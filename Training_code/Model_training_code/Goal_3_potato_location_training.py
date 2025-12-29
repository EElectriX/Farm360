import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier
import pickle

# ---------------------------
# 1. LOAD DATA
# ---------------------------
df = pd.read_csv("/kaggle/input/potato-leaf-disease-based-on-weather-details/Disease with Weather.csv")   # change filename if needed

# ---------------------------
# 2. SELECT FEATURES
# ---------------------------
features = [
    "Temperature",
    "Humidity",
    "Wind Speed",
    "Wind Bearing",
    "Visibility",
    "Pressure"
]

target = "Disease in number"

X = df[features]
y = df[target]

# ---------------------------
# 3. TRAIN-TEST SPLIT
# ---------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

# ---------------------------
# 4. TRAIN MODEL (XGBOOST)
# ---------------------------
model = XGBClassifier(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    eval_metric="mlogloss"
)

model.fit(X_train, y_train)

# ---------------------------
# 5. EVALUATE
# ---------------------------
pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, pred))
print("\nClassification Report:\n", classification_report(y_test, pred))

# ---------------------------
# 6. SAVE MODEL
# ---------------------------
pickle.dump(model, open("potato_disease_model.pkl", "wb"))
print("\nModel saved as potato_disease_model.pkl")

