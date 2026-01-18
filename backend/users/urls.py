from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, emergency_delete_view, ManageProfileView

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet)

urlpatterns = [
    # 1. Specific paths should ideally go ABOVE the router to prevent conflicts
    path('delete-emergency/<str:token>/', emergency_delete_view, name='emergency-delete'),
    
    # CHANGE THIS LINE: Remove "api/" from the start
    path('manage-profile/', ManageProfileView.as_view(), name='manage-profile'),

    # 2. Router includes go last
    path('', include(router.urls)),
]