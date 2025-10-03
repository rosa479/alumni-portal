# test_app/models.py

import uuid
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifier
    for authentication instead of usernames.
    """
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', User.Role.ADMIN) # Set role to Admin
        extra_fields.setdefault('status', User.Status.VERIFIED) # Superuser is always verified

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    # Enum-like classes for choices, as per your spec
    class Role(models.TextChoices):
        ALUMNI = "ALUMNI", "Alumni"
        ASSOCIATE = "ASSOCIATE", "Associate Member"
        ADMIN = "ADMIN", "Admin"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending Verification"
        VERIFIED = "VERIFIED", "Verified"
        REJECTED = "REJECTED", "Rejected"

    # We don't need the default username, first_name, or last_name fields
    username = None
    first_name = None
    last_name = None

    # Fields from your schema
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.ALUMNI)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    invited_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='invited_users'
    )

    # Use email as the unique identifier for login
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] # No other fields required for createsuperuser besides email and password

    objects = UserManager() # Attach the custom manager

    def __str__(self):
        return self.email


class AlumniProfile(models.Model):
    # One-to-one link to the User model
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='alumni_profile')

    # Fields from your schema
    full_name = models.CharField(max_length=255)
    graduation_year = models.PositiveIntegerField()
    department = models.CharField(max_length=100)
    profile_picture_url = models.URLField(max_length=500, null=True, blank=True)
    about_me = models.TextField(blank=True)
    credit_score = models.IntegerField(default=0)

    def __str__(self):
        return self.full_name