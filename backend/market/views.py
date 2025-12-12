from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Shoe, ShoeImage
from .serializers import ShoeSerializer
from .permissions import IsSellerOrReadOnly


class ShoeViewSet(viewsets.ModelViewSet):
    queryset = Shoe.objects.all().order_by('-created_at')
    serializer_class = ShoeSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly, IsSellerOrReadOnly]

    # Search & Filter Configuration
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['brand', 'size', 'condition', 'seller__username']
    search_fields = ['title', 'description', 'brand']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 1. Save the Shoe first
        shoe = serializer.save(seller=self.request.user)

        # 2. Handle Gallery Images (if any)
        # Frontend sends 'gallery_images' as a list of files
        images = request.FILES.getlist('gallery_images')

        for img in images:
            ShoeImage.objects.create(shoe=shoe, image=img)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
