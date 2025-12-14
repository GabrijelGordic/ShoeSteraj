import logging
import threading
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
        from .models import Profile
        Profile.objects.create(user=instance)

        # 2. Trigger the Email in a Background Thread
        email_thread = threading.Thread(
            target=send_welcome_email_thread, args=(instance,))
        email_thread.start()


def send_welcome_email_thread(instance):
    """
    This runs in the background. If it takes 10 seconds, 
    it won't stop the user from logging in.
    """
    subject = "Welcome to Šuzeraj!"
    message = f"Hi {instance.username},\n\nWelcome to the marketplace! We are glad to have you."

    try:
        print(f"Starting email send to {instance.email}...")
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [instance.email],
            fail_silently=False,
        )
        print(f"SUCCESS: Email sent to {instance.email}")
    except Exception as e:
        # If this fails, it prints to logs, but the User is already safely registered.
        print(f"ERROR: Failed to send email to {instance.email}. Reason: {e}")
