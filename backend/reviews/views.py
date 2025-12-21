from rest_framework import viewsets, permissions
from .models import Review
from .serializers import ReviewSerializer

# --- CUSTOM PERMISSION ---
# This ensures only the author of the review can edit/delete it.
class IsReviewerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the owner of the review
        return obj.reviewer == request.user


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    
    # Use the custom permission defined above
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsReviewerOrReadOnly]

    def perform_create(self, serializer):
        # Automatically set the reviewer to the current logged-in user
        serializer.save(reviewer=self.request.user)