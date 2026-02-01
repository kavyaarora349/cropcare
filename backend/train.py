"""
Train a leaf disease classifier on the dataset in data/ folder.
Discovers classes from the train directory structure (no hardcoded labels).
Validates images with PIL and skips invalid/corrupt files.
Run from project root: python backend/train.py
"""
import json
import os
import random
import sys
from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from PIL import Image

# Project root (parent of backend/)
PROJECT_ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = Path(__file__).resolve().parent
MODELS_DIR = BACKEND_DIR / "models"
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 20
VALIDATION_SPLIT = 0.2
SEED = 42
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"}


def find_train_dir() -> Path:
    """Locate the train directory under data/raw."""
    data_root = PROJECT_ROOT / "data" / "raw"
    if not data_root.exists():
        raise FileNotFoundError(f"Data root not found: {data_root}")
    for root, dirs, _ in os.walk(data_root):
        root_path = Path(root)
        if "train" in dirs:
            train_path = root_path / "train"
            subdirs = [d for d in train_path.iterdir() if d.is_dir()]
            if subdirs:
                return train_path
    raise FileNotFoundError(f"No 'train' directory with class subdirs found under {data_root}")


def collect_valid_images(train_dir: Path):
    """Collect (file_path, class_index) for files that PIL can open as RGB. Skips invalid/corrupt images."""
    class_dirs = sorted(d for d in train_dir.iterdir() if d.is_dir())
    class_names = [d.name for d in class_dirs]
    paths, labels = [], []
    skipped = 0
    total = sum(1 for d in class_dirs for f in d.iterdir() if f.is_file() and f.suffix.lower() in IMAGE_EXTENSIONS)
    print(f"Validating up to {total} image(s) (skipping invalid/corrupt)...")
    for class_idx, class_dir in enumerate(class_dirs):
        for f in class_dir.iterdir():
            if not f.is_file():
                continue
            if f.suffix.lower() not in IMAGE_EXTENSIONS:
                skipped += 1
                continue
            try:
                with Image.open(f) as img:
                    img.convert("RGB")
            except Exception:
                skipped += 1
                continue
            paths.append(str(f.resolve()))
            labels.append(class_idx)
    if skipped:
        print(f"Skipped {skipped} invalid or unsupported image(s).")
    return paths, labels, class_names


def load_and_preprocess(path: str):
    """Load image with PIL, resize, normalize. Returns numpy array for tf.py_function."""
    img = Image.open(path).convert("RGB")
    if img.size != IMG_SIZE:
        img = img.resize(IMG_SIZE, Image.Resampling.LANCZOS)
    arr = np.array(img, dtype=np.float32) / 255.0
    return arr


def main():
    tf.random.set_seed(SEED)
    random.seed(SEED)
    np.random.seed(SEED)
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    model_path = MODELS_DIR / "leaf_model.keras"
    class_names_path = MODELS_DIR / "class_names.json"

    if model_path.exists() and class_names_path.exists():
        print("Model already exists, loading...")
        model = keras.models.load_model(model_path)
        with open(class_names_path, "r") as f:
            class_names = json.load(f)
        print(f"Model and class_names loaded from {MODELS_DIR}")
    else:
        train_dir = find_train_dir()
        print(f"Using train directory: {train_dir}")

        paths, labels, class_names = collect_valid_images(train_dir)
        num_classes = len(class_names)
        print(f"Classes ({num_classes}): {class_names}")
        print(f"Valid images: {len(paths)}")

        # Shuffle and split train/val
        indices = list(range(len(paths)))
        random.shuffle(indices)
        n_val = int(len(indices) * VALIDATION_SPLIT)
        val_idx, train_idx = set(indices[:n_val]), indices[n_val:]
        train_paths = [paths[i] for i in train_idx]
        train_labels = [labels[i] for i in train_idx]
        val_paths = [paths[i] for i in val_idx]
        val_labels = [labels[i] for i in val_idx]
        print(f"Training samples: {len(train_paths)}, validation samples: {len(val_paths)}")

        def make_dataset(paths_list, labels_list, shuffle=True):
            labels_onehot = tf.keras.utils.to_categorical(labels_list, num_classes=num_classes)
            ds = tf.data.Dataset.from_tensor_slices((paths_list, labels_onehot))
            if shuffle:
                ds = ds.shuffle(buffer_size=len(paths_list), seed=SEED)
            def load_one(path_val, label_np):
                if hasattr(path_val, "numpy"):
                    path_val = path_val.numpy()
                if hasattr(path_val, "item"):
                    path_val = path_val.item()
                path_str = path_val.decode() if isinstance(path_val, bytes) else str(path_val)
                if hasattr(label_np, "numpy"):
                    label_np = label_np.numpy()
                img = load_and_preprocess(path_str)
                return img.astype(np.float32), label_np.astype(np.float32)

            ds = ds.map(
                lambda p, l: tf.py_function(
                    func=load_one,
                    inp=[p, l],
                    Tout=[tf.float32, tf.float32],
                ),
                num_parallel_calls=tf.data.AUTOTUNE,
            )
            # py_function loses shape: force known shape so Keras gets rank
            def fix_shape(img, label):
                img = tf.reshape(img, (*IMG_SIZE, 3))
                label = tf.reshape(label, (num_classes,))
                return img, label

            ds = ds.map(fix_shape, num_parallel_calls=tf.data.AUTOTUNE)
            ds = ds.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)
            return ds

        train_ds = make_dataset(train_paths, train_labels, shuffle=True)
        val_ds = make_dataset(val_paths, val_labels, shuffle=False)

        # Transfer learning: MobileNetV2
        base = keras.applications.MobileNetV2(
            input_shape=(*IMG_SIZE, 3),
            include_top=False,
            weights="imagenet",
            pooling="avg",
        )
        base.trainable = False
        model = keras.Sequential([
            base,
            layers.Dropout(0.3),
            layers.Dense(256, activation="relu"),
            layers.Dropout(0.3),
            layers.Dense(num_classes, activation="softmax"),
        ])
        model.compile(
            optimizer=keras.optimizers.Adam(1e-3),
            loss="categorical_crossentropy",
            metrics=["accuracy"],
        )
        model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS, verbose=1)

        # Optional: fine-tune last layers
        base.trainable = True
        for layer in base.layers[:-30]:
            layer.trainable = False
        model.compile(
            optimizer=keras.optimizers.Adam(1e-5),
            loss="categorical_crossentropy",
            metrics=["accuracy"],
        )
        model.fit(train_ds, validation_data=val_ds, epochs=3, verbose=1)

        model.save(model_path)
        with open(class_names_path, "w") as f:
            json.dump(class_names, f, indent=2)
        print(f"Model and class_names saved to {MODELS_DIR}")


if __name__ == "__main__":
    main()
    sys.exit(0)
