from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Admin
from .serializers import AdminLoginSerializer, AdminSerializer
from django.contrib.auth import get_user_model

AdminUser = get_user_model()


# ✅ Custom permission: Only Admin role can manage admins
class IsAdminUserRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and hasattr(request.user, "role")
            and request.user.role == "admin"
        )


# ✅ LOGIN ENDPOINT
class AdminLoginView(APIView):
    """POST /api/admin/login/ — Admin login and JWT token generation"""

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "user": AdminSerializer(user).data,
                "token": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )


# ✅ GET CURRENT LOGGED-IN ADMIN (fixed)
class AdminMeView(APIView):
    """GET /api/admin/me/ — Fetch current logged-in admin details"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if not hasattr(user, "role"):
            return Response(
                {"error": "Invalid token or user not recognized"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = AdminSerializer(user)
        # ✅ Return flat JSON instead of {"user": {...}}
        return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ LIST ALL ADMINS
class AdminListView(generics.ListAPIView):
    """GET /api/admin/users/ — List all admins"""
    queryset = AdminUser.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [IsAdminUserRole]  # Only admin role can view


# ✅ CREATE NEW ADMIN
class AdminCreateView(generics.CreateAPIView):
    """POST /api/admin/create/ — Add a new admin"""
    serializer_class = AdminSerializer
    permission_classes = [IsAdminUserRole]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        admin = serializer.save()
        return Response(
            {
                "message": "Admin created successfully",
                "admin": AdminSerializer(admin).data,
            },
            status=status.HTTP_201_CREATED,
        )


# ✅ DELETE ADMIN
class AdminDeleteView(APIView):
    """DELETE /api/admin/delete/<int:pk>/ — Delete an admin"""
    permission_classes = [IsAdminUserRole]

    def delete(self, request, pk):
        try:
            admin = AdminUser.objects.get(pk=pk)

            if admin.role == "admin" and request.user.id == admin.id:
                return Response(
                    {"error": "You cannot delete your own admin account."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            admin.delete()
            return Response(
                {"message": "Admin deleted successfully"},
                status=status.HTTP_200_OK,
            )
        except AdminUser.DoesNotExist:
            return Response(
                {"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND
            )
