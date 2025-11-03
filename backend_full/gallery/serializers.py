from rest_framework import serializers
from .models import GalleryPost, GalleryImage


class GalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = GalleryImage
        fields = ['id', 'image', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class GalleryPostSerializer(serializers.ModelSerializer):
    images = GalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = GalleryPost
        fields = ['id', 'title', 'category', 'description', 'created_at', 'images']

    def create(self, validated_data):
        request = self.context.get('request')
        images = request.FILES.getlist('images')
        post = GalleryPost.objects.create(**validated_data)

        for image in images:
            GalleryImage.objects.create(post=post, image=image)

        return post

    def update(self, instance, validated_data):
        request = self.context.get('request')
        images = request.FILES.getlist('images')

        instance.title = validated_data.get('title', instance.title)
        instance.category = validated_data.get('category', instance.category)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        # ✅ Only replace images if new ones are provided
        if images:
            instance.images.all().delete()
            for image in images:
                GalleryImage.objects.create(post=instance, image=image)

        return instance
