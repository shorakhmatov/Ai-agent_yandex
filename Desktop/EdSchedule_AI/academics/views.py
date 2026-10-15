from rest_framework import viewsets
from .models import (
    Department, AcademicTerm, TimeSlot, Subject,
    Classroom, StudentGroup, Teacher, TeacherAvailability
)
from .serializers import (
    DepartmentSerializer, AcademicTermSerializer, TimeSlotSerializer,
    SubjectSerializer, ClassroomSerializer, StudentGroupSerializer,
    TeacherSerializer, TeacherAvailabilitySerializer
)
from organizations.permissions import IsOrganizationMember, IsSchedulerOrAdmin

class BaseAcademicViewSet(viewsets.ModelViewSet):
    """
    Базовый ViewSet для учебных данных с фильтрацией по организации.
    """
    def get_queryset(self):
        org_id = self.request.query_params.get('organization_id')
        if org_id:
            return self.queryset.filter(organization_id=org_id)
        # Если org_id не передан, возвращаем пустой queryset (или все для суперюзера)
        if self.request.user.is_superuser:
            return self.queryset.all()
        return self.queryset.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsSchedulerOrAdmin()]
        return [IsOrganizationMember()]

class DepartmentViewSet(BaseAcademicViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class AcademicTermViewSet(BaseAcademicViewSet):
    queryset = AcademicTerm.objects.all()
    serializer_class = AcademicTermSerializer

class TimeSlotViewSet(BaseAcademicViewSet):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer

class SubjectViewSet(BaseAcademicViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class ClassroomViewSet(BaseAcademicViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer

class StudentGroupViewSet(BaseAcademicViewSet):
    queryset = StudentGroup.objects.all()
    serializer_class = StudentGroupSerializer

class TeacherViewSet(BaseAcademicViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

class TeacherAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = TeacherAvailability.objects.all()
    serializer_class = TeacherAvailabilitySerializer
    permission_classes = [IsOrganizationMember]

    def get_queryset(self):
        return self.queryset.filter(teacher__organization_id=self.request.query_params.get('organization_id'))
