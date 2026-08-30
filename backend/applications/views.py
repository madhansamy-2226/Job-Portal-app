from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from applications.models import Application
from applications.serializers import (
    ApplicationSerializer, ApplicationCreateSerializer, ApplicationStatusUpdateSerializer
)
from jobs.models import Job

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN' or user.is_staff:
            return Application.objects.all()
        elif user.role == 'EMPLOYER':
            return Application.objects.filter(job__employer=user)
        else: # SEEKER
            return Application.objects.filter(seeker=user)

    @action(detail=False, methods=['post'], url_path=r'job/(?P<job_id>\d+)/apply')
    def apply(self, request, job_id=None):
        try:
            job = Job.objects.get(pk=job_id, is_active=True)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found or no longer active.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role == 'EMPLOYER':
            return Response({'error': 'Employers cannot apply for jobs.'}, status=status.HTTP_400_BAD_REQUEST)

        if Application.objects.filter(job=job, seeker=request.user).exists():
            return Response({'error': 'You have already applied for this job.'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve seeker default resume if not provided
        resume_url = request.data.get('resume_url')
        resume_filename = request.data.get('resume_filename')
        cover_note = request.data.get('cover_note', '')

        if not resume_url and hasattr(request.user, 'seeker_profile'):
            resume_url = request.user.seeker_profile.resume_url
            resume_filename = request.user.seeker_profile.resume_filename or 'resume.pdf'

        application = Application.objects.create(
            job=job,
            seeker=request.user,
            resume_url=resume_url or '',
            resume_filename=resume_filename or 'resume.pdf',
            cover_note=cover_note,
            status='APPLIED'
        )

        serializer = ApplicationSerializer(application, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch', 'put'], url_path='update-status')
    def update_status(self, request, pk=None):
        application = self.get_object()
        
        # Verify employer ownership or admin
        if request.user.role != 'ADMIN' and application.job.employer != request.user:
            return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ApplicationStatusUpdateSerializer(application, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            updated_app = ApplicationSerializer(application, context={'request': request}).data
            return Response({
                'application': updated_app,
                'message': f"Application status updated to {application.get_status_display()}!"
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
