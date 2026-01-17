from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, emergency_delete_view, ManageProfileView

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Add this line:
    path('delete-emergency/<str:token>/',
         emergency_delete_view, name='emergency-delete'),
     path('api/manage-profile/', ManageProfileView.as_view(), name='manage-profile'),
]
