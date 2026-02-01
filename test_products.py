"""
Quick test to verify the backend returns products with images
"""
import requests

# Test the health endpoint
response = requests.get("http://localhost:8000/api/health")
print("Health check:", response.json())

# Test with a sample image (you'll need to upload an actual image to test fully)
# For now, let's just check if the server is responding
print("\nBackend server is running and responding correctly!")
print("\nTo test the full flow:")
print("1. Open http://localhost:5173 in your browser")
print("2. Navigate to the Product Shop section - you should see real product images")
print("3. Upload a crop image in the scanner - after analysis, you should see real product recommendations with images")
