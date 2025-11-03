# realty/serializers.py
from rest_framework import serializers
from .models import RealtyPost, RealtyImage, Bedroom
import json

class RealtyImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = RealtyImage
        fields = ['id', 'image', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        elif isinstance(obj.image, str):  # in case URLs are saved directly
            return obj.image
        return None


class BedroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bedroom
        fields = ['id', 'name', 'sqm']


class RealtyPostSerializer(serializers.ModelSerializer):
    images = RealtyImageSerializer(many=True, required=False)
    bedrooms = BedroomSerializer(many=True, required=False)

    class Meta:
        model = RealtyPost
        fields = [
            'id', 'title', 'type', 'category', 'price', 'location',
            'description', 'living_room_sqm', 'kitchen_sqm',
            'images', 'bedrooms', 'created_at', 
        ]

    def _parse_json_field(self, field_name):
        raw_data = self.initial_data.get(field_name)
        if isinstance(raw_data, str):
            try:
                return json.loads(raw_data)
            except json.JSONDecodeError:
                return []
        return self.validated_data.pop(field_name, [])

    def create(self, validated_data):
        bedrooms_data = self._parse_json_field('bedrooms')
        images_data = self._parse_json_field('images')
        post = RealtyPost.objects.create(**validated_data)

        # ✅ Handle multiple uploaded images
        request = self.context.get('request')
        if request and hasattr(request, 'FILES'):
            file_list = request.FILES.getlist('images')
            for file in file_list:
                RealtyImage.objects.create(post=post, image=file)

        # ✅ Handle image URLs (in case sent as JSON)
        for image_data in images_data:
            image_value = image_data.get('image')
            if image_value and isinstance(image_value, str):
                RealtyImage.objects.create(post=post, image=image_value)

        # ✅ Handle bedrooms
        for bedroom_data in bedrooms_data:
            Bedroom.objects.create(post=post, **bedroom_data)

        return post

    def update(self, instance, validated_data):
        bedrooms_data = self._parse_json_field('bedrooms')
        images_data = self._parse_json_field('images')

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Clear old related data
        instance.bedrooms.all().delete()
        instance.images.all().delete()

        request = self.context.get('request')
        if request and hasattr(request, 'FILES'):
            file_list = request.FILES.getlist('images')
            for file in file_list:
                RealtyImage.objects.create(post=instance, image=file)

        for image_data in images_data:
            image_value = image_data.get('image')
            if image_value and isinstance(image_value, str):
                RealtyImage.objects.create(post=instance, image=image_value)

        for bedroom_data in bedrooms_data:
            Bedroom.objects.create(post=instance, **bedroom_data)

        return instance
