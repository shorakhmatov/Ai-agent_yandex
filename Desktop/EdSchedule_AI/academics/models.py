from django.db import models
from organizations.models import Organization
import uuid

class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=255, verbose_name='Название кафедры/подразделения')

    class Meta:
        verbose_name = 'Кафедра / Подразделение'
        verbose_name_plural = 'Кафедры / Подразделения'

    def __str__(self):
        return self.name

class AcademicTerm(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='academic_terms')
    name = models.CharField(max_length=255, verbose_name='Название периода (семестр, четверть)')
    start_date = models.DateField(verbose_name='Дата начала')
    end_date = models.DateField(verbose_name='Дата окончания')
    is_active = models.BooleanField(default=False, verbose_name='Текущий активный период')

    class Meta:
        verbose_name = 'Учебный период'
        verbose_name_plural = 'Учебные периоды'

    def __str__(self):
        return f"{self.name} ({self.organization.name})"

class TimeSlot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='time_slots')
    day_of_week = models.IntegerField(choices=[
        (1, 'Понедельник'),
        (2, 'Вторник'),
        (3, 'Среда'),
        (4, 'Четверг'),
        (5, 'Пятница'),
        (6, 'Суббота'),
        (7, 'Воскресенье')
    ], verbose_name='День недели')
    slot_number = models.PositiveIntegerField(verbose_name='Номер пары / урока')
    start_time = models.TimeField(verbose_name='Время начала')
    end_time = models.TimeField(verbose_name='Время окончания')

    class Meta:
        ordering = ['day_of_week', 'slot_number']
        unique_together = ('organization', 'day_of_week', 'slot_number')
        verbose_name = 'Временной интервал (слот)'
        verbose_name_plural = 'Временные интервалы (слоты)'

    def __str__(self):
        return f"День {self.day_of_week}, Урок {self.slot_number} ({self.start_time} - {self.end_time})"

class Subject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='subjects')
    name = models.CharField(max_length=255, verbose_name='Название предмета')
    code = models.CharField(max_length=50, blank=True, null=True, verbose_name='Код предмета')

    class Meta:
        verbose_name = 'Предмет'
        verbose_name_plural = 'Предметы'

    def __str__(self):
        return self.name

class Classroom(models.Model):
    ROOM_TYPES = (
        ('standard', 'Стандартная аудитория'),
        ('lecture', 'Лекционная аудитория'),
        ('lab', 'Лаборатория'),
        ('computer', 'Компьютерный класс'),
        ('gym', 'Спортзал'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='classrooms')
    name = models.CharField(max_length=100, verbose_name='Номер/название аудитории')
    capacity = models.PositiveIntegerField(default=30, verbose_name='Вместимость')
    room_type = models.CharField(max_length=50, choices=ROOM_TYPES, default='standard', verbose_name='Тип аудитории')
    building = models.CharField(max_length=100, blank=True, null=True, verbose_name='Корпус')

    class Meta:
        verbose_name = 'Аудитория'
        verbose_name_plural = 'Аудитории'

    def __str__(self):
        return f"{self.name} ({self.get_room_type_display()})"

class StudentGroup(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='student_groups')
    name = models.CharField(max_length=100, verbose_name='Название группы')
    student_count = models.PositiveIntegerField(default=25, verbose_name='Количество студентов')

    class Meta:
        verbose_name = 'Учебная группа'
        verbose_name_plural = 'Учебные группы'

    def __str__(self):
        return self.name

class Teacher(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='teachers')
    user = models.OneToOneField('accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='teacher_profile')
    first_name = models.CharField(max_length=100, verbose_name='Имя')
    last_name = models.CharField(max_length=100, verbose_name='Фамилия')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='teachers')

    class Meta:
        verbose_name = 'Преподаватель'
        verbose_name_plural = 'Преподаватели'

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class TeacherAvailability(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='availabilities')
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE)
    is_available = models.BooleanField(default=True, verbose_name='Доступен')

    class Meta:
        unique_together = ('teacher', 'time_slot')
        verbose_name = 'Доступность преподавателя'
        verbose_name_plural = 'Доступность преподавателей'
