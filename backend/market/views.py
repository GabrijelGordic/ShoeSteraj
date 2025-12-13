from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
import django_filters
from .models import Shoe, ShoeImage
from .serializers import ShoeSerializer
from .permissions import IsSellerOrReadOnly

# 1. Custom Filter Class for Ranges (Min/Max Price)


class ShoeFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(
        field_name="price", lookup_expr='gte')  # Greater than or equal
    max_price = django_filters.NumberFilter(
        field_name="price", lookup_expr='lte')  # Less than or equal
    # Case-insensitive partial match
    brand = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Shoe
        fields = ['brand', 'size', 'condition',
                  'seller__username', 'min_price', 'max_price']


class ShoeViewSet(viewsets.ModelViewSet):
    queryset = Shoe.objects.all().order_by('-created_at')
    serializer_class = ShoeSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly, IsSellerOrReadOnly]

    # 2. Add OrderingFilter to the backends
    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]

    # Connect the custom filter class
    filterset_class = ShoeFilter

    # Search is for text fields
    search_fields = ['title', 'description', 'brand']

    # 3. Allow sorting by Price and Date
    ordering_fields = ['price', 'created_at']

    # Custom Pagination (Keep existing if you put it in a separate file,
    # otherwise paste the class StandardResultsSetPagination here if it was in this file)
    # pagination_class = StandardResultsSetPagination (Uncomment if you defined it above)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        shoe = serializer.save(seller=self.request.user)

        images = request.FILES.getlist('gallery_images')
        for img in images:
            ShoeImage.objects.create(shoe=shoe, image=img)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
