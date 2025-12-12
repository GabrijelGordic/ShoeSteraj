from django.db import models
from django.contrib.auth.models import User


class Shoe(models.Model):
    CONDITION_CHOICES = (
        ('New', 'New'),
        ('Used', 'Used'),
    )

    # Link to the User who is selling the shoe
    seller = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='shoes')

    title = models.CharField(max_length=100)
    brand = models.CharField(max_length=50)
    # Allows sizes like 10.5
    size = models.DecimalField(max_digits=4, decimal_places=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    condition = models.CharField(
        max_length=10, choices=CONDITION_CHOICES, default='New')
    description = models.TextField(blank=True)

    # Image of the shoe
    image = models.ImageField(upload_to='shoe_images/')

    # Status (so we can hide sold items later)
    is_sold = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.brand})"


# NEW MODEL FOR GALLERY
class ShoeImage(models.Model):
    shoe = models.ForeignKey(
        Shoe, on_delete=models.CASCADE, related_name='gallery')
    image = models.ImageField(upload_to='shoe_gallery/')

    def __str__(self):
        return f"Image for {self.shoe.title}"
