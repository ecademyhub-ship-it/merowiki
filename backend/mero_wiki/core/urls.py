from django.urls import path, include
from core.views import UserView, loginview, welcomeview, changepasswordview, passwordchangelink, resetpasswordview, logoutview, ActivateAccountView,FeaturesView,ReviewsView,GoogleLoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", UserView.as_view(), name="register"),
    path("login/", loginview.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("welcome/", welcomeview.as_view(), name="welcome"),
    path("google-login/", GoogleLoginView.as_view(), name="google-login"),
    path("logout/", logoutview.as_view(), name="logout"),
    path("change_password/", changepasswordview.as_view(), name="changepassword"),
    path("reset/", passwordchangelink.as_view(), name='password_reset'),
    path('pass_reset/<uid>/<token>/', resetpasswordview.as_view(), name='password_reset_confirm'),
    path('activate/<uidb64>/<token>/', ActivateAccountView.as_view(), name='activate'),
    path("features/",FeaturesView.as_view(),name = "features"),
    path("features/<int:feature_id>/reviews/", ReviewsView.as_view(), name="feature-reviews")
    
]