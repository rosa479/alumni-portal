# test_app/urls.py

from django.urls import path
from .views import RegisterView, UserProfileView # Add UserProfileView to the import
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/me/', UserProfileView.as_view(), name='user_profile'), # Add this line
]
