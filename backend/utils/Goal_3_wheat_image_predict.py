# utils/goal3_wheat_image.py
import tensorflow as tf
import numpy as np
from PIL import Image

MODEL_PATH = "Models/Goal_3/wheat/wheat_leaf_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# auto detect classes
class_names = ["rust", "septoria", "healthy"]  # replace exactly from your dataset

IMG_SIZE = 224


def wheat_image_predict(img_path):
    img = Image.open(img_path).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))
    img_arr = np.array(img) / 255
    img_arr = np.expand_dims(img_arr, axis=0)

    pred = model.predict(img_arr)
    idx = np.argmax(pred)
    conf = float(np.max(pred) * 100)

    return {"prediction": class_names[idx], "confidence": conf}
