from rest_framework import serializers
from .models import Shoe


class ShoeSerializer(serializers.ModelSerializer):
    # We want to see the seller's username, not just their ID number
    seller_username = serializers.ReadOnlyField(source='seller.username')

    class Meta:
        model = Shoe
        fields = [
            'id',
            'seller',
            'seller_username',
            'title',
            'brand',
            'price',
            'size',
            'condition',
            'description',
            'image',
            'is_sold',
            'created_at'
        ]
        # The seller cannot be changed by the user manually, it's set automatically
        read_only_fields = ['seller']
