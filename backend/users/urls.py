from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, emergency_delete_view  # <--- Import it

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Add this line:
    path('delete-emergency/<str:token>/',
         emergency_delete_view, name='emergency-delete'),
]
