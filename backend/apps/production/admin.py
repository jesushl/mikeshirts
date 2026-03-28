from django.contrib import admin

from .models import ProductionTicket


@admin.register(ProductionTicket)
class ProductionTicketAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'variant', 'quantity_needed', 'status',
        'estimated_completion', 'completed_at',
    )
    list_filter = ('status',)
    search_fields = ('variant__sku', 'variant__product__name')
    list_editable = ('status',)
