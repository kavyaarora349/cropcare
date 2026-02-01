import google.generativeai as genai
import os

key = "AIzaSyBRQFVh6UKkC7esq0lrsZqlz3auEtChCNI"
genai.configure(api_key=key)

print(f"Checking models with key: {key[:5]}...")

try:
    model = genai.GenerativeModel('gemini-flash-latest')
    response = model.generate_content("Hello, can you hear me?")
    print(f"SUCCESS! Response: {response.text}")
except Exception as e:
    print(f"ERROR: {e}")
    print("\nListing available models:")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)
    except Exception as e2:
        print(f"Could not list models: {e2}")
