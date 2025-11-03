from django.urls import path
from .views import (
    AdminLoginView,
    AdminMeView,
    AdminListView,
    AdminCreateView,
    AdminDeleteView,
)

urlpatterns = [
    path("login/", AdminLoginView.as_view(), name="admin-login"),
    path("me/", AdminMeView.as_view(), name="admin-me"),
    path("users/", AdminListView.as_view(), name="admin-list"),
    path("create/", AdminCreateView.as_view(), name="admin-create"),
    path("delete/<int:pk>/", AdminDeleteView.as_view(), name="admin-delete"),
]
