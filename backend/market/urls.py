from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShoeViewSet, AnalyzeShoeView, sitemap_view # <--- Added AnalyzeShoeView

class NoFormatSuffixRouter(DefaultRouter):
    def get_urls(self):
        urls = super().get_urls()
        return urls

router = NoFormatSuffixRouter()
router.register(r'shoes', ShoeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # New AI Endpoint
    path('analyze-shoe/', AnalyzeShoeView.as_view(), name='analyze-shoe'),
    path('sitemap.xml', sitemap_view, name='sitemap'),
]