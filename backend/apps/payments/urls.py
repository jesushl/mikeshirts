from django.urls import path

from . import views

app_name = 'payments'

urlpatterns = [
    path('webhook/', views.WebhookView.as_view(), name='webhook'),
]
