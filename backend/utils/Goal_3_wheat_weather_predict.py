# utils/goal3_wheat_weather.py
import joblib
import numpy as np
import requests
from utils.Fetching_soil_ph_geojson import fetch_soil_ph
MODEL_PATH = "Models/Goal_3/wheat/wheat_crop_health_model_by_parameter.pkl"
ENCODER_PATH = "Models/Goal_3/wheat/wheat_label_encoder_by_parameter.pkl"

model = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)


from dotenv import load_dotenv
import os

load_dotenv()  # loads .env file


API_KEY = os.getenv("OPENWEATHER_API_KEY")

def wheat_weather_predict(lat=None, lon=None):
    """
    If lat/lon is provided → fetch live weather
    If not provided → use default safe values
    """
    
    # ----------------------------
    # CASE 1: lat/lon is provided
    # ----------------------------
    if lat and lon:
        try:
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
            res = requests.get(url).json()

            temp = res.get("main", {}).get("temp", 25)
            humidity = res.get("main", {}).get("humidity", 60)
            pressure = res.get("main", {}).get("pressure", 1000)
            wind_speed = res.get("wind", {}).get("speed", 2)
            clouds = res.get("clouds", {}).get("all", 10)
            rainfall = clouds * 0.8  # 0–80 mm
            soil_ph = fetch_soil_ph(lat, lon)  # fetch soil pH based on lat/lon

        except Exception as e:
            # fallback in case of API failure
            print("Weather API failed:", e)
            temp = 25
            humidity = 60
            pressure = 1000
            wind_speed = 2
            rainfall = 10
            soil_ph = 6.5  

    # ----------------------------
    # CASE 2: No lat/lon provided → use default values
    # ----------------------------
    else:
        temp = 25
        humidity = 60
        pressure = 1000
        wind_speed = 2
        rainfall = 10
        soil_ph = 6.5

    # Build input
    X = np.array([[temp, humidity, rainfall, wind_speed, soil_ph]])

    # Prediction
    pred = int(model.predict(X)[0])
    label = encoder.inverse_transform([pred])[0]

    return {
      "prediction": str(label),

      "used_lat_lon": bool(lat and lon),

      "inputs": {
          "temperature": float(temp),
          "humidity": float(humidity),
          "rainfall_mm": float(rainfall),
          "wind_speed": float(wind_speed),
          "soil_ph": float(soil_ph)
      }
  }
