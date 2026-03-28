from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.urls import include, path

from apps.catalog.seo_views import LlmsTxtView, ProductJsonLdView, RobotsTxtView
from apps.catalog.sitemaps import CategorySitemap, ProductSitemap

sitemaps = {
    'products': ProductSitemap,
    'categories': CategorySitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/auth/social/', include('drf_social_oauth2.urls', namespace='drf')),
    path('api/catalog/', include('apps.catalog.urls')),
    path('api/catalog/products/<slug:slug>/schema/', ProductJsonLdView.as_view(), name='product-jsonld'),
    path('api/cart/', include('apps.cart.urls')),
    path('api/orders/', include('apps.orders.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/admin/', include('apps.admin_panel.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='sitemap'),
    path('robots.txt', RobotsTxtView.as_view(), name='robots'),
    path('llms.txt', LlmsTxtView.as_view(), name='llms-txt'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
