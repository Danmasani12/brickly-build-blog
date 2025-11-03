from django.urls import path
from .views import RealtyPostListView, RealtyPostDetailView

urlpatterns = [
    path('', RealtyPostListView.as_view(), name='realty-list'),
    path('<int:pk>/', RealtyPostDetailView.as_view(), name='realty-detail'),
]
