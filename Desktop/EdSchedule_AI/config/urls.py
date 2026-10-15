from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def welcome_view(request):
    return JsonResponse({
        "status": "online",
        "message": "EdSchedule AI API is running",
        "endpoints": {
            "admin": "/admin/",
            "auth": "/api/auth/",
            "academics": "/api/academics/",
            "scheduling": "/api/scheduling/",
            "ai": "/api/ai/",
            "export": "/api/export/"
        }
    })

urlpatterns = [
    path('', welcome_view, name='welcome'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/academics/', include('academics.urls')),
    path('api/scheduling/', include('scheduling.urls')),
    path('api/ai/', include('ai_assistant.urls')),
    path('api/export/', include('imports_exports.urls')),
]
