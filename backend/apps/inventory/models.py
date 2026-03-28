from django.db import models


class Stock(models.Model):
    variant = models.OneToOneField(
        'catalog.Variant',
        on_delete=models.CASCADE,
        related_name='stock',
    )
    quantity = models.PositiveIntegerField(default=0)
    low_threshold = models.PositiveIntegerField(
        default=3,
        help_text='Alerta cuando quantity <= este valor.',
    )
    production_days = models.PositiveIntegerField(
        default=7,
        help_text='Días estimados de producción on-demand.',
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'inventory_stock'
        verbose_name = 'Stock'
        verbose_name_plural = 'Stock'

    def __str__(self):
        return f'{self.variant} — {self.quantity} uds'

    @property
    def availability(self):
        if self.quantity > 0:
            return 'in_stock'
        if self.production_days > 0:
            return 'made_to_order'
        return 'unavailable'

    @property
    def is_low_stock(self):
        return 0 < self.quantity <= self.low_threshold
