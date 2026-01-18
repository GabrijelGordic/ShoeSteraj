from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    reviewer_username = serializers.ReadOnlyField(source='reviewer.username')
    # write_only means we receive it, but don't send it back
    seller_username = serializers.CharField(write_only=True) 

    class Meta:
        model = Review
        fields = ['id', 'seller', 'reviewer', 'reviewer_username', 'seller_username', 
                  'rating', 'comment', 'created_at']
        read_only_fields = ['reviewer', 'seller']

    def validate(self, data):
        request = self.context.get('request')
        # Safety check if request is missing
        if not request or not hasattr(request, 'user'):
            raise serializers.ValidationError("Authentication required.")
            
        user = request.user
        
        # 1. Resolve seller_username to actual User object
        seller_username = data.get('seller_username')
        try:
            seller = User.objects.get(username=seller_username)
        except User.DoesNotExist:
            raise serializers.ValidationError({"seller_username": "Seller not found."})

        # 2. Check: Self-review (Compare IDs to be safe)
        if seller.pk == user.pk:
            raise serializers.ValidationError("You cannot review your own profile.")

        # 3. Check: Duplicate Review
        if Review.objects.filter(reviewer=user, seller=seller).exists():
            raise serializers.ValidationError("You have already reviewed this seller.")

        # Store seller object for create()
        data['seller'] = seller
        return data

    def create(self, validated_data):
        # Remove helper field
        validated_data.pop('seller_username', None)
        # Note: 'reviewer' comes from perform_create in views.py
        return Review.objects.create(**validated_data)