from django.urls import path

from . import views

app_name = 'cart'

urlpatterns = [
    path('', views.CartView.as_view(), name='cart'),
    path('items/', views.CartItemAddView.as_view(), name='cart-add'),
    path('items/<int:variant_id>/', views.CartItemUpdateView.as_view(), name='cart-item-update'),
    path('items/<int:variant_id>/delete/', views.CartItemDeleteView.as_view(), name='cart-item-delete'),
    path('merge/', views.CartMergeView.as_view(), name='cart-merge'),
]
