# test_app/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, AlumniProfile

class CustomUserAdmin(UserAdmin):

    list_display = ('email', 'role', 'status', 'is_staff')
    list_filter = ('role', 'status', 'is_staff')
    search_fields = ('email',)
    ordering = ('email',)

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

admin.site.register(User, CustomUserAdmin)
admin.site.register(AlumniProfile)