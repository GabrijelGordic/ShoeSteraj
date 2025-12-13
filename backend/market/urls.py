from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShoeViewSet, sitemap_view

router = DefaultRouter()
router.register(r'shoes', ShoeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('sitemap.xml', sitemap_view, name='sitemap'),
]
