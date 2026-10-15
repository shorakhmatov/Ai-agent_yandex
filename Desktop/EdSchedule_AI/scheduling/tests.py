from django.test import TestCase
from organizations.models import Organization
from academics.models import (
    AcademicTerm, TimeSlot, Teacher, Subject, Classroom, StudentGroup
)
from scheduling.models import Schedule, Lesson
from scheduling.engine import TimetableEngine, LessonRequirement
import datetime

class TimetableEngineTestCase(TestCase):
    def setUp(self):
        self.org = Organization.objects.create(name='Тестовый Колледж', slug='test-college')
        self.term = AcademicTerm.objects.create(
            organization=self.org,
            name='Семестр 1',
            start_date=datetime.date(2026, 9, 1),
            end_date=datetime.date(2026, 12, 30),
            is_active=True
        )

        # Создаем 2 слота времени
        self.slot1 = TimeSlot.objects.create(
            organization=self.org, day_of_week=1, slot_number=1,
            start_time=datetime.time(9, 0), end_time=datetime.time(10, 30)
        )
        self.slot2 = TimeSlot.objects.create(
            organization=self.org, day_of_week=1, slot_number=2,
            start_time=datetime.time(10, 45), end_time=datetime.time(12, 15)
        )

        # Аудитории: одна на 30 мест, одна на 15 мест
        self.room_large = Classroom.objects.create(organization=self.org, name='101', capacity=30)
        self.room_small = Classroom.objects.create(organization=self.org, name='102', capacity=15)

        # Группы: 25 человек и 10 человек
        self.group_large = StudentGroup.objects.create(organization=self.org, name='Группа-А', student_count=25)
        self.group_small = StudentGroup.objects.create(organization=self.org, name='Группа-Б', student_count=10)

        # Преподаватели и предметы
        self.teacher1 = Teacher.objects.create(organization=self.org, first_name='Иван', last_name='Петров')
        self.teacher2 = Teacher.objects.create(organization=self.org, first_name='Сергей', last_name='Сидоров')
        self.subject1 = Subject.objects.create(organization=self.org, name='Математика')
        self.subject2 = Subject.objects.create(organization=self.org, name='Физика')

        self.schedule = Schedule.objects.create(
            organization=self.org, academic_term=self.term, name='Тестовое расписание'
        )

    def test_generate_schedule_respects_hard_constraints(self):
        """
        Проверяет, что движок OR-Tools генерирует расписание без накладок
        и размещает большую группу только в большую аудиторию.
        """
        engine = TimetableEngine(self.schedule)
        requirements = [
            LessonRequirement(
                subject_id=str(self.subject1.id),
                teacher_id=str(self.teacher1.id),
                group_id=str(self.group_large.id),
                required_hours=1
            ),
            LessonRequirement(
                subject_id=str(self.subject2.id),
                teacher_id=str(self.teacher2.id),
                group_id=str(self.group_small.id),
                required_hours=1
            ),
        ]

        result = engine.generate(requirements)
        self.assertTrue(result['success'])
        self.assertEqual(result['lessons_created'], 2)

        # Проверяем, что большая группа попала строго в большую аудиторию
        large_group_lesson = Lesson.objects.get(
            schedule=self.schedule, student_group=self.group_large
        )
        self.assertEqual(large_group_lesson.classroom, self.room_large)
