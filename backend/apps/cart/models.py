from django.conf import settings
from django.db import models


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'cart_cart'

    def __str__(self):
        return f'Cart — {self.user}'

    @property
    def item_count(self):
        return self.items.aggregate(total=models.Sum('quantity'))['total'] or 0


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(
        'catalog.Variant', on_delete=models.CASCADE, related_name='+',
    )
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = 'cart_cartitem'
        constraints = [
            models.UniqueConstraint(
                fields=['cart', 'variant'],
                name='unique_cart_variant',
            ),
        ]

    def __str__(self):
        return f'{self.variant} × {self.quantity}'

    @property
    def line_total(self):
        return self.variant.effective_price * self.quantity
