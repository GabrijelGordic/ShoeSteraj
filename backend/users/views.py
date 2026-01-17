from rest_framework import viewsets
from .models import Profile
from .serializers import ProfileSerializer
from .permissions import IsOwnerOrReadOnly
from django.http import HttpResponse
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from .serializers import ManageProfileSerializer
# CRITICAL: Must be ModelViewSet (allows editing), NOT ReadOnlyModelViewSet


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]
    lookup_field = 'user__username'

    # We explicitly allow 'patch' here so the frontend can update data
    http_method_names = ['get', 'patch', 'head', 'options']


@api_view(['GET'])
@permission_classes([AllowAny])
def emergency_delete_view(request, token):
    signer = TimestampSigner()
    try:
        # 1. Check if token is valid and less than 24 hours old
        user_id = signer.unsign(token, max_age=60 * 60 * 24)

        # 2. Find and Delete User
        user = User.objects.get(id=user_id)
        email = user.email
        user.delete()

        return HttpResponse(f"""
            <div style='font-family: sans-serif; text-align: center; padding: 50px;'>
                <h1 style='color: red;'>Account Deleted</h1>
                <p>The account associated with {email} has been permanently deleted.</p>
                <p>You are safe.</p>
            </div>
        """)

    except (BadSignature, SignatureExpired, User.DoesNotExist):
        return HttpResponse("<h1>Invalid or Expired Link</h1>", status=400)
class ManageProfileView(APIView):
    # Ensures only logged-in users can access
    permission_classes = [IsAuthenticated]
    # Required to handle Image Uploads
    parser_classes = [MultiPartParser, FormParser] 

    def get(self, request):
        # Find profile for current user, create if missing (safety)
        profile, created = Profile.objects.get_or_create(user=request.user)
        serializer = ManageProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        # partial=True allows updating just one field (e.g., just bio)
        serializer = ManageProfileSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=400)