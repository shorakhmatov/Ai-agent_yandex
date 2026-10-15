from dataclasses import dataclass
from typing import List, Dict, Optional
from ortools.sat.python import cp_model
from scheduling.models import Schedule, Lesson, ScheduleConflict
from academics.models import AcademicTerm, TimeSlot, Teacher, Subject, Classroom, StudentGroup

@dataclass
class LessonRequirement:
    subject_id: str
    teacher_id: str
    group_id: str
    required_hours: int  # Количество занятий в неделю

class TimetableEngine:
    def __init__(self, schedule: Schedule):
        self.schedule = schedule
        self.organization = schedule.organization
        self.term = schedule.academic_term

    def generate(self, requirements: List[LessonRequirement]) -> Dict:
        """
        Генерирует расписание с помощью Google OR-Tools CP-SAT.
        """
        time_slots = list(TimeSlot.objects.filter(organization=self.organization))
        classrooms = list(Classroom.objects.filter(organization=self.organization))

        if not time_slots or not classrooms or not requirements:
            return {
                'success': False,
                'message': 'Недостаточно данных для генерации (отсутствуют слоты, аудитории или требования к занятиям).'
            }

        model = cp_model.CpModel()

        # Создаем переменные: lesson_vars[(req_idx, slot_idx, room_idx)] = 1, если занятие назначено
        # Разворачиваем каждое требование на конкретные уроки
        lessons_to_schedule = []
        for req in requirements:
            for _ in range(req.required_hours):
                lessons_to_schedule.append(req)

        num_lessons = len(lessons_to_schedule)
        num_slots = len(time_slots)
        num_rooms = len(classrooms)

        # Переменные решений
        assignments = {}
        for l_idx in range(num_lessons):
            for s_idx in range(num_slots):
                for r_idx in range(num_rooms):
                    assignments[(l_idx, s_idx, r_idx)] = model.NewBoolVar(f'assign_{l_idx}_{s_idx}_{r_idx}')

        # 1. Жёсткое ограничение: каждое занятие должно быть назначено ровно 1 раз
        for l_idx in range(num_lessons):
            model.AddExactlyOne(
                assignments[(l_idx, s_idx, r_idx)]
                for s_idx in range(num_slots)
                for r_idx in range(num_rooms)
            )

        # 2. Жёсткое ограничение: в одной аудитории в один слот может быть максимум 1 занятие
        for s_idx in range(num_slots):
            for r_idx in range(num_rooms):
                model.AddAtMostOne(
                    assignments[(l_idx, s_idx, r_idx)]
                    for l_idx in range(num_lessons)
                )

        # 3. Жёсткое ограничение: один преподаватель в один слот не может вести более 1 занятия
        teachers = list(Teacher.objects.filter(organization=self.organization))
        teacher_id_map = {t.id: t for t in teachers}
        for s_idx in range(num_slots):
            for teacher in teachers:
                model.AddAtMostOne(
                    assignments[(l_idx, s_idx, r_idx)]
                    for l_idx, req in enumerate(lessons_to_schedule)
                    if str(req.teacher_id) == str(teacher.id)
                    for r_idx in range(num_rooms)
                )

        # 4. Жёсткое ограничение: одна группа в один слот не может иметь более 1 занятия
        groups = list(StudentGroup.objects.filter(organization=self.organization))
        for s_idx in range(num_slots):
            for group in groups:
                model.AddAtMostOne(
                    assignments[(l_idx, s_idx, r_idx)]
                    for l_idx, req in enumerate(lessons_to_schedule)
                    if str(req.group_id) == str(group.id)
                    for r_idx in range(num_rooms)
                )

        # 5. Жёсткое ограничение: вместимость аудитории должна соответствовать размеру группы
        for l_idx, req in enumerate(lessons_to_schedule):
            group = next((g for g in groups if str(g.id) == str(req.group_id)), None)
            if group:
                for r_idx, room in enumerate(classrooms):
                    if room.capacity < group.student_count:
                        # Запрещаем назначать эту группу в данную аудиторию
                        for s_idx in range(num_slots):
                            model.Add(assignments[(l_idx, s_idx, r_idx)] == 0)

        # Решаем задачу
        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = 30.0  # Ограничение по времени на расчет
        status = solver.Solve(model)

        if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            # Очищаем старые занятия в этом расписании
            Lesson.objects.filter(schedule=self.schedule).delete()
            ScheduleConflict.objects.filter(schedule=self.schedule).delete()

            created_lessons = []
            for l_idx, req in enumerate(lessons_to_schedule):
                for s_idx, slot in enumerate(time_slots):
                    for r_idx, room in enumerate(classrooms):
                        if solver.Value(assignments[(l_idx, s_idx, r_idx)]) == 1:
                            lesson = Lesson.objects.create(
                                schedule=self.schedule,
                                time_slot=slot,
                                teacher_id=req.teacher_id,
                                subject_id=req.subject_id,
                                classroom=room,
                                student_group_id=req.group_id
                            )
                            created_lessons.append(lesson)

            return {
                'success': True,
                'status': 'optimal' if status == cp_model.OPTIMAL else 'feasible',
                'lessons_created': len(created_lessons),
                'message': 'Расписание успешно сгенерировано без конфликтов.'
            }
        else:
            return {
                'success': False,
                'status': 'infeasible',
                'message': 'Не удалось найти решение, удовлетворяющее всем жестким ограничениям. Попробуйте добавить слоты, аудитории или пересмотреть нагрузку.'
            }
