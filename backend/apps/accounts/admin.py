from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, Address


class AddressInline(admin.TabularInline):
    model = Address
    extra = 0


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = [AddressInline]
    list_display = ('email', 'username', 'first_name', 'last_name', 'auth_provider', 'is_staff')
    list_filter = BaseUserAdmin.list_filter + ('auth_provider',)
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile', {'fields': ('phone', 'rfc', 'auth_provider')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Profile', {'fields': ('email', 'phone', 'rfc', 'auth_provider')}),
    )
