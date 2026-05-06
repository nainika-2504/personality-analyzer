import os
from google import genai

api_key = "AIzaSyC0j03ztoevpx-OTf0Ju2yB5yHNdQIE8JQ"
client = genai.Client(api_key=api_key)

try:
    print("Testing gemini-2.5-flash...")
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Say hello"
    )
    print(f"  Success! Response: {response.text.strip()}")
except Exception as e:
    print(f"  Failed: {e}")
