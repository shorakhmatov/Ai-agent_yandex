from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .tools import AIAssistantTools
from organizations.permissions import IsOrganizationMember

class AIAssistantChatView(APIView):
    permission_classes = [IsOrganizationMember]

    def post(self, request):
        """
        Принимает запрос пользователя и вызывает соответствующий инструмент (Tool Calling).
        Поддерживает русский и узбекский языки.
        """
        org_id = request.data.get('organization_id')
        user_message = request.data.get('message', '').strip()
        schedule_id = request.data.get('schedule_id')

        if not user_message:
            return Response({'error': 'Сообщение не может быть пустым'}, status=status.HTTP_400_BAD_REQUEST)

        # Простая эмуляция определения намерений (Intent matching) для MVP
        # В полноценном режиме здесь подключается LLM с вызовом функций
        msg_lower = user_message.lower()

        # 1. Поиск свободных аудиторий (RU / UZ)
        if 'свободные аудитории' in msg_lower or 'бўш аудитория' in msg_lower:
            day = request.data.get('day_of_week', 1)
            slot = request.data.get('slot_number', 1)
            rooms = AIAssistantTools.get_available_rooms(org_id, day, slot)
            return Response({
                'action': 'get_available_rooms',
                'language': 'uz' if 'бўш' in msg_lower else 'ru',
                'response': f"Найдено свободных аудиторий: {len(rooms)}",
                'data': rooms
            })

        # 2. Поиск конфликтов
        elif 'конфликт' in msg_lower or 'зиддият' in msg_lower:
            if not schedule_id:
                return Response({'error': 'Укажите schedule_id для проверки конфликтов'}, status=status.HTTP_400_BAD_REQUEST)
            conflicts = AIAssistantTools.find_schedule_conflicts(schedule_id)
            return Response({
                'action': 'find_schedule_conflicts',
                'language': 'uz' if 'зиддият' in msg_lower else 'ru',
                'response': f"Обнаружено конфликтов: {len(conflicts)}",
                'data': conflicts
            })

        # 3. Нагрузка преподавателей
        elif 'нагрузка' in msg_lower or 'юклама' in msg_lower:
            workload = AIAssistantTools.get_teacher_workload(org_id)
            return Response({
                'action': 'get_teacher_workload',
                'language': 'uz' if 'юклама' in msg_lower else 'ru',
                'response': "Данные о нагрузке преподавателей получены.",
                'data': workload
            })

        # 4. Получение расписания
        elif 'расписание' in msg_lower or 'жадвал' in msg_lower:
            if not schedule_id:
                return Response({'error': 'Укажите schedule_id'}, status=status.HTTP_400_BAD_REQUEST)
            schedule_data = AIAssistantTools.get_schedule(schedule_id)
            return Response({
                'action': 'get_schedule',
                'language': 'uz' if 'жадвал' in msg_lower else 'ru',
                'response': f"Всего занятий: {len(schedule_data)}",
                'data': schedule_data
            })

        return Response({
            'action': 'unknown',
            'response': 'Запрос принят. Для уточнения параметров воспользуйтесь доступными командами расписания (поддерживаются русский и узбекский языки).',
            'data': []
        })
