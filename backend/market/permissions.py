from rest_framework import permissions


class IsSellerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the seller of the shoe
        return obj.seller == request.user
