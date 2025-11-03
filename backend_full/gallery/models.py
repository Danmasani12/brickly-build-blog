from django.db import models

class GalleryPost(models.Model):
    CATEGORY_CHOICES = [
        ('residential', 'Residential'),
        ('commercial', 'Commercial'),
        ('renovation', 'Renovation'),
    ]

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class GalleryImage(models.Model):
    post = models.ForeignKey(GalleryPost, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='gallery_images/')

    def __str__(self):
        return f'Image for {self.post.title}'
