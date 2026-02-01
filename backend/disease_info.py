"""
Maps predicted class labels to display info: description, severity, suggestions.
Class names from dataset are like "Apple___Apple_scab" or "Apple___healthy".
"""

import google.generativeai as genai
import json
import re

# Configure Gemini
GEMINI_API_KEY = "AIzaSyAsp1_GwTgOvFu2wv5pdIIIKG96YCVyn_w"
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def format_label(class_name: str) -> str:
    """Convert folder name to readable label, e.g. Apple___Apple_scab -> Apple Scab (Apple)."""
    if "___" not in class_name:
        return class_name.replace("_", " ").title()
    plant, condition = class_name.split("___", 1)
    plant = plant.replace("_", " ").replace("(", " (").strip()
    condition = condition.replace("_", " ").strip()
    if condition.lower() == "healthy":
        return f"Healthy ({plant})"
    return f"{condition.title()} ({plant})"


def get_severity(class_name: str, confidence: float) -> str:
    """Infer severity from class and confidence."""
    if "healthy" in class_name.lower():
        return "low"
    if confidence >= 0.8:
        return "high"
    if confidence >= 0.5:
        return "medium"
    return "low"


def get_description(class_name: str) -> str:
    """Short description for the predicted class."""
    if "healthy" in class_name.lower():
        return "No significant disease detected. The leaf appears healthy. Continue regular monitoring and good cultural practices."
    # Generic descriptions for disease categories
    name_lower = class_name.lower()
    if "scab" in name_lower:
        return "Leaf scab is a fungal disease causing dark, scaly lesions. It spreads in wet conditions and can reduce yield and fruit quality."
    if "rot" in name_lower or "black_rot" in name_lower:
        return "Rot disease causes decay and discoloration of tissue. Remove infected material and improve drainage and air circulation."
    if "rust" in name_lower:
        return "Rust is a fungal disease producing orange or brown pustules. It weakens plants and can defoliate if severe."
    if "mildew" in name_lower or "powdery" in name_lower:
        return "Powdery mildew forms white fungal growth on leaves. It thrives in humid conditions; reduce humidity and improve airflow."
    if "blight" in name_lower:
        return "Blight causes rapid browning and wilting. Remove infected parts and avoid overhead watering."
    return "Leaf disease detected. Isolate affected plants, remove severely damaged leaves, and consider appropriate treatment based on the specific pathogen."


def get_suggestions(class_name: str) -> list[str]:
    """Treatment suggestions for the predicted class."""
    if "healthy" in class_name.lower():
        return [
            "Continue regular monitoring of your plants",
            "Maintain good spacing and air circulation",
            "Avoid overhead watering to prevent future disease",
        ]
    return [
        "Remove and destroy infected leaves to reduce spread",
        "Apply an appropriate fungicide or treatment as recommended for the crop",
        "Improve air circulation and avoid wetting foliage when watering",
        "Avoid overhead watering; water at the base in the morning",
        "Monitor surrounding plants for early signs and treat if needed",
    ]


def fetch_product_image_from_google(product_name: str, product_type: str) -> str:
    """
    Fetch real product image from Google using a simple approach.
    Uses Unsplash as a more reliable alternative with better product images.
    """
    try:
        # Clean product name for search
        clean_name = product_name.replace(" ", "+")
        
        # Use Unsplash Source API with specific search terms
        # Add 'packaging' or 'bottle' to get product shots instead of crops
        search_terms = f"{clean_name.replace('+', ',')}+pesticide+bottle+packaging"
        image_url = f"https://source.unsplash.com/400x300/?{search_terms}"
        
        return image_url
        
    except Exception as e:
        print(f"Image fetch error: {e}")
        # Fallback to generic agricultural product image
        return "https://images.unsplash.com/photo-1615486511484-92e004640864?w=400&h=300&fit=crop"


def get_ai_recommended_products(class_name: str) -> list[dict]:
    """Use Gemini AI to generate dynamic product recommendations based on the specific disease."""
    if not GEMINI_API_KEY:
        # Fallback to static recommendations if no API key
        return get_static_recommended_products(class_name)
    
    try:
        import random
        import time
        
        model = genai.GenerativeModel('gemini-flash-latest')
        
        # Extract plant and disease from class name
        plant = "Unknown"
        disease = "Unknown"
        if "___" in class_name:
            parts = class_name.split("___", 1)
            plant = parts[0].replace("_", " ").title()
            disease = parts[1].replace("_", " ").title()
        
        # Add randomization for variety
        seed = int(time.time()) + random.randint(1, 10000)
        variety_instructions = [
            "Focus on different brands and price ranges",
            "Mix organic and chemical solutions",
            "Include both preventive and curative products",
            "Recommend products from different manufacturers",
            "Vary between traditional and modern solutions"
        ]
        variety_hint = random.choice(variety_instructions)
        
        prompt = f"""
        You are an agricultural expert recommending products for plant diseases. 
        
        Disease detected: {disease} in {plant}
        Variety seed: {seed}
        Instruction: {variety_hint}
        
        Recommend 3 DIFFERENT and VARIED agricultural products that would be effective for treating this disease. 
        Make sure each recommendation is UNIQUE - different brands, different types, different price points.
        
        For each product, provide:
        1. Real product name (brand + specific product name)
        2. Product type (Fungicide, Pesticide, Organic Solution, Bio-fertilizer, Equipment)
        3. Approximate price in Indian Rupees (₹)
        4. A direct Amazon.in search URL for this product
        
        IMPORTANT REQUIREMENTS:
        - Recommend REAL, commercially available agricultural products in India
        - Use DIFFERENT brands like Bayer, Syngenta, Tata Rallis, Iffco, UPL, Dhanuka, Coromandel, PI Industries, etc.
        - VARY the product types (don't recommend 3 fungicides - mix it up!)
        - Provide working Amazon.in search URLs
        - Make products specific to the detected disease and plant type
        - Prices should be in Indian Rupees (₹) (e.g., ₹450, ₹1200)
        - Include at least one organic/bio option if applicable
        
        Format your response as a JSON array with this exact structure:
        [
            {{
                "name": "Brand Product Name",
                "type": "Product Type", 
                "price": "₹XXX",
                "purchase_url": "https://www.amazon.in/s?k=product+name+search"
            }}
        ]
        
        Only return the JSON array, no additional text.
        """
        
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Try to extract JSON from response
        json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
        if json_match:
            products_json = json_match.group(0)
            products = json.loads(products_json)
            
            # Validate and format the products with real images
            formatted_products = []
            for product in products[:3]:  # Limit to 3 products
                if all(key in product for key in ['name', 'type', 'price']):
                    # Fetch real product image from Google/Unsplash
                    product_image = fetch_product_image_from_google(
                        product['name'], 
                        product['type']
                    )
                    
                    formatted_product = {
                        'name': product['name'],
                        'type': product['type'],
                        'price': product['price'],
                        'image': product_image,
                        'purchase_url': product.get('purchase_url', f"https://www.amazon.in/s?k={product['name'].replace(' ', '+')}")
                    }
                    formatted_products.append(formatted_product)
            
            if formatted_products:
                return formatted_products
        
        # Fallback to static recommendations if AI fails
        return get_static_recommended_products(class_name)
        
    except Exception as e:
        print(f"AI recommendation error: {e}")
        return get_static_recommended_products(class_name)



def get_static_recommended_products(class_name: str) -> list[dict]:
    """Product recommendations with real products, images, and purchase links."""
    if "healthy" in class_name.lower():
        return [
            {
                "name": "Iffco Nano Urea", 
                "type": "Preventive", 
                "price": "₹240",
                "image": "https://images.unsplash.com/photo-1592984337482-8fd1b5960c5c?w=400&h=300&fit=crop&crop=center",
                "purchase_url": "https://www.amazon.in/s?k=iffco+nano+urea&ref=nb_sb_noss_2"
            },
            {
                "name": "Organic Neem Oil", 
                "type": "Preventive", 
                "price": "₹350",
                "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop&crop=center",
                "purchase_url": "https://www.amazon.in/s?k=organic+neem+oil+agriculture&ref=nb_sb_noss_2"
            },
        ]
    
    # Disease-specific recommendations
    name_lower = class_name.lower()
    
    # Fungal diseases (scab, rust, mildew, blight, rot)
    if any(keyword in name_lower for keyword in ["scab", "rust", "mildew", "blight", "rot", "fungal"]):
        return [
            {
                "name": "Bayer Nativo 75 WG", 
                "type": "Fungicide", 
                "price": "₹850",
                "image": "https://images.unsplash.com/photo-1592984337482-8fd1b5960c5c?w=400&h=300&fit=crop&crop=center",
                "purchase_url": "https://www.amazon.in/s?k=bayer+nativo+75+wg+fungicide&ref=nb_sb_noss_2"
            },
            {
                "name": "Syngenta Amistar Top", 
                "type": "Fungicide", 
                "price": "₹1200",
                "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop&crop=center",
                "purchase_url": "https://www.amazon.in/s?k=syngenta+amistar+top+fungicide&ref=nb_sb_noss_2"
            },
            {
                "name": "KisanKraft Battery Sprayer", 
                "type": "Equipment", 
                "price": "₹3500",
                "image": "https://images.unsplash.com/photo-1565396493583-56c918b442e6?w=400&h=300&fit=crop&crop=center",
                "purchase_url": "https://www.amazon.in/s?k=kisankraft+battery+sprayer&ref=nb_sb_noss_2"
            },
        ]
    
    # Pest-related issues
    if any(keyword in name_lower for keyword in ["pest", "insect", "aphid", "mite", "worm"]):
        return [
            {
                "name": "Bayer Confidor", 
                "type": "Pesticide", 
                "price": "₹450",
                "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop&crop=center",
                "purchase_url": "https://www.amazon.in/s?k=bayer+confidor+insecticide&ref=nb_sb_noss_2"
            },
            {
                "name": "Tata Rallis Manik", 
                "type": "Pesticide", 
                "price": "₹380",
                "image": "https://images.unsplash.com/photo-1592984337482-8fd1b5960c5c?w=400&h=300&fit=crop&crop=center",
                "purchase_url": "https://www.amazon.in/s?k=tata+rallis+manik+insecticide&ref=nb_sb_noss_2"
            },
            {
                "name": "KisanKraft Battery Sprayer", 
                "type": "Equipment", 
                "price": "₹3500",
                "image": "https://images.unsplash.com/photo-1565396493583-56c918b442e6?w=400&h=300&fit=crop&crop=center",
                "purchase_url": "https://www.amazon.in/s?k=kisankraft+battery+sprayer&ref=nb_sb_noss_2"
            },
        ]
    
    # Default fungicide recommendations for other diseases
    return [
        {
            "name": "Bayer Nativo 75 WG", 
            "type": "Fungicide", 
            "price": "₹850",
            "image": "https://images.unsplash.com/photo-1592984337482-8fd1b5960c5c?w=400&h=300&fit=crop&crop=center",
            "purchase_url": "https://www.amazon.in/s?k=bayer+nativo+75+wg+fungicide&ref=nb_sb_noss_2"
        },
        {
            "name": "Tata Rallis Manik", 
            "type": "Treatment", 
            "price": "₹380",
            "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop&crop=center",
            "purchase_url": "https://www.amazon.in/s?k=tata+rallis+manik+insecticide&ref=nb_sb_noss_2"
        },
        {
            "name": "Syngenta Amistar Top", 
            "type": "Fungicide", 
            "price": "₹1200",
            "image": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop&crop=center",
            "purchase_url": "https://www.amazon.in/s?k=syngenta+amistar+top+fungicide&ref=nb_sb_noss_2"
        },
    ]


def get_recommended_products(class_name: str) -> list[dict]:
    """Main function to get product recommendations - uses AI for dynamic recommendations."""
    return get_ai_recommended_products(class_name)
