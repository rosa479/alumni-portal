# test_app/urls.py

from django.urls import path
# Import the new admin views from Step 3
from .views import (
    RegisterView,
    UserProfileView,
    AdminVerificationListView,
    AdminVerificationActionView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Existing Auth and Profile URLs
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/me/', UserProfileView.as_view(), name='user_profile'),

    # --- EDITED PART FOR STEP 3 ---
    # URLs for admins to manage user verifications.
    # This endpoint lists users awaiting verification.
    path('admin/verifications/', AdminVerificationListView.as_view(), name='admin_verification_list'),
    # This endpoint allows an admin to approve or reject a specific user's verification.
    path('admin/verifications/<uuid:userId>/action/', AdminVerificationActionView.as_view(), name='admin_verification_action'),
]