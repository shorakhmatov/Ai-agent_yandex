from django.db import models
from organizations.models import Organization
from academics.models import AcademicTerm, TimeSlot, Teacher, Subject, Classroom, StudentGroup
import uuid

class Schedule(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Черновик'),
        ('published', 'Опубликовано'),
        ('archived', 'Архивировано'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='schedules')
    academic_term = models.ForeignKey(AcademicTerm, on_delete=models.CASCADE, related_name='schedules')
    name = models.CharField(max_length=255, verbose_name='Название расписания')
    version = models.PositiveIntegerField(default=1, verbose_name='Номер версии')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='draft', verbose_name='Статус')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Расписание'
        verbose_name_plural = 'Расписания'

    def __str__(self):
        return f"{self.name} (v{self.version}) - {self.get_status_display()}"

class Lesson(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='lessons')
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE, related_name='lessons')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='lessons')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='lessons')
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='lessons')
    student_group = models.ForeignKey(StudentGroup, on_delete=models.CASCADE, related_name='lessons')

    class Meta:
        verbose_name = 'Занятие / Урок'
        verbose_name_plural = 'Занятия / Уроки'

    def __str__(self):
        return f"{self.subject.name} - {self.student_group.name} ({self.time_slot})"

class ScheduleConflict(models.Model):
    CONFLICT_TYPES = (
        ('teacher_overlap', 'Преподаватель занят в двух местах одновременно'),
        ('group_overlap', 'Учебная группа имеет два занятия одновременно'),
        ('room_overlap', 'Аудитория занята двумя занятиями одновременно'),
        ('room_capacity', 'Вместимость аудитории меньше размера группы'),
        ('teacher_unavailable', 'Преподаватель недоступен в это время'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='conflicts')
    conflict_type = models.CharField(max_length=50, choices=CONFLICT_TYPES)
    description = models.TextField(verbose_name='Описание конфликта')
    lesson_1 = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='conflicts_as_first')
    lesson_2 = models.ForeignKey(Lesson, on_delete=models.CASCADE, null=True, blank=True, related_name='conflicts_as_second')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Конфликт расписания'
        verbose_name_plural = 'Конфликты расписания'
