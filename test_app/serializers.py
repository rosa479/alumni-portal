# test_app/serializers.py

from django.db import transaction
from rest_framework import serializers
from .models import User, AlumniProfile, Community, Post

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
        fields = ['id', 'email', 'role', 'status', 'alumni_profile']


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
        fields = ['email', 'password', 'full_name', 'graduation_year', 'department']

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
        fields = ['id', 'email', 'role', 'status', 'alumni_profile']
        # These fields are read-only because they are managed by the system, not the user.
        read_only_fields = ['id', 'email', 'role', 'status']

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
    
class CommunitySerializer(serializers.ModelSerializer):
    """
    Serializer for listing communities.
    """
    class Meta:
        model = Community
        fields = ['id', 'name', 'description']


class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for reading posts. Includes read-only author details.
    """
    # Use a simple string representation for the author for readability
    author_email = serializers.EmailField(source='author.email', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'community', 'content', 'status', 'created_at', 'author_email']
        read_only_fields = ['status', 'author_email']

    def create(self, validated_data):
        # Automatically set the author to the currently logged-in user
        validated_data['author'] = self.context['request'].user
        post = Post.objects.create(**validated_data)
        return post