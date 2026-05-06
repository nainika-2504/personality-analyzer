from google import genai
import os

API_KEY = "AIzaSyC0j03ztoevpx-OTf0Ju2yB5yHNdQIE8JQ"
client = genai.Client(api_key=API_KEY)

try:
    print("Testing gemini-2.5-flash...")
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Say hello"
    )
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error with gemini-2.5-flash: {e}")

try:
    print("\nTesting models/gemini-2.5-flash...")
    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents="Say hello"
    )
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error with models/gemini-2.5-flash: {e}")
