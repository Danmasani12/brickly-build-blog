from django.contrib import admin
from .models import RealtyPost, RealtyImage, Bedroom

class RealtyImageInline(admin.TabularInline):  # You can use StackedInline for full forms
    model = RealtyImage
    extra = 1

class BedroomInline(admin.TabularInline):
    model = Bedroom
    extra = 1

@admin.register(RealtyPost)
class RealtyPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'category', 'price', 'location', 'created_at')
    search_fields = ('title', 'location', 'category')
    list_filter = ('type', 'category', 'created_at')
    inlines = [RealtyImageInline, BedroomInline]


@admin.register(RealtyImage)
class RealtyImageAdmin(admin.ModelAdmin):
    list_display = ('post', 'image')


@admin.register(Bedroom)
class BedroomAdmin(admin.ModelAdmin):
    list_display = ('post', 'name', 'sqm')
