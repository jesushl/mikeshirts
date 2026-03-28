from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.payments.services import create_mp_preference
from .models import Order
from .serializers import (
    CheckoutSerializer,
    OrderDetailSerializer,
    OrderListSerializer,
)
from .services import create_order_from_cart


class CheckoutView(APIView):
    """POST: create order from cart and return Mercado Pago payment URL."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            order = create_order_from_cart(
                request.user,
                serializer.validated_data['shipping_address_id'],
            )
        except ValueError as e:
            return Response(
                {'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            init_point = create_mp_preference(order)
        except Exception as e:
            order.delete()
            return Response(
                {'detail': f'Error al crear pago: {e}'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({
            'order_id': order.pk,
            'init_point': init_point,
        }, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related('items', 'sale_ticket', 'ship_ticket')
        )
