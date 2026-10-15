from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer
from organizations.models import OrganizationMembership

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_data = UserSerializer(request.user).data
        memberships = OrganizationMembership.objects.filter(user=request.user, is_active=True).select_related('organization')
        memberships_data = [
            {
                'organization_id': str(m.organization.id),
                'organization_name': m.organization.name,
                'role': m.role,
            }
            for m in memberships
        ]
        return Response({
            'user': user_data,
            'memberships': memberships_data
        })
