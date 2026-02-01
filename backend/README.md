# Crop Care Connect – Backend (ML + API)

Backend for leaf disease analysis: trains on your dataset under `data/` and exposes an API used by the frontend.

## Setup

From the **project root** (`crop-care-connect`):

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

## 1. Train the model (required once)

Uses the dataset in `data/raw/.../train` (class names are discovered from folder names). Run from **project root**:

```bash
python backend/train.py
```

- Finds `data/raw/.../train` and uses each subfolder as a class.
- Trains a MobileNetV2-based classifier (transfer learning).
- Saves the model and class list to `backend/models/`.

Training can take a while depending on dataset size and hardware.

## 2. Start the API

From **project root**:

```bash
cd backend
uvicorn main:app --reload --port 8000
```

Or from `backend/`:

```bash
uvicorn main:app --reload --port 8000
```

- API: http://127.0.0.1:8000  
- Docs: http://127.0.0.1:8000/docs  
- Health: `GET /api/health`  
- Analyze: `POST /api/analyze` with form field `file` (image)

## 3. Run the frontend

From project root:

```bash
npm run dev
```

Vite proxies `/api` to the backend, so the Scan Crop flow uses the real ML model.

## Dataset layout

Expected structure:

```
data/raw/.../train/
  Apple___Apple_scab/
    *.JPG
  Apple___healthy/
    *.JPG
  ...
```

Class names are taken from folder names (e.g. `Apple___Apple_scab` → “Apple Scab (Apple)”).
