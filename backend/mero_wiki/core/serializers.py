from core.models import user,Features,Review
from rest_framework import serializers
from django.utils.encoding import force_bytes, smart_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from core.utils import send_password_reset_email
import re

class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = user
        fields = ['id', 'email', 'full_name', 'tc','password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
        }
    def validate_email(self, value):
        if user.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value.lower()

    #validation of password
    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password doesn't match")
        
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters")
        if not re.search(r'[A-Z]',password ):
            raise serializers.ValidationError("Password must contain at least one uppercase letter")
        if not re.search(r'[a-z]',password ):
            raise serializers.ValidationError("Password must contain at least one lowercase letter")
        if not re.search(r'\d',password ):
            raise serializers.ValidationError("Password must contain at least one digit")
        return attrs
    
    def validate_full_name(self, value):
        # Sanitize full name
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("Full name must be at least 3 characters")
        return value
    
    def create(self, validated_data):
        return user.objects.create_user(**validated_data)

class loginserializer(serializers.ModelSerializer):
    email=serializers.EmailField(max_length=255)
    password = serializers.CharField(write_only=True)

    class Meta:
        model=user
        fields=['email','password']

class welcomeSerializer(serializers.ModelSerializer):
    class Meta:
        model=user
        fields=['id', 'email', 'full_name']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        max_length=255, style={'input_type': 'password'}, write_only=True
    )
    new_password = serializers.CharField(
        max_length=255, style={'input_type': 'password'}, write_only=True
    )
    confirm_password = serializers.CharField(
        max_length=255, style={'input_type': 'password'}, write_only=True
    )

    def validate(self, attrs):
        old_password = attrs.get('old_password')
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')

        user = self.context.get('user')

        # Check old password
        if not user.check_password(old_password):
            raise serializers.ValidationError("Old password is incorrect")

        # Check new password match
        if new_password != confirm_password:
            raise serializers.ValidationError("New password and confirm password do not match")

        # Password strength checks
        if len(new_password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters")
        if not re.search(r'[A-Z]', new_password):
            raise serializers.ValidationError("Password must contain at least one uppercase letter")
        if not re.search(r'[a-z]', new_password):
            raise serializers.ValidationError("Password must contain at least one lowercase letter")
        if not re.search(r'\d', new_password):
            raise serializers.ValidationError("Password must contain at least one digit")

        return attrs

    def save(self, **kwargs):
        user = self.context.get('user')
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return user

    
class linkserializer(serializers.Serializer):
    email=serializers.EmailField(max_length=255)
    class Meta:
        fields=['email']

    def validate(self, attrs):
        email=attrs.get('email')
        if user.objects.filter(email=email).exists():
            User=user.objects.get(email=email)
            uid=urlsafe_base64_encode(force_bytes(User.id))
            token=default_token_generator.make_token(User)
            link = f"http://localhost:5173/reset/{uid}/{token}/"
            send_password_reset_email(User.email, link)
            return attrs
        raise serializers.ValidationError("you are not a registered user")    

class resetpasswordserializer(serializers.Serializer):           
    password=serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    password2=serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    class Meta:
        fields=['password', 'password2']
    
    def validate(self, attrs):
        password=attrs.get('password')
        password2=attrs.get('password2')
        uid=self.context.get('uid')
        token=self.context.get('token')
        if password !=password2:
            raise serializers.ValidationError("Password and Confirm Password doesn't match")
        
        id=smart_str(urlsafe_base64_decode(uid))
        User=user.objects.get(id=id)

        if not default_token_generator.check_token(User, token):
            raise serializers.ValidationError("Token is not valid or expired")
        User.set_password(password) 
        User.save()
        return attrs 

class FeaturesSerializer(serializers.ModelSerializer):
    rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    def get_rating(self, feature):
        return feature.average_rating()

    def get_review_count(self, feature):
        return feature.reviews.count()

    class Meta:
        model = Features
        fields = ['id','category','name','profile','phone','description','location','is_available','rating','review_count']


class ReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'reviewer', 'rating', 'comment', 'created_at']


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['rating', 'comment']

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value