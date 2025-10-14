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
import requests
from .serializers import (
    RegisterSerializer, 
    UserSerializer, 
    UserProfileSerializer, 
    CommunitySerializer, 
    CommunityDetailSerializer, 
    PostSerializer, 
    ScholarshipSerializer, 
    ScholarshipListSerializer, 
    ScholarshipContributionSerializer, 
    TagSerializer, 
    UserTagSerializer, 
    PostLikeSerializer, 
    PostCommentSerializer,
    AlumniProfileSerializer,  # Add this
    WorkExperienceSerializer,  # Add this
    EducationSerializer,  # Add this
    SkillSerializer  # Add this
)
from .models import User, Community, Post, Scholarship, ScholarshipContribution, Tag, UserTag, PostLike, PostComment, WorkExperience, Education, Skill  # Add the new models
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


class PublicUserProfileView(generics.RetrieveAPIView):
    """
    API view for retrieving any user's public profile by their ID.
    Corresponds to: GET /profiles/{userId}/
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    
    def get_queryset(self):
        return User.objects.filter(status=User.Status.VERIFIED)
        
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
    Lists latest posts or creates a new post with recommendations based on user similarity.
    Corresponds to: GET /api/posts/, POST /api/posts/
    """
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Returns posts ordered by relevance to the current user.
        Prioritizes posts from users with similar graduation year and department.
        """
        current_user = self.request.user
        
        # Get user's profile information for similarity matching
        try:
            user_profile = current_user.alumni_profile
            user_graduation_year = user_profile.graduation_year
            user_department = user_profile.department
        except:
            # If user doesn't have a profile, return recent posts
            return Post.objects.filter(status=Post.Status.APPROVED).order_by('-created_at')[:20]
        
        # Get all approved posts (limit to recent posts for performance)
        from django.utils import timezone
        from datetime import timedelta
        
        # Only consider posts from the last 30 days for better performance
        recent_date = timezone.now() - timedelta(days=30)
        posts = Post.objects.filter(
            status=Post.Status.APPROVED,
            created_at__gte=recent_date
        ).select_related(
            'author__alumni_profile', 'community'
        ).exclude(author=current_user).order_by('-created_at')  # Don't show user's own posts
        
        # If no recent posts, get latest 50 posts regardless of date
        if not posts.exists():
            posts = Post.objects.filter(status=Post.Status.APPROVED).select_related(
                'author__alumni_profile', 'community'
            ).exclude(author=current_user).order_by('-created_at')[:50]
        
        # Calculate similarity scores and sort posts
        posts_with_scores = []
        
        for post in posts:
            similarity_score = self._calculate_user_similarity(
                current_user, post.author, user_graduation_year, user_department
            )
            posts_with_scores.append((post, similarity_score))
        
        # Sort by similarity score (highest first), then by recency
        posts_with_scores.sort(key=lambda x: (x[1], x[0].created_at), reverse=True)
        
        # Return the top 20 posts
        recommended_posts = [post for post, score in posts_with_scores[:20]]
        
        return recommended_posts

    def _calculate_user_similarity(self, current_user, post_author, user_graduation_year, user_department):
        """
        Calculate similarity score between current user and post author.
        Higher score means more similar users.
        """
        try:
            author_profile = post_author.alumni_profile
            author_graduation_year = author_profile.graduation_year
            author_department = author_profile.department
        except:
            return 0  # No profile means no similarity
        
        similarity_score = 0
        
        # Department similarity (highest weight - 50 points)
        if user_department == author_department:
            similarity_score += 50
        
        # Graduation year proximity (40 points max)
        year_difference = abs(user_graduation_year - author_graduation_year)
        if year_difference == 0:
            similarity_score += 40  # Same year
        elif year_difference == 1:
            similarity_score += 30  # 1 year difference
        elif year_difference == 2:
            similarity_score += 20  # 2 years difference
        elif year_difference <= 5:
            similarity_score += 10  # Within 5 years
        
        # Bonus for same department AND close graduation year
        if (user_department == author_department and year_difference <= 2):
            similarity_score += 20  # Bonus for being very similar
        
        # Small recency boost (10 points max for recent posts)
        # This is handled in the main queryset sorting, so we'll skip individual post recency here
        # to keep the similarity score focused on user attributes
        
        return similarity_score

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
        total_contributors = sum(scholarship.endowment.count() for scholarship in queryset)
        
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
    Corresponds to: POST /api/scholarships/{scholarship_id}/endowment/
    """
    serializer_class = ScholarshipContributionSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        scholarship_id = self.kwargs['scholarship_id']
        scholarship = Scholarship.objects.get(id=scholarship_id)
        serializer.save(scholarship=scholarship)


class ScholarshipEndowmentListView(generics.ListAPIView):
    """
    List all endowment for a specific scholarship.
    Corresponds to: GET /api/scholarships/{scholarship_id}/endowment/
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

class PostDetailView(generics.RetrieveAPIView):
    """
    Retrieve a specific post by its ID.
    Corresponds to: GET /api/posts/{id}/
    """
    queryset = Post.objects.filter(status=Post.Status.APPROVED)
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'


class UserRecommendationsView(generics.ListAPIView):
    """
    Get recommended users based on similarity to the current user.
    Corresponds to: GET /api/profiles/recommendations/
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Returns top 6 recommended users based on similarity algorithm.
        """
        current_user = self.request.user
        
        # Get current user's profile information
        try:
            user_profile = current_user.alumni_profile
            user_graduation_year = user_profile.graduation_year
            user_department = user_profile.department
        except:
            # If user doesn't have a profile, return random verified users
            return User.objects.filter(
                status=User.Status.VERIFIED
            ).exclude(id=current_user.id).order_by('?')[:6]
        
        # Get all verified users except current user
        potential_users = User.objects.filter(
            status=User.Status.VERIFIED
        ).exclude(id=current_user.id).select_related('alumni_profile')
        
        # Calculate similarity scores for each user
        users_with_scores = []
        
        for user in potential_users:
            similarity_score = self._calculate_user_similarity(
                current_user, user, user_graduation_year, user_department
            )
            
            # Only include users with some similarity (score > 0)
            if similarity_score > 0:
                users_with_scores.append((user, similarity_score))
        
        # Sort by similarity score (highest first)
        users_with_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Return top 6 recommendations
        recommended_users = [user for user, score in users_with_scores[:6]]
        
        # If we don't have enough similar users, fill with random users
        if len(recommended_users) < 6:
            remaining_count = 6 - len(recommended_users)
            excluded_ids = [user.id for user in recommended_users] + [current_user.id]
            
            additional_users = User.objects.filter(
                status=User.Status.VERIFIED
            ).exclude(id__in=excluded_ids).order_by('?')[:remaining_count]
            
            recommended_users.extend(additional_users)
        
        return recommended_users[:6]  # Ensure we never return more than 6
    
    def _calculate_user_similarity(self, current_user, target_user, user_graduation_year, user_department):
        """
        Calculate similarity score between current user and target user.
        Higher score means more similar users.
        
        Scoring system:
        - Same department: 100 points
        - Same graduation year: 80 points
        - 1 year difference: 60 points
        - 2 years difference: 40 points
        - 3-5 years difference: 20 points
        - Same department + close year bonus: +30 points
        - Same role: +20 points
        - Recently active: +10 points
        """
        try:
            target_profile = target_user.alumni_profile
            target_graduation_year = target_profile.graduation_year
            target_department = target_profile.department
        except:
            return 0  # No profile means no similarity
        
        similarity_score = 0
        
        # Department similarity (highest weight - 100 points)
        if user_department.lower() == target_department.lower():
            similarity_score += 100
        
        # Graduation year proximity (80 points max)
        year_difference = abs(user_graduation_year - target_graduation_year)
        if year_difference == 0:
            similarity_score += 80  # Same year
        elif year_difference == 1:
            similarity_score += 60  # 1 year difference
        elif year_difference == 2:
            similarity_score += 40  # 2 years difference
        elif year_difference <= 5:
            similarity_score += 20  # Within 5 years
        
        # Bonus for same department AND close graduation year
        if (user_department.lower() == target_department.lower() and year_difference <= 2):
            similarity_score += 30  # Strong similarity bonus
        
        # Role similarity (20 points)
        if current_user.role == target_user.role:
            similarity_score += 20
        
        # Recent activity bonus (10 points)
        from django.utils import timezone
        from datetime import timedelta
        
        # Check if user has been active recently (posted or commented in last 30 days)
        recent_date = timezone.now() - timedelta(days=30)
        has_recent_activity = (
            target_user.posts.filter(created_at__gte=recent_date).exists() or
            target_user.post_comments.filter(created_at__gte=recent_date).exists()
        )
        
        if has_recent_activity:
            similarity_score += 10
        
        # Credit score proximity bonus (5 points max)
        try:
            current_credit = current_user.alumni_profile.credit_score
            target_credit = target_profile.credit_score
            credit_difference = abs(current_credit - target_credit)
            
            if credit_difference <= 50:
                similarity_score += 5
        except:
            pass  # Ignore if credit scores not available
        
        return similarity_score
    
    def list(self, request, *args, **kwargs):
        """Override list to add recommendation reasons"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Add recommendation reasons for each user
        current_user = request.user
        try:
            user_profile = current_user.alumni_profile
            user_graduation_year = user_profile.graduation_year
            user_department = user_profile.department
        except:
            user_graduation_year = None
            user_department = None
        
        enhanced_data = []
        for i, user_data in enumerate(serializer.data):
            user = queryset[i]
            
            # Generate recommendation reason
            reason = self._get_recommendation_reason(
                current_user, user, user_graduation_year, user_department
            )
            
            enhanced_data.append({
                **user_data,
                'recommendation_reason': reason
            })
        
        return Response({
            'results': enhanced_data,
            'total_recommendations': len(enhanced_data)
        })
    
    def _get_recommendation_reason(self, current_user, target_user, user_graduation_year, user_department):
        """Generate a human-readable reason for the recommendation"""
        try:
            target_profile = target_user.alumni_profile
            target_graduation_year = target_profile.graduation_year
            target_department = target_profile.department
        except:
            return "Fellow alumni"
        
        reasons = []
        
        # Check department match
        if user_department and user_department.lower() == target_department.lower():
            reasons.append(f"Same department ({user_department})")
        
        # Check graduation year
        if user_graduation_year:
            year_difference = abs(user_graduation_year - target_graduation_year)
            if year_difference == 0:
                reasons.append(f"Same batch ({user_graduation_year})")
            elif year_difference == 1:
                reasons.append("Close batch mate")
            elif year_difference <= 3:
                reasons.append("Recent batch mate")
        
        # Check role
        if current_user.role == target_user.role:
            role_display = dict(current_user.Role.choices).get(current_user.role, current_user.role)
            reasons.append(f"Fellow {role_display.lower()}")
        
        # Check recent activity
        from django.utils import timezone
        from datetime import timedelta
        recent_date = timezone.now() - timedelta(days=30)
        has_recent_activity = (
            target_user.posts.filter(created_at__gte=recent_date).exists() or
            target_user.post_comments.filter(created_at__gte=recent_date).exists()
        )
        
        if has_recent_activity:
            reasons.append("Recently active")
        
        # Return the most relevant reason or default
        if reasons:
            return " • ".join(reasons[:2])  # Show max 2 reasons
        else:
            return "Fellow alumni"

# Add these new views

class UserProfileUpdateView(generics.UpdateAPIView):
    """
    Update user profile information.
    Corresponds to: PUT /api/profiles/me/update/
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        
        # Update user fields
        user_data = {}
        if 'roll_number' in request.data:
            user_data['roll_number'] = request.data['roll_number']
        if 'credit_points' in request.data:
            user_data['credit_points'] = request.data['credit_points']
        
        # Update user if there's data
        if user_data:
            user_serializer = UserSerializer(user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
        
        # Update alumni profile
        if hasattr(user, 'alumni_profile'):
            profile = user.alumni_profile
            profile_data = {}
            
            if 'full_name' in request.data:
                profile_data['full_name'] = request.data['full_name']
            if 'graduation_year' in request.data:
                profile_data['graduation_year'] = request.data['graduation_year']
            if 'department' in request.data:
                profile_data['department'] = request.data['department']
            if 'profile_picture_url' in request.data:
                profile_data['profile_picture_url'] = request.data['profile_picture_url']
            if 'about_me' in request.data:
                profile_data['about_me'] = request.data['about_me']
            
            if profile_data:
                profile_serializer = AlumniProfileSerializer(profile, data=profile_data, partial=True)
                if profile_serializer.is_valid():
                    profile_serializer.save()
        
        # Return updated user data
        updated_user = User.objects.get(id=user.id)
        return Response(UserProfileSerializer(updated_user).data)


class WorkExperienceListCreateView(generics.ListCreateAPIView):
    """
    List and create work experiences for the authenticated user.
    Corresponds to: GET/POST /api/work-experience/
    """
    serializer_class = WorkExperienceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return WorkExperience.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WorkExperienceDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a work experience.
    Corresponds to: GET/PUT/DELETE /api/work-experience/{id}/
    """
    serializer_class = WorkExperienceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return WorkExperience.objects.filter(user=self.request.user)


class EducationListCreateView(generics.ListCreateAPIView):
    """
    List and create education entries for the authenticated user.
    Corresponds to: GET/POST /api/education/
    """
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Education.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class EducationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete an education entry.
    Corresponds to: GET/PUT/DELETE /api/education/{id}/
    """
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Education.objects.filter(user=self.request.user)


class SkillListCreateView(generics.ListCreateAPIView):
    """
    List and create skills for the authenticated user.
    Corresponds to: GET/POST /api/skills/
    """
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Skill.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a skill.
    Corresponds to: GET/PUT/DELETE /api/skills/{id}/
    """
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Skill.objects.filter(user=self.request.user)
