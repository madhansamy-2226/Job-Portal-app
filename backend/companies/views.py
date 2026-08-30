from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from companies.models import Company
from companies.serializers import CompanySerializer

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    lookup_field = 'id'

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'by_slug']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_company(self, request):
        try:
            company = Company.objects.get(owner=request.user)
            serializer = self.get_serializer(company)
            return Response(serializer.data)
        except Company.DoesNotExist:
            return Response({'detail': 'No company profile found for this employer.'}, status=status.HTTP_404_NOT_FOUND)
