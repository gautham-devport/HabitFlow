from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/aicoach/', include('aicoach.urls')),
    path("api/users/", include("users.urls")),
    path('api/', include('habits.urls')),
    
]
