# test_app/serializers.py

from django.db import transaction
from rest_framework import serializers
from .models import User, AlumniProfile, Community, Post, Scholarship, ScholarshipContribution, Tag, UserTag, PostLike, PostComment

class AlumniProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the AlumniProfile model. Made this a standalone class
    so we can reuse it.
    """
    class Meta:
        model = AlumniProfile
        fields = ['full_name', 'graduation_year', 'department', 'about_me', 'credit_score', 'profile_picture_url']
        read_only_fields = ['credit_score'] # Users should not be able to edit their score directly


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the main User model for safe data retrieval.
    """
    alumni_profile = AlumniProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'roll_number', 'email', 'role', 'status', 'alumni_profile']


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for new user registration. It handles creating both the
    User and the associated AlumniProfile in a single, atomic transaction.
    """
    # Get profile fields directly for the registration payload
    full_name = serializers.CharField(max_length=255, write_only=True)
    graduation_year = serializers.IntegerField(write_only=True)
    department = serializers.CharField(max_length=100, write_only=True)

    # Make the password write-only to ensure it's not returned in the response
    password = serializers.CharField(min_length=8, write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        # Fields required for creating a User instance
        fields = ['email', 'roll_number', 'password', 'full_name', 'graduation_year', 'department']

    def create(self, validated_data):
        # Pop the profile data from the validated data before creating the user
        profile_data = {
            'full_name': validated_data.pop('full_name'),
            'graduation_year': validated_data.pop('graduation_year'),
            'department': validated_data.pop('department')
        }

        # Use a database transaction to ensure atomicity.
        try:
            with transaction.atomic():
                # The 'create_user' method handles password hashing automatically
                user = User.objects.create_user(**validated_data)
                
                # Create the associated AlumniProfile
                AlumniProfile.objects.create(user=user, **profile_data)
        except Exception as e:
            raise serializers.ValidationError(f"An error occurred during registration: {e}")

        return user
    

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for retrieving and updating the logged-in user's profile.
    """
    # Use the serializer above for the nested alumni_profile
    alumni_profile = AlumniProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'roll_number', 'email', 'role', 'status', 'credit_points', 'alumni_profile']
        # These fields are read-only because they are managed by the system, not the user.
        read_only_fields = ['id', 'email', 'roll_number', 'role', 'status']

    def update(self, instance, validated_data):
        # Handle the nested profile data update
        profile_data = validated_data.pop('alumni_profile', {})
        
        # Update the AlumniProfile instance
        alumni_profile = instance.alumni_profile
        for attr, value in profile_data.items():
            setattr(alumni_profile, attr, value)
        alumni_profile.save()

        # The parent update() method will handle the User fields if any
        return super().update(instance, validated_data)
class UserPublicSerializer(serializers.ModelSerializer):
    alumni_profile = AlumniProfileSerializer()
    class Meta:
        model = User
        fields = ['id', 'email', 'roll_number', 'alumni_profile']
    

class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for reading posts. Includes read-only author details.
    """
    # Use a simple string representation for the author for readability
    author_id = serializers.UUIDField(source='author.id', read_only=True)
    author_email = serializers.EmailField(source='author.email', read_only=True)
    author_profile_picture = serializers.URLField(source='author.alumni_profile.profile_picture_url', read_only=True)
    author_name = serializers.CharField(source='author.alumni_profile.full_name', read_only=True)
    community_name = serializers.CharField(source='community.name', read_only=True)
    tags = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
            
    class Meta:
        model = Post
        fields = ['id', 'community', 'community_name', 'title', 'content', 'image_url', 'tags', 'status', 'created_at', 'author_id', 'author_email', 'author_profile_picture', 'author_name', 'likes_count', 'comments_count', 'is_liked']
        read_only_fields = ['status', 'author_email']
    
    def get_tags(self, obj):
        from .models import Tag
        return TagSerializer(obj.tags.all(), many=True).data
    
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def create(self, validated_data):
        # Automatically set the author to the currently logged-in user
        validated_data['author'] = self.context['request'].user
        post = Post.objects.create(**validated_data)
        return post

class CommunitySerializer(serializers.ModelSerializer):
    """
    Serializer for listing communities with counts only.
    """
    members_count = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Community
        fields = ['id', 'name', 'description', 'members_count', 'posts_count']
    
    def get_members_count(self, obj):
        return obj.members.count()
    
    def get_posts_count(self, obj):
        return obj.posts.filter(status=Post.Status.APPROVED).count()


class CommunityDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for community detail view with latest posts.
    """
    members_count = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()
    latest_posts = serializers.SerializerMethodField()
    
    class Meta:
        model = Community
        fields = ['id', 'name', 'description', 'members_count', 'posts_count', 'latest_posts']
    
    def get_members_count(self, obj):
        return obj.members.count()
    
    def get_posts_count(self, obj):
        return obj.posts.filter(status=Post.Status.APPROVED).count()
    
    def get_latest_posts(self, obj):
        latest_posts = obj.posts.filter(status=Post.Status.APPROVED).order_by('-created_at')[:10]
        return PostSerializer(latest_posts, many=True).data


class TagSerializer(serializers.ModelSerializer):
    """
    Serializer for tags
    """
    class Meta:
        model = Tag
        fields = ['id', 'name', 'description', 'community', 'created_by', 'created_at', 'is_active']
        read_only_fields = ['created_by', 'created_at']


class UserTagSerializer(serializers.ModelSerializer):
    """
    Serializer for user-tag mappings
    """
    tag_name = serializers.CharField(source='tag.name', read_only=True)
    tag_description = serializers.CharField(source='tag.description', read_only=True)
    
    class Meta:
        model = UserTag
        fields = ['id', 'user', 'tag_name', 'tag_description', 'assigned_by', 'assigned_at', 'is_active']
        read_only_fields = ['assigned_by', 'assigned_at']


class PostLikeSerializer(serializers.ModelSerializer):
    """
    Serializer for post likes
    """
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = PostLike
        fields = ['id', 'user', 'user_email', 'user_name', 'created_at']
        read_only_fields = ['user', 'created_at']
    
    def get_user_name(self, obj):
        return obj.user.alumni_profile.full_name if hasattr(obj.user, 'alumni_profile') else obj.user.email


class PostCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for post comments
    """
    user_id = serializers.UUIDField(source='user.id', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    user_profile_picture = serializers.SerializerMethodField()
    
    class Meta:
        model = PostComment
        fields = ['id', 'user', 'user_id', 'user_email', 'user_name', 'user_profile_picture', 'content', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def get_user_name(self, obj):
        return obj.user.alumni_profile.full_name if hasattr(obj.user, 'alumni_profile') else obj.user.email
    
    def get_user_profile_picture(self, obj):
        return obj.user.alumni_profile.profile_picture_url if hasattr(obj.user, 'alumni_profile') else None


class ScholarshipContributionSerializer(serializers.ModelSerializer):
    """
    Serializer for scholarship contributions.
    """
    contributor_name = serializers.CharField(source='contributor.alumni_profile.full_name', read_only=True)
    contributor_email = serializers.EmailField(source='contributor.email', read_only=True)
    
    class Meta:
        model = ScholarshipContribution
        fields = ['id', 'amount', 'is_anonymous', 'message', 'created_at', 'contributor_name', 'contributor_email']
        read_only_fields = ['id', 'created_at', 'contributor_name', 'contributor_email']
    
    def create(self, validated_data):
        # Automatically set the contributor to the currently logged-in user
        validated_data['contributor'] = self.context['request'].user
        contribution = ScholarshipContribution.objects.create(**validated_data)
        return contribution


class ScholarshipSerializer(serializers.ModelSerializer):
    """
    Serializer for scholarships with progress information.
    """
    progress_percentage = serializers.ReadOnlyField()
    remaining_amount = serializers.ReadOnlyField()
    created_by_name = serializers.CharField(source='created_by.alumni_profile.full_name', read_only=True)
    contributions = ScholarshipContributionSerializer(many=True, read_only=True)
    contribution_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Scholarship
        fields = [
            'id', 'title', 'description', 'target_amount', 'current_amount', 
            'status', 'created_by', 'created_by_name', 'created_at', 'updated_at', 
            'image_url', 'progress_percentage', 'remaining_amount', 'contributions', 'contribution_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'current_amount']
    
    def get_contribution_count(self, obj):
        return obj.contributions.count()


class ScholarshipListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing scholarships.
    """
    progress_percentage = serializers.ReadOnlyField()
    remaining_amount = serializers.ReadOnlyField()
    created_by_name = serializers.CharField(source='created_by.alumni_profile.full_name', read_only=True)
    contribution_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Scholarship
        fields = [
            'id', 'title', 'description', 'target_amount', 'current_amount', 
            'status', 'created_by_name', 'created_at', 'image_url', 
            'progress_percentage', 'remaining_amount', 'contribution_count'
        ]
    
    def get_contribution_count(self, obj):
        return obj.contributions.count()