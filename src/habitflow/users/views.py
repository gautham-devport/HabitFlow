from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken



class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "id": user.id,
            "email": user.email,
            "name": user.get_full_name() or user.username,
            "picture": getattr(user, "picture", ""),  # make sure your User model has picture
        }
        return Response(data)
    



class GoogleLoginView(APIView):
    def post(self, request):
        """
        Receives Google user info from frontend, creates/gets user in Django,
        and returns JWT tokens.
        """
        email = request.data.get("email")
        name = request.data.get("name")
        picture = request.data.get("picture")

        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Split name into first and last (optional)
        first_name, *last_name = name.split(" ", 1)
        last_name = last_name[0] if last_name else ""

        # Get or create user
        user, created = User.objects.get_or_create(
            username=email,
            defaults={
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
            },
        )

        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response(
            {
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "picture": picture,
                },
                "access": access_token,
                "refresh": str(refresh),
                "message": "Login successful",
                "is_new_user": created,
            },
            status=status.HTTP_200_OK,
        )
