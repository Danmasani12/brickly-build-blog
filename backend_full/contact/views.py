from rest_framework import generics, status
from rest_framework.response import Response
from django.core.mail import send_mail
from .models import ContactMessage
from .serializers import ContactMessageSerializer
from django.conf import settings


class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def perform_create(self, serializer):
        message = serializer.save()

        # Send email notification to admin
        subject = f"New Contact Message from {message.name}"
        body = (
            f"Name: {message.name}\n"
            f"Email: {message.email}\n"
            f"Phone: {message.phone or 'N/A'}\n"
            f"Subject: {message.subject}\n\n"
            f"Message:\n{message.message}"
        )

        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=["danmasani12@gmail.com"],  # admin email
            fail_silently=False,
        )

        # ✅ Send automatic reply to user
        auto_subject = "We’ve received your message"
        auto_body = (
            f"Hello {message.name},\n\n"
            "Thank you for reaching out to us. "
            "We’ve received your message and our team will get back to you soon.\n\n"
            "Here’s a copy of your message:\n"
            f"Subject: {message.subject}\n"
            f"Message: {message.message}\n\n"
            "Best regards,\n"
            "Lion Cage Construction Team\n"
            "Wuse Zone 4, Abuja, Nigeria"
        )

        send_mail(
            subject=auto_subject,
            message=auto_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[message.email],
            fail_silently=False,
        )
