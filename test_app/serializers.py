# test_app/serializers.py

from django.db import transaction
from rest_framework import serializers
from .models import User, AlumniProfile

class AlumniProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the AlumniProfile model.
    """
    class Meta:
        model = AlumniProfile
        fields = ['full_name', 'graduation_year', 'department', 'about_me', 'credit_score']


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
        # If profile creation fails, the user creation will be rolled back.
        try:
            with transaction.atomic():
                # The 'create_user' method handles password hashing automatically
                user = User.objects.create_user(**validated_data)
                
                # Create the associated AlumniProfile
                AlumniProfile.objects.create(user=user, **profile_data)
        except Exception as e:
            # Handle potential integrity errors or other exceptions
            raise serializers.ValidationError(f"An error occurred during registration: {e}")

        return user