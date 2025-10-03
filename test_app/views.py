# test_app/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer, UserSerializer, UserProfileSerializer, CommunitySerializer, PostSerializer
from .models import User, Community, Post
from .permissions import IsAdminUser

class RegisterView(generics.CreateAPIView):
    """
    API view for user registration.
    Corresponds to: POST /auth/register
    """
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny] # Anyone can access this view to register

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # We can return some basic user info upon successful registration
        user_data = UserSerializer(user).data
        
        return Response(
            {
                "user": user_data,
                "message": "User created successfully. Please log in.",
            },
            status=status.HTTP_201_CREATED
        )
        
class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API view for retrieving and updating the authenticated user's profile.
    Corresponds to: GET /profiles/me, PUT /profiles/me
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated] # Ensures only logged-in users can access this

    def get_object(self):
        # This method returns the object that the view will display.
        # We override it to always return the currently authenticated user.
        return self.request.user
        
class AdminVerificationListView(generics.ListAPIView):
    """
    Lists all users pending verification.
    Accessible only by Admins.
    Corresponds to: GET /admin/verifications
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        # We only want to see users who are PENDING.
        return User.objects.filter(status=User.Status.PENDING)


class AdminApproveVerificationView(generics.GenericAPIView):
    """
    Approves a user's verification status.
    Accessible only by Admins.
    Corresponds to: POST /admin/verifications/{userId}/approve
    """
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, *args, **kwargs):
        user_id = self.kwargs.get('userId')

        try:
            # It's good practice to ensure we're only approving pending users.
            user_to_verify = User.objects.get(id=user_id, status=User.Status.PENDING)
        except User.DoesNotExist:
            return Response({"error": "User pending verification not found."}, status=status.HTTP_404_NOT_FOUND)

        user_to_verify.status = User.Status.VERIFIED
        user_to_verify.save()
        return Response({"message": f"User {user_to_verify.email} has been verified."}, status=status.HTTP_200_OK)
    
class CommunityListView(generics.ListAPIView):
    """
    Lists all available communities.
    Corresponds to: GET /api/communities/
    """
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    permission_classes = [IsAuthenticated]


class PostCreateView(generics.CreateAPIView):
    """
    Creates a new post, which will be in a PENDING state for moderation.
    Corresponds to: POST /api/posts/
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]


class CommunityPostListView(generics.ListAPIView):
    """
    Lists all APPROVED posts within a specific community.
    Corresponds to: GET /api/communities/{communityId}/posts/
    """
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filter posts by the community ID in the URL and by APPROVED status.
        """
        community_id = self.kwargs['community_id']
        return Post.objects.filter(
            community_id=community_id,
            status=Post.Status.APPROVED
        ).order_by('-created_at')
