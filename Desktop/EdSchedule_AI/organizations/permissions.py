from rest_framework import permissions
from organizations.models import OrganizationMembership

class IsOrganizationMember(permissions.BasePermission):
    """
    Разрешает доступ только пользователям, состоящим в организации.
    Ожидает organization_id в параметрах запроса или в URL kwargs.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True

        org_id = view.kwargs.get('organization_id') or request.query_params.get('organization_id')
        if not org_id:
            return False

        return OrganizationMembership.objects.filter(
            user=request.user,
            organization_id=org_id,
            is_active=True
        ).exists()

class IsSchedulerOrAdmin(permissions.BasePermission):
    """
    Разрешает доступ только составителям расписания (Vice Principal) и Администраторам организации.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True

        org_id = view.kwargs.get('organization_id') or request.query_params.get('organization_id')
        if not org_id:
            return False

        return OrganizationMembership.objects.filter(
            user=request.user,
            organization_id=org_id,
            role__in=['org_admin', 'vice_principal', 'platform_admin'],
            is_active=True
        ).exists()
