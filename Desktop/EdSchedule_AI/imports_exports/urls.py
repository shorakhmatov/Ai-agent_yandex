from django.urls import path
from .views import ScheduleExportView
from .import_views import ImportCSVPreviewView, ImportCSVCommitView

urlpatterns = [
    path('export/<uuid:schedule_id>/', ScheduleExportView.as_view(), name='schedule_export'),
    path('import/preview/', ImportCSVPreviewView.as_view(), name='import_preview'),
    path('import/commit/', ImportCSVCommitView.as_view(), name='import_commit'),
]
