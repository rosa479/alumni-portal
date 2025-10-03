# test_app/urls.py

from django.urls import path
from .views import (
    RegisterView,
    UserProfileView,
    AdminVerificationListView,
    AdminApproveVerificationView,
    CommunityListView,
    PostCreateView,
    CommunityPostListView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Service: Auth
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Service: Profile
    path('profiles/me/', UserProfileView.as_view(), name='user_profile'),

    # Service: Admin
    path('admin/verifications/', AdminVerificationListView.as_view(), name='admin_verification_list'),
    path('admin/verifications/<uuid:userId>/approve/', AdminApproveVerificationView.as_view(), name='admin_verification_approve'),

    # Service: Community & Posts
    path('communities/', CommunityListView.as_view(), name='community_list'),
    path('posts/', PostCreateView.as_view(), name='post_create'),
    path('communities/<uuid:community_id>/posts/', CommunityPostListView.as_view(), name='community_post_list'),

]