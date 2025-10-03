# test_app/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer, UserSerializer, UserProfileSerializer
from rest_framework.permissions import IsAuthenticated 

class RegisterView(generics.CreateAPIView):
    """
    API view for user registration.
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
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated] # Ensures only logged-in users can access this

    def get_object(self):
        # This method returns the object that the view will display.
        # We override it to always return the currently authenticated user.
        return self.request.user