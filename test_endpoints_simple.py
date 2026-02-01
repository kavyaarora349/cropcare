"""Test script to verify both Leaf Bot chat and crop analysis endpoints - Simple version."""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_chat():
    """Test the Leaf Bot chat endpoint."""
    print("\n" + "="*60)
    print("TESTING LEAF BOT CHAT ENDPOINT")
    print("="*60)
    
    url = f"{BASE_URL}/api/chat"
    payload = {"message": "What crops grow well in winter?"}
    
    try:
        print(f"\nSending request to: {url}")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(url, json=payload, timeout=30)
        
        print(f"\nStatus Code: {response.status_code}")
        
        if response.ok:
            data = response.json()
            print(f"\nSUCCESS!")
            print(f"Bot Response:")
            print("-" * 60)
            print(data.get('response', 'No response'))
            print("-" * 60)
            return True
        else:
            print(f"\nFAILED!")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"\nEXCEPTION!")
        print(f"Error: {str(e)}")
        return False

def test_analysis():
    """Test the crop analysis endpoint."""
    print("\n" + "="*60)
    print("TESTING CROP ANALYSIS ENDPOINT")
    print("="*60)
    
    url = f"{BASE_URL}/api/analyze"
    
    try:
        print(f"\nSending request to: {url}")
        
        # Open the test image
        with open("test_image.png", "rb") as f:
            files = {"file": ("test_image.png", f, "image/png")}
            
            response = requests.post(url, files=files, timeout=30)
        
        print(f"\nStatus Code: {response.status_code}")
        
        if response.ok:
            data = response.json()
            print(f"\nSUCCESS!")
            print(f"Analysis Result:")
            print("-" * 60)
            print(f"Disease: {data.get('disease')}")
            print(f"Confidence: {data.get('confidence')}%")
            print(f"Severity: {data.get('severity')}")
            print(f"Description: {data.get('description')}")
            print(f"\nSuggestions:")
            for i, suggestion in enumerate(data.get('suggestions', []), 1):
                print(f"  {i}. {suggestion}")
            print(f"\nRecommended Products:")
            for product in data.get('products', []):
                print(f"  - {product.get('name')} ({product.get('type')}) - {product.get('price')}")
            print("-" * 60)
            return True
        else:
            print(f"\nFAILED!")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"\nEXCEPTION!")
        print(f"Error: {str(e)}")
        return False

def test_health():
    """Test the health endpoint."""
    print("\n" + "="*60)
    print("TESTING HEALTH ENDPOINT")
    print("="*60)
    
    url = f"{BASE_URL}/api/health"
    
    try:
        print(f"\nSending request to: {url}")
        response = requests.get(url, timeout=5)
        
        print(f"\nStatus Code: {response.status_code}")
        
        if response.ok:
            data = response.json()
            print(f"\nSUCCESS!")
            print(f"Response: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"\nFAILED!")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"\nEXCEPTION!")
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("\nTESTING CROP CARE CONNECT API ENDPOINTS")
    print("="*60)
    
    # Test health first
    health_ok = test_health()
    
    if not health_ok:
        print("\nHealth check failed. Backend may not be running.")
        print("Please ensure the backend is running with: uvicorn backend.main:app --reload --port 8000")
        exit(1)
    
    # Test both features
    chat_ok = test_chat()
    analysis_ok = test_analysis()
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print(f"Health Check: {'PASS' if health_ok else 'FAIL'}")
    print(f"Leaf Bot Chat: {'PASS' if chat_ok else 'FAIL'}")
    print(f"Crop Analysis: {'PASS' if analysis_ok else 'FAIL'}")
    print("="*60)
    
    if chat_ok and analysis_ok:
        print("\nAll tests passed!")
    else:
        print("\nSome tests failed. Check the output above for details.")
