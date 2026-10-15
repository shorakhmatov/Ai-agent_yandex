from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet, AcademicTermViewSet, TimeSlotViewSet,
    SubjectViewSet, ClassroomViewSet, StudentGroupViewSet,
    TeacherViewSet, TeacherAvailabilityViewSet
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'terms', AcademicTermViewSet)
router.register(r'timeslots', TimeSlotViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'classrooms', ClassroomViewSet)
router.register(r'groups', StudentGroupViewSet)
router.register(r'teachers', TeacherViewSet)
router.register(r'availabilities', TeacherAvailabilityViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
