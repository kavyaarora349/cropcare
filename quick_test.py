"""Quick test to see the actual error from Gemini."""
import requests
import json

url = "http://localhost:8000/api/chat"
payload = {"message": "hi"}

try:
    response = requests.post(url, json=payload, timeout=30)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
