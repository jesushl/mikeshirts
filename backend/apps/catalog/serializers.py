from rest_framework import serializers

from apps.inventory.models import Stock
from .models import Category, Product, ProductImage, Variant


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'position', 'is_main']


class VariantStockSerializer(serializers.ModelSerializer):
    availability = serializers.CharField(read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Stock
        fields = ['quantity', 'production_days', 'availability', 'is_low_stock']


class VariantSerializer(serializers.ModelSerializer):
    effective_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True,
    )
    stock = VariantStockSerializer(read_only=True)
    size_display = serializers.CharField(source='get_size_display', read_only=True)
    color_display = serializers.CharField(source='get_color_display', read_only=True)

    class Meta:
        model = Variant
        fields = [
            'id', 'size', 'size_display', 'color', 'color_display',
            'sku', 'effective_price', 'stock',
        ]


class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    main_image = serializers.SerializerMethodField()
    availability = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'base_price', 'category',
            'main_image', 'availability', 'is_featured', 'created_at',
        ]

    def get_main_image(self, obj):
        img = obj.images.filter(is_main=True).first()
        if not img:
            img = obj.images.first()
        if img and img.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(img.image.url)
            return img.image.url
        return None

    def get_availability(self, obj):
        """Best availability across all variants."""
        variants = obj.variants.all()
        if not variants:
            return 'unavailable'
        for v in variants:
            stock = getattr(v, 'stock', None)
            if stock and stock.availability == 'in_stock':
                return 'in_stock'
        for v in variants:
            stock = getattr(v, 'stock', None)
            if stock and stock.availability == 'made_to_order':
                return 'made_to_order'
        return 'unavailable'


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = VariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'base_price',
            'category', 'size_chart', 'images', 'variants',
            'created_at', 'updated_at',
        ]
