from google import genai
from google.genai import types
from django.conf import settings
import json

def analyze_shoe_image(image_file):
    try:
        if not settings.GEMINI_API_KEY:
            return {"error": "Missing Gemini API Key"}

        client = genai.Client(api_key=settings.GEMINI_API_KEY)

        # 1. Reset file pointer
        if hasattr(image_file, 'seek'):
            image_file.seek(0)
        
        if image_file.closed:
            image_file.open()
            
        image_bytes = image_file.read()

        prompt = """
        Analyze this image of a shoe. Extract these details:
        - brand (e.g. Nike, Adidas)
        - model (e.g. Air Jordan 1)
        - color (Dominant colors)
        - category (Basketball, Running, Casual, Luxury, Boots, Other)
        - description (A short, catchy 2-sentence marketing description)
        
        If it is not a shoe, return an error field.
        """

        # 2. USE THE ALIAS FROM YOUR LIST
        # "gemini-flash-latest" is explicitly in your check_models output
        response = client.models.generate_content(
            model='gemini-flash-latest', 
            contents=[
                prompt,
                types.Part.from_bytes(
                    data=image_bytes, 
                    mime_type="image/jpeg"
                )
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema={
                    "type": "OBJECT",
                    "properties": {
                        "brand": {"type": "STRING"},
                        "model": {"type": "STRING"},
                        "color": {"type": "STRING"},
                        "category": {"type": "STRING"},
                        "description": {"type": "STRING"}
                    }
                }
            )
        )

        result_json = response.parsed
        
        if isinstance(result_json, str):
            return json.loads(result_json)
        
        if hasattr(result_json, 'model_dump'):
            return result_json.model_dump()
            
        return result_json

    except Exception as e:
        print(f"Gemini Error: {e}")
        # If this fails with 429, it means the Free Tier is exhausted for the day
        return {"error": "AI Service busy or limit reached. Please fill manually."}