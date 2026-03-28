from django.db import models


class ShipTicket(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('shipped', 'Enviado'),
        ('delivered', 'Entregado'),
    ]

    order = models.OneToOneField(
        'orders.Order', on_delete=models.CASCADE, related_name='ship_ticket',
    )
    tracking_number = models.CharField('Número de guía', max_length=100, blank=True)
    carrier = models.CharField('Paquetería', max_length=100, blank=True)
    shipping_cost = models.DecimalField(
        'Costo de envío', max_digits=10, decimal_places=2, default=0,
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    shipped_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shipping_shipticket'
        verbose_name = 'Ticket de envío'
        verbose_name_plural = 'Tickets de envío'

    def __str__(self):
        return f'Envío #{self.order_id} — {self.get_status_display()}'
