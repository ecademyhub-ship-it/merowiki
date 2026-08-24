from django.urls import path, include
from core.views import UserView, loginview, welcomeview, changepasswordview, passwordchangelink, resetpasswordview, logoutview, ActivateAccountView,FeaturesView,ReviewsView

urlpatterns = [
    path("register/", UserView.as_view(), name="register"),
    path("login/", loginview.as_view(), name="login"),
    path("welcome/", welcomeview.as_view(), name="welcome"),
    path("logout/", logoutview.as_view(), name="logout"),
    path("change_password/", changepasswordview.as_view(), name="changepassword"),
    path("reset/", passwordchangelink.as_view(), name='password_reset'),
    path('pass_reset/<uid>/<token>/', resetpasswordview.as_view(), name='password_reset_confirm'),
    path('activate/<uidb64>/<token>/', ActivateAccountView.as_view(), name='activate'),
    path("features/",FeaturesView.as_view(),name = "features"),
    path("features/<int:feature_id>/reviews/", ReviewsView.as_view(), name="feature-reviews")
]