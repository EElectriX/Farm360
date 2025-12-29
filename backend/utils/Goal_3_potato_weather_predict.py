# utils/goal_3_predict_weather.py

import requests
import numpy as np
import pickle

MODEL_PATH = "Models/Goal_3/potato/potato_model_weather.pkl"
model = pickle.load(open(MODEL_PATH, "rb"))


from dotenv import load_dotenv
import os

load_dotenv()  # loads .env file


API_KEY = os.getenv("OPENWEATHER_API_KEY")
disease_map = {
    0: "Potato__healthy",
    1: "Potato__Early_blight",
    2: "Potato__Late_blight"
}

def predict_from_weather(lat, lon):

    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    response = requests.get(url).json()

    Temperature = response["main"]["temp"]
    Humidity = response["main"]["humidity"]
    Pressure = response["main"]["pressure"]
    Visibility = response.get("visibility", 0)
    Wind_Speed = response["wind"]["speed"]
    Wind_Bearing = response["wind"]["deg"]

    input_data = np.array([[Temperature, Humidity, Wind_Speed,
                            Wind_Bearing, Visibility, Pressure]])

    pred = model.predict(input_data)[0]
    final_label = disease_map.get(pred, "Unknown")

    return {
        "prediction": str(final_label),
        "used_lat_lon": lat is not None and lon is not None,
        "inputs": { 
            "temperature": Temperature,
            "humidity": Humidity,
            "wind_speed": Wind_Speed,
            "pressure": Pressure,
            "visibility": Visibility,
            "wind_bearing": Wind_Bearing
        }
    }
