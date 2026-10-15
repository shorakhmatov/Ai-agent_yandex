from typing import List, Dict, Any
from scheduling.models import Schedule, Lesson, ScheduleConflict
from academics.models import Classroom, Teacher, StudentGroup

class AIAssistantTools:
    """
    Безопасный слой инструментов для ИИ-помощника.
    ИИ вызывает эти методы (Tool Calling), вместо прямого доступа к базе данных.
    """

    @staticmethod
    def get_schedule(schedule_id: str) -> List[Dict[str, Any]]:
        """Возвращает текущее расписание в виде списка занятий."""
        lessons = Lesson.objects.filter(schedule_id=schedule_id).select_related(
            'subject', 'teacher', 'classroom', 'student_group', 'time_slot'
        )
        return [
            {
                'id': str(l.id),
                'subject': l.subject.name,
                'teacher': f"{l.teacher.first_name} {l.teacher.last_name}",
                'group': l.student_group.name,
                'room': l.classroom.name,
                'day_of_week': l.time_slot.day_of_week,
                'slot': l.time_slot.slot_number,
                'time': f"{l.time_slot.start_time} - {l.time_slot.end_time}"
            }
            for l in lessons
        ]

    @staticmethod
    def find_schedule_conflicts(schedule_id: str) -> List[Dict[str, Any]]:
        """Ищет и возвращает список всех конфликтов в расписании."""
        conflicts = ScheduleConflict.objects.filter(schedule_id=schedule_id)
        return [
            {
                'id': str(c.id),
                'type': c.conflict_type,
                'description': c.description
            }
            for c in conflicts
        ]

    @staticmethod
    def get_available_rooms(organization_id: str, day_of_week: int, slot_number: int) -> List[Dict[str, Any]]:
        """Возвращает свободные аудитории на указанный день и временной слот."""
        # Находим занятые комнаты в этот слот
        busy_rooms = Lesson.objects.filter(
            schedule__organization_id=organization_id,
            schedule__status='published',
            time_slot__day_of_week=day_of_week,
            time_slot__slot_number=slot_number
        ).values_list('classroom_id', flat=True)

        available = Classroom.objects.filter(
            organization_id=organization_id
        ).exclude(id__in=busy_rooms)

        return [
            {
                'id': str(r.id),
                'name': r.name,
                'capacity': r.capacity,
                'type': r.get_room_type_display()
            }
            for r in available
        ]

    @staticmethod
    def get_teacher_workload(organization_id: str) -> List[Dict[str, Any]]:
        """Возвращает загрузку преподавателей (количество проведенных часов/уроков)."""
        teachers = Teacher.objects.filter(organization_id=organization_id)
        result = []
        for teacher in teachers:
            lesson_count = Lesson.objects.filter(
                teacher=teacher,
                schedule__status='published'
            ).count()
            result.append({
                'teacher': f"{teacher.first_name} {teacher.last_name}",
                'total_lessons': lesson_count
            })
        return result
