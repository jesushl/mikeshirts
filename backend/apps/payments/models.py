from django.db import models


class Payment(models.Model):
    order = models.ForeignKey(
        'orders.Order', on_delete=models.CASCADE, related_name='payments',
    )
    mp_payment_id = models.CharField('MP Payment ID', max_length=255, unique=True)
    mp_status = models.CharField(max_length=50)
    mp_status_detail = models.CharField(max_length=100, blank=True)
    mp_payment_type = models.CharField(max_length=50, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    raw_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'payments_payment'

    def __str__(self):
        return f'Payment {self.mp_payment_id} — {self.mp_status}'
