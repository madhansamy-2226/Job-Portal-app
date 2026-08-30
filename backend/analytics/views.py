from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from accounts.models import User
from companies.models import Company
from jobs.models import Job, Category
from applications.models import Application

class StatsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        total_active_jobs = Job.objects.filter(is_active=True).count()
        total_users = User.objects.count()
        total_companies = Company.objects.count()
        total_categories = Category.objects.count()
        total_applications = Application.objects.count()

        return Response({
            'active_jobs': total_active_jobs if total_active_jobs > 0 else 4,
            'registered_users': max(total_users, 100),
            'companies_count': max(total_companies, 200),
            'categories_count': max(total_categories, 8),
            'total_applications': total_applications,
        })


class EmployerStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['EMPLOYER', 'ADMIN']:
            return Response({'error': 'Access denied.'}, status=403)

        jobs = Job.objects.filter(employer=request.user)
        total_jobs = jobs.count()
        active_jobs = jobs.filter(is_active=True).count()
        
        applications = Application.objects.filter(job__employer=request.user)
        total_applications = applications.count()
        shortlisted_count = applications.filter(status__in=['SHORTLISTED', 'INTERVIEW', 'SELECTED']).count()

        return Response({
            'total_jobs': total_jobs,
            'active_jobs': active_jobs,
            'total_applicants': total_applications,
            'shortlisted_candidates': shortlisted_count,
        })


class AdminStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        return Response({
            'total_users': User.objects.count(),
            'total_seekers': User.objects.filter(role='SEEKER').count(),
            'total_employers': User.objects.filter(role='EMPLOYER').count(),
            'total_jobs': Job.objects.count(),
            'active_jobs': Job.objects.filter(is_active=True).count(),
            'total_applications': Application.objects.count(),
            'total_companies': Company.objects.count(),
            'total_categories': Category.objects.count(),
        })
