import uuid

from django.db import models


class Visit(models.Model):
    session_id = models.UUIDField(default=uuid.uuid4, db_index=True)
    user_id = models.IntegerField(null=True, blank=True, db_index=True)
    utm_source = models.CharField(max_length=255, blank=True)
    utm_medium = models.CharField(max_length=255, blank=True)
    utm_campaign = models.CharField(max_length=255, blank=True)
    utm_content = models.CharField(max_length=255, blank=True)
    utm_term = models.CharField(max_length=255, blank=True)
    referrer = models.URLField(max_length=2048, blank=True)
    ip = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    started_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'analytics'
        db_table = 'analytics_visit'
        ordering = ['-started_at']

    def __str__(self):
        return f'Visit {self.session_id} — {self.started_at:%Y-%m-%d %H:%M}'


class PageView(models.Model):
    visit = models.ForeignKey(Visit, on_delete=models.CASCADE, related_name='pageviews')
    path = models.CharField(max_length=2048)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'analytics'
        db_table = 'analytics_pageview'
        ordering = ['-timestamp']

    def __str__(self):
        return f'{self.path} — {self.timestamp:%H:%M:%S}'


class FunnelEvent(models.Model):
    EVENT_TYPES = [
        ('visit', 'Visita al sitio'),
        ('product_view', 'Vista de producto'),
        ('add_to_cart', 'Agregar al carrito'),
        ('checkout_start', 'Inicio de checkout'),
        ('purchase', 'Compra completada'),
    ]

    visit = models.ForeignKey(Visit, on_delete=models.CASCADE, related_name='funnel_events')
    event_type = models.CharField(max_length=30, choices=EVENT_TYPES, db_index=True)
    metadata = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'analytics'
        db_table = 'analytics_funnelevent'
        ordering = ['-timestamp']

    def __str__(self):
        return f'{self.get_event_type_display()} — {self.timestamp:%H:%M:%S}'
