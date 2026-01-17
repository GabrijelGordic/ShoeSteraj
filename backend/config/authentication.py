from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import authentication, exceptions
from supabase import create_client, Client

class SupabaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return None

        try:
            # 1. Initialize Supabase Client
            url: str = settings.SUPABASE_URL
            key: str = settings.SUPABASE_KEY
            supabase: Client = create_client(url, key)

            # 2. Extract the token
            token = auth_header.split(' ')[1]

            # 3. Ask Supabase to verify the User
            user_response = supabase.auth.get_user(token)
            user_data = user_response.user

            if not user_data:
                raise exceptions.AuthenticationFailed('User not found in Supabase')

        except Exception as e:
            # print(f"\n\n🚨 AUTH ERROR: {str(e)}\n\n") # Optional: Un-comment for debugging
            raise exceptions.AuthenticationFailed('Invalid Token')

        # 4. Get Email
        user_email = user_data.email
        if not user_email:
            raise exceptions.AuthenticationFailed('Token has no email')

        # 5. Bridge to Django User (STRICT READ-ONLY)
        # We DO NOT create users here. We wait for the Supabase SQL Trigger to do it.
        try:
            # We look up by email because the SQL trigger ensures email is synced
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            # If the user exists in Supabase but not in Django yet, 
            # it means they haven't verified their email (or the trigger failed).
            raise exceptions.AuthenticationFailed(
                'Account not fully active. Please verify your email.'
            )

        return (user, None)