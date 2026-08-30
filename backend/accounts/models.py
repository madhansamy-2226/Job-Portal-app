from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('SEEKER', 'Job Seeker'),
        ('EMPLOYER', 'Employer'),
        ('ADMIN', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='SEEKER')
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class SeekerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seeker_profile')
    headline = models.CharField(max_length=255, blank=True, null=True, help_text="e.g. Full Stack Python Developer")
    bio = models.TextField(blank=True, null=True)
    experience_years = models.IntegerField(default=0)
    current_location = models.CharField(max_length=150, blank=True, null=True)
    preferred_location = models.CharField(max_length=150, blank=True, null=True)
    expected_salary = models.CharField(max_length=100, blank=True, null=True)
    resume_url = models.URLField(max_length=500, blank=True, null=True)
    resume_filename = models.CharField(max_length=255, blank=True, null=True)
    skills = models.JSONField(default=list, blank=True, help_text="List of skills e.g. ['Python', 'Django', 'React']")
    education = models.JSONField(default=list, blank=True, help_text="List of education entries [{degree, institution, year, grade}]")
    experience = models.JSONField(default=list, blank=True, help_text="List of work experiences [{title, company, duration, description}]")
    portfolio_url = models.URLField(max_length=300, blank=True, null=True)
    github_url = models.URLField(max_length=300, blank=True, null=True)
    linkedin_url = models.URLField(max_length=300, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile: {self.user.get_full_name() or self.user.username}"
