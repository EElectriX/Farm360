# utils/goal3_rice_image.py
import tensorflow as tf
import numpy as np
from PIL import Image

MODEL_PATH = "Models/Goal_3/rice/rice_leaf_offline_cnn.h5"
model = tf.keras.models.load_model(MODEL_PATH)

class_names = [
    'bacterial_leaf_blight',
    'brown_spot',
    'healthy',
    'leaf_blast',
    'leaf_scald',
    'narrow_brown_spot'
]

IMG_SIZE = 128


def rice_image_predict(img_path):
    img = Image.open(img_path).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))
    img_arr = np.array(img) / 255.0
    img_arr = np.expand_dims(img_arr, axis=0)

    pred = model.predict(img_arr)
    idx = np.argmax(pred)
    conf = float(np.max(pred) * 100)

    return {"prediction": class_names[idx], "confidence": conf}
