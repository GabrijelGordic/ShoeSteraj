from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from django.core.signing import TimestampSigner
from .models import Profile

# 1. Auto-Create Profile (Existing Logic)


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        # We call the email function here to ensure it happens right after creation
        send_welcome_email(instance)


@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()

# 2. Send Welcome/Security Email (New Logic)


def send_welcome_email(user):
    """
    Sends an email ONLY when a new user is registered.
    Contains a 'Kill Switch' link to delete the account if the email was used by mistake.
    """

    # Generate secure token based on User ID
    signer = TimestampSigner()
    token = signer.sign(user.id)

    # Build the link
    # In production, change localhost:8000 to your real backend domain
    delete_link = f"http://shoesteraj.pages.dev/api/delete-emergency/{token}/"

    subject = 'Welcome to Šuzeraj - Account Confirmation'

    message = f"""
    Welcome to Šuzeraj!

    Your account for username "{user.username}" has been successfully created.

    --------------------------------------------------
    YOU DID NOT CREATE THIS ACCOUNT?
    
    If you did not sign up for Šuzeraj, someone may be using your email address without permission.
    Click the link below immediately to DELETE this account:
    
    {delete_link}
    --------------------------------------------------

    If you created this account, you can ignore this warning and log in normally.

    Happy Shopping,
    The Šuzeraj Team
    """

    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        print(f"--- Welcome email sent to {user.email} ---")
    except Exception as e:
        print(f"--- Failed to send email: {e} ---")
