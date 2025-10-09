# test_app/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer, UserSerializer, UserProfileSerializer, CommunitySerializer, PostSerializer, ScholarshipSerializer, ScholarshipListSerializer, ScholarshipContributionSerializer
from .models import User, Community, Post, Scholarship, ScholarshipContribution
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


class PostListCreateView(generics.ListCreateAPIView):
    """
    Lists latest posts or creates a new post.
    Corresponds to: GET /api/posts/, POST /api/posts/
    """
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This method defines the list of items to be returned.
        We filter it to get the 10 most recent posts.
        """
        # 1. order_by('-created_at') sorts posts from newest to oldest.
        # 2. [:10] slices the result to get only the first 10 items.
        # 3. We filter by APPROVED status to ensure only approved posts are shown.
        return Post.objects.filter(status=Post.Status.APPROVED).order_by('-created_at')[:10]

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


class ScholarshipListView(generics.ListCreateAPIView):
    """
    Lists all scholarships or creates a new scholarship.
    Corresponds to: GET /api/scholarships/, POST /api/scholarships/
    """
    queryset = Scholarship.objects.filter(status=Scholarship.Status.ACTIVE).order_by('-created_at')
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ScholarshipListSerializer
        return ScholarshipSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ScholarshipDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a scholarship.
    Corresponds to: GET /api/scholarships/{id}/, PUT /api/scholarships/{id}/, DELETE /api/scholarships/{id}/
    """
    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer
    permission_classes = [IsAuthenticated]


class ScholarshipContributionCreateView(generics.CreateAPIView):
    """
    Create a contribution to a scholarship.
    Corresponds to: POST /api/scholarships/{scholarship_id}/contributions/
    """
    serializer_class = ScholarshipContributionSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        scholarship_id = self.kwargs['scholarship_id']
        scholarship = Scholarship.objects.get(id=scholarship_id)
        serializer.save(scholarship=scholarship)


class ScholarshipContributionsListView(generics.ListAPIView):
    """
    List all contributions for a specific scholarship.
    Corresponds to: GET /api/scholarships/{scholarship_id}/contributions/
    """
    serializer_class = ScholarshipContributionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        scholarship_id = self.kwargs['scholarship_id']
        return ScholarshipContribution.objects.filter(
            scholarship_id=scholarship_id
        ).order_by('-created_at')
