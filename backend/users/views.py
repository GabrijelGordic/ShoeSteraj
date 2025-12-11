from rest_framework import viewsets, permissions
from .models import Profile
from .serializers import ProfileSerializer


class ProfileViewSet(viewsets.ReadOnlyModelViewSet):
    # We want to find profiles based on the 'username' of the user, not the profile ID
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.AllowAny]  # Profiles are public
    # This allows url to be /profiles/gabrijel/ instead of /profiles/1/
    lookup_field = 'user__username'
