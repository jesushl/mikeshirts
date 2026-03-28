import logging

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import process_mp_payment

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name='dispatch')
class WebhookView(APIView):
    """Receives Mercado Pago payment notifications."""
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        topic = request.data.get('type') or request.query_params.get('topic')
        data = request.data.get('data', {})

        if topic == 'payment':
            mp_payment_id = data.get('id') or request.query_params.get('id')
            if mp_payment_id:
                try:
                    process_mp_payment(mp_payment_id)
                except Exception:
                    logger.exception('Error processing MP payment %s', mp_payment_id)

        return Response(status=status.HTTP_200_OK)
