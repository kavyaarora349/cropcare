"""
Backend API for leaf disease analysis. Run: uvicorn main:app --reload --port 8000
"""
import io
import os
# Force CPU usage to save memory on Render Free Tier
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from PIL import Image
import os
import google.generativeai as genai
from .model_loader import predict, load_model_and_classes
from .disease_info import format_label, get_severity, get_description, get_suggestions, get_recommended_products



# Configure Gemini
# Read API key from environment variable for production security
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("WARNING: GEMINI_API_KEY not set. Leaf Bot will return fallback responses.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model on startup to prevent delay on first request
    print("Loading model...")
    try:
        load_model_and_classes()
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
    yield


app = FastAPI(title="Crop Care Connect API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}

class ChatRequest(BaseModel):
    message: str
    language: str = "en"  # Default to English

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    if not GEMINI_API_KEY:
        # Fallback response if no key is configured
        return {"response": "I see you're interested in Leaf Bot! To make me smart, I need a Gemini API Key. Please provide one to the developer variables."}
    
    try:
        model = genai.GenerativeModel('gemini-flash-latest')
        
        # Base prompt
        base_prompt = """You are Leaf Bot 🌱, a friendly and knowledgeable agricultural assistant helping farmers and gardeners.

Your personality:
- Warm, enthusiastic, and encouraging
- Use relevant emojis naturally throughout your responses (🌾 🌻 🌿 🍅 🥕 🌧️ ☀️ 💧 🌡️ etc.)
- Keep responses concise but informative (2-4 sentences or bullet points)
- Use simple, clear language that farmers can easily understand
- Be practical and action-oriented"""

        # Language specific instruction
        if request.language == 'hi':
            lang_instruction = """
IMPORTANT: The user has requested to communicate in Hindi. 
- You MUST reply in Hindi (Devanagari script).
- Keep the same emoji-rich, friendly tone.
- Translate technical terms if needed but commonly used English terms in farming are okay if written in Hindi script.
"""
        else:
            lang_instruction = ""

        prompt = f"""{base_prompt}
{lang_instruction}

User's question: {request.message}

Provide a helpful, friendly response with appropriate emojis. Format your answer clearly with line breaks if listing multiple points."""

        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        print(f"Gemini Error: {e}")
        # Friendly error message with emoji
        return {"response": "😅 Oops! I'm having a bit of trouble thinking right now. Could you try asking again in a moment?"}



@app.post("/api/analyze")
async def analyze_leaf(file: UploadFile = File(...), crop_type: str = None):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")
    try:
        raw = await file.read()
        image = Image.open(io.BytesIO(raw)).convert("RGB")
    except Exception as e:
        raise HTTPException(400, f"Invalid image: {e}")
    try:
        class_name, confidence = predict(image, crop_type)
    except FileNotFoundError as e:
        raise HTTPException(503, "Model not trained yet. Run: python backend/train.py")
    severity = get_severity(class_name, confidence)
    return {
        "disease": format_label(class_name),
        "confidence": round(confidence * 100),
        "severity": severity,
        "description": get_description(class_name),
        "suggestions": get_suggestions(class_name),
        "products": get_recommended_products(class_name),
    }
