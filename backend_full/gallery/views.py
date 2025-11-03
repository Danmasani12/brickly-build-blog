from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import GalleryPost
from .serializers import GalleryPostSerializer


class GalleryPostListView(generics.ListCreateAPIView):
    queryset = GalleryPost.objects.prefetch_related('images').order_by('-created_at')
    serializer_class = GalleryPostSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_context(self):
        return {'request': self.request}

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post = serializer.save()
        headers = self.get_success_headers(serializer.data)
        response_serializer = self.get_serializer(post)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class GalleryPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GalleryPost.objects.prefetch_related('images').all()
    serializer_class = GalleryPostSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_context(self):
        return {'request': self.request}

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"detail": "Gallery post deleted successfully!"}, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        post = serializer.save()
        response_serializer = self.get_serializer(post)
        return Response(
            {"detail": "Gallery post updated successfully!", "data": response_serializer.data},
            status=status.HTTP_200_OK
        )
