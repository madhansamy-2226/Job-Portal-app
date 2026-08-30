from rest_framework import serializers
from companies.models import Company

class CompanySerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    owner_email = serializers.CharField(source='owner.email', read_only=True)
    active_jobs_count = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ('id', 'owner', 'slug', 'is_verified', 'created_at', 'updated_at')

    def get_active_jobs_count(self, obj):
        return obj.jobs.filter(is_active=True).count()
