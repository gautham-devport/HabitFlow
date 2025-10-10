from django.urls import path
from .views import GoogleLoginView, ProfileView

urlpatterns = [
    path("google-login/", GoogleLoginView.as_view(), name="google-login"),
    path("profile/", ProfileView.as_view(), name="profile"),
]
