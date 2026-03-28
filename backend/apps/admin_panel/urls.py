from django.urls import path

from . import views

app_name = 'admin_panel'

urlpatterns = [
    # Dashboard
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),

    # Ventas
    path('ventas/orders/', views.AdminOrderListView.as_view(), name='ventas-orders'),
    path('ventas/orders/<int:pk>/', views.AdminOrderDetailView.as_view(), name='ventas-order-detail'),
    path('ventas/tickets/', views.AdminSaleTicketListView.as_view(), name='ventas-tickets'),
    path('ventas/metrics/', views.VentasMetricsView.as_view(), name='ventas-metrics'),

    # Producción
    path('production/tickets/', views.AdminProductionTicketListView.as_view(), name='production-tickets'),
    path('production/tickets/<int:pk>/', views.AdminProductionTicketUpdateView.as_view(), name='production-ticket-update'),

    # Envíos
    path('shipping/tickets/', views.AdminShipTicketListView.as_view(), name='shipping-tickets'),
    path('shipping/tickets/<int:pk>/', views.AdminShipTicketUpdateView.as_view(), name='shipping-ticket-update'),

    # Analítica
    path('analytics/', views.AnalyticsDashboardView.as_view(), name='analytics-dashboard'),
]
