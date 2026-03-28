from decimal import Decimal

from django.conf import settings

from apps.catalog.models import Variant
from apps.inventory.models import Stock
from .models import Cart, CartItem

CART_SESSION_KEY = 'cart'


def _get_variant_or_none(variant_id):
    try:
        return Variant.objects.select_related('product').get(
            pk=variant_id, product__is_active=True,
        )
    except Variant.DoesNotExist:
        return None


def _check_availability(variant, requested_qty):
    """Returns max available quantity (stock + on-demand capacity)."""
    try:
        stock = variant.stock
    except Stock.DoesNotExist:
        return 0
    if stock.availability == 'unavailable':
        return 0
    return requested_qty


class SessionCart:
    """Cart backed by Django session for anonymous users."""

    def __init__(self, session):
        self._session = session
        self._cart = session.get(CART_SESSION_KEY, {})

    def _save(self):
        self._session[CART_SESSION_KEY] = self._cart
        self._session.modified = True

    def add(self, variant_id, quantity=1):
        variant = _get_variant_or_none(variant_id)
        if not variant:
            raise ValueError('Variante no encontrada o producto inactivo.')
        _check_availability(variant, quantity)
        key = str(variant_id)
        if key in self._cart:
            self._cart[key] += quantity
        else:
            self._cart[key] = quantity
        self._save()

    def update_quantity(self, variant_id, quantity):
        key = str(variant_id)
        if key not in self._cart:
            raise ValueError('Item no está en el carrito.')
        if quantity <= 0:
            self.remove(variant_id)
            return
        self._cart[key] = quantity
        self._save()

    def remove(self, variant_id):
        key = str(variant_id)
        self._cart.pop(key, None)
        self._save()

    def clear(self):
        self._cart = {}
        self._save()

    def get_items(self):
        """Return list of (variant, quantity) tuples."""
        items = []
        for vid_str, qty in self._cart.items():
            variant = _get_variant_or_none(int(vid_str))
            if variant:
                items.append((variant, qty))
        return items

    def is_empty(self):
        return len(self._cart) == 0

    def as_dict(self):
        """Return raw session dict (for merge)."""
        return dict(self._cart)


def get_or_create_db_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


def merge_session_into_db(session, user):
    """Merge anonymous session cart into authenticated DB cart."""
    session_cart = SessionCart(session)
    if session_cart.is_empty():
        return
    db_cart = get_or_create_db_cart(user)
    for variant, qty in session_cart.get_items():
        item, created = CartItem.objects.get_or_create(
            cart=db_cart, variant=variant,
            defaults={'quantity': qty},
        )
        if not created:
            item.quantity += qty
            item.save()
    session_cart.clear()


def build_cart_response(items, request=None):
    """Build a serializable cart dict from a list of (variant, quantity) pairs."""
    shipping = getattr(settings, 'SHIPPING_FLAT_RATE', Decimal('249.00'))
    cart_items = []
    subtotal = Decimal('0.00')
    for variant, qty in items:
        line_total = variant.effective_price * qty
        subtotal += line_total
        img = variant.product.images.filter(is_main=True).first()
        if not img:
            img = variant.product.images.first()
        image_url = None
        if img and img.image:
            image_url = img.image.url
            if request:
                image_url = request.build_absolute_uri(image_url)
        cart_items.append({
            'variant_id': variant.id,
            'product_name': variant.product.name,
            'product_slug': variant.product.slug,
            'size': variant.get_size_display(),
            'color': variant.get_color_display(),
            'sku': variant.sku,
            'unit_price': str(variant.effective_price),
            'quantity': qty,
            'line_total': str(line_total),
            'image': image_url,
        })
    total = subtotal + shipping if cart_items else Decimal('0.00')
    return {
        'items': cart_items,
        'item_count': sum(i['quantity'] for i in cart_items),
        'subtotal': str(subtotal),
        'shipping': str(shipping),
        'total': str(total),
    }
