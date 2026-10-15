import csv
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from ics import Calendar, Event
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from scheduling.models import Schedule, Lesson
from organizations.permissions import IsOrganizationMember

class ScheduleExportView(APIView):
    permission_classes = [IsOrganizationMember]

    def get(self, request, schedule_id):
        export_format = request.query_params.get('format', 'pdf').lower()
        lang = request.query_params.get('lang', 'ru').lower()

        try:
            schedule = Schedule.objects.select_related('organization', 'academic_term').get(id=schedule_id)
        except Schedule.DoesNotExist:
            return Response({'error': 'Расписание не найдено'}, status=404)

        lessons = Lesson.objects.filter(schedule=schedule).select_related(
            'subject', 'teacher', 'classroom', 'student_group', 'time_slot'
        )

        if export_format == 'csv':
            response = HttpResponse(content_type='text/csv; charset=utf-8')
            filename_suffix = 'uz' if lang == 'uz' else 'ru'
            response['Content-Disposition'] = f'attachment; filename="schedule_{schedule.id}_{filename_suffix}.csv"'

            writer = csv.writer(response)
            if lang == 'uz':
                writer.writerow(['Fan', 'O\'qituvchi', 'Guruh', 'Xona', 'Hafta kuni', 'Dars vaqti'])
                for l in lessons:
                    writer.writerow([
                        l.subject.name,
                        f"{l.teacher.first_name} {l.teacher.last_name}",
                        l.student_group.name,
                        l.classroom.name,
                        l.time_slot.day_of_week,
                        f"{l.time_slot.start_time}-{l.time_slot.end_time}"
                    ])
            else:
                writer.writerow(['Предмет', 'Преподаватель', 'Группа', 'Аудитория', 'День недели', 'Время'])
                for l in lessons:
                    writer.writerow([
                        l.subject.name,
                        f"{l.teacher.first_name} {l.teacher.last_name}",
                        l.student_group.name,
                        l.classroom.name,
                        l.time_slot.day_of_week,
                        f"{l.time_slot.start_time}-{l.time_slot.end_time}"
                    ])
            return response

        elif export_format == 'ics':
            c = Calendar()
            for l in lessons:
                e = Event()
                e.name = f"{l.subject.name} ({l.student_group.name})"
                e.description = f"Преподаватель: {l.teacher.first_name} {l.teacher.last_name}, Аудитория: {l.classroom.name}"
                e.location = l.classroom.name
                # Для упрощения MVP ставим текущую дату по слоту
                c.events.add(e)

            response = HttpResponse(c.serialize(), content_type='text/calendar; charset=utf-8')
            response['Content-Disposition'] = f'attachment; filename="schedule_{schedule.id}.ics"'
            return response

        elif export_format == 'pdf':
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="schedule_{schedule.id}.pdf"'

            doc = SimpleDocTemplate(response, pagesize=A4)
            styles = getSampleStyleSheet()
            elements = []

            title_text = f"Расписание: {schedule.name} ({schedule.organization.name})"
            if lang == 'uz':
                title_text = f"Dars jadvali: {schedule.name} ({schedule.organization.name})"

            elements.append(Paragraph(title_text, styles['Heading1']))
            elements.append(Spacer(1, 12))

            table_data = []
            if lang == 'uz':
                table_data.append(['Fan', 'O\'qituvchi', 'Guruh', 'Xona', 'Kun/Vaqt'])
                for l in lessons:
                    table_data.append([
                        l.subject.name,
                        f"{l.teacher.first_name} {l.teacher.last_name}",
                        l.student_group.name,
                        l.classroom.name,
                        f"Kun {l.time_slot.day_of_week}, {l.time_slot.start_time}"
                    ])
            else:
                table_data.append(['Предмет', 'Преподаватель', 'Группа', 'Аудитория', 'День/Время'])
                for l in lessons:
                    table_data.append([
                        l.subject.name,
                        f"{l.teacher.first_name} {l.teacher.last_name}",
                        l.student_group.name,
                        l.classroom.name,
                        f"День {l.time_slot.day_of_week}, {l.time_slot.start_time}"
                    ])

            t = Table(table_data, colWidths=[120, 110, 80, 80, 110])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4F46E5')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F3F4F6')),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#D1D5DB')),
            ]))
            elements.append(t)

            doc.build(elements)
            return response

        return Response({'error': 'Неподдерживаемый формат экспорта. Доступны: pdf, csv, ics.'}, status=400)
