from django.urls import path
from . import views

app_name = 'scholarships'

urlpatterns = [
    # Scholarship endpoints
    path('list', views.scholarship_list, name='scholarship-list'),
    path('<uuid:pk>/', views.scholarship_detail, name='scholarship-detail'),
    
    # Application endpoints
    path('applications/', views.application_list, name='application-list'),
    path('applications/<uuid:pk>/', views.application_detail, name='application-detail'),
    path('applications/<uuid:pk>/approve/', views.approve_application, name='approve-application'),
    path('<uuid:scholarship_id>/apply/', views.apply_for_scholarship, name='apply-for-scholarship'),
]
