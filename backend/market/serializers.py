from rest_framework import serializers
from .models import Shoe, ShoeImage, Wishlist
from django.db.models import Avg

# 1. Serializer for the Gallery Images
class ShoeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoeImage
        fields = ['id', 'image']

# 2. Main Shoe Serializer
class ShoeSerializer(serializers.ModelSerializer):
    seller_username = serializers.ReadOnlyField(source='seller.username')
    
    # Fetches the phone number from the User's Profile
    seller_phone = serializers.ReadOnlyField(source='seller.profile.phone_number')

    # Calculated fields
    seller_rating = serializers.SerializerMethodField()
    views = serializers.ReadOnlyField() 
    is_liked = serializers.SerializerMethodField()

    # Read-only nested images (for display)
    images = ShoeImageSerializer(source='gallery', many=True, read_only=True)

    # --- NEW: Write-only field for uploading multiple images ---
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    # -----------------------------------------------------------

    class Meta:
        model = Shoe
        fields = [
            'id',
            'seller',
            'seller_username',
            'seller_phone',
            'seller_rating',
            'title',
            'brand',
            'price',
            'currency',
            'size',
            'condition',
            'description',
            'image',        
            'images',
            'uploaded_images', # <--- Add the new field here
            'contact_info',
            'is_sold',
            'created_at',
            'views',
            'is_liked'
        ]
        read_only_fields = ['seller', 'views', 'is_liked']

    def get_seller_rating(self, obj):
        avg = obj.seller.received_reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Wishlist.objects.filter(user=request.user, shoe=obj).exists()
        return False 

    # --- NEW: Custom Create Method to save gallery images ---
    def create(self, validated_data):
        # 1. Pop the uploaded_images list so it doesn't crash the Shoe creation
        uploaded_images = validated_data.pop('uploaded_images', [])
        
        # 2. Create the main Shoe instance
        shoe = Shoe.objects.create(**validated_data)

        # 3. Create ShoeImage objects for the gallery
        for image in uploaded_images:
            ShoeImage.objects.create(shoe=shoe, image=image)

        return shoe