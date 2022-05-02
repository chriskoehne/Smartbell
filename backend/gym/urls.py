from . import views
from django.urls import path, include
from django.contrib import admin
from rest_framework import routers
from .viewsets import *


admin.autodiscover()

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'members', MemberViewSet)
router.register(r'memberships', MembershipViewSet)
router.register(r'equipment', EquipmentViewSet)
router.register(r'service_history', ServiceHistoryViewset)
router.register(r'gym_classes', GymClassViewset)
router.register(r'attendance', GymClassAttendanceViewset)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='api_auth')),
    path('hello/', views.hello, name='hello'),
]
