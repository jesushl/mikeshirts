from datetime import timedelta
from decimal import Decimal

from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.inventory.models import Stock
from apps.orders.models import Order, SaleTicket
from apps.production.models import ProductionTicket
from apps.shipping.models import ShipTicket

from .permissions import IsAnyStaff, IsEnvios, IsProduccion, IsVentas
from .serializers import (
    AdminOrderDetailSerializer,
    AdminOrderListSerializer,
    AdminProductionTicketSerializer,
    AdminSaleTicketSerializer,
    AdminShipTicketSerializer,
    ProductionTicketUpdateSerializer,
    ShipTicketUpdateSerializer,
)


class DashboardView(APIView):
    """Key business metrics for any staff member."""
    permission_classes = [IsAnyStaff]

    def get(self, request):
        today = timezone.now().date()
        orders_today = Order.objects.filter(
            created_at__date=today,
        ).exclude(status='cancelled')

        revenue_today = orders_today.filter(
            status__in=['paid', 'in_production', 'shipped', 'delivered'],
        ).aggregate(total=Sum('total'))['total'] or Decimal('0.00')

        from django.db.models import F
        low_stock = Stock.objects.filter(
            quantity__gt=0, quantity__lte=F('low_threshold'),
        ).count()

        return Response({
            'orders_today': orders_today.count(),
            'revenue_today': str(revenue_today),
            'pending_orders': Order.objects.filter(status='pending_payment').count(),
            'pending_production': ProductionTicket.objects.filter(status='pending').count(),
            'in_production': ProductionTicket.objects.filter(status='in_production').count(),
            'pending_shipping': ShipTicket.objects.filter(status='pending').count(),
            'low_stock_count': low_stock,
        })


# --- Ventas ---

class AdminOrderListView(generics.ListAPIView):
    serializer_class = AdminOrderListSerializer
    permission_classes = [IsVentas]
    filterset_fields = ['status']
    search_fields = ['user__email', 'mp_payment_id']
    ordering_fields = ['created_at', 'total']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = Order.objects.select_related('user').prefetch_related('items')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        if date_from:
            qs = qs.filter(created_at__date__gte=date_from)
        if date_to:
            qs = qs.filter(created_at__date__lte=date_to)
        return qs


class AdminOrderDetailView(generics.RetrieveAPIView):
    serializer_class = AdminOrderDetailSerializer
    permission_classes = [IsVentas]
    queryset = Order.objects.select_related('user').prefetch_related('items')


class AdminSaleTicketListView(generics.ListAPIView):
    serializer_class = AdminSaleTicketSerializer
    permission_classes = [IsVentas]
    search_fields = ['folio']
    ordering = ['-issued_at']

    def get_queryset(self):
        return SaleTicket.objects.select_related('order__user')


class VentasMetricsView(APIView):
    """Sales metrics for a date range (default: last 30 days)."""
    permission_classes = [IsVentas]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        since = timezone.now() - timedelta(days=days)
        paid_statuses = ['paid', 'in_production', 'shipped', 'delivered']
        orders = Order.objects.filter(
            status__in=paid_statuses, created_at__gte=since,
        )
        agg = orders.aggregate(
            total_sales=Sum('total'),
            order_count=Count('id'),
        )
        total_sales = agg['total_sales'] or Decimal('0.00')
        order_count = agg['order_count'] or 0
        avg_ticket = (total_sales / order_count) if order_count else Decimal('0.00')

        return Response({
            'period_days': days,
            'total_sales': str(total_sales),
            'order_count': order_count,
            'avg_ticket': str(round(avg_ticket, 2)),
        })


# --- Producción ---

class AdminProductionTicketListView(generics.ListAPIView):
    serializer_class = AdminProductionTicketSerializer
    permission_classes = [IsProduccion]
    filterset_fields = ['status']
    ordering = ['-created_at']

    def get_queryset(self):
        return ProductionTicket.objects.select_related(
            'variant__product', 'order_item',
        )


class AdminProductionTicketUpdateView(generics.UpdateAPIView):
    serializer_class = ProductionTicketUpdateSerializer
    permission_classes = [IsProduccion]
    queryset = ProductionTicket.objects.all()
    http_method_names = ['patch']


# --- Envíos ---

class AdminShipTicketListView(generics.ListAPIView):
    serializer_class = AdminShipTicketSerializer
    permission_classes = [IsEnvios]
    filterset_fields = ['status']
    ordering = ['-created_at']

    def get_queryset(self):
        return ShipTicket.objects.select_related('order__user')


class AdminShipTicketUpdateView(generics.UpdateAPIView):
    serializer_class = ShipTicketUpdateSerializer
    permission_classes = [IsEnvios]
    queryset = ShipTicket.objects.all()
    http_method_names = ['patch']


# --- Analítica ---

class AnalyticsDashboardView(APIView):
    """Analytics metrics: visits, pageviews, funnel, conversion rate, top referrers."""
    permission_classes = [IsAnyStaff]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        since = timezone.now() - timedelta(days=days)

        from apps.analytics.models import FunnelEvent, PageView, Visit

        visits = Visit.objects.filter(started_at__gte=since)
        total_visits = visits.count()
        unique_visitors = visits.values('ip').distinct().count()
        total_pageviews = PageView.objects.filter(timestamp__gte=since).count()

        funnel_qs = FunnelEvent.objects.filter(timestamp__gte=since)
        funnel = {}
        for et in ['visit', 'product_view', 'add_to_cart', 'checkout_start', 'purchase']:
            funnel[et] = funnel_qs.filter(event_type=et).values('visit').distinct().count()

        conversion_rate = 0.0
        if funnel.get('visit', 0) > 0:
            conversion_rate = round(
                funnel.get('purchase', 0) / funnel['visit'] * 100, 2,
            )

        top_referrers = list(
            visits.exclude(referrer='')
            .values('referrer')
            .annotate(count=Count('id'))
            .order_by('-count')[:10]
        )

        top_utm_sources = list(
            visits.exclude(utm_source='')
            .values('utm_source')
            .annotate(count=Count('id'))
            .order_by('-count')[:10]
        )

        return Response({
            'period_days': days,
            'total_visits': total_visits,
            'unique_visitors': unique_visitors,
            'total_pageviews': total_pageviews,
            'funnel': funnel,
            'conversion_rate': conversion_rate,
            'top_referrers': top_referrers,
            'top_utm_sources': top_utm_sources,
        })
