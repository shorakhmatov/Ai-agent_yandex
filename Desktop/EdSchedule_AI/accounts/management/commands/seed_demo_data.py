from django.core.management.base import BaseCommand
from accounts.models import User
from organizations.models import Organization, OrganizationMembership
from academics.models import (
    Department, AcademicTerm, TimeSlot, Subject,
    Classroom, StudentGroup, Teacher, TeacherAvailability
)
from scheduling.models import Schedule, Lesson
import datetime

class Command(BaseCommand):
    help = 'Заполняет базу данных реалистичными демонстрационными данными'

    def handle(self, *args, **options):
        self.stdout.write("Создание демонстрационных данных...")

        # 1. Создаем организацию
        org, _ = Organization.objects.get_or_create(
            slug='school-12',
            defaults={
                'name': 'Специализированная школа №12',
                'org_type': 'school',
                'address': 'г. Ташкент, Мирзо-Улугбекский район',
                'contact_phone': '+998 71 200 00 12',
                'contact_email': 'info@school12.uz'
            }
        )

        # 2. Создаем пользователей
        admin_user, _ = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@school12.uz', 'first_name': 'Администратор', 'last_name': 'Системы'}
        )
        admin_user.set_password('admin123')
        admin_user.save()

        vp_user, _ = User.objects.get_or_create(
            username='vice_principal',
            defaults={'email': 'vp@school12.uz', 'first_name': 'Дилшод', 'last_name': 'Каримов'}
        )
        vp_user.set_password('password123')
        vp_user.save()

        # Назначаем членство
        OrganizationMembership.objects.get_or_create(
            user=admin_user, organization=org, defaults={'role': 'org_admin'}
        )
        OrganizationMembership.objects.get_or_create(
            user=vp_user, organization=org, defaults={'role': 'vice_principal'}
        )

        # 3. Кафедра
        dept_it, _ = Department.objects.get_or_create(organization=org, name='Кафедра информационных технологий')
        dept_math, _ = Department.objects.get_or_create(organization=org, name='Кафедра точных наук')

        # 4. Учебный период
        term, _ = AcademicTerm.objects.get_or_create(
            organization=org,
            name='Весенний семестр 2026',
            defaults={
                'start_date': datetime.date(2026, 2, 2),
                'end_date': datetime.date(2026, 6, 20),
                'is_active': True
            }
        )

        # 5. Временные слоты (Понедельник - Суббота, по 5 уроков)
        slots_data = [
            (1, datetime.time(8, 30), datetime.time(10, 0)),
            (2, datetime.time(10, 15), datetime.time(11, 45)),
            (3, datetime.time(12, 15), datetime.time(13, 45)),
            (4, datetime.time(14, 0), datetime.time(15, 30)),
            (5, datetime.time(15, 45), datetime.time(17, 15)),
        ]
        created_slots = []
        for day in range(1, 7): # 1-Пн, ..., 6-Сб
            for slot_num, start_t, end_t in slots_data:
                slot, _ = TimeSlot.objects.get_or_create(
                    organization=org,
                    day_of_week=day,
                    slot_number=slot_num,
                    defaults={'start_time': start_t, 'end_time': end_t}
                )
                created_slots.append(slot)

        # 6. Аудитории
        rooms_data = [
            ('101', 50, 'lecture', 'Главный корпус'),
            ('102', 35, 'standard', 'Главный корпус'),
            ('201', 30, 'standard', 'Главный корпус'),
            ('204-Лаб', 25, 'lab', 'Лабораторный корпус'),
            ('Комп-Класс 1', 30, 'computer', 'IT Корпус'),
            ('Комп-Класс 2', 25, 'computer', 'IT Корпус'),
        ]
        created_rooms = []
        for r_name, cap, r_type, bld in rooms_data:
            room, _ = Classroom.objects.get_or_create(
                organization=org,
                name=r_name,
                defaults={'capacity': cap, 'room_type': r_type, 'building': bld}
            )
            created_rooms.append(room)

        # 7. Группы
        groups_data = [('ИС-21', 28), ('ИС-22', 25), ('ЭК-11', 24), ('ПИ-31', 22)]
        created_groups = []
        for g_name, count in groups_data:
            grp, _ = StudentGroup.objects.get_or_create(
                organization=org,
                name=g_name,
                defaults={'student_count': count}
            )
            created_groups.append(grp)

        # 8. Предметы
        subjects_data = [
            ('Высшая математика', 'MATH-101'),
            ('Программирование Python', 'CS-201'),
            ('Базы данных и SQL', 'CS-202'),
            ('Физика', 'PHYS-101'),
            ('Английский язык', 'LANG-101'),
        ]
        created_subjects = []
        for s_name, code in subjects_data:
            sub, _ = Subject.objects.get_or_create(
                organization=org,
                name=s_name,
                defaults={'code': code}
            )
            created_subjects.append(sub)

        # 9. Преподаватели
        teachers_data = [
            ('Алексей', 'Иванов', dept_math),
            ('Шерзод', 'Каримов', dept_it),
            ('Виктор', 'Смирнов', dept_math),
            ('Нодира', 'Юсупова', dept_it),
            ('Эмма', 'Браун', dept_it),
        ]
        created_teachers = []
        for f_name, l_name, dept in teachers_data:
            t, _ = Teacher.objects.get_or_create(
                organization=org,
                first_name=f_name,
                last_name=l_name,
                defaults={'department': dept}
            )
            created_teachers.append(t)

        # 10. Расписание
        schedule, _ = Schedule.objects.get_or_create(
            organization=org,
            academic_term=term,
            name='Основное учебное расписание (II семестр)',
            defaults={'version': 1, 'status': 'draft'}
        )

        # Добавим несколько готовых занятий
        if created_slots and created_teachers and created_subjects and created_rooms and created_groups:
            Lesson.objects.get_or_create(
                schedule=schedule,
                time_slot=created_slots[0],
                defaults={
                    'teacher': created_teachers[0],
                    'subject': created_subjects[0],
                    'classroom': created_rooms[0],
                    'student_group': created_groups[0]
                }
            )
            Lesson.objects.get_or_create(
                schedule=schedule,
                time_slot=created_slots[1],
                defaults={
                    'teacher': created_teachers[1],
                    'subject': created_subjects[1],
                    'classroom': created_rooms[4],
                    'student_group': created_groups[0]
                }
            )

        self.stdout.write(self.style.SUCCESS('Демонстрационные данные успешно созданы!'))
        self.stdout.write(self.style.SUCCESS('Логин зам. директора: vice_principal / password123'))
