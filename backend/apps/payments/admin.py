from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('mp_payment_id', 'order', 'mp_status', 'mp_payment_type', 'amount', 'created_at')
    list_filter = ('mp_status', 'mp_payment_type')
    search_fields = ('mp_payment_id', 'order__id')
    readonly_fields = ('mp_payment_id', 'mp_status', 'mp_status_detail', 'mp_payment_type', 'amount', 'raw_data')
