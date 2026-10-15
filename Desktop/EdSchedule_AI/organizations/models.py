from django.db import models
from django.conf import settings
import uuid

class Organization(models.Model):
    ORG_TYPES = (
        ('school', 'Школа'),
        ('college', 'Колледж'),
        ('university', 'Университет'),
        ('training_center', 'Учебный центр'),
        ('other', 'Другое'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='Название учреждения')
    slug = models.SlugField(max_length=255, unique=True, verbose_name='Уникальный идентификатор (slug)')
    org_type = models.CharField(max_length=50, choices=ORG_TYPES, default='school', verbose_name='Тип учреждения')
    address = models.TextField(blank=True, null=True, verbose_name='Адрес')
    contact_phone = models.CharField(max_length=50, blank=True, null=True, verbose_name='Телефон')
    contact_email = models.EmailField(blank=True, null=True, verbose_name='Электронная почта')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    class Meta:
        verbose_name = 'Организация'
        verbose_name_plural = 'Организации'

    def __str__(self):
        return self.name

class OrganizationMembership(models.Model):
    ROLES = (
        ('platform_admin', 'Суперадминистратор платформы'),
        ('org_admin', 'Администратор организации'),
        ('vice_principal', 'Заместитель директора (составитель расписания)'),
        ('teacher', 'Преподаватель'),
        ('student', 'Студент'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='memberships')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='memberships')
    role = models.CharField(max_length=50, choices=ROLES, default='teacher', verbose_name='Роль')
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'organization')
        verbose_name = 'Членство в организации'
        verbose_name_plural = 'Членства в организациях'

    def __str__(self):
        return f"{self.user.username} - {self.organization.name} ({self.get_role_display()})"
