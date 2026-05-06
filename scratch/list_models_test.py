from google import genai
import os

API_KEY = "AIzaSyC0j03ztoevpx-OTf0Ju2yB5yHNdQIE8JQ"
client = genai.Client(api_key=API_KEY)

try:
    print("Listing models...")
    for model in client.models.list():
        print(f"Model: {model.name}")
except Exception as e:
    print(f"Error: {e}")
