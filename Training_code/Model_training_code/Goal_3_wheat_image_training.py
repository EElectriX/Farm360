# ============================================================
# 1. IMPORTS
# ============================================================
import tensorflow as tf
import numpy as np
import os

IMG_SIZE = 224
BATCH_SIZE = 32
DATA_DIR = "/kaggle/input/wheat-plant-diseases/data/train"

print("TF Version:", tf.__version__)

# ============================================================
# 2. SAFE IMAGE DECODER (SKIPS CORRUPTED IMAGES)
# ============================================================
def safe_decode(path):
    try:
        img_bytes = tf.io.read_file(path)
        img = tf.io.decode_image(img_bytes, channels=3, expand_animations=False)
        img = tf.image.resize(img, (IMG_SIZE, IMG_SIZE))
        img = img / 255.0
        return img
    except:
        return None

# ============================================================
# 3. CREATE CLEAN DATASET LIST
# ============================================================
image_paths = []
labels = []

class_names = sorted(os.listdir(DATA_DIR))
class_map = {name: i for i, name in enumerate(class_names)}

print("Classes:", class_map)

for cls in class_names:
    cls_path = os.path.join(DATA_DIR, cls)
    for fname in os.listdir(cls_path):
        fpath = os.path.join(cls_path, fname)
        try:
            img_bytes = tf.io.read_file(fpath)
            tf.io.decode_image(img_bytes, channels=3, expand_animations=False)
            image_paths.append(fpath)
            labels.append(class_map[cls])
        except:
            print("Skipping bad file:", fpath)

image_paths = np.array(image_paths)
labels = np.array(labels)

print("Total Clean Images:", len(image_paths))

# ============================================================
# 4. TF DATASET PIPELINE
# ============================================================
def load_fn(path, label):
    img = safe_decode(path)
    if img is None:
        return tf.zeros((IMG_SIZE, IMG_SIZE, 3)), -1
    return img, label

ds = tf.data.Dataset.from_tensor_slices((image_paths, labels))
ds = ds.map(lambda p, l: load_fn(p, l), num_parallel_calls=tf.data.AUTOTUNE)
ds = ds.filter(lambda img, lbl: lbl >= 0)

# Split dataset
val_size = int(0.2 * len(image_paths))

val_ds = ds.take(val_size).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)
train_ds = ds.skip(val_size).shuffle(1000).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

# ============================================================
# 5. CNN MODEL (NO INTERNET, NO DOWNLOAD REQUIRED)
# ============================================================
from tensorflow.keras import layers, models

model = models.Sequential([
    layers.Conv2D(32, 3, activation="relu", input_shape=(IMG_SIZE, IMG_SIZE, 3)),
    layers.MaxPooling2D(),

    layers.Conv2D(64, 3, activation="relu"),
    layers.MaxPooling2D(),

    layers.Conv2D(128, 3, activation="relu"),
    layers.MaxPooling2D(),

    layers.Flatten(),
    layers.Dense(128, activation="relu"),
    layers.Dropout(0.3),

    layers.Dense(len(class_names), activation="softmax")
])

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# ============================================================
# 6. TRAIN MODEL
# ============================================================
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=10
)

# ============================================================
# 7. SAVE MODEL
# ============================================================
model.save("wheat_disease_model.h5")
print("Model saved!")
