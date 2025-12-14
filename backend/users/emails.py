from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


def send_welcome_email(user):
    ctx = {
        "user": user,
        "frontend_url": "https://shoesteraj.pages.dev/",
    }

    subject = render_to_string("emails/welcome_subject.txt", ctx).strip()
    text_body = render_to_string("emails/welcome_body.txt", ctx)
    html_body = render_to_string("emails/welcome_body.html", ctx)

    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    msg.attach_alternative(html_body, "text/html")
    msg.send(fail_silently=False)
