from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns
from .views import ShoeViewSet, sitemap_view


class NoFormatSuffixRouter(DefaultRouter):
    def get_urls(self):
        urls = super().get_urls()
        # Don't apply format_suffix_patterns
        return urls


router = NoFormatSuffixRouter()
router.register(r'shoes', ShoeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('sitemap.xml', sitemap_view, name='sitemap'),
]
