from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "phone", "created_at", "is_read")
    list_filter = ("is_read", "created_at")
    search_fields = ("name", "email", "subject", "message", "phone")
    ordering = ("-created_at",)
    readonly_fields = ("name", "email", "phone", "subject", "message", "created_at")

    fieldsets = (
        ("Sender Information", {
            "fields": ("name", "email", "phone"),
        }),
        ("Message Details", {
            "fields": ("subject", "message"),
        }),
        ("Status & Metadata", {
            "fields": ("is_read", "created_at"),
        }),
    )

    def has_add_permission(self, request):
        # Prevent adding messages manually in the admin
        return False
