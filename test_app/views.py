# test_app/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from test_app.storage import MediaStorage
import uuid
import os
from .serializers import RegisterSerializer, UserSerializer, UserProfileSerializer, CommunitySerializer, CommunityDetailSerializer, PostSerializer, ScholarshipSerializer, ScholarshipListSerializer, ScholarshipContributionSerializer, TagSerializer, UserTagSerializer, PostLikeSerializer, PostCommentSerializer
from .models import User, Community, Post, Scholarship, ScholarshipContribution, Tag, UserTag, PostLike, PostComment
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

        # Generate JWT tokens for the new user
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        # Return user info and tokens for automatic login
        user_data = UserSerializer(user).data
        
        return Response(
            {
                "user": user_data,
                "access": str(access),
                "refresh": str(refresh),
                "message": "User created successfully.",
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
    Lists all available communities with counts only.
    Corresponds to: GET /api/communities/
    """
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    permission_classes = [IsAuthenticated]


class CommunityDetailView(generics.RetrieveAPIView):
    """
    Retrieve a specific community with latest posts.
    Corresponds to: GET /api/communities/{id}/
    """
    queryset = Community.objects.all()
    serializer_class = CommunityDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'


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
    
    def list(self, request, *args, **kwargs):
        """Override list to add total calculations"""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        # Calculate totals
        total_raised = sum(float(scholarship.current_amount) for scholarship in queryset)
        total_contributors = sum(scholarship.contributions.count() for scholarship in queryset)
        
        return Response({
            'results': serializer.data,
            'total_raised': total_raised,
            'total_contributors': total_contributors,
            'total_scholarships': queryset.count()
        })


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


class TagListCreateView(generics.ListCreateAPIView):
    """
    List all tags for a community or create a new tag.
    Corresponds to: GET /api/communities/{community_id}/tags/, POST /api/communities/{community_id}/tags/
    """
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        community_id = self.kwargs['community_id']
        return Tag.objects.filter(community_id=community_id, is_active=True)
    
    def perform_create(self, serializer):
        community_id = self.kwargs['community_id']
        community = Community.objects.get(id=community_id)
        serializer.save(community=community, created_by=self.request.user)


class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a tag.
    Corresponds to: GET /api/tags/{id}/, PUT /api/tags/{id}/, DELETE /api/tags/{id}/
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]


class UserTagListCreateView(generics.ListCreateAPIView):
    """
    List user tags or assign tags to users.
    Corresponds to: GET /api/user-tags/, POST /api/user-tags/
    """
    serializer_class = UserTagSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserTag.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(assigned_by=self.request.user)


class CommunityUserTagsView(generics.ListAPIView):
    """
    List all user tags for a specific community.
    Corresponds to: GET /api/communities/{community_id}/user-tags/
    """
    serializer_class = UserTagSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        community_id = self.kwargs['community_id']
        return UserTag.objects.filter(
            tag__community_id=community_id,
            user=self.request.user,
            is_active=True
        )


class ImageUploadView(APIView):
    """
    Handle image uploads to S3.
    Corresponds to: POST /api/upload-image/
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            if 'image' not in request.FILES:
                return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            image_file = request.FILES['image']
            
            # Generate unique filename
            file_extension = os.path.splitext(image_file.name)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            
            # Use S3 storage directly
            s3_storage = MediaStorage()
            file_path = f"uploads/{unique_filename}"
            saved_path = s3_storage.save(file_path, ContentFile(image_file.read()))
            
            # Get the public URL
            image_url = s3_storage.url(saved_path)
            
            return Response({
                'image_url': image_url,
                'message': 'Image uploaded successfully'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': f'Failed to upload image: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PostLikeView(APIView):
    """
    Handle post likes - like/unlike a post
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            like, created = PostLike.objects.get_or_create(
                post=post,
                user=request.user
            )
            
            if created:
                return Response({
                    'message': 'Post liked successfully',
                    'liked': True,
                    'likes_count': post.likes.count()
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'message': 'Post already liked',
                    'liked': True,
                    'likes_count': post.likes.count()
                }, status=status.HTTP_200_OK)
                
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            like = PostLike.objects.get(post=post, user=request.user)
            like.delete()
            
            return Response({
                'message': 'Post unliked successfully',
                'liked': False,
                'likes_count': post.likes.count()
            }, status=status.HTTP_200_OK)
            
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        except PostLike.DoesNotExist:
            return Response({'error': 'Like not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PostCommentListCreateView(generics.ListCreateAPIView):
    """
    List and create comments for a post
    """
    serializer_class = PostCommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return PostComment.objects.filter(post_id=post_id).order_by('-created_at')
    
    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = Post.objects.get(id=post_id)
        serializer.save(user=self.request.user, post=post)


class PostCommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific comment
    """
    serializer_class = PostCommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return PostComment.objects.filter(user=self.request.user)


# OAuth Views
class GoogleOAuthView(APIView):
    """
    Handle Google OAuth authentication
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            code = request.data.get('code')
            redirect_uri = request.data.get('redirect_uri')
            
            if not code:
                return Response({'error': 'Authorization code is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Exchange code for access token
            import requests
            from django.conf import settings
            
            token_url = 'https://oauth2.googleapis.com/token'
            token_data = {
                'client_id': settings.GOOGLE_OAUTH_CLIENT_ID,
                'client_secret': settings.GOOGLE_OAUTH_CLIENT_SECRET,
                'code': code,
                'grant_type': 'authorization_code',
                'redirect_uri': redirect_uri
            }
            
            token_response = requests.post(token_url, data=token_data)
            token_response.raise_for_status()
            token_info = token_response.json()
            
            # Get user info from Google
            user_info_url = f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={token_info['access_token']}"
            user_response = requests.get(user_info_url)
            user_response.raise_for_status()
            google_profile = user_response.json()
            
            email = google_profile.get('email')
            if not email:
                return Response({'error': 'Email not provided by Google'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user exists
            try:
                user = User.objects.get(email=email)
                if user.is_active:
                    # User exists and is active - generate tokens
                    from rest_framework_simplejwt.tokens import RefreshToken
                    refresh = RefreshToken.for_user(user)
                    access = refresh.access_token
                    
                    return Response({
                        'user_exists': True,
                        'user': UserSerializer(user).data,
                        'access': str(access),
                        'refresh': str(refresh)
                    })
                else:
                    # User exists but not active
                    return Response({
                        'user_exists': True,
                        'user': UserSerializer(user).data,
                        'google_profile': google_profile
                    })
            except User.DoesNotExist:
                # User doesn't exist
                return Response({
                    'user_exists': False,
                    'google_profile': google_profile
                })
                
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CheckUserView(APIView):
    """
    Check if user exists by email
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            return Response({
                'exists': True,
                'is_active': user.is_active,
                'user': UserSerializer(user).data
            })
        except User.DoesNotExist:
            return Response({'exists': False})


class ActivateUserView(APIView):
    """
    Activate existing user account
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            email = request.data.get('email')
            if not email:
                return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.get(email=email)
            
            # Update user data
            user.full_name = request.data.get('full_name', user.full_name)
            user.roll_number = request.data.get('roll_number', user.roll_number)
            user.graduation_year = request.data.get('graduation_year', user.graduation_year)
            user.department = request.data.get('department', user.department)
            user.is_active = True
            user.save()
            
            # Update alumni profile if exists
            if hasattr(user, 'alumni_profile'):
                profile = user.alumni_profile
                profile.full_name = request.data.get('full_name', profile.full_name)
                profile.graduation_year = request.data.get('graduation_year', profile.graduation_year)
                profile.department = request.data.get('department', profile.department)
                profile.save()
            
            # Generate tokens
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token
            
            return Response({
                'user': UserSerializer(user).data,
                'access': str(access),
                'refresh': str(refresh)
            })
            
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GoogleOAuthLoginView(APIView):
    """
    Simple OAuth login - just generate tokens for existing user
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            email = request.data.get('email')
            if not email:
                return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user exists and is active
            try:
                user = User.objects.get(email=email, is_active=True)
            except User.DoesNotExist:
                return Response({'error': 'User not found or not active'}, status=status.HTTP_404_NOT_FOUND)
            
            # Generate tokens
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token
            
            return Response({
                'user': UserSerializer(user).data,
                'access': str(access),
                'refresh': str(refresh)
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
