from django.contrib import admin
from .models import GalleryPost, GalleryImage


class GalleryImageInline(admin.TabularInline):
    model = GalleryImage
    extra = 1


@admin.register(GalleryPost)
class GalleryPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_at')
    list_filter = ('category',)
    search_fields = ('title', 'description')
    inlines = [GalleryImageInline]


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('post', 'image')
