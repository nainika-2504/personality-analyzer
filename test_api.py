import requests
import json
import os

API_KEY = "AIzaSyB-n4ZB74_tFLTzgLESWaMTEUGuXzxc3xw"
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
