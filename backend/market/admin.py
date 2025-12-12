from django.contrib import admin
from .models import Shoe, ShoeImage

# This allows you to add images directly inside the Shoe page


class ShoeImageInline(admin.TabularInline):
    model = ShoeImage


class ShoeAdmin(admin.ModelAdmin):
    inlines = [ShoeImageInline]
    list_display = ('title', 'brand', 'price', 'seller', 'created_at')


admin.site.register(Shoe, ShoeAdmin)
admin.site.register(ShoeImage)
