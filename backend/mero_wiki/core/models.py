from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from phonenumber_field.modelfields import PhoneNumberField 
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.db.models import Avg

class UserManager(BaseUserManager):
    def create_user(self, email, full_name, tc, password=None, password2=None):
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            full_name=full_name,
            tc=tc,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, tc, password=None):
        user = self.create_user(
            email,
            password=password,
            full_name=full_name,
            tc=tc,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save(using=self._db)
        return user


class user(AbstractBaseUser):
    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True,
    )
    full_name = models.CharField(max_length=255)
    tc=models.BooleanField()
    is_active = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name","tc"]

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        if self.is_superuser:
            return True
        return self.is_staff

    def has_module_perms(self, app_label):
        if self.is_superuser:
            return True
        return self.is_staff

class Features(models.Model):
    CATEGORY_CHOICES = [
            ('plumber', 'Plumber'),
            ('electrician', 'Electrician'),
            ('teacher', 'Teacher'),
            ('photographer', 'Photographer'),
            ('cleaner', 'Cleaner'),
            ('computer_repair', 'Computer Repair'),
            ('designer', 'Designer'),
            ('automobile_engineer', 'Automobile Engineer'),
        ]

    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    name = models.CharField(max_length=100 )
    profile = models.ImageField(upload_to='photos/')  
    email = models.EmailField(max_length=255, unique=True, validators=[validate_email])
    phone = PhoneNumberField(region="NP")
    description = models.TextField()
    location = models.CharField(max_length=100)
    is_available = models.BooleanField(default=True)
    booked_by = models.ForeignKey(
        'User',             
        on_delete=models.CASCADE,
        related_name='bookings',  
        null=True, blank=True     
    )

    def average_rating(self):
        return self.reviews.aggregate(avg=Avg('rating'))['avg'] or 0

    class Meta:
        ordering = ['name']
        verbose_name = "Feature"
        verbose_name_plural = "Features"

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

    def clean(self):
        super().clean()
        if self.email and not self.email.endswith(".com"):
            raise ValidationError({"email": "Email must end with .com"})

class Review(models.Model):
    user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    feature = models.ForeignKey(
        'Features',
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    rating = models.PositiveSmallIntegerField()  
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} rated {self.feature.name} {self.rating}/5"