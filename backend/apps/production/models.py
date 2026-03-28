from django.db import models


class ProductionTicket(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('in_production', 'En producción'),
        ('completed', 'Completado'),
    ]

    order_item = models.ForeignKey(
        'orders.OrderItem', on_delete=models.CASCADE,
        related_name='production_tickets',
    )
    variant = models.ForeignKey(
        'catalog.Variant', on_delete=models.SET_NULL,
        null=True, related_name='production_tickets',
    )
    quantity_needed = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    estimated_completion = models.DateField('Fecha estimada', null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'production_productionticket'
        verbose_name = 'Ticket de producción'
        verbose_name_plural = 'Tickets de producción'

    def __str__(self):
        return f'Producción — {self.variant} × {self.quantity_needed} — {self.get_status_display()}'
