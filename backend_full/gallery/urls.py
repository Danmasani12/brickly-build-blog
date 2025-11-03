from django.urls import path
from .views import GalleryPostListView, GalleryPostDetailView

urlpatterns = [
    path('', GalleryPostListView.as_view(), name='gallery-list'),
    path('<int:pk>/', GalleryPostDetailView.as_view(), name='gallery-detail'),
]
