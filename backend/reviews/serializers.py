from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    reviewer_username = serializers.ReadOnlyField(source='reviewer.username')

    class Meta:
        model = Review
        fields = ['id', 'seller', 'reviewer', 'reviewer_username',
                  'rating', 'comment', 'created_at']
        read_only_fields = ['reviewer']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        seller = data['seller']

        # Check 1: Self-review
        if seller == user:
            raise serializers.ValidationError(
                "You cannot review your own profile.")

        # Check 2: Duplicate Review (The Fix for your Error)
        # Check if this user has already reviewed this seller
        # We use .exists() which is very fast
        if Review.objects.filter(reviewer=user, seller=seller).exists():
            raise serializers.ValidationError(
                "You have already reviewed this seller.")

        return data
