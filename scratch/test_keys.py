import os
from google import genai
import sys

def test_key(api_key, label):
    print(f"Testing {label}: {api_key[:10]}...")
    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents="Say hello"
        )
        print(f"  Success! Response: {response.text.strip()}")
        return True
    except Exception as e:
        print(f"  Failed: {e}")
        return False

key1 = "AIzaSyC0j03ztoevpx-OTf0Ju2yB5yHNdQIE8JQ" # From api_key.txt
key2 = "AIzaSyB-n4ZB74_tFLTzgLESWaMTEUGuXzxc3xw" # From test_api.py

test_key(key1, "api_key.txt")
test_key(key2, "test_api.py")
