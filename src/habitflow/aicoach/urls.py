# aicoach/urls.py
from django.urls import path
from .views import AICoachView, AIRoutineView

urlpatterns = [
    path('suggest/', AICoachView.as_view(), name='aicoach-suggest'),
    path('routine/', AIRoutineView.as_view(), name='aicoach-routine'),
]
