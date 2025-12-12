from rest_framework import serializers
from .models import Shoe, ShoeImage


class ShoeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoeImage
        fields = ['id', 'image']


class ShoeSerializer(serializers.ModelSerializer):
    seller_username = serializers.ReadOnlyField(source='seller.username')
    seller_rating = serializers.SerializerMethodField()
    # Add the gallery
    gallery = ShoeImageSerializer(many=True, read_only=True)

    class Meta:
        model = Shoe
        fields = [
            'id', 'seller', 'seller_username', 'seller_rating',
            'title', 'brand', 'price', 'size', 'condition',
            'description', 'image', 'gallery', 'contact_info', 'is_sold', 'created_at'
        ]
        read_only_fields = ['seller']

    # Fetch the seller's rating to display on the Shoe Page
    def get_seller_rating(self, obj):
        from django.db.models import Avg
        avg = obj.seller.received_reviews.aggregate(Avg('rating'))[
            'rating__avg']
        return round(avg, 1) if avg else 0
