import django_filters

from .models import Product


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category__slug')
    size = django_filters.CharFilter(method='filter_by_size')
    color = django_filters.CharFilter(method='filter_by_color')
    min_price = django_filters.NumberFilter(field_name='base_price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='base_price', lookup_expr='lte')
    featured = django_filters.BooleanFilter(field_name='is_featured')

    class Meta:
        model = Product
        fields = ['category', 'size', 'color', 'min_price', 'max_price', 'featured']

    def filter_by_size(self, queryset, name, value):
        return queryset.filter(variants__size=value).distinct()

    def filter_by_color(self, queryset, name, value):
        return queryset.filter(variants__color=value).distinct()
