# realty/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import RealtyPost
from .serializers import RealtyPostSerializer

class RealtyPostListView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = RealtyPost.objects.prefetch_related('images', 'bedrooms').all()
    serializer_class = RealtyPostSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context=self.get_serializer_context()
        )
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class RealtyPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RealtyPost.objects.prefetch_related('images', 'bedrooms').all()
    serializer_class = RealtyPostSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"detail": "Post deleted successfully!"}, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial,
            context=self.get_serializer_context()
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {"detail": "Post updated successfully!", "data": serializer.data},
            status=status.HTTP_200_OK
        )
