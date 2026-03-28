from django.urls import path

from . import views

app_name = 'accounts'

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('token/refresh/', views.RefreshView.as_view(), name='token-refresh'),
    path('me/', views.MeView.as_view(), name='me'),
    path('me/addresses/', views.AddressListCreateView.as_view(), name='address-list'),
    path('me/addresses/<int:pk>/', views.AddressDetailView.as_view(), name='address-detail'),
    path('me/profile-complete/', views.ProfileCompleteView.as_view(), name='profile-complete'),
]
