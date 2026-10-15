from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Schedule, Lesson, ScheduleConflict
from .serializers import ScheduleSerializer, LessonSerializer, ScheduleConflictSerializer
from .engine import TimetableEngine, LessonRequirement
from organizations.permissions import IsSchedulerOrAdmin, IsOrganizationMember

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

    def get_queryset(self):
        org_id = self.request.query_params.get('organization_id')
        if org_id:
            return self.queryset.filter(organization_id=org_id)
        if self.request.user.is_superuser:
            return self.queryset.all()
        return self.queryset.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'generate', 'publish']:
            return [IsSchedulerOrAdmin()]
        return [IsOrganizationMember()]

    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        """
        Запуск генерации расписания через OR-Tools.
        Ожидает в теле массив 'requirements':
        [
            {"subject_id": "...", "teacher_id": "...", "group_id": "...", "required_hours": 2},
            ...
        ]
        """
        schedule = self.get_object()
        reqs_data = request.data.get('requirements', [])

        if not reqs_data:
            return Response(
                {'error': 'Требуется предоставить список учебных нагрузок (requirements).'},
                status=status.HTTP_400_BAD_REQUEST
            )

        requirements = [
            LessonRequirement(
                subject_id=r['subject_id'],
                teacher_id=r['teacher_id'],
                group_id=r['group_id'],
                required_hours=int(r['required_hours'])
            )
            for r in reqs_data
        ]

        engine = TimetableEngine(schedule)
        result = engine.generate(requirements)

        if result['success']:
            return Response(result, status=status.HTTP_200_OK)
        else:
            return Response(result, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """
        Публикация расписания (проверка конфликтов перед публикацией).
        """
        schedule = self.get_object()

        # Проверяем, есть ли неразрешенные конфликты
        if schedule.conflicts.exists():
            return Response(
                {'error': 'Нельзя опубликовать расписание с активными конфликтами.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        schedule.status = 'published'
        schedule.save()
        return Response({'status': 'Расписание успешно опубликовано.'})

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    def get_queryset(self):
        schedule_id = self.request.query_params.get('schedule_id')
        if schedule_id:
            return self.queryset.filter(schedule_id=schedule_id)
        return self.queryset.all()
