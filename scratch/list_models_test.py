import os
from google import genai

api_key = "AIzaSyC0j03ztoevpx-OTf0Ju2yB5yHNdQIE8JQ"
client = genai.Client(api_key=api_key)

try:
    print("Listing models...")
    for model in client.models.list():
        print(f"  {model.name}")
except Exception as e:
    print(f"Error: {e}")
