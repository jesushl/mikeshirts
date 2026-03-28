from rest_framework import serializers

from apps.orders.models import Order, OrderItem, SaleTicket
from apps.production.models import ProductionTicket
from apps.shipping.models import ShipTicket


class AdminOrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'variant_desc', 'quantity', 'unit_price', 'line_total']


class AdminOrderListSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'user_email', 'status', 'status_display',
            'total', 'item_count', 'created_at',
        ]

    def get_item_count(self, obj):
        return obj.items.count()


class AdminOrderDetailSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    items = AdminOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user_email', 'status', 'status_display',
            'shipping_address', 'subtotal', 'shipping_cost', 'total',
            'mp_preference_id', 'mp_payment_id',
            'items', 'created_at', 'updated_at',
        ]


class AdminSaleTicketSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(source='order.id', read_only=True)
    order_total = serializers.DecimalField(
        source='order.total', max_digits=10, decimal_places=2, read_only=True,
    )
    user_email = serializers.EmailField(source='order.user.email', read_only=True)

    class Meta:
        model = SaleTicket
        fields = ['id', 'folio', 'order_id', 'order_total', 'user_email', 'issued_at']


class AdminProductionTicketSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    variant_sku = serializers.CharField(source='variant.sku', read_only=True, default='—')
    product_name = serializers.SerializerMethodField()
    order_id = serializers.IntegerField(source='order_item.order_id', read_only=True)

    class Meta:
        model = ProductionTicket
        fields = [
            'id', 'order_id', 'variant_sku', 'product_name',
            'quantity_needed', 'status', 'status_display',
            'estimated_completion', 'completed_at',
            'created_at', 'updated_at',
        ]

    def get_product_name(self, obj):
        return obj.order_item.product_name if obj.order_item else '—'


class ProductionTicketUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionTicket
        fields = ['status', 'completed_at']


class AdminShipTicketSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    order_id = serializers.IntegerField(source='order.id', read_only=True)
    user_email = serializers.EmailField(source='order.user.email', read_only=True)

    class Meta:
        model = ShipTicket
        fields = [
            'id', 'order_id', 'user_email',
            'tracking_number', 'carrier', 'shipping_cost',
            'status', 'status_display',
            'shipped_at', 'delivered_at',
            'created_at', 'updated_at',
        ]


class ShipTicketUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShipTicket
        fields = ['tracking_number', 'carrier', 'shipping_cost', 'status', 'shipped_at', 'delivered_at']
