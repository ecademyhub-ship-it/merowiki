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
    google_id = models.CharField(
        max_length=255,
        unique=True,
        null=True,
        blank=True
    )

    tc=models.BooleanField()
    is_active = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
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
    # Existing professions
    ('plumber', 'Plumber'),
    ('electrician', 'Electrician'),
    ('teacher', 'Teacher'),
    ('photographer', 'Photographer'),
    ('cleaner', 'Cleaner'),
    ('computer_repair', 'Computer Repair'),
    ('designer', 'Designer'),
    ('automobile_engineer', 'Automobile Engineer'),
    ('barber', 'Barber'),

    # Home & Repair Services
    ('carpenter', 'Carpenter'),
    ('painter', 'Painter'),
    ('mason', 'Mason'),
    ('welder', 'Welder'),
    ('tile_worker', 'Tile Worker'),
    ('roofer', 'Roof Repair Specialist'),
    ('locksmith', 'Locksmith'),
    ('pest_control', 'Pest Control Specialist'),
    ('ac_repair', 'AC Repair Technician'),
    ('refrigerator_repair', 'Refrigerator Repair Technician'),
    ('washing_machine_repair', 'Washing Machine Repair'),
    ('water_tank_cleaner', 'Water Tank Cleaner'),
    ('toilet_tank_cleaner', 'Toilet Tank Cleaner'),
    ('interior_designer', 'Interior Designer'),

    # Vehicle Services
    ('motorcycle_mechanic', 'Motorcycle Mechanic'),
    ('car_mechanic', 'Car Mechanic'),
    ('bike_washer', 'Bike Washing Service'),
    ('car_washer', 'Car Washing Service'),
    ('car_rental', 'Car Rental'),
    ('bike_rental', 'Bike Rental'),

    # Technology Services
    ('mobile_repair', 'Mobile Repair Technician'),
    ('laptop_repair', 'Laptop Repair Technician'),
    ('software_developer', 'Software Developer'),
    ('web_developer', 'Web Developer'),
    ('network_technician', 'Network Technician'),
    ('cctv_technician', 'CCTV Technician'),

    # Education
    ('home_tutor', 'Home Tutor'),
    ('language_tutor', 'Language Tutor'),
    ('music_teacher', 'Music Teacher'),
    ('dance_teacher', 'Dance Teacher'),

    # Beauty & Personal Care
    ('beautician', 'Beautician'),
    ('makeup_artist', 'Makeup Artist'),
    ('hair_stylist', 'Hair Stylist'),
    ('massage_therapist', 'Massage Therapist'),

    # Events & Creative
    ('videographer', 'Videographer'),
    ('event_planner', 'Event Planner'),
    ('dj', 'DJ'),
    ('catering_service', 'Catering Service'),
    ('cook', 'Cook'),
    ('bhajan_toli', 'Bhajan Toli'),
    ('band_baja', 'Band Baja'),
    ('panche_baja', 'Panche Baja'),
    ('flower_decorator', 'Flower Decorator'),
    ('half_catering', 'Half Catering'),

    # Professional Services
    ('accountant', 'Accountant'),
    ('lawyer', 'Lawyer'),
    ('translator', 'Translator'),
    ('real_estate_agent', 'Real Estate Agent'),

    # Domestic & Household Services
    ('maid', 'Maid/Domestic Helper'),
    ('nanny', 'Nanny/Babysitter'),
    ('elderly_care', 'Elderly Care'),
    ('gardener', 'Gardener'),
    ('house_mover', 'House Moving Service'),
    ('florist', 'Florist'),

    # Fashion & Tailoring
    ('tailor', 'Tailor/Dressmaker'),
    ('cobbler', 'Cobbler/Shoemaker'),
    ('leather_worker', 'Leather Worker'),

    # Health & Wellness
    ('nurse', 'Nurse/Health Worker'),
    ('yoga_instructor', 'Yoga Instructor'),
    ('fitness_trainer', 'Fitness Trainer'),
    ('physiotherapist', 'Physiotherapist'),
    ('veterinarian', 'Veterinarian'),
    ('astrologer', 'Astrologer'),

    # Energy & Utilities
    ('geyezer_maintenance', 'Geyezer Maintenance'),
    ('generator_repair', 'Generator Repair'),
    ('solar_technician', 'Solar Panel Technician'),
    ('water_purification', 'Water Purification Technician'),

    # Skilled Crafts
    ('blacksmith', 'Blacksmith'),
    ('woodcarver', 'Woodcarver'),
    ('metalworker', 'Metalworker'),
    ('pottery_maker', 'Pottery Maker'),

    # Logistics & Transportation
    ('courier_service', 'Courier Service'),
    ('transport_service', 'Transport Service'),

    # Sports & Recreation
    ('sports_trainer', 'Sports Trainer'),
    ('martial_arts_trainer', 'Martial Arts Trainer'),
    ('swimming_coach', 'Swimming Coach'),
    ]

    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    name = models.CharField(max_length=100 )
    profile = models.ImageField(upload_to='photos/')  
    work_photo_1 = models.ImageField(upload_to='photos/', blank=True, null=True)
    work_photo_2 = models.ImageField(upload_to='photos/', blank=True, null=True)
    work_photo_3 = models.ImageField(upload_to='photos/', blank=True, null=True)
    work_photo_4 = models.ImageField(upload_to='photos/', blank=True, null=True)
    work_photo_5 = models.ImageField(upload_to='photos/', blank=True, null=True)
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