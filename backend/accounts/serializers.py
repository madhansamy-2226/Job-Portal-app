from rest_framework import serializers
from accounts.models import User, SeekerProfile

class SeekerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeekerProfile
        fields = '__all__'
        read_only_fields = ('id', 'user', 'updated_at')


class UserSerializer(serializers.ModelSerializer):
    seeker_profile = SeekerProfileSerializer(read_only=True)
    company_id = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'avatar_url', 'bio', 'seeker_profile', 'company_id', 'company_name', 'date_joined')
        read_only_fields = ('id', 'date_joined')

    def get_company_id(self, obj):
        if hasattr(obj, 'company'):
            return obj.company.id
        return None

    def get_company_name(self, obj):
        if hasattr(obj, 'company'):
            return obj.company.name
        return None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default='SEEKER')
    company_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'role', 'phone', 'company_name')

    def create(self, validated_data):
        company_name = validated_data.pop('company_name', None)
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)

        # Create corresponding profile/company
        if user.role == 'SEEKER':
            SeekerProfile.objects.create(
                user=user,
                headline=f"{user.first_name} {user.last_name}" if user.first_name else user.username,
            )
        elif user.role == 'EMPLOYER':
            from companies.models import Company
            c_name = company_name or f"{user.username}'s Company"
            Company.objects.create(
                owner=user,
                name=c_name,
            )
        return user
