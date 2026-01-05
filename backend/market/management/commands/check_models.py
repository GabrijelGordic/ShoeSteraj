from django.core.management.base import BaseCommand
from google import genai
from django.conf import settings

class Command(BaseCommand):
    help = 'Lists all Gemini models available to your API Key'

    def handle(self, *args, **kwargs):
        if not settings.GEMINI_API_KEY:
            self.stdout.write(self.style.ERROR("❌ No GEMINI_API_KEY found!"))
            return

        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        self.stdout.write(self.style.SUCCESS("\n🔍 Checking models..."))
        
        try:
            # Simple loop: just print the name attribute
            # If 'name' doesn't exist, we print the whole object to debug
            for m in client.models.list(config={"page_size": 100}):
                if hasattr(m, 'name'):
                    self.stdout.write(f"👉 {m.name}")
                else:
                    self.stdout.write(f"❓ Unknown Object: {m}")
                    
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Connection Error: {e}"))
            
        self.stdout.write("\n")