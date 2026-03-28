import uuid

from .models import FunnelEvent, PageView, Visit

ANALYTICS_COOKIE = 'ms_vid'
TRACKED_PREFIXES = ('/api/',)
IGNORED_PREFIXES = ('/api/admin/', '/api/analytics/', '/api/auth/', '/api/payments/webhook/')


def _get_client_ip(request):
    xff = request.META.get('HTTP_X_FORWARDED_FOR')
    if xff:
        return xff.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


class AnalyticsMiddleware:
    """Track /api/ requests: create Visit on first hit, log PageViews."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        path = request.path
        if not any(path.startswith(p) for p in TRACKED_PREFIXES):
            return response
        if any(path.startswith(p) for p in IGNORED_PREFIXES):
            return response

        try:
            self._track(request, response)
        except Exception:
            pass

        return response

    def _track(self, request, response):
        session_id = request.COOKIES.get(ANALYTICS_COOKIE)
        is_new = False

        if not session_id:
            session_id = str(uuid.uuid4())
            is_new = True

        visit = Visit.objects.filter(session_id=session_id).first()
        if not visit:
            visit = Visit.objects.create(
                session_id=session_id,
                user_id=request.user.pk if hasattr(request, 'user') and request.user.is_authenticated else None,
                utm_source=request.GET.get('utm_source', ''),
                utm_medium=request.GET.get('utm_medium', ''),
                utm_campaign=request.GET.get('utm_campaign', ''),
                utm_content=request.GET.get('utm_content', ''),
                utm_term=request.GET.get('utm_term', ''),
                referrer=request.META.get('HTTP_REFERER', ''),
                ip=_get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
            )
            FunnelEvent.objects.create(visit=visit, event_type='visit')

        PageView.objects.create(visit=visit, path=request.path)

        if is_new:
            response.set_cookie(
                ANALYTICS_COOKIE, session_id,
                max_age=60 * 60 * 24 * 365,
                httponly=True, samesite='Lax',
            )
