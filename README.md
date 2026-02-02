# 🌾 Crop Care Connect

**An AI-powered agricultural platform helping farmers detect crop diseases and get expert farming advice.**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://cropcare-frontend.onrender.com)
[![Backend API](https://img.shields.io/badge/API-running-blue)](https://cropcare-backend-onuo.onrender.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🌟 Features

### 🔬 AI Crop Disease Analysis
- **Upload crop images** and get instant disease detection
- **Machine Learning powered** using TensorFlow and MobileNetV2
- **Detailed diagnosis** with confidence scores and severity levels
- **Treatment recommendations** with actionable suggestions
- **Product recommendations** with direct purchase links to Amazon India

### 🤖 Leaf Bot - AI Farming Assistant
- **Intelligent chatbot** powered by Google Gemini AI
- **Multilingual support** (English & Hindi)
- **Expert farming advice** on crops, diseases, techniques, and seasonal tips
- **Friendly and emoji-rich** responses for better engagement

### 🌐 Community & Shopping
- **Community Feed** - Share experiences and learn from other farmers
- **Product Shop** - Browse and purchase agricultural products
- **Weather Widget** - Real-time weather information
- **Responsive Design** - Works seamlessly on mobile and desktop

---

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Framer Motion** for animations
- **React Router** for navigation

### Backend
- **FastAPI** (Python) for REST API
- **TensorFlow** for ML model inference
- **Google Gemini AI** for chatbot
- **Pillow** for image processing
- **Uvicorn** as ASGI server

### Machine Learning
- **MobileNetV2** transfer learning model
- **38 crop disease classes** detection
- **Image preprocessing** and augmentation
- **Confidence scoring** and severity assessment

---

## 🚀 Live Deployment

- **Frontend**: [https://cropcare-frontend.onrender.com](https://cropcare-frontend.onrender.com)
- **Backend API**: [https://cropcare-backend-onuo.onrender.com](https://cropcare-backend-onuo.onrender.com)
- **API Docs**: [https://cropcare-backend-onuo.onrender.com/docs](https://cropcare-backend-onuo.onrender.com/docs)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/kavyaarora349/cropcare.git
cd cropcare

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Set environment variable
# Create a .env file with:
# GEMINI_API_KEY=your_gemini_api_key_here

# Start the API server
uvicorn main:app --reload --port 8000
```

### Training the ML Model (Optional)

```bash
# Ensure you have the dataset in data/raw/.../train/
python backend/train.py
```

---

## 🌐 Deployment Guide

### Deploy Backend to Render

1. **Push code to GitHub**
2. **Create new Web Service** on [Render](https://dashboard.render.com/)
3. **Connect your repository** - Render auto-detects `render.yaml`
4. **Set environment variable**:
   - `GEMINI_API_KEY` = your Gemini API key
5. **Deploy** - Takes ~5-10 minutes
6. **Copy backend URL** for frontend configuration

### Deploy Frontend

1. **Set environment variable** in your deployment platform:
   - `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com`
   - ⚠️ **No trailing slash!**
2. **Deploy** - Frontend will connect to your backend

### Important Notes
- ⏱️ Render free tier spins down after 15 minutes of inactivity
- 🐌 First request after spin-down takes 30-60 seconds (cold start)
- 💾 Model file (25.8MB) is included in the repository

---

## 📁 Project Structure

```
cropcare/
├── backend/                 # FastAPI backend
│   ├── main.py             # API endpoints
│   ├── model_loader.py     # ML model loading
│   ├── disease_info.py     # Disease information database
│   ├── train.py            # Model training script
│   ├── models/             # Trained models
│   └── requirements.txt    # Python dependencies
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── config.ts           # API configuration
│   └── index.css           # Global styles
├── render.yaml             # Render deployment config
└── package.json            # Node dependencies
```

---

## 🔑 Environment Variables

### Backend
- `GEMINI_API_KEY` - Google Gemini API key for chatbot
- `PYTHON_VERSION` - Python version (3.11.0)
- `PORT` - Server port (8000)

### Frontend
- `VITE_API_BASE_URL` - Backend API URL (no trailing slash)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Kavya Arora**
- GitHub: [@kavyaarora349](https://github.com/kavyaarora349)

---

## 🙏 Acknowledgments

- Plant disease dataset from [PlantVillage](https://plantvillage.psu.edu/)
- Google Gemini AI for chatbot capabilities
- TensorFlow and MobileNetV2 for ML model
- shadcn/ui for beautiful UI components

---

**Made with love for farmers worldwide** 🌾

