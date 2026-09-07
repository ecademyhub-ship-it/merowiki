from django.shortcuts import render
from django.contrib import messages
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, loginserializer,welcomeSerializer,ChangePasswordSerializer,linkserializer, resetpasswordserializer,FeaturesSerializer,ReviewSerializer,ReviewCreateSerializer
from django.contrib.auth import authenticate, update_last_login
from .error import AccountErrorRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.views import TokenRefreshView as SimpleJWTTokenRefreshView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q
from django.db.models import Avg
from rest_framework_simplejwt.tokens import  RefreshToken
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from .models import user,Features,Review
from .utils import send_activation_email
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.conf import settings
import secrets


def get_tokens_for_user(user):
    if not user.is_active:
      raise AuthenticationFailed("User is not active")

    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserView(APIView):
    renderer_classes = [AccountErrorRenderer]
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_user = serializer.save()
            uid = urlsafe_base64_encode(force_bytes(new_user.pk))
            token = default_token_generator.make_token(new_user)
            activation_url = f"https://merowiki.com/activate/{uid}/{token}/"
            send_activation_email(new_user.email, activation_url)
            return Response({'msg': 'Registration successful. Please check your email to activate your account.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ActivateAccountView(APIView):
    renderer_classes = [AccountErrorRenderer]
    
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user_obj = user.objects.get(pk=uid)
            
            if user_obj.is_active:
                return Response({'msg': 'Account is already activated'}, status=status.HTTP_400_BAD_REQUEST)

            if default_token_generator.check_token(user_obj, token):
                user_obj.is_active = True
                user_obj.save()
                return Response({'msg': 'Account activated successfully! You can now login.'}, status=status.HTTP_200_OK)
            else:
                return Response({'msg': 'Activation link is invalid or has expired.'}, status=status.HTTP_400_BAD_REQUEST)

        except (TypeError, ValueError, OverflowError, user.DoesNotExist):
            return Response({'msg': 'Activation link is invalid or has expired.'}, status=status.HTTP_400_BAD_REQUEST)



# Create your views here.
class loginview(APIView):
    renderer_classes = [AccountErrorRenderer]
    def post(self, request):
        serializer=loginserializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email=serializer.validated_data.get('email')
            password=serializer.validated_data.get('password')
            user=authenticate(email=email, password=password)
            if user is None:
                return Response({'msg':'invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                update_last_login(None, user)
                token=get_tokens_for_user(user)
                return Response({'msg':'login successful', 'token': token}, status=status.HTTP_200_OK)

        return Response({'msg':'login failed'}, status=status.HTTP_400_BAD_REQUEST)


class RefreshTokenView(SimpleJWTTokenRefreshView):
    permission_classes = [AllowAny]
    authentication_classes = []
    renderer_classes = [AccountErrorRenderer]
    
class welcomeview(APIView):
    renderer_classes = [AccountErrorRenderer]
    permission_classes = [IsAuthenticated]
    def get (self, request):
        serializer=welcomeSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
     
class logoutview(APIView):
    renderer_classes = [AccountErrorRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            refreshtoken=request.data.get('refresh')
            token=RefreshToken(refreshtoken)
            token.blacklist()
            return Response({'msg':'logout successful'}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'msg':'logout failed'}, status=status.HTTP_400_BAD_REQUEST)



class changepasswordview(APIView):
    renderer_classes = [AccountErrorRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'user': request.user})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'msg':'password changed successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class passwordchangelink(APIView):
    renderer_classes = [AccountErrorRenderer]
    def post(self, request):
        serializer=linkserializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
           return Response({'msg':'password change link sent to your email'}, status=status.HTTP_200_OK)
        

class resetpasswordview(APIView):
    renderer_classes = [AccountErrorRenderer]
    def post(self,request,uid,token):
        serializer= resetpasswordserializer(data=request.data, context={'uid':uid, 'token':token})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'password reset successful'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoogleLoginView(APIView):
    renderer_classes = [AccountErrorRenderer]
    permission_classes = [AllowAny]

    def post(self, request):
        google_token = request.data.get("token")

        if not google_token:
            return Response(
                {"msg": "Google token is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Verify the token received from Google
            idinfo = id_token.verify_oauth2_token(
                google_token,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            email = idinfo.get("email")
            full_name = idinfo.get("name", "")
            google_id = idinfo.get("sub")

            if not email or not google_id:
                return Response(
                    {"msg": "Google account did not provide required identity details"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Extra security check
            if not idinfo.get("email_verified"):
                return Response(
                    {"msg": "Google email is not verified"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check whether the user already exists
            try:
                user_obj = user.objects.get(email=email)

            except user.DoesNotExist:
                # Generate a random password because
                # Google users will not log in using a password
                random_password = secrets.token_urlsafe(32)

                user_obj = user.objects.create_user(
                    email=email,
                    full_name=full_name or email.split("@")[0],
                    tc=True,
                    password=random_password,
                )

                # Google authentication already verified the identity
                user_obj.is_active = True

            # Keep the verified Google subject ID on the local user record.
            user_obj.google_id = google_id
            user_obj.save()

            # Generate the SAME SimpleJWT tokens
            token = get_tokens_for_user(user_obj)

            return Response(
                {
                    "msg": "Google login successful",
                    "token": token,
                    "user": {
                        "id": user_obj.id,
                        "email": user_obj.email,
                        "full_name": user_obj.full_name,
                        "google_id": google_id,
                    }
                },
                status=status.HTTP_200_OK
            )

        except ValueError:
            return Response(
                {"msg": "Invalid or expired Google token"},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            print("Google Login Error:", str(e))

            return Response(
                {"msg": "Google login failed"},
                status=status.HTTP_400_BAD_REQUEST
            )


class FeaturesView(APIView):
    renderer_classes = [AccountErrorRenderer]
    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get("category")
        query = request.query_params.get("q")
        location = request.query_params.get("location")

        features = Features.objects.annotate(
            avg_rating=Avg('reviews__rating')
        ).order_by('-avg_rating', 'name')

        # Filter by exact category
        if category:
            features = features.filter(category__iexact=category)

        # Search service
        if query:
            features = features.filter(
                Q(name__icontains=query)
                | Q(category__icontains=query)
                | Q(description__icontains=query)
            )

        # Filter by location
        if location:
            features = features.filter(
                location__icontains=location
            )

        serializer = FeaturesSerializer(features, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class LocationsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        locations = (
            Features.objects
            .exclude(location__isnull=True)
            .exclude(location__exact="")
            .values_list("location", flat=True)
            .distinct()
            .order_by("location")
        )

        return Response(list(locations), status=status.HTTP_200_OK)


class ReviewsView(APIView):
    renderer_classes = [AccountErrorRenderer]

    def get_feature(self, feature_id):
        try:
            return Features.objects.get(pk=feature_id)
        except Features.DoesNotExist:
            return None

    def get(self, request, feature_id):
        feature = self.get_feature(feature_id)
        if feature is None:
            return Response({'detail': 'Professional not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response(ReviewSerializer(feature.reviews.all(), many=True).data)

    def post(self, request, feature_id):
        feature = self.get_feature(feature_id)
        if feature is None:
            return Response({'detail': 'Professional not found.'}, status=status.HTTP_404_NOT_FOUND)
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication is required to review a professional.'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = ReviewCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review, _ = Review.objects.update_or_create(
            user=request.user,
            feature=feature,
            defaults=serializer.validated_data,
        )
        return Response({
            'review': ReviewSerializer(review).data,
            'rating': feature.average_rating(),
            'review_count': feature.reviews.count(),
        }, status=status.HTTP_200_OK)