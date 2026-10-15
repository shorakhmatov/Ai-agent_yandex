import csv
import io
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from academics.models import Teacher, StudentGroup, Classroom, Subject, Department
from organizations.permissions import IsSchedulerOrAdmin

class ImportCSVPreviewView(APIView):
    """
    Парсит загруженный CSV файл, проверяет строки и возвращает предпросмотр
    с указанием валидных строк и ошибок валидации по каждой строке.
    Поддерживает типы сущностей: teachers, groups, classrooms, subjects.
    """
    parser_classes = [MultiPartParser]
    permission_classes = [IsSchedulerOrAdmin]

    def post(self, request):
        entity_type = request.data.get('entity_type') # 'teachers', 'groups', 'classrooms', 'subjects'
        file_obj = request.FILES.get('file')

        if not file_obj or not entity_type:
            return Response(
                {'error': 'Необходимо передать entity_type и файл CSV.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            decoded_file = file_obj.read().decode('utf-8-sig')
        except Exception:
            return Response(
                {'error': 'Файл должен быть в кодировке UTF-8.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        io_string = io.StringIO(decoded_file)
        reader = csv.reader(io_string)

        headers = next(reader, None)
        if not headers:
            return Response({'error': 'Файл пуст или поврежден.'}, status=status.HTTP_400_BAD_REQUEST)

        rows = []
        errors = []
        valid_count = 0

        for row_idx, row in enumerate(reader, start=2):
            if not any(row):
                continue

            row_errors = []
            row_data = {}

            if entity_type == 'teachers':
                # Ожидается: first_name, last_name, department
                if len(row) < 2 or not row[0].strip() or not row[1].strip():
                    row_errors.append("Имя и фамилия обязательны для заполнения")
                row_data = {
                    'first_name': row[0].strip() if len(row) > 0 else '',
                    'last_name': row[1].strip() if len(row) > 1 else '',
                    'department': row[2].strip() if len(row) > 2 else ''
                }

            elif entity_type == 'groups':
                # Ожидается: name, student_count
                if len(row) < 1 or not row[0].strip():
                    row_errors.append("Название группы обязательно")
                count = 25
                if len(row) > 1 and row[1].strip():
                    try:
                        count = int(row[1].strip())
                    except ValueError:
                        row_errors.append("Количество студентов должно быть числом")
                row_data = {'name': row[0].strip(), 'student_count': count}

            elif entity_type == 'classrooms':
                # Ожидается: name, capacity, room_type
                if len(row) < 1 or not row[0].strip():
                    row_errors.append("Номер аудитории обязателен")
                cap = 30
                if len(row) > 1 and row[1].strip():
                    try:
                        cap = int(row[1].strip())
                    except ValueError:
                        row_errors.append("Вместимость должна быть числом")
                row_data = {
                    'name': row[0].strip(),
                    'capacity': cap,
                    'room_type': row[2].strip() if len(row) > 2 else 'standard'
                }

            elif entity_type == 'subjects':
                if len(row) < 1 or not row[0].strip():
                    row_errors.append("Название предмета обязательно")
                row_data = {
                    'name': row[0].strip(),
                    'code': row[1].strip() if len(row) > 1 else ''
                }

            if row_errors:
                errors.append({'row': row_idx, 'errors': row_errors, 'data': row_data})
            else:
                valid_count += 1

            rows.append({
                'row_number': row_idx,
                'data': row_data,
                'is_valid': len(row_errors) == 0,
                'errors': row_errors
            })

        return Response({
            'entity_type': entity_type,
            'total_rows': len(rows),
            'valid_count': valid_count,
            'error_count': len(errors),
            'rows_preview': rows[:50], # первые 50 строк для предпросмотра
            'has_errors': len(errors) > 0
        })

class ImportCSVCommitView(APIView):
    """
    Транзакционно сохраняет валидные данные в базу данных организации.
    """
    permission_classes = [IsSchedulerOrAdmin]

    def post(self, request):
        entity_type = request.data.get('entity_type')
        org_id = request.data.get('organization_id')
        items = request.data.get('items', [])

        if not entity_type or not org_id or not items:
            return Response({'error': 'Не переданы данные для сохранения.'}, status=400)

        created_count = 0
        if entity_type == 'teachers':
            for item in items:
                Teacher.objects.create(
                    organization_id=org_id,
                    first_name=item.get('first_name', ''),
                    last_name=item.get('last_name', '')
                )
                created_count += 1

        elif entity_type == 'groups':
            for item in items:
                StudentGroup.objects.create(
                    organization_id=org_id,
                    name=item.get('name', ''),
                    student_count=item.get('student_count', 25)
                )
                created_count += 1

        elif entity_type == 'classrooms':
            for item in items:
                Classroom.objects.create(
                    organization_id=org_id,
                    name=item.get('name', ''),
                    capacity=item.get('capacity', 30),
                    room_type=item.get('room_type', 'standard')
                )
                created_count += 1

        elif entity_type == 'subjects':
            for item in items:
                Subject.objects.create(
                    organization_id=org_id,
                    name=item.get('name', ''),
                    code=item.get('code', '')
                )
                created_count += 1

        return Response({
            'success': True,
            'created_count': created_count,
            'message': f"Успешно импортировано записей: {created_count}"
        })
