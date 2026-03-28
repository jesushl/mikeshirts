from decimal import Decimal

from django.conf import settings

from apps.accounts.models import Address
from apps.cart.models import CartItem
from apps.cart.services import get_or_create_db_cart
from .models import Order, OrderItem


def create_order_from_cart(user, shipping_address_id):
    """Validate cart, snapshot prices/address, create Order + OrderItems, clear cart."""
    cart = get_or_create_db_cart(user)
    items = cart.items.select_related('variant__product').all()
    if not items:
        raise ValueError('El carrito está vacío.')

    try:
        address = Address.objects.get(pk=shipping_address_id, user=user)
    except Address.DoesNotExist:
        raise ValueError('Dirección de envío no válida.')

    address_snapshot = {
        'street': address.street,
        'ext_number': address.ext_number,
        'int_number': address.int_number,
        'neighborhood': address.neighborhood,
        'city': address.city,
        'state': address.state,
        'zip_code': address.zip_code,
        'country': address.country,
        'label': address.label,
    }

    subtotal = Decimal('0.00')
    order_items_data = []
    for ci in items:
        v = ci.variant
        price = v.effective_price
        line = price * ci.quantity
        subtotal += line
        order_items_data.append({
            'variant': v,
            'quantity': ci.quantity,
            'unit_price': price,
            'product_name': v.product.name,
            'variant_desc': f'{v.get_size_display()} / {v.get_color_display()}',
        })

    shipping_cost = getattr(settings, 'SHIPPING_FLAT_RATE', Decimal('249.00'))
    total = subtotal + shipping_cost

    order = Order.objects.create(
        user=user,
        shipping_address=address_snapshot,
        subtotal=subtotal,
        shipping_cost=shipping_cost,
        total=total,
    )
    for data in order_items_data:
        OrderItem.objects.create(order=order, **data)

    cart.items.all().delete()

    return order
