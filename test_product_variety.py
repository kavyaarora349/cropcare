"""
Test script to verify AI product recommendations with variety and real images.
This will test that different products are recommended each time.
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from disease_info import get_ai_recommended_products

def test_product_variety():
    """Test that different products are recommended for the same disease"""
    
    # Test with a common disease
    test_disease = "Apple___Apple_scab"
    
    print("=" * 80)
    print("Testing AI Product Recommendations with Variety")
    print("=" * 80)
    print(f"\nDisease: {test_disease}\n")
    
    # Get recommendations 3 times
    all_recommendations = []
    
    for i in range(3):
        print(f"\n--- Attempt {i+1} ---")
        products = get_ai_recommended_products(test_disease)
        
        print(f"Number of products: {len(products)}")
        for j, product in enumerate(products, 1):
            print(f"\n  Product {j}:")
            print(f"    Name: {product['name']}")
            print(f"    Type: {product['type']}")
            print(f"    Price: {product['price']}")
            print(f"    Image: {product['image'][:60]}...")
            print(f"    URL: {product['purchase_url'][:60]}...")
        
        all_recommendations.append(products)
    
    # Check for variety
    print("\n" + "=" * 80)
    print("Variety Analysis")
    print("=" * 80)
    
    # Extract all product names
    all_names = []
    for rec in all_recommendations:
        all_names.extend([p['name'] for p in rec])
    
    unique_names = set(all_names)
    
    print(f"\nTotal products recommended: {len(all_names)}")
    print(f"Unique products: {len(unique_names)}")
    print(f"Variety score: {len(unique_names) / len(all_names) * 100:.1f}%")
    
    if len(unique_names) >= 5:
        print("\n✅ PASS: Good variety in recommendations!")
    elif len(unique_names) >= 3:
        print("\n⚠️  PARTIAL: Some variety, but could be better")
    else:
        print("\n❌ FAIL: Not enough variety in recommendations")
    
    print("\nUnique products recommended:")
    for name in unique_names:
        print(f"  - {name}")

if __name__ == "__main__":
    test_product_variety()
