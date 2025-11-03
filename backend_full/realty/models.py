from django.db import models

class RealtyPost(models.Model):
    PROPERTY_TYPE_CHOICES = [
        ('sale', 'For Sale'),
        ('lease', 'For Lease'),
    ]

    title = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=PROPERTY_TYPE_CHOICES)
    category = models.CharField(max_length=100, blank=True)
    price = models.CharField(max_length=100)
    location = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    living_room_sqm = models.FloatField(null=True, blank=True)
    kitchen_sqm = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class RealtyImage(models.Model):
    post = models.ForeignKey(RealtyPost, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='realty_images/')

    def __str__(self):
        return f'Image for {self.post.title}'


class Bedroom(models.Model):
    post = models.ForeignKey(RealtyPost, related_name='bedrooms', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    sqm = models.FloatField()

    def __str__(self):
        return f"{self.name} - {self.post.title}"
