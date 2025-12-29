# ============================================================
#      RICE LEAF DISEASE PREDICTION - OFFLINE CNN MODEL
# ============================================================

import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Dense, Flatten, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
import matplotlib.pyplot as plt

# -----------------------------
# Dataset Paths
# -----------------------------
train_dir = "/kaggle/input/rice-leafs-disease-dataset/RiceLeafsDisease/train"
valid_dir = "/kaggle/input/rice-leafs-disease-dataset/RiceLeafsDisease/validation"

# -----------------------------
# Image Preprocessing
# -----------------------------
IMG_SIZE = 128
BATCH_SIZE = 32

train_datagen = ImageDataGenerator(
    rescale=1/255.0,
    rotation_range=25,
    zoom_range=0.2,
    width_shift_range=0.1,
    height_shift_range=0.1,
    horizontal_flip=True
)

valid_datagen = ImageDataGenerator(rescale=1/255.0)

train_data = train_datagen.flow_from_directory(
    train_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical"
)

valid_data = valid_datagen.flow_from_directory(
    valid_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical"
)

# -----------------------------
#        OFFLINE CNN MODEL
# -----------------------------
model = Sequential([
    
    Conv2D(32, (3,3), activation="relu", input_shape=(IMG_SIZE, IMG_SIZE, 3)),
    BatchNormalization(),
    MaxPooling2D(),

    Conv2D(64, (3,3), activation="relu"),
    BatchNormalization(),
    MaxPooling2D(),

    Conv2D(128, (3,3), activation="relu"),
    BatchNormalization(),
    MaxPooling2D(),

    Conv2D(256, (3,3), activation="relu"),
    BatchNormalization(),
    MaxPooling2D(),

    Flatten(),

    Dense(256, activation="relu"),
    Dropout(0.4),
    
    Dense(128, activation="relu"),
    Dropout(0.3),

    Dense(6, activation="softmax")   # 6 classes
])

model.compile(
    loss="categorical_crossentropy",
    optimizer=Adam(0.0005),
    metrics=["accuracy"]
)

model.summary()

# -----------------------------
# Train Model
# -----------------------------
history = model.fit(
    train_data,
    validation_data=valid_data,
    epochs=20
)

# -----------------------------
# Plot Accuracy
# -----------------------------
plt.plot(history.history["accuracy"], label="Train Acc")
plt.plot(history.history["val_accuracy"], label="Val Acc")
plt.legend()
plt.title("Accuracy")
plt.show()

# -----------------------------
# Plot Loss
# -----------------------------
plt.plot(history.history["loss"], label="Train Loss")
plt.plot(history.history["val_loss"], label="Val Loss")
plt.legend()
plt.title("Loss")
plt.show()

# -----------------------------
# Save Model
# -----------------------------
model.save("rice_leaf_offline_cnn.h5")

print("✔ Training complete — Offline CNN Model Saved!")
