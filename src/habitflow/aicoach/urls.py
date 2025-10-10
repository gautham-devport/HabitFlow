# aicoach/urls.py
from django.urls import path
from .views import AICoachView

urlpatterns = [
    path('suggest/', AICoachView.as_view(), name='aicoach-suggest'),
]
