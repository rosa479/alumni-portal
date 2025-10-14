# test_app/urls.py

from django.urls import path
from .views import (
    RegisterView,
    UserProfileView,
    PublicUserProfileView,
    AdminVerificationListView,
    AdminApproveVerificationView,
    CommunityListView,
    CommunityDetailView,
    PostListCreateView,
    CommunityPostListView,
    ScholarshipListView,
    ScholarshipDetailView,
    ScholarshipContributionCreateView,
    ScholarshipEndowmentListView,
    TagListCreateView,
    TagDetailView,
    UserRecommendationsView,
    UserTagListCreateView,
    CommunityUserTagsView,
    ImageUploadView,
    PostLikeView,
    PostCommentListCreateView,
    PostCommentDetailView,
    GoogleOAuthView,
    CheckUserView,
    ActivateUserView,
    GoogleOAuthLoginView,
    PostDetailView,  # Import the PostDetailView
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
    path('auth/google/', GoogleOAuthView.as_view(), name='google_oauth'),
    path('auth/google-login/', GoogleOAuthLoginView.as_view(), name='google_oauth_login'),
    path('auth/check-user/', CheckUserView.as_view(), name='check_user'),
    path('auth/activate-user/', ActivateUserView.as_view(), name='activate_user'),
    
    # Service: Profile
    path('profiles/me/', UserProfileView.as_view(), name='user_profile'),
    path('profiles/<uuid:id>/', PublicUserProfileView.as_view(), name='public_user_profile'),
    path('profiles/recommendations/', UserRecommendationsView.as_view(), name='user_recommendations'),  # Add this line

    # Service: Admin
    path('admin/verifications/', AdminVerificationListView.as_view(), name='admin_verification_list'),
    path('admin/verifications/<uuid:userId>/approve/', AdminApproveVerificationView.as_view(), name='admin_verification_approve'),

    # Service: Community & Posts
    path('communities/', CommunityListView.as_view(), name='community_list'),
    path('communities/<uuid:id>/', CommunityDetailView.as_view(), name='community_detail'),
    path('posts/', PostListCreateView.as_view(), name='post_create'),
    path('posts/<uuid:id>/', PostDetailView.as_view(), name='post_detail'),  # Add this line
    path('communities/<uuid:community_id>/posts/', CommunityPostListView.as_view(), name='community_post_list'),

    # Service: Scholarships
    path('scholarships/', ScholarshipListView.as_view(), name='scholarship_list'),
    path('scholarships/<uuid:pk>/', ScholarshipDetailView.as_view(), name='scholarship_detail'),
    path('scholarships/<uuid:scholarship_id>/endowment/', ScholarshipContributionCreateView.as_view(), name='scholarship_contribution_create'),
    path('scholarships/<uuid:scholarship_id>/endowment/list/', ScholarshipEndowmentListView.as_view(), name='scholarship_endowment_list'),

    # Service: Tags
    path('communities/<uuid:community_id>/tags/', TagListCreateView.as_view(), name='tag_list_create'),
    path('tags/<uuid:pk>/', TagDetailView.as_view(), name='tag_detail'),
    path('user-tags/', UserTagListCreateView.as_view(), name='user_tag_list_create'),
    path('communities/<uuid:community_id>/user-tags/', CommunityUserTagsView.as_view(), name='community_user_tags'),

    # Service: File Upload
    path('upload-image/', ImageUploadView.as_view(), name='image_upload'),
    
    # Post interactions
    path('posts/<uuid:post_id>/like/', PostLikeView.as_view(), name='post_like'),
    path('posts/<uuid:post_id>/comments/', PostCommentListCreateView.as_view(), name='post_comments'),
    path('comments/<uuid:pk>/', PostCommentDetailView.as_view(), name='comment_detail'),

]