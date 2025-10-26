from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('django/', admin.site.urls),
    path('api/', include('test_app.urls')),
    path('api/scholarships/', include('scholarships.urls')),
]
