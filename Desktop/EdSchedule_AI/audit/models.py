from django.db import models
from organizations.models import Organization
from accounts.models import User
import uuid

class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='audit_logs', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_actions')
    action = models.CharField(max_length=255, verbose_name='Действие')
    details = models.JSONField(default=dict, blank=True, verbose_name='Детали / Изменения')
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name='IP-адрес')
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Время')

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Запись аудита'
        verbose_name_plural = 'Журнал аудита'

    def __str__(self):
        return f"{self.timestamp} | {self.user} | {self.action}"
