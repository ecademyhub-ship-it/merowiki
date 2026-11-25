from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework.test import APIClient

from .models import Features, Review, user
from .serializers import ReviewCreateSerializer, UserSerializer


class UserAndSerializerTests(TestCase):
	def test_create_user_normalizes_email_and_hashes_password(self):
		created_user = user.objects.create_user(
			email="Person@Example.COM",
			full_name="Test Person",
			tc=True,
			password="StrongPass1",
		)

		self.assertEqual(created_user.email, "Person@example.com")
		self.assertTrue(created_user.check_password("StrongPass1"))
		self.assertFalse(created_user.is_active)

	def test_user_serializer_rejects_weak_password(self):
		serializer = UserSerializer(data={
			"email": "person@example.com",
			"full_name": "Test Person",
			"tc": True,
			"password": "weak",
			"password2": "weak",
		})

		self.assertFalse(serializer.is_valid())
		self.assertIn("Password must be at least 8 characters", str(serializer.errors))


class FeatureAndReviewTests(TestCase):
	def setUp(self):
		self.owner = user.objects.create_user(
			email="owner@example.com",
			full_name="Feature Owner",
			tc=True,
			password="StrongPass1",
		)
		self.feature = Features.objects.create(
			category="plumber",
			name="Reliable Plumbing",
			profile=SimpleUploadedFile("profile.jpg", b"image-data", content_type="image/jpeg"),
			email="service@example.com",
			phone="+9779812345678",
			description="Residential plumbing service",
			location="Kathmandu",
		)

	def test_feature_requires_com_email(self):
		self.feature.email = "service@example.org"

		with self.assertRaises(ValidationError):
			self.feature.full_clean()

	def test_average_rating_and_rating_validation(self):
		Review.objects.create(user=self.owner, feature=self.feature, rating=4)
		Review.objects.create(user=self.owner, feature=self.feature, rating=2)

		self.assertEqual(self.feature.average_rating(), 3)
		self.assertFalse(ReviewCreateSerializer(data={"rating": 6}).is_valid())


class PublicFeatureApiTests(TestCase):
	def setUp(self):
		Features.objects.create(
			category="plumber",
			name="Kathmandu Plumbing",
			profile=SimpleUploadedFile("profile.jpg", b"image-data", content_type="image/jpeg"),
			email="plumber@example.com",
			phone="+9779812345678",
			description="Emergency plumbing service",
			location="Kathmandu",
		)
		Features.objects.create(
			category="teacher",
			name="Pokhara Tutor",
			profile=SimpleUploadedFile("profile.jpg", b"image-data", content_type="image/jpeg"),
			email="tutor@example.com",
			phone="+9779812345678",
			description="Home tutoring",
			location="Pokhara",
		)
		self.client = APIClient()

	def test_feature_search_filters_by_location(self):
		response = self.client.get("/api/user/features/", {"location": "Kathmandu"})

		self.assertEqual(response.status_code, 200)
		self.assertEqual([item["name"] for item in response.data], ["Kathmandu Plumbing"])

	def test_locations_are_distinct_and_sorted(self):
		response = self.client.get("/api/user/locations/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data, ["Kathmandu", "Pokhara"])