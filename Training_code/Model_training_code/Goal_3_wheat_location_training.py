import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier

# Load dataset
file_path = "/kaggle/input/crop-health-and-environmental-stress-dataset/agriculture_dataset.csv"
df = pd.read_csv(file_path)

# Filter only rice
df = df[df["Crop_Type"].str.lower().str.strip() == "wheat"]

# Select features
features = ["Temperature", "Humidity", "Rainfall", "Wind_Speed", "Soil_pH"]
target = "Crop_Health_Label"
df = df[features + [target]].dropna()

# Prepare X and y
X = df[features].values
y = df[target].values
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

# Train XGBoost
num_classes = len(label_encoder.classes_)
model = XGBClassifier(
    n_estimators=500,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="multi:softmax",
    num_class=num_classes,
    eval_metric="mlogloss",
    use_label_encoder=False,
    random_state=42
)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print("MODEL ACCURACY:", accuracy)
class_names = [str(c) for c in label_encoder.classes_]
print(classification_report(y_test, y_pred, target_names=class_names))

# Save model
joblib.dump(model, "wheat_crop_health_model_by_parameter.pkl")
joblib.dump(label_encoder, "wheat_label_encoder_by_parameter.pkl")
print("Model and Label Encoder Saved Successfully!")
