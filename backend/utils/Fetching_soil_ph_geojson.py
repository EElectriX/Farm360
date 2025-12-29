import warnings
warnings.filterwarnings("ignore", category=UserWarning)

import requests
import json
import pickle
import pandas as pd
from xgboost import XGBClassifier
import joblib # Added joblib import


# ---------------------------------------------------
# 1. GET SOIL DATA FROM SoilGrids API
# ---------------------------------------------------
import re
import numpy as np
from math import radians, sin, cos, sqrt, atan2
from sklearn.neighbors import KDTree

#--------------------------------------------------
# STREAM PARSER FOR CORRUPTED GEOJSON
#--------------------------------------------------

geojson_path = "Models\wosis_latest.geojson"

points = []
ph_values = []

# regex patterns
coord_pattern = re.compile(r'"coordinates"\s*:\s*\[\s*([-0-9\.]+)\s*,\s*([-0-9\.]+)\s*\]')
ph_pattern = re.compile(r'"value_avg"\s*:\s*([0-9\.]+)')

with open(geojson_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            # extract coordinates
            coord_match = coord_pattern.search(line)
            ph_match = ph_pattern.search(line)

            if coord_match and ph_match:
                lon = float(coord_match.group(1))
                lat = float(coord_match.group(2))
                ph = float(ph_match.group(1))

                points.append([lat, lon])
                ph_values.append(ph)

        except:
            continue  # skip corrupted line

points = np.array(points)
ph_values = np.array(ph_values)

print("Loaded valid points:", len(points))

#--------------------------------------------------
# BUILD KD TREE
#--------------------------------------------------

tree = KDTree(points, metric="euclidean")

#--------------------------------------------------
# HAVERSINE DISTANCE
#--------------------------------------------------

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    return R * 2 * atan2(sqrt(a), sqrt(1-a))

#--------------------------------------------------
# NEAREST SOIL PH
#--------------------------------------------------

def get_soil_ph(lat, lon):
    dist, idx = tree.query([[lat, lon]], k=1)
    nearest_idx = idx[0][0]

    nearest_lat, nearest_lon = points[nearest_idx]
    ph_value = ph_values[nearest_idx]

    meters = haversine(lat, lon, nearest_lat, nearest_lon)

    return ph_value, meters

#--------------------------------------------------
# TEST
#--------------------------------------------------

import requests

# def get_location(lat,lon):
#     try:
#         resp = requests.get("https://ipinfo.io/json").json()
#         lat, lon = resp["loc"].split(",")
#         return float(lat), float(lon)
#     except:
#         return None, None

# lat, lon = get_location_from_ip()

# print("Latitude:", lat)
# print("Longitude:", lon)

# lat_test = lat  # example
# lon_test = lon

# ph_value, dist = get_soil_ph(lat_test, lon_test)

# print("Nearest Soil pH:", ph_value)
# print("Distance (meters):", dist)

def fetch_soil_ph(lat, lon):
    ph_value, dist = get_soil_ph(lat, lon)
    return ph_value

