from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os

# Import your modules
from utils.Goal_2_predict import goal2_predict
from utils.Goal_3_potato_image_predict import goal3_potato_predict
from utils.Goal_3_potato_weather_predict import predict_from_weather
from utils.Goal_3_rice_image_predict import rice_image_predict
from utils.Goal_3_rice_weather_predict import rice_weather_predict

from utils.Goal_3_wheat_image_predict import wheat_image_predict
from utils.Goal_3_wheat_weather_predict import wheat_weather_predict

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "static"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return render_template("index.html")


# ==========================
#     GOAL 2 API
# ==========================
@app.route("/predict/goal2", methods=["POST"])
def predict_goal2():
    try:
        payload = request.get_json() or request.form
        lat = payload.get("lat")
        lon = payload.get("lon")

        if lat is None or lon is None:
            return jsonify({"error": "lat and lon required"}), 400

        result = goal2_predict(float(lat), float(lon))
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================
#     GOAL 3 API
# ==========================
# utils/goal_3_predict_weather.py

def majority_vote(pred1, pred2=None):
    if pred2 is None:
        return pred1  # only image prediction available

    if pred1 == pred2:
        return pred1

    # If mismatch → Image is more reliable
    return pred1

def safe_float(x):
        try:
            return float(x)
        except:
            return None

@app.route("/predict/goal3/Potato", methods=["POST"])
def predict_goal3_potato():
        file = request.files["file"]
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        image_result = goal3_potato_predict(file_path)
        print("------------------------------------------------------------Image Prediction Result:", image_result)
        print("------------------------------------------------------------Request Form Data:", request.form)
        lat = safe_float(request.form.get("lat"))
        lon = safe_float(request.form.get("lon"))

        weather_result = None
        if lat is not None and lon is not None:
            weather_result = predict_from_weather(lat, lon)

        return jsonify({
            "image_prediction": image_result,
            "weather_prediction": weather_result,
            "final_prediction": image_result["prediction"],
            "image_url": file_path
        })

   
@app.route("/predict/goal3/Rice", methods=["POST"])
def predict_goal3_rice():
    file = request.files["file"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    lat = safe_float(request.form.get("lat"))
    lon = safe_float(request.form.get("lon"))

    image_res = rice_image_predict(file_path)
    weather_res = None

    if lat and lon:
        weather_res = rice_weather_predict(lat, lon)

    final = image_res["prediction"]
    if weather_res:
        # majority voting
        if weather_res["prediction"] != image_res["prediction"]:
            final = f"{image_res['prediction']} / {weather_res['prediction']}"

    return jsonify({
        "image_prediction": image_res,
        "weather_prediction": weather_res,
        "final_prediction": final,
        "image_url": file_path
    })




@app.route("/predict/goal3/Wheat", methods=["POST"])
def predict_goal3_wheat():
    file = request.files["file"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    lat = safe_float(request.form.get("lat"))
    lon = safe_float(request.form.get("lon"))


    image_res = wheat_image_predict(file_path)
    weather_res = None

    if lat and lon:
        weather_res = wheat_weather_predict(lat, lon)

    final = image_res["prediction"]
    if weather_res:
        if weather_res["prediction"] != image_res["prediction"]:
            final = f"{image_res['prediction']} / {weather_res['prediction']}"

    return jsonify({
        "image_prediction": image_res,
        "weather_prediction": weather_res,
        "final_prediction": final,
        "image_url": file_path
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
