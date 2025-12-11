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
        # Check: Is the user trying to review themselves?
        # Note: We access the user from the context request because 'reviewer' isn't saved yet
        user = self.context['request'].user
        if data['seller'] == user:
            raise serializers.ValidationError(
                "You cannot review your own profile.")
        return data
