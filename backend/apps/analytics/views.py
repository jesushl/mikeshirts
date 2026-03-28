from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .middleware import ANALYTICS_COOKIE
from .models import FunnelEvent, Visit
from .serializers import FunnelEventInputSerializer


class TrackEventView(APIView):
    """POST funnel events from the frontend."""
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = FunnelEventInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        session_id = request.COOKIES.get(ANALYTICS_COOKIE)
        if not session_id:
            return Response(
                {'detail': 'No analytics session.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        visit = Visit.objects.filter(session_id=session_id).first()
        if not visit:
            return Response(
                {'detail': 'Visit not found.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        FunnelEvent.objects.create(
            visit=visit,
            event_type=serializer.validated_data['event_type'],
            metadata=serializer.validated_data.get('metadata', {}),
        )
        return Response(status=status.HTTP_201_CREATED)
