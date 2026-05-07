import requests
import json
import os

API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_NEW_API_KEY")
url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={API_KEY}"

payload = {
    "contents": [
        {
            "parts": [{"text": "Say hello"}]
        }
    ]
}

print(f"Testing URL: {url}")
response = requests.post(url, json=payload)
print(f"Status Code: {response.status_code}")
print(f"Response Body: {response.text}")
