from django.contrib import admin

from .models import ShipTicket


@admin.register(ShipTicket)
class ShipTicketAdmin(admin.ModelAdmin):
    list_display = ('order', 'carrier', 'tracking_number', 'status', 'shipped_at', 'delivered_at')
    list_filter = ('status', 'carrier')
    search_fields = ('tracking_number', 'order__id')
    list_editable = ('tracking_number', 'carrier', 'status')
