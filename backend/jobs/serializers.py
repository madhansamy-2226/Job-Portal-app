from rest_framework import serializers
from jobs.models import Category, Skill, Job, SavedJob
from companies.serializers import CompanySerializer

class CategorySerializer(serializers.ModelSerializer):
    job_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_job_count(self, obj):
        return obj.jobs.filter(is_active=True).count()


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    applications_count = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ('id', 'employer', 'company', 'slug', 'views_count', 'created_at', 'updated_at')

    def get_applications_count(self, obj):
        return obj.applications.count()

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False


class JobCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        exclude = ('employer', 'company', 'slug', 'views_count', 'created_at', 'updated_at')


class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)

    class Meta:
        model = SavedJob
        fields = ('id', 'job', 'saved_at')
