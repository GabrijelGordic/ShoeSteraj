import logging
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()
logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        # 1. Create the profile
        from .models import Profile  # Local import to avoid circular dependency
        Profile.objects.create(user=instance)

        # 2. Send Welcome Email (Safely)
        send_welcome_email(instance)


def send_welcome_email(instance):
    subject = "Welcome to Šuzeraj!"
    message = f"Hi {instance.username},\n\nWelcome to the marketplace! We are glad to have you."

    try:
        # Use fail_silently=False to raise error if it fails,
        # but we catch it immediately in the except block.
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [instance.email],
            fail_silently=False,
        )
        print(f"Email sent successfully to {instance.email}")
    except Exception as e:
        # THIS IS THE FIX: We catch the error, log it, but DO NOT crash the server.
        # The user will still be registered successfully.
        print(f"WARNING: Email failed to send. Error: {e}")
