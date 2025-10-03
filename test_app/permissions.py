# test_app/permissions.py

from rest_framework import permissions
from .models import User

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to users with the ADMIN role.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == User.Role.ADMIN