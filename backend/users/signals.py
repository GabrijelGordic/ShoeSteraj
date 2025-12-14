import logging
import threading

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

User = get_user_model()
logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if not created:
        return

    # 1) Create the profile
    from .models import Profile
    Profile.objects.create(user=instance)

    # 2) Send welcome email (background thread)
    # NOTE: Gunicorn/Render može ubiti worker i prekinuti thread.
    # Ako želiš maksimalnu pouzdanost, pošalji bez threada.
    send_welcome_email_thread(instance)


def send_welcome_email_thread(user):
    ctx = {
        "user": user,
        "frontend_url": "https://shoesteraj.pages.dev/",
    }

    subject = render_to_string("emails/welcome_subject.txt", ctx).strip()
    text_body = render_to_string("emails/welcome_body.txt", ctx)
    html_body = render_to_string("emails/welcome_body.html", ctx)

    try:
        logger.info("Starting email send to %s...", user.email)

        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )
        msg.attach_alternative(html_body, "text/html")
        msg.send(fail_silently=False)

        logger.info("SUCCESS: Email sent to %s", user.email)

    except Exception as e:
        logger.exception(
            "ERROR: Failed to send email to %s. Reason: %s", user.email, e)
