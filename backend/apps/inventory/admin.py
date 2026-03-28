from django.contrib import admin

from .models import Stock


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = (
        'variant', 'quantity', 'low_threshold',
        'production_days', 'availability_display', 'low_stock_flag',
    )
    list_filter = ('variant__product__category',)
    search_fields = ('variant__sku', 'variant__product__name')
    list_editable = ('quantity', 'low_threshold', 'production_days')
    raw_id_fields = ('variant',)

    @admin.display(description='Disponibilidad', ordering='quantity')
    def availability_display(self, obj):
        labels = {
            'in_stock': 'En stock',
            'made_to_order': 'Sobre pedido',
            'unavailable': 'No disponible',
        }
        return labels.get(obj.availability, obj.availability)

    @admin.display(description='Stock bajo', boolean=True)
    def low_stock_flag(self, obj):
        return obj.is_low_stock
