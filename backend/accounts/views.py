from rest_framework import status, viewsets, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from accounts.models import User, SeekerProfile
from accounts.serializers import UserSerializer, RegisterSerializer, SeekerProfileSerializer

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user, context={'request': request}).data
            return Response({
                'user': user_data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'message': 'Registration successful!'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username') or request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Please provide username/email and password.'}, status=status.HTTP_400_BAD_REQUEST)

        # Allow login by email or username
        user = None
        if '@' in username:
            try:
                user_obj = User.objects.get(email__iexact=username)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None
        else:
            user = authenticate(username=username, password=password)

        if not user:
            return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({'error': 'Account is deactivated. Please contact support.'}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user, context={'request': request}).data

        return Response({
            'user': user_data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Login successful!'
        })


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        data = request.data.copy()

        # Update basic user fields
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.phone = data.get('phone', user.phone)
        user.avatar_url = data.get('avatar_url', user.avatar_url)
        user.bio = data.get('bio', user.bio)
        user.save()

        # If seeker, update SeekerProfile
        if user.role == 'SEEKER':
            profile, created = SeekerProfile.objects.get_or_create(user=user)
            if 'headline' in data: profile.headline = data['headline']
            if 'bio' in data: profile.bio = data['bio']
            if 'experience_years' in data: profile.experience_years = data['experience_years']
            if 'current_location' in data: profile.current_location = data['current_location']
            if 'preferred_location' in data: profile.preferred_location = data['preferred_location']
            if 'expected_salary' in data: profile.expected_salary = data['expected_salary']
            if 'resume_url' in data: profile.resume_url = data['resume_url']
            if 'resume_filename' in data: profile.resume_filename = data['resume_filename']
            if 'skills' in data: profile.skills = data['skills']
            if 'education' in data: profile.education = data['education']
            if 'experience' in data: profile.experience = data['experience']
            if 'portfolio_url' in data: profile.portfolio_url = data['portfolio_url']
            if 'github_url' in data: profile.github_url = data['github_url']
            if 'linkedin_url' in data: profile.linkedin_url = data['linkedin_url']
            profile.save()

        # If employer, update Company info if provided
        if user.role == 'EMPLOYER' and hasattr(user, 'company'):
            company = user.company
            if 'company_name' in data: company.name = data['company_name']
            if 'company_website' in data: company.website = data['company_website']
            if 'company_logo' in data: company.logo_url = data['company_logo']
            if 'company_industry' in data: company.industry = data['company_industry']
            if 'company_location' in data: company.location = data['company_location']
            if 'company_about' in data: company.about = data['company_about']
            if 'company_size' in data: company.size = data['company_size']
            company.save()

        updated_serializer = UserSerializer(user, context={'request': request})
        return Response({
            'user': updated_serializer.data,
            'message': 'Profile updated successfully!'
        })


class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()
