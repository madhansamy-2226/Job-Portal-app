from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from jobs.models import Category, Skill, Job, SavedJob
from jobs.serializers import (
    CategorySerializer, SkillSerializer, JobSerializer,
    JobCreateUpdateSerializer, SavedJobSerializer
)
from companies.models import Company

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.select_related('company', 'category', 'employer').all()
    serializer_class = JobSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['job_type', 'experience_level', 'category', 'is_featured', 'is_active']
    search_fields = ['title', 'description', 'location', 'company__name', 'skills_required']
    ordering_fields = ['created_at', 'salary_max', 'views_count']
    ordering = ['-is_featured', '-created_at']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return JobCreateUpdateSerializer
        return JobSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'featured', 'categories']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = super().get_queryset()

        # Handle custom query parameters
        category_slug = self.request.query_params.get('category_slug')
        if category_slug:
            qs = qs.filter(category__slug=category_slug)

        location = self.request.query_params.get('location')
        if location:
            qs = qs.filter(location__icontains=location)

        min_salary = self.request.query_params.get('min_salary')
        if min_salary:
            qs = qs.filter(salary_max__gte=min_salary)

        # For employers viewing their own jobs
        if self.request.query_params.get('employer_only') == 'true' and self.request.user.is_authenticated:
            qs = qs.filter(employer=self.request.user)
        elif not self.request.user.is_staff and self.action == 'list':
            # Public list only shows active jobs unless filtered by employer
            if not self.request.query_params.get('include_inactive'):
                qs = qs.filter(is_active=True)

        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_create(self, serializer):
        user = self.request.user
        company = getattr(user, 'company', None)
        if not company:
            company = Company.objects.create(owner=user, name=f"{user.username}'s Tech Company")
        serializer.save(employer=user, company=company)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_jobs = Job.objects.filter(is_active=True, is_featured=True)[:6]
        if not featured_jobs.exists():
            featured_jobs = Job.objects.filter(is_active=True)[:6]
        serializer = self.get_serializer(featured_jobs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def save_job(self, request, pk=None):
        job = self.get_object()
        saved_job, created = SavedJob.objects.get_or_create(user=request.user, job=job)
        if not created:
            saved_job.delete()
            return Response({'saved': False, 'message': 'Job removed from saved list.'})
        return Response({'saved': True, 'message': 'Job saved successfully!'})


class SavedJobViewSet(viewsets.ModelViewSet):
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user)
