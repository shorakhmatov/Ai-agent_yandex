from django.test import TestCase
from accounts.models import User
from organizations.models import Organization, OrganizationMembership
from academics.models import Subject
from rest_framework.test import APIClient
from rest_framework import status

class TenantIsolationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Создаем две изолированные организации
        self.org_a = Organization.objects.create(name='Школа №1', slug='school-1')
        self.org_b = Organization.objects.create(name='Лицей №2', slug='lyceum-2')

        # Создаем пользователей
        self.user_a = User.objects.create_user(username='user_a', password='password123')
        self.user_b = User.objects.create_user(username='user_b', password='password123')

        # Привязываем пользователей к своим организациям
        OrganizationMembership.objects.create(
            user=self.user_a, organization=self.org_a, role='org_admin'
        )
        OrganizationMembership.objects.create(
            user=self.user_b, organization=self.org_b, role='org_admin'
        )

        # Создаем предмет в организации А
        self.subject_a = Subject.objects.create(
            organization=self.org_a, name='Информатика'
        )
        # Создаем предмет в организации Б
        self.subject_b = Subject.objects.create(
            organization=self.org_b, name='Химия'
        )

    def test_user_cannot_read_another_organization_subjects(self):
        """
        Тест безопасности: пользователь Организации А не может получить данные Организации Б.
        """
        self.client.force_authenticate(user=self.user_a)

        # Запрос предметов Организации Б от имени пользователя Организации А
        response = self.client.get(f'/api/academics/subjects/?organization_id={self.org_b.id}')

        # Пользователь не имеет членства в org_b -> Должен получить 403 Forbidden
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_read_own_organization_subjects(self):
        """
        Пользователь организации А успешно видит свои предметы.
        """
        self.client.force_authenticate(user=self.user_a)
        response = self.client.get(f'/api/academics/subjects/?organization_id={self.org_a.id}')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Проверяем, что в выдаче есть только Информатика и нет Химии
        names = [item['name'] for item in response.data]
        self.assertIn('Информатика', names)
        self.assertNotIn('Химия', names)
