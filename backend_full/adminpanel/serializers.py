from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Admin


class AdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=6)

    class Meta:
        model = Admin
        fields = ["id", "email", "password", "role", "is_active", "is_staff"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        admin = Admin.objects.create(**validated_data)
        admin.set_password(password)
        admin.save()
        return admin


class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise serializers.ValidationError("Both email and password are required.")

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        data["user"] = user
        return data
