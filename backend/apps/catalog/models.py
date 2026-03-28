from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)

    class Meta:
        db_table = 'catalog_category'
        verbose_name_plural = 'categories'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    description = models.TextField()
    base_price = models.DecimalField('Precio base (MXN)', max_digits=10, decimal_places=2)
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name='products',
    )
    size_chart = models.JSONField(
        'Tabla de tallas',
        default=list,
        blank=True,
        help_text='Lista de objetos: [{"size":"S","chest":86,"length":68}, ...]',
    )
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField('Destacado', default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'catalog_product'
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='images',
    )
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=255, blank=True)
    position = models.PositiveIntegerField(default=0)
    is_main = models.BooleanField(default=False)

    class Meta:
        db_table = 'catalog_productimage'
        ordering = ['position']

    def __str__(self):
        tag = ' [MAIN]' if self.is_main else ''
        return f'{self.product.name} — img {self.position}{tag}'

    def save(self, *args, **kwargs):
        if self.is_main:
            ProductImage.objects.filter(
                product=self.product, is_main=True,
            ).exclude(pk=self.pk).update(is_main=False)
        super().save(*args, **kwargs)


SIZE_CHOICES = [
    ('XS', 'XS'),
    ('S', 'S'),
    ('M', 'M'),
    ('L', 'L'),
    ('XL', 'XL'),
    ('XXL', 'XXL'),
]

COLOR_CHOICES = [
    ('negro', 'Negro'),
    ('blanco', 'Blanco'),
    ('gris', 'Gris'),
    ('azul_marino', 'Azul Marino'),
    ('rojo', 'Rojo'),
    ('verde', 'Verde'),
]

_COLOR_CODES = {
    'negro': 'BLK',
    'blanco': 'WHT',
    'gris': 'GRY',
    'azul_marino': 'NVY',
    'rojo': 'RED',
    'verde': 'GRN',
}


class Variant(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='variants',
    )
    size = models.CharField(max_length=5, choices=SIZE_CHOICES)
    color = models.CharField(max_length=20, choices=COLOR_CHOICES)
    sku = models.CharField('SKU', max_length=50, unique=True, blank=True)
    price_override = models.DecimalField(
        'Precio override (MXN)',
        max_digits=10, decimal_places=2,
        blank=True, null=True,
        help_text='Dejar vacío para usar el precio base del producto.',
    )

    class Meta:
        db_table = 'catalog_variant'
        constraints = [
            models.UniqueConstraint(
                fields=['product', 'size', 'color'],
                name='unique_product_size_color',
            ),
        ]

    def __str__(self):
        return f'{self.product.name} — {self.get_size_display()} / {self.get_color_display()}'

    @property
    def effective_price(self):
        if self.price_override is not None:
            return self.price_override
        return self.product.base_price

    def save(self, *args, **kwargs):
        if not self.sku:
            color_code = _COLOR_CODES.get(self.color, self.color[:3].upper())
            self.sku = f'{self.product_id}-{self.size}-{color_code}'
        super().save(*args, **kwargs)
