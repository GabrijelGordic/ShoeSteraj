from rest_framework import serializers
from .models import Profile
from django.db.models import Avg
from reviews.models import Review

# Helper to show reviews nicely


class SimpleReviewSerializer(serializers.ModelSerializer):
    reviewer_username = serializers.ReadOnlyField(source='reviewer.username')

    class Meta:
        model = Review
        fields = ['reviewer_username', 'rating', 'comment', 'created_at']


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.CharField(source='user.email')

    # Calculated fields
    seller_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    reviews_list = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'user_id', 'username', 'email', 'avatar', 'location',
            'phone_number', 'is_verified', 'seller_rating',
            'review_count', 'reviews_list'
        ]

    def get_seller_rating(self, obj):
        avg = obj.user.received_reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0

    def get_review_count(self, obj):
        return obj.user.received_reviews.count()

    def get_reviews_list(self, obj):
        # Get the last 10 reviews for this user
        reviews = obj.user.received_reviews.all().order_by('-created_at')[:10]
        return SimpleReviewSerializer(reviews, many=True).data
