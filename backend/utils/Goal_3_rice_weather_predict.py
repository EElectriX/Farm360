# utils/goal3_rice_weather.py
import joblib
import numpy as np
import requests
from utils.Fetching_soil_ph_geojson import fetch_soil_ph

MODEL_PATH = "Models/Goal_3/rice/rice_crop_health_model_by_parameter.pkl"
ENCODER_PATH = "Models/Goal_3/rice/rice_label_encoder_by_parameter.pkl"

model = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)
from dotenv import load_dotenv
import os

load_dotenv()  # loads .env file


API_KEY = os.getenv("OPENWEATHER_API_KEY")


def rice_weather_predict(lat=None, lon=None):

    # ---------------------------
    # 1) If lat/lon provided → try weather API
    # ---------------------------
    if lat is not None and lon is not None:
        try:
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
            res = requests.get(url).json()

            temp = float(res["main"]["temp"])
            humidity = float(res["main"]["humidity"])
            pressure = float(res["main"]["pressure"])
            wind_speed = float(res["wind"]["speed"])
            clouds = float(res["clouds"]["all"])

            rainfall = clouds * 0.8 + 0.02

            # Soil pH from your geojson
            try:
                soil_ph = float(fetch_soil_ph(lat, lon))
            except:
                soil_ph = 6.5  # safe fallback

        except Exception as e:
            print("Weather API failed:", e)

            # Defaults
            temp = 28
            humidity = 70
            pressure = 1005
            wind_speed = 2
            rainfall = 10
            soil_ph = 6.5

    else:
        # ---------------------------
        # 2) No lat/lon → use default parameters
        # ---------------------------
        temp = 28
        humidity = 70
        pressure = 1005
        wind_speed = 2
        rainfall = 10
        soil_ph = 6.5

    # ---------------------------
    # Prepare input for model
    # ---------------------------
    X = np.array([[temp, humidity, rainfall, wind_speed, soil_ph]])

    pred = int(model.predict(X)[0])
    label = encoder.inverse_transform([pred])[0]

    return {
        "prediction": str(label),
        "used_lat_lon": lat is not None and lon is not None,
        "inputs": {
            "temperature": temp,
            "humidity": humidity,
            "rainfall_mm": rainfall,
            "wind_speed": wind_speed,
            "soil_ph": soil_ph
        }
    }
