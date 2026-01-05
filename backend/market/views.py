from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from rest_framework.views import APIView # <--- Added for AI View
from rest_framework.parsers import MultiPartParser, FormParser # <--- Added for Image Upload
from django_filters.rest_framework import DjangoFilterBackend
import django_filters
from django.http import HttpResponse

# Imports from your app
from .models import Shoe, ShoeImage, Wishlist
from .serializers import ShoeSerializer
from .permissions import IsSellerOrReadOnly
from .ai_utils import analyze_shoe_image # <--- Your new AI function

# --- Custom Filter Class ---
class ShoeFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    brand = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Shoe
        fields = ['brand', 'size', 'condition', 'seller__username', 'min_price', 'max_price']

# --- AI ANALYSIS VIEW ---
class AnalyzeShoeView(APIView):
    """
    Receives an image, sends it to Google Gemini, and returns shoe details (Brand, Model, etc.)
    """
    parser_classes = (MultiPartParser, FormParser) # Required for handling image uploads

    def post(self, request, *args, **kwargs):
        if 'image' not in request.data:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

        image_file = request.data['image']
        
        # Send to Gemini (defined in ai_utils.py)
        analysis_result = analyze_shoe_image(image_file)
        
        if "error" in analysis_result:
            return Response(analysis_result, status=status.HTTP_400_BAD_REQUEST)
            
        return Response(analysis_result, status=status.HTTP_200_OK)

class ShoeViewSet(viewsets.ModelViewSet):
    queryset = Shoe.objects.all().order_by('-created_at')
    serializer_class = ShoeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsSellerOrReadOnly]

    # Filters & Search
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ShoeFilter
    search_fields = ['title', 'description', 'brand']
    ordering_fields = ['price', 'created_at', 'views']

    # --- VIEW COUNT LOGIC ---
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.seller != request.user:
            instance.views += 1
            instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # --- WISHLIST: TOGGLE LIKE ---
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_wishlist(self, request, pk=None):
        shoe = self.get_object()
        user = request.user

        if shoe.seller == user:
            return Response(
                {'error': 'You cannot add your own item to the wishlist.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        wishlist_item, created = Wishlist.objects.get_or_create(user=user, shoe=shoe)

        if not created:
            wishlist_item.delete()
            return Response({'status': 'removed', 'is_liked': False}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'added', 'is_liked': True}, status=status.HTTP_201_CREATED)

    # --- WISHLIST: GET FAVORITES ---
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def favorites(self, request):
        user = request.user
        favorites = Shoe.objects.filter(wishlisted_by__user=user).order_by('-created_at')
        
        page = self.paginate_queryset(favorites)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(favorites, many=True)
        return Response(serializer.data)

    # --- CREATE LOGIC ---
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        shoe = serializer.save(seller=self.request.user)

        images = request.FILES.getlist('uploaded_images')
        for img in images:
            ShoeImage.objects.create(shoe=shoe, image=img)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


# --- SEO Sitemap ---
@api_view(['GET'])
def sitemap_view(request):
    """Generate XML sitemap for all shoe listings"""
    shoes = Shoe.objects.all().order_by('-created_at')
    base_url = f"{request.scheme}://{request.get_host()}"

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        f'  <url><loc>{base_url}/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>',
    ]

    for shoe in shoes:
        xml_lines.append(
            f'  <url>'
            f'<loc>{base_url}/shoes/{shoe.id}</loc>'
            f'<lastmod>{shoe.created_at.strftime("%Y-%m-%d")}</lastmod>'
            f'<priority>0.8</priority>'
            f'<changefreq>weekly</changefreq>'
            f'</url>'
        )

    xml_lines.append('</urlset>')
    return HttpResponse('\n'.join(xml_lines), content_type='application/xml')