import logging
from decimal import Decimal
from datetime import timedelta

import mercadopago
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone

from apps.inventory.models import Stock
from apps.orders.models import SaleTicket
from apps.production.models import ProductionTicket
from apps.shipping.models import ShipTicket

from .models import Payment

logger = logging.getLogger(__name__)


def get_mp_sdk():
    return mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)


def create_mp_preference(order):
    """Create a Mercado Pago Checkout Pro preference and return init_point URL."""
    sdk = get_mp_sdk()
    items = []
    for item in order.items.select_related('variant__product'):
        items.append({
            'title': f'{item.product_name} ({item.variant_desc})',
            'quantity': item.quantity,
            'unit_price': float(item.unit_price),
            'currency_id': 'MXN',
        })

    if order.shipping_cost > 0:
        items.append({
            'title': 'Envío',
            'quantity': 1,
            'unit_price': float(order.shipping_cost),
            'currency_id': 'MXN',
        })

    site_url = settings.SITE_URL
    preference_data = {
        'items': items,
        'payer': {
            'email': order.user.email,
            'name': order.user.first_name,
            'surname': order.user.last_name,
        },
        'back_urls': {
            'success': f'{site_url}/checkout/success?order={order.pk}',
            'failure': f'{site_url}/checkout/failure?order={order.pk}',
            'pending': f'{site_url}/checkout/pending?order={order.pk}',
        },
        'notification_url': settings.MERCADOPAGO_NOTIFICATION_URL,
        'external_reference': str(order.pk),
        'auto_return': 'approved',
    }

    result = sdk.preference().create(preference_data)
    response = result['response']
    order.mp_preference_id = response['id']
    order.save(update_fields=['mp_preference_id'])

    if settings.DEBUG:
        return response.get('sandbox_init_point', response['init_point'])
    return response['init_point']


def process_mp_payment(mp_payment_id):
    """Fetch payment from MP, create Payment record, trigger post-payment if approved."""
    sdk = get_mp_sdk()
    result = sdk.payment().get(int(mp_payment_id))
    data = result['response']

    order_id = data.get('external_reference')
    if not order_id:
        logger.warning('Webhook sin external_reference: %s', mp_payment_id)
        return

    from apps.orders.models import Order
    try:
        order = Order.objects.get(pk=int(order_id))
    except Order.DoesNotExist:
        logger.warning('Order %s no encontrada para payment %s', order_id, mp_payment_id)
        return

    payment, created = Payment.objects.get_or_create(
        mp_payment_id=str(mp_payment_id),
        defaults={
            'order': order,
            'mp_status': data.get('status', ''),
            'mp_status_detail': data.get('status_detail', ''),
            'mp_payment_type': data.get('payment_type_id', ''),
            'amount': Decimal(str(data.get('transaction_amount', 0))),
            'raw_data': data,
        },
    )

    if not created:
        payment.mp_status = data.get('status', '')
        payment.mp_status_detail = data.get('status_detail', '')
        payment.raw_data = data
        payment.save()

    order.mp_payment_id = str(mp_payment_id)

    mp_status = data.get('status', '')
    if mp_status == 'approved' and order.status == 'pending_payment':
        order.status = 'paid'
        order.save(update_fields=['status', 'mp_payment_id', 'updated_at'])
        _post_payment_process(order)
    elif mp_status in ('rejected', 'cancelled'):
        order.status = 'cancelled'
        order.save(update_fields=['status', 'mp_payment_id', 'updated_at'])
    else:
        order.save(update_fields=['mp_payment_id', 'updated_at'])


def _post_payment_process(order):
    """After approved payment: deduct stock, create tickets, send email."""
    has_production = False

    for item in order.items.select_related('variant'):
        if not item.variant:
            continue
        try:
            stock = item.variant.stock
        except Stock.DoesNotExist:
            stock = Stock.objects.create(variant=item.variant, quantity=0)

        available = stock.quantity
        if available >= item.quantity:
            stock.quantity -= item.quantity
            stock.save(update_fields=['quantity', 'updated_at'])
        else:
            shortfall = item.quantity - available
            stock.quantity = 0
            stock.save(update_fields=['quantity', 'updated_at'])

            ProductionTicket.objects.create(
                order_item=item,
                variant=item.variant,
                quantity_needed=shortfall,
                estimated_completion=timezone.now().date() + timedelta(
                    days=stock.production_days,
                ),
            )
            has_production = True

    if has_production:
        order.status = 'in_production'
        order.save(update_fields=['status', 'updated_at'])

    SaleTicket.objects.create(order=order)
    ShipTicket.objects.create(order=order, shipping_cost=order.shipping_cost)

    _send_confirmation_email(order)


def _send_confirmation_email(order):
    """Send order confirmation email."""
    ticket = order.sale_ticket
    items_text = []
    for item in order.items.all():
        items_text.append(
            f'  - {item.product_name} ({item.variant_desc}) × {item.quantity}'
            f' — ${item.line_total:.2f} MXN'
        )

    body = (
        f'¡Gracias por tu compra en Mike Shirts!\n\n'
        f'Folio: {ticket.folio}\n'
        f'Pedido: #{order.pk}\n\n'
        f'Productos:\n' + '\n'.join(items_text) + '\n\n'
        f'Subtotal: ${order.subtotal:.2f} MXN\n'
        f'Envío: ${order.shipping_cost:.2f} MXN\n'
        f'Total: ${order.total:.2f} MXN\n\n'
        f'Te avisaremos cuando tu pedido sea enviado.\n'
        f'— Mike Shirts'
    )
    send_mail(
        subject=f'Confirmación de pedido #{order.pk} — {ticket.folio}',
        message=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.user.email],
        fail_silently=True,
    )
