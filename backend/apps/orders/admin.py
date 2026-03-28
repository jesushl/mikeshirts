from django.contrib import admin

from .models import Order, OrderItem, SaleTicket


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name', 'variant_desc', 'unit_price', 'quantity', 'line_total')
    fields = ('product_name', 'variant_desc', 'quantity', 'unit_price', 'line_total')

    @admin.display(description='Total línea')
    def line_total(self, obj):
        return obj.line_total


class SaleTicketInline(admin.StackedInline):
    model = SaleTicket
    extra = 0
    readonly_fields = ('folio', 'issued_at')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'mp_payment_id')
    readonly_fields = ('subtotal', 'shipping_cost', 'total', 'mp_preference_id', 'mp_payment_id')
    inlines = [OrderItemInline, SaleTicketInline]


@admin.register(SaleTicket)
class SaleTicketAdmin(admin.ModelAdmin):
    list_display = ('folio', 'order', 'issued_at')
    search_fields = ('folio',)
    readonly_fields = ('folio', 'issued_at')
