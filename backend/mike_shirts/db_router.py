class AnalyticsRouter:
    """Route analytics models to the analytics database."""

    ANALYTICS_LABELS = {'analytics'}

    def db_for_read(self, model, **hints):
        if model._meta.app_label in self.ANALYTICS_LABELS:
            return 'analytics'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label in self.ANALYTICS_LABELS:
            return 'analytics'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        labels = self.ANALYTICS_LABELS
        if obj1._meta.app_label in labels or obj2._meta.app_label in labels:
            return obj1._meta.app_label == obj2._meta.app_label
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label in self.ANALYTICS_LABELS:
            return db == 'analytics'
        if db == 'analytics':
            return False
        return None
