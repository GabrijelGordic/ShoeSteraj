from rest_framework import viewsets
from .models import Profile
from .serializers import ProfileSerializer
from .permissions import IsOwnerOrReadOnly

# CRITICAL: Must be ModelViewSet (allows editing), NOT ReadOnlyModelViewSet


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]
    lookup_field = 'user__username'

    # We explicitly allow 'patch' here so the frontend can update data
    http_method_names = ['get', 'patch', 'head', 'options']
