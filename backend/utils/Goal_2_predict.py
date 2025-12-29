
# model for prediction goal 2 
import os
import re , joblib
import numpy as np
import pandas as pd
import requests
from math import radians, sin, cos, sqrt, atan2
from flask import Flask, request, jsonify, render_template
from sklearn.neighbors import KDTree
from flask_cors import CORS

# --- CONFIG ---
# Update these paths/values to match your environment
GEOJSON_PATH = "Models/Goal_2/wosis_latest.geojson"
SCALER_PATH = "Models/Goal_2/disease_scaler.pkl"
MODEL_PATH = "Models/Goal_2/xgboost_disease_model.pkl"
OPENWEATHER_API_KEY = os.environ.get('OPENWEATHER_API_KEY', '00967c003d1aa577334ce7612061524b')




# --- UTILITIES ---
def load_geojson_points(geojson_path):
    coord_pattern = re.compile(r'"coordinates"\s*:\s*\[\s*([-0-9\.]+)\s*,\s*([-0-9\.]+)\s*\]')
    ph_pattern = re.compile(r'"value_avg"\s*:\s*([0-9\.]+)')

    points = []
    ph_values = []

    with open(geojson_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                coord_match = coord_pattern.search(line)
                ph_match = ph_pattern.search(line)

                if coord_match and ph_match:
                    lon = float(coord_match.group(1))
                    lat = float(coord_match.group(2))
                    ph = float(ph_match.group(1))

                    points.append([lat, lon])
                    ph_values.append(ph)
            except Exception:
                continue

    points = np.array(points)
    ph_values = np.array(ph_values)
    return points, ph_values


def haversine(lat1, lon1, lat2, lon2):
    R = 6371000  # meters
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    return R * 2 * atan2(sqrt(a), sqrt(1-a))


# --- load geojson and build tree once at startup ---
points, ph_values = load_geojson_points(GEOJSON_PATH)
if len(points) == 0:
    print("Warning: loaded 0 geojson points. Check GEOJSON_PATH.")
else:
    tree = KDTree(points, metric='euclidean')


def get_soil_ph(lat, lon):
    if len(points) == 0:
        return 6.5, None
    dist, idx = tree.query([[lat, lon]], k=1)
    nearest_idx = int(idx[0][0])
    nearest_lat, nearest_lon = points[nearest_idx]
    ph_value = float(ph_values[nearest_idx])
    meters = haversine(lat, lon, nearest_lat, nearest_lon)
    return ph_value, meters


# --- Load scaler and model ---
if os.path.exists(SCALER_PATH):
    scaler = joblib.load(SCALER_PATH)
else:
    scaler = None
    print("Warning: scaler not found at", SCALER_PATH)

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    model = None
    print("Warning: model not found at", MODEL_PATH)


# --- Prediction function ---
def estimate_rainfall_from_clouds(cloud_percent):
    # User requested range 0-80 mm mapping (linear)
    return (cloud_percent / 100.0) * 80.0 + 0.02



def goal2_predict(lat, lon):
    # 1) get soil pH
    soil_ph, distance_m = get_soil_ph(lat, lon)

    # 2) get weather
    ow_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
    resp = requests.get(ow_url, timeout=10)
    data = resp.json()

    temperature = data.get('main', {}).get('temp', 25.0)
    humidity = data.get('main', {}).get('humidity', 60.0)
    cloud_percent = data.get('clouds', {}).get('all', 0)
    rainfall = estimate_rainfall_from_clouds(cloud_percent)

    # 3) dataframe
    df = pd.DataFrame([{
        'temperature': float(temperature),
        'humidity': float(humidity),
        'rainfall': float(rainfall),
        'soil_pH': float(soil_ph)
    }])

    if scaler is None or model is None:
        return {"error": "model or scaler missing"}

    X_scaled = scaler.transform(df)
    pred = int(model.predict(X_scaled)[0])

    return {
        "prediction": pred,
        "interpretation": "disease" if pred == 1 else "healthy",
        "input": {
            "lat": lat,
            "lon": lon,
            "temperature": float(temperature),
            "humidity": float(humidity),
            "cloud_percent": int(cloud_percent),
            "estimated_rainfall_mm": float(rainfall),
            "soil_ph": float(soil_ph),
            "soil_distance_m": float(distance_m)
        }
    }
