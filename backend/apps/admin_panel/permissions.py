from rest_framework.permissions import BasePermission


def _in_group(user, group_name):
    if not user or not user.is_authenticated:
        return False
    return user.groups.filter(name__in=[group_name, 'admin_full']).exists()


class IsAnyStaff(BasePermission):
    """User belongs to any staff group."""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.groups.filter(
            name__in=['ventas', 'envios', 'produccion', 'admin_full'],
        ).exists()


class IsVentas(BasePermission):
    def has_permission(self, request, view):
        return _in_group(request.user, 'ventas')


class IsEnvios(BasePermission):
    def has_permission(self, request, view):
        return _in_group(request.user, 'envios')


class IsProduccion(BasePermission):
    def has_permission(self, request, view):
        return _in_group(request.user, 'produccion')


class IsAdminFull(BasePermission):
    def has_permission(self, request, view):
        return _in_group(request.user, 'admin_full')
