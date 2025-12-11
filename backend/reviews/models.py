from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
    seller = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='received_reviews')
    reviewer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='given_reviews')

    # Rating 1 to 5
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Prevent a user from reviewing the same seller twice
        unique_together = ('seller', 'reviewer')

    def __str__(self):
        return f"{self.rating} Stars for {self.seller.username} by {self.reviewer.username}"
