from django.core.management.base import BaseCommand
from apps.catalog.models import Category, Product, ProductImage, Variant
from apps.inventory.models import Stock


CATEGORIES = {
    'Anime': 'anime',
    'Videojuegos': 'videojuegos',
    'Películas': 'peliculas',
    'Cultura Pop': 'cultura-pop',
    'México': 'mexico',
}

PRODUCTS = [
    {
        'name': 'Naruto Luchador',
        'category': 'Anime',
        'base_price': 449,
        'description': 'Naruto Uzumaki con máscara de lucha libre mexicana y capa tricolor. Estilo Día de Muertos con remolinos de chakra y papel picado.',
        'colors': ['negro', 'rojo'],
        'featured': True,
    },
    {
        'name': 'Mario Charro',
        'category': 'Videojuegos',
        'base_price': 449,
        'description': 'Mario Bros vestido de charro con sombrero de mariachi y bigote extra. Hongos reemplazados por chiles jalapeños.',
        'colors': ['blanco', 'rojo'],
        'featured': True,
    },
    {
        'name': 'Darth Vader Catrina',
        'category': 'Películas',
        'base_price': 499,
        'description': 'Darth Vader con maquillaje de Catrina y flores de cempasúchil en el casco. La Fuerza se mezcla con el Día de Muertos.',
        'colors': ['negro', 'gris'],
        'featured': True,
    },
    {
        'name': 'Pikachu Alebrije',
        'category': 'Videojuegos',
        'base_price': 449,
        'description': 'Pikachu transformado en alebrije oaxaqueño con patrones geométricos multicolor y rayos estilo arte huichol.',
        'colors': ['negro', 'blanco'],
        'featured': True,
    },
    {
        'name': 'Totoro Vendedor de Elotes',
        'category': 'Anime',
        'base_price': 469,
        'description': 'Mi vecino Totoro empujando un carrito de elotes en una calle mexicana. Con limón, chile y mayonesa.',
        'colors': ['verde', 'gris'],
        'featured': True,
    },
    {
        'name': 'Spider-Man Huichol',
        'category': 'Películas',
        'base_price': 479,
        'description': 'Spider-Man con traje inspirado en arte Wixárika (huichol). Telaraña con patrones geométricos de chaquira y colores vivos.',
        'colors': ['rojo', 'azul_marino'],
        'featured': False,
    },
    {
        'name': 'Godzilla vs. Quetzalcóatl',
        'category': 'Películas',
        'base_price': 499,
        'description': 'Godzilla enfrentando a Quetzalcóatl sobre las pirámides de Teotihuacán. Fuego atómico contra fuego divino.',
        'colors': ['negro', 'azul_marino'],
        'featured': False,
    },
    {
        'name': 'Luffy Pirata del Caribe MX',
        'category': 'Anime',
        'base_price': 449,
        'description': 'Monkey D. Luffy navegando por el Caribe mexicano con sombrero de paja y hamaca. One Piece meets Cancún.',
        'colors': ['blanco', 'azul_marino'],
        'featured': False,
    },
    {
        'name': 'Zelda Frida Kahlo',
        'category': 'Videojuegos',
        'base_price': 479,
        'description': 'La princesa Zelda como Frida Kahlo con corona de flores, cejas icónicas y la Trifuerza como collar. Arte y poder.',
        'colors': ['negro', 'verde'],
        'featured': False,
    },
    {
        'name': 'Calavera Pac-Man',
        'category': 'Videojuegos',
        'base_price': 429,
        'description': 'Pac-Man como calavera de azúcar persiguiendo fantasmas decorados con papel picado. Retro gaming meets tradición.',
        'colors': ['negro', 'blanco'],
        'featured': False,
    },
]

SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

SIZE_CHART = [
    {'size': 'XS', 'chest': 84, 'length': 66},
    {'size': 'S', 'chest': 88, 'length': 68},
    {'size': 'M', 'chest': 92, 'length': 70},
    {'size': 'L', 'chest': 96, 'length': 72},
    {'size': 'XL', 'chest': 102, 'length': 74},
    {'size': 'XXL', 'chest': 108, 'length': 76},
]


class Command(BaseCommand):
    help = 'Seed 10 example products with variants and stock'

    def handle(self, *args, **options):
        cats = {}
        for name, slug in CATEGORIES.items():
            cat, _ = Category.objects.get_or_create(name=name, defaults={'slug': slug})
            cats[name] = cat

        for pdata in PRODUCTS:
            if Product.objects.filter(slug__iexact=pdata['name'].lower().replace(' ', '-')).exists():
                self.stdout.write(f"  Skip (exists): {pdata['name']}")
                continue

            product = Product.objects.create(
                name=pdata['name'],
                description=pdata['description'],
                base_price=pdata['base_price'],
                category=cats[pdata['category']],
                size_chart=SIZE_CHART,
                is_featured=pdata['featured'],
            )

            for color in pdata['colors']:
                for size in SIZES:
                    variant = Variant.objects.create(
                        product=product,
                        size=size,
                        color=color,
                    )
                    stock_qty = 10 if size in ('M', 'L', 'XL') else 5
                    Stock.objects.create(
                        variant=variant,
                        quantity=stock_qty,
                        low_threshold=2,
                    )

            self.stdout.write(self.style.SUCCESS(
                f"  Created: {product.name} ({len(pdata['colors']) * len(SIZES)} variants)"
            ))

        self.stdout.write(self.style.SUCCESS('\nDone! Products seeded.'))
