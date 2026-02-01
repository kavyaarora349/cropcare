"""
Load the trained leaf disease model and class names for inference.
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image
import tensorflow as tf

BACKEND_DIR = Path(__file__).resolve().parent
MODELS_DIR = BACKEND_DIR / "models"
MODEL_PATH = MODELS_DIR / "leaf_model.keras"
CLASS_NAMES_PATH = MODELS_DIR / "class_names.json"
IMG_SIZE = (224, 224)

_model = None
_class_names = None


def load_model_and_classes():
    global _model, _class_names
    if _model is not None:
        return _model, _class_names
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found at {MODEL_PATH}. Run: python backend/train.py"
        )
    if not CLASS_NAMES_PATH.exists():
        raise FileNotFoundError(
            f"Class names not found at {CLASS_NAMES_PATH}. Run: python backend/train.py"
        )
    _model = tf.keras.models.load_model(MODEL_PATH)
    with open(CLASS_NAMES_PATH) as f:
        _class_names = json.load(f)
    return _model, _class_names


def preprocess_image(image: Image.Image) -> np.ndarray:
    """Resize and normalize image to model input shape."""
    image = image.convert("RGB")
    image = image.resize(IMG_SIZE, Image.Resampling.LANCZOS)
    arr = np.array(image, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)


def predict(image: Image.Image, crop_type: str = None) -> tuple[str, float]:
    """
    Run inference on a PIL Image.
    If crop_type is provided, filter predictions to only diseases for that crop.
    Returns (class_name, confidence).
    """
    model, class_names = load_model_and_classes()
    x = preprocess_image(image)
    logits = model.predict(x, verbose=0)
    proba = logits[0]

    if crop_type:
        # Filter classes to only those matching the crop type
        filtered_indices = [i for i, class_name in enumerate(class_names) if class_name.lower().startswith(crop_type.lower())]
        if filtered_indices:
            # Get probabilities only for filtered classes
            filtered_proba = proba[filtered_indices]
            # Find the best among filtered classes
            best_idx_in_filtered = int(np.argmax(filtered_proba))
            global_idx = filtered_indices[best_idx_in_filtered]
            return class_names[global_idx], float(proba[global_idx])
        else:
            # No classes match the crop type, fall back to global prediction
            pass

    # Default: use all classes
    idx = int(np.argmax(proba))
    return class_names[idx], float(proba[idx])
