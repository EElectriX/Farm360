import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier
import joblib

# -----------------------------------------
# 1. Load dataset
# -----------------------------------------
df = pd.read_csv("/kaggle/input/plant-disease-classification/plant_disease_dataset.csv")

# -----------------------------------------
# 2. Select features & target
# -----------------------------------------
features = ["temperature", "humidity", "rainfall", "soil_pH"]
target = "disease_present"

X = df[features]
y = df[target]

# -----------------------------------------
# 3. Train-test split
# -----------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42
)

# -----------------------------------------
# 4. Scaling
# -----------------------------------------
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# -----------------------------------------
# 5. Train XGBoost model
# -----------------------------------------
model = XGBClassifier(
    n_estimators=400,
    max_depth=4,
    learning_rate=0.05,
    subsample=0.9,
    colsample_bytree=0.9,
    eval_metric='logloss',
    random_state=42
)

model.fit(X_train_scaled, y_train)

# -----------------------------------------
# 6. Evaluate
# -----------------------------------------
y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)

print("\nFinal XGBoost Accuracy:", round(accuracy * 100, 2), "%\n")
print("Classification Report:")
print(classification_report(y_test, y_pred))

# -----------------------------------------
# 7. Feature Importance
# -----------------------------------------
importances = model.feature_importances_
for f, s in sorted(zip(features, importances), key=lambda x: -x[1]):
    print(f"{f}: {s:.4f}")

# -----------------------------------------
# 8. SAVE MODEL + SCALER
# -----------------------------------------
joblib.dump(model, "xgboost_disease_model.pkl")
joblib.dump(scaler, "disease_scaler.pkl")

print("\nModel saved as xgboost_disease_model.pkl")
print("Scaler saved as disease_scaler.pkl")
