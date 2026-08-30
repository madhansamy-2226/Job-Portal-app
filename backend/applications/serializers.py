from rest_framework import serializers
from applications.models import Application
from jobs.serializers import JobSerializer
from accounts.serializers import UserSerializer

class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    seeker = UserSerializer(read_only=True)
    seeker_name = serializers.SerializerMethodField()
    seeker_headline = serializers.SerializerMethodField()
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.company.name', read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('id', 'job', 'seeker', 'applied_at', 'updated_at')

    def get_seeker_name(self, obj):
        return obj.seeker.get_full_name() or obj.seeker.username

    def get_seeker_headline(self, obj):
        if hasattr(obj.seeker, 'seeker_profile'):
            return obj.seeker.seeker_profile.headline
        return ""


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ('resume_url', 'resume_filename', 'cover_note')


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ('status', 'employer_notes')
