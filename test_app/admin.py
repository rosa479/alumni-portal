# test_app/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, AlumniProfile, Community, Post, Scholarship, ScholarshipContribution

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'role', 'status', 'is_staff')
    list_filter = ('role', 'status', 'is_staff')
    search_fields = ('email',)
    ordering = ('email',)
    list_editable = ('status',)  # <-- Make status editable in list view

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

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'community', 'status', 'created_at')
    list_filter = ('status', 'community')
    search_fields = ('title', 'author__email')
    ordering = ('-created_at',)
    list_editable = ('status',)  # <-- Make status editable in list view

admin.site.register(User, CustomUserAdmin)
admin.site.register(AlumniProfile)
admin.site.register(Community)
admin.site.register(Scholarship)
admin.site.register(ScholarshipContribution)