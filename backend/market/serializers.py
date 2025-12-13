from rest_framework import serializers
from .models import Shoe, ShoeImage
from django.db.models import Avg

# 1. Serializer for the Gallery Images


class ShoeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoeImage
        fields = ['id', 'image']

# 2. Main Shoe Serializer


class ShoeSerializer(serializers.ModelSerializer):
    seller_username = serializers.ReadOnlyField(source='seller.username')

    # Calculated fields
    seller_rating = serializers.SerializerMethodField()

    # This is the new part: Fetch the gallery images
    gallery = ShoeImageSerializer(many=True, read_only=True)

    class Meta:
        model = Shoe
        fields = [
            'id',
            'seller',
            'seller_username',
            'seller_rating',
            'title',
            'brand',
            'price',
            'currency',
            'size',
            'condition',
            'description',
            'image',        # The main cover image
            'gallery',      # The extra images
            'contact_info',
            'is_sold',
            'created_at'
        ]
        read_only_fields = ['seller']

    def get_seller_rating(self, obj):
        # Calculate average rating of the seller
        avg = obj.seller.received_reviews.aggregate(Avg('rating'))[
            'rating__avg']
        return round(avg, 1) if avg else 0
