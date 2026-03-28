from django.conf import settings
from django.db import models
from django.utils import timezone


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending_payment', 'Pendiente de pago'),
        ('paid', 'Pagado'),
        ('in_production', 'En producción'),
        ('shipped', 'Enviado'),
        ('delivered', 'Entregado'),
        ('cancelled', 'Cancelado'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='orders',
    )
    shipping_address = models.JSONField(
        'Dirección de envío (snapshot)',
        help_text='Snapshot de la dirección al momento de la compra.',
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending_payment',
    )
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    mp_preference_id = models.CharField(max_length=255, blank=True)
    mp_payment_id = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'orders_order'
        ordering = ['-created_at']

    def __str__(self):
        return f'Order #{self.pk} — {self.user} — {self.get_status_display()}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(
        'catalog.Variant', on_delete=models.SET_NULL,
        null=True, related_name='+',
    )
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    product_name = models.CharField(max_length=255)
    variant_desc = models.CharField(max_length=100)

    class Meta:
        db_table = 'orders_orderitem'

    def __str__(self):
        return f'{self.product_name} ({self.variant_desc}) × {self.quantity}'

    @property
    def line_total(self):
        return self.unit_price * self.quantity


class SaleTicket(models.Model):
    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, related_name='sale_ticket',
    )
    folio = models.CharField(max_length=30, unique=True, editable=False)
    issued_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'orders_saleticket'

    def __str__(self):
        return self.folio

    def save(self, *args, **kwargs):
        if not self.folio:
            self.folio = self._generate_folio()
        super().save(*args, **kwargs)

    @staticmethod
    def _generate_folio():
        today = timezone.now().strftime('%Y%m%d')
        prefix = f'MS-{today}-'
        last = (
            SaleTicket.objects
            .filter(folio__startswith=prefix)
            .order_by('-folio')
            .first()
        )
        if last:
            seq = int(last.folio.split('-')[-1]) + 1
        else:
            seq = 1
        return f'{prefix}{seq:04d}'
