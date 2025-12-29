# utils/Goal_3_predict.py
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os

# Load model once
MODEL_PATH = "Models/Goal_3/potato/potato_model_image.h5"
model = load_model(MODEL_PATH)

# Class Names
class_names = ["Potato__Early_blight", "Potato__Late_blight", "Potato__healthy"]

# Auto detect model input size
IMG_SIZE = model.input_shape[1]


def preprocess(img_path):
    img = image.load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
    img = image.img_to_array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img


def goal3_potato_predict(img_path):
    img_array = preprocess(img_path)
    pred = model.predict(img_array)

    label = class_names[np.argmax(pred)]
    confidence = float(np.max(pred) * 100)

    return {
        "prediction": label,
        "confidence": confidence
    }
