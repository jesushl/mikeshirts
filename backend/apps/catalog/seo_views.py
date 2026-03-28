from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views import View
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product


class RobotsTxtView(View):
    def get(self, request):
        site_url = getattr(settings, 'SITE_URL', 'http://localhost:5173')
        lines = [
            'User-agent: *',
            'Allow: /',
            '',
            'Disallow: /api/admin/',
            'Disallow: /api/auth/',
            'Disallow: /admin/',
            '',
            f'Sitemap: {site_url}/sitemap.xml',
        ]
        return HttpResponse('\n'.join(lines), content_type='text/plain')


class LlmsTxtView(View):
    def get(self, request):
        product_count = Product.objects.filter(is_active=True).count()
        lines = [
            '# Mike Shirts',
            '',
            '> Tienda online de playeras con diseños originales que combinan cultura geek con identidad mexicana.',
            '',
            '## Qué vendemos',
            f'Playeras de diseño original ({product_count} productos activos).',
            'Tallas: XS, S, M, L, XL, XXL.',
            'Colores: Negro, Blanco, Gris, Azul Marino, Rojo, Verde.',
            'Modelo híbrido: inventario fijo + producción on-demand.',
            '',
            '## Envíos',
            'Solo México. Tarifa flat $249 MXN.',
            'Paquetería variable (sin proveedor fijo).',
            '',
            '## Pagos',
            'Mercado Pago: tarjeta de crédito/débito, OXXO, SPEI.',
            'Solo MXN.',
            '',
            '## API',
            'Catálogo público: GET /api/catalog/products/',
            'Detalle: GET /api/catalog/products/{slug}/',
            'Categorías: GET /api/catalog/categories/',
            '',
            '## Contacto',
            'Email: contacto@mikeshirts.mx',
        ]
        return HttpResponse('\n'.join(lines), content_type='text/plain')


class ProductJsonLdView(APIView):
    """Returns JSON-LD Product schema for a specific product."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        try:
            product = Product.objects.select_related('category').prefetch_related(
                'images', 'variants__stock',
            ).get(slug=slug, is_active=True)
        except Product.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)

        site_url = getattr(settings, 'SITE_URL', 'http://localhost:5173')

        main_image = product.images.filter(is_main=True).first()
        if not main_image:
            main_image = product.images.first()
        image_url = ''
        if main_image and main_image.image:
            image_url = request.build_absolute_uri(main_image.image.url)

        prices = [v.effective_price for v in product.variants.all()]
        low_price = min(prices) if prices else product.base_price
        high_price = max(prices) if prices else product.base_price

        has_stock = any(
            getattr(v, 'stock', None) and v.stock.availability == 'in_stock'
            for v in product.variants.all()
        )

        schema = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            'name': product.name,
            'description': product.description,
            'image': image_url,
            'url': f'{site_url}/producto/{product.slug}',
            'brand': {
                '@type': 'Brand',
                'name': 'Mike Shirts',
            },
            'category': product.category.name if product.category else '',
            'offers': {
                '@type': 'AggregateOffer',
                'priceCurrency': 'MXN',
                'lowPrice': str(low_price),
                'highPrice': str(high_price),
                'availability': (
                    'https://schema.org/InStock' if has_stock
                    else 'https://schema.org/PreOrder'
                ),
                'offerCount': product.variants.count(),
            },
        }

        return Response(schema)
