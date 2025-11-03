from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

class AdminManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "admin")
        return self.create_user(email, password, **extra_fields)

class Admin(AbstractBaseUser, PermissionsMixin):
    username = None  # 🚀 Important: remove Django’s default username field

    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("moderator", "Moderator"),
        ("user", "User"),
    )

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = AdminManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # no username required

    def __str__(self):
        return f"{self.email} ({self.role})"
