from django.utils.deprecation import MiddlewareMixin
from django.core.exceptions import PermissionDenied
from organizations.models import OrganizationMembership

class TenantIsolationMiddleware(MiddlewareMixin):
    """
    Middleware to ensure data isolation.
    It doesn't set a tenant, but validates that the user has access
    to the organization they are trying to access.
    """

    def process_view(self, request, view_func, view_args, view_kwargs):
        # We look for organization_id in URL kwargs
        org_id = view_kwargs.get('organization_id') or request.GET.get('organization_id')

        if org_id:
            if not request.user.is_authenticated:
                raise PermissionDenied("Требуется авторизация")

            # Platform admins can access anything
            if request.user.is_superuser:
                return None

            # Check if user has a membership in this organization
            has_membership = OrganizationMembership.objects.filter(
                user=request.user,
                organization_id=org_id,
                is_active=True
            ).exists()

            if not has_membership:
                raise PermissionDenied("У вас нет доступа к этой организации")

        return None
