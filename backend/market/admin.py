from django.contrib import admin
from .models import Shoe, ShoeImage


class ShoeImageInline(admin.TabularInline):
    model = ShoeImage


class ShoeAdmin(admin.ModelAdmin):
    inlines = [ShoeImageInline]


admin.site.register(Shoe, ShoeAdmin)
admin.site.register(ShoeImage)
