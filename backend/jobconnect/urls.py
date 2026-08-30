from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.decorators import api_view
from rest_framework.response import Response

from accounts.views import RegisterView, LoginView, UserProfileView, AdminUserViewSet
from companies.views import CompanyViewSet
from jobs.views import CategoryViewSet, SkillViewSet, JobViewSet, SavedJobViewSet
from applications.views import ApplicationViewSet
from analytics.views import StatsView, EmployerStatsView, AdminStatsView

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'saved-jobs', SavedJobViewSet, basename='saved-job')
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'admin/users', AdminUserViewSet, basename='admin-user')

@api_view(['GET'])
def api_root_info(request):
    return Response({
        'status': 'online',
        'app': 'JobConnect REST API',
        'version': '1.0.0',
        'endpoints': {
            'jobs': request.build_absolute_uri('/api/jobs/'),
            'categories': request.build_absolute_uri('/api/categories/'),
            'companies': request.build_absolute_uri('/api/companies/'),
            'applications': request.build_absolute_uri('/api/applications/'),
            'auth_login': request.build_absolute_uri('/api/auth/login/'),
            'auth_register': request.build_absolute_uri('/api/auth/register/'),
            'user_profile': request.build_absolute_uri('/api/profile/'),
            'analytics_stats': request.build_absolute_uri('/api/analytics/stats/'),
        }
    })

urlpatterns = [
    # Root API welcome endpoint
    path('', api_root_info, name='api_root_home'),
    path('api/', api_root_info, name='api_root_info'),

    path('admin/', admin.site.urls),
    
    # Auth endpoints
    path('api/auth/register/', RegisterView.as_view(), name='auth_register'),
    path('api/auth/login/', LoginView.as_view(), name='auth_login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='auth_token_refresh'),
    path('api/profile/', UserProfileView.as_view(), name='user_profile'),

    # Analytics endpoints
    path('api/analytics/stats/', StatsView.as_view(), name='public_stats'),
    path('api/analytics/employer/', EmployerStatsView.as_view(), name='employer_stats'),
    path('api/analytics/admin/', AdminStatsView.as_view(), name='admin_stats'),

    # Router endpoints
    path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
