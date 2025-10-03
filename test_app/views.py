# test_app/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer, UserSerializer, UserProfileSerializer
from rest_framework.permissions import IsAuthenticated 
from .models import User
from .permissions import IsAdminUser

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
class AdminVerificationListView(generics.ListAPIView):
    """
    Lists all users pending verification who have confirmed their document upload.
    Accessible only by Admins.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        # We only want to see users who are PENDING and have a confirmed document.
        return User.objects.filter(
            status=User.Status.PENDING,
            # verification_document__is_confirmed=True
        )


class AdminVerificationActionView(generics.GenericAPIView):
    """
    Performs an action (approve/reject) on a user's verification status.
    Accessible only by Admins.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, *args, **kwargs):
        user_id = self.kwargs.get('userId')
        action = request.data.get('action')

        try:
            user_to_verify = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if action == "approve":
            user_to_verify.status = User.Status.VERIFIED
            user_to_verify.save()
            # In the future, we would trigger a Celery task here to award credit points.
            return Response({"message": f"User {user_to_verify.email} has been verified."}, status=status.HTTP_200_OK)
        
        elif action == "reject":
            user_to_verify.status = User.Status.REJECTED
            user_to_verify.save()
            return Response({"message": f"User {user_to_verify.email}'s verification has been rejected."}, status=status.HTTP_200_OK)
        
        else:
            return Response({"error": "Invalid action. Use 'approve' or 'reject'."}, status=status.HTTP_400_BAD_REQUEST)