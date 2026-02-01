"""Test the enhanced Leaf Bot with a few sample questions."""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_chat_question(question):
    """Test a single chat question."""
    print("\n" + "="*70)
    print(f"Question: {question}")
    print("="*70)
    
    url = f"{BASE_URL}/api/chat"
    payload = {"message": question}
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        
        if response.ok:
            data = response.json()
            print(f"\nLeaf Bot's Response:")
            print("-" * 70)
            print(data.get('response', 'No response'))
            print("-" * 70)
            return True
        else:
            print(f"\nFailed: {response.text}")
            return False
            
    except Exception as e:
        print(f"\nError: {str(e)}")
        return False

if __name__ == "__main__":
    print("\nTesting Enhanced Leaf Bot")
    print("="*70)
    
    # Test questions
    questions = [
        "What crops grow well in winter?",
        "How do I prevent tomato blight?",
        "Tell me about organic fertilizers",
    ]
    
    for question in questions:
        test_chat_question(question)
        print("\n")
    
    print("="*70)
    print("Testing complete!")
