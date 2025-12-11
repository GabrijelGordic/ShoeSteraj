from rest_framework import viewsets, permissions
from .models import Shoe
from .serializers import ShoeSerializer


class ShoeViewSet(viewsets.ModelViewSet):
    # Get all shoes, newest first
    queryset = Shoe.objects.all().order_by('-created_at')
    serializer_class = ShoeSerializer

    # Logic: Read access (GET) is open to everyone. Write access (POST) needs login.
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # This method runs automatically when saving a new shoe
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
        # Automatically set the seller to the logged-in user
