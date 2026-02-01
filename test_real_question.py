"""Test with a real farming question."""
import requests
import json

url = "http://localhost:8000/api/chat"
payload = {"message": "What crops grow well in winter?"}

try:
    response = requests.post(url, json=payload, timeout=30)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"\nBot Response:")
    print("="*70)
    print(data.get('response', 'No response'))
    print("="*70)
except Exception as e:
    print(f"Error: {e}")
