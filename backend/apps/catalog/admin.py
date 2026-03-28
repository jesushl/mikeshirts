from django.contrib import admin
from django.utils.html import format_html

from .models import Category, Product, ProductImage, Variant


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'product_count')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

    @admin.display(description='Productos')
    def product_count(self, obj):
        return obj.products.count()


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'alt_text', 'position', 'is_main', 'preview')
    readonly_fields = ('preview',)

    @admin.display(description='Vista previa')
    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" height="60" />', obj.image.url)
        return '—'


class VariantInline(admin.TabularInline):
    model = Variant
    extra = 1
    fields = ('size', 'color', 'sku', 'price_override')
    readonly_fields = ('sku',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'base_price', 'variant_count', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, VariantInline]
    list_editable = ('is_active',)

    @admin.display(description='Variantes')
    def variant_count(self, obj):
        return obj.variants.count()
