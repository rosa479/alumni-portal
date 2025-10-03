# test_app/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, AlumniProfile

class CustomUserAdmin(UserAdmin):
    """
    Corrected configuration for the custom User model in the admin panel.
    """
    # The list view configuration is correct
    list_display = ('email', 'role', 'status', 'is_staff')
    list_filter = ('role', 'status', 'is_staff')
    search_fields = ('email',)
    ordering = ('email',)

    # **THE FIX IS HERE:** We are now defining the entire form layout from scratch,
    # leaving out the non-existent fields like 'username'.
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Custom Fields', {'fields': ('role', 'status', 'invited_by')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password'),
        }),
    )

# Register your models here
admin.site.register(User, CustomUserAdmin)
admin.site.register(AlumniProfile)