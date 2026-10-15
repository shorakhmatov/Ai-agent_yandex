from rest_framework import serializers
from .models import Schedule, Lesson, ScheduleConflict
from academics.serializers import (
    TimeSlotSerializer, TeacherSerializer, SubjectSerializer,
    ClassroomSerializer, StudentGroupSerializer
)

class LessonSerializer(serializers.ModelSerializer):
    time_slot_details = TimeSlotSerializer(source='time_slot', read_only=True)
    teacher_details = TeacherSerializer(source='teacher', read_only=True)
    subject_details = SubjectSerializer(source='subject', read_only=True)
    classroom_details = ClassroomSerializer(source='classroom', read_only=True)
    student_group_details = StudentGroupSerializer(source='student_group', read_only=True)

    class Meta:
        model = Lesson
        fields = '__all__'

class ScheduleConflictSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleConflict
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    conflicts = ScheduleConflictSerializer(many=True, read_only=True)
    conflicts_count = serializers.IntegerField(source='conflicts.count', read_only=True)

    class Meta:
        model = Schedule
        fields = '__all__'
