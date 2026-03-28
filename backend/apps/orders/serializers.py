from rest_framework import serializers

from apps.production.models import ProductionTicket
from apps.shipping.models import ShipTicket
from .models import Order, OrderItem, SaleTicket


class CheckoutSerializer(serializers.Serializer):
    shipping_address_id = serializers.IntegerField()


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product_name', 'variant_desc', 'quantity',
            'unit_price', 'line_total',
        ]


class SaleTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleTicket
        fields = ['folio', 'issued_at']


class ShipTicketSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = ShipTicket
        fields = [
            'tracking_number', 'carrier', 'shipping_cost',
            'status', 'status_display', 'shipped_at', 'delivered_at',
        ]


class ProductionTicketSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = ProductionTicket
        fields = [
            'id', 'quantity_needed', 'status', 'status_display',
            'estimated_completion', 'completed_at',
        ]


class OrderListSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'status_display', 'total',
            'item_count', 'created_at',
        ]

    def get_item_count(self, obj):
        return obj.items.count()


class OrderDetailSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    sale_ticket = SaleTicketSerializer(read_only=True)
    ship_ticket = ShipTicketSerializer(read_only=True)
    production_tickets = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'status_display', 'shipping_address',
            'subtotal', 'shipping_cost', 'total',
            'items', 'sale_ticket', 'ship_ticket', 'production_tickets',
            'created_at', 'updated_at',
        ]

    def get_production_tickets(self, obj):
        tickets = ProductionTicket.objects.filter(order_item__order=obj)
        return ProductionTicketSerializer(tickets, many=True).data
