from django.contrib.auth.models import UserManager

STAFF_GROUPS = {'ventas', 'envios', 'produccion', 'admin_full'}


class CustomerManager(UserManager):
    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .exclude(groups__name__in=STAFF_GROUPS)
        )


class StaffUserManager(UserManager):
    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(groups__name__in=STAFF_GROUPS)
            .distinct()
        )
