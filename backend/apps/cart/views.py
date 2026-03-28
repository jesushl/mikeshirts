from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CartItem
from .serializers import CartItemInputSerializer, CartItemUpdateSerializer
from .services import (
    SessionCart,
    build_cart_response,
    get_or_create_db_cart,
    merge_session_into_db,
    _get_variant_or_none,
)


def _get_cart_items(request):
    """Return list of (variant, quantity) tuples for current user/session."""
    if request.user.is_authenticated:
        cart = get_or_create_db_cart(request.user)
        return [
            (item.variant, item.quantity)
            for item in cart.items.select_related(
                'variant__product', 'variant__stock',
            ).all()
        ]
    return SessionCart(request.session).get_items()


class CartView(APIView):
    """GET current cart, DELETE to clear."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        items = _get_cart_items(request)
        return Response(build_cart_response(items, request))

    def delete(self, request):
        if request.user.is_authenticated:
            cart = get_or_create_db_cart(request.user)
            cart.items.all().delete()
        else:
            SessionCart(request.session).clear()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartItemAddView(APIView):
    """POST to add a variant to the cart."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CartItemInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        variant_id = serializer.validated_data['variant_id']
        quantity = serializer.validated_data['quantity']

        variant = _get_variant_or_none(variant_id)
        if not variant:
            return Response(
                {'detail': 'Variante no encontrada o producto inactivo.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if request.user.is_authenticated:
            cart = get_or_create_db_cart(request.user)
            item, created = CartItem.objects.get_or_create(
                cart=cart, variant=variant,
                defaults={'quantity': quantity},
            )
            if not created:
                item.quantity += quantity
                item.save()
        else:
            SessionCart(request.session).add(variant_id, quantity)

        items = _get_cart_items(request)
        return Response(
            build_cart_response(items, request),
            status=status.HTTP_201_CREATED,
        )


class CartItemUpdateView(APIView):
    """PATCH to update quantity of a cart item by variant_id."""
    permission_classes = [permissions.AllowAny]

    def patch(self, request, variant_id):
        serializer = CartItemUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quantity = serializer.validated_data['quantity']

        if request.user.is_authenticated:
            cart = get_or_create_db_cart(request.user)
            try:
                item = cart.items.get(variant_id=variant_id)
                item.quantity = quantity
                item.save()
            except CartItem.DoesNotExist:
                return Response(
                    {'detail': 'Item no está en el carrito.'},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            try:
                SessionCart(request.session).update_quantity(variant_id, quantity)
            except ValueError as e:
                return Response(
                    {'detail': str(e)}, status=status.HTTP_404_NOT_FOUND,
                )

        items = _get_cart_items(request)
        return Response(build_cart_response(items, request))


class CartItemDeleteView(APIView):
    """DELETE to remove a variant from the cart."""
    permission_classes = [permissions.AllowAny]

    def delete(self, request, variant_id):
        if request.user.is_authenticated:
            cart = get_or_create_db_cart(request.user)
            cart.items.filter(variant_id=variant_id).delete()
        else:
            SessionCart(request.session).remove(variant_id)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartMergeView(APIView):
    """POST to merge anonymous session cart into authenticated DB cart."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        merge_session_into_db(request.session, request.user)
        items = _get_cart_items(request)
        return Response(build_cart_response(items, request))
