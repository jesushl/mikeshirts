from django.urls import path

from . import views

app_name = 'analytics'

urlpatterns = [
    path('event/', views.TrackEventView.as_view(), name='track-event'),
]
