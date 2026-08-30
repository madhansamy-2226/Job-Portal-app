from django.db import models
from django.utils.text import slugify
from accounts.models import User

class Company(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name='company')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    website = models.URLField(max_length=300, blank=True, null=True)
    industry = models.CharField(max_length=150, default='Technology')
    location = models.CharField(max_length=200, default='Bangalore, India')
    about = models.TextField(blank=True, null=True)
    size = models.CharField(max_length=50, default='50-200 employees')
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Companies'
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Company.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
