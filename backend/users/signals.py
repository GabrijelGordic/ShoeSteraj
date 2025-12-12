from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile
from django.contrib.auth.signals import user_logged_in
from django.core.mail import send_mail
from django.conf import settings


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()


@receiver(user_logged_in)
def send_login_email(sender, user, request, **kwargs):
    """
    Sends an email notification every time a user logs in.
    """
    subject = 'Security Alert: New Login to ShoeSteraj'
    message = f'Hello {user.username},\n\nWe detected a new login to your account.\nIf this was you, great! If not, please change your password.\n\nHappy Shopping,\nThe ShoeSteraj Team'

    print(f"--- Attempting to send email to {user.email} ---")

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
