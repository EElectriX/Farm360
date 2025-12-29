# ============================================================
# GOAL 2 : MODEL EVALUATION & GRAPH GENERATION
# (NO RETRAINING REQUIRED)
# ============================================================

import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.metrics import (
    confusion_matrix,
    accuracy_score,
    roc_curve,
    auc,
    precision_recall_curve
)

# ============================================================
# 1. CHANGE THESE PATHS ONLY
# ============================================================

MODEL_PATH = "backend\Models\Goal_2\disease_scaler.pkl"   # model link (.pkl / .joblib)
DATASET_PATH = "/kaggle/input/your-dataset.csv"

FEATURES = [
    "Temperature",
    "Humidity",
    "Rainfall",
    "Wind_Speed",
    "Soil_pH"
]

TARGET = "Crop_Health_Label"   # OR disease label column

OUTPUT_DIR = "goal2_graphs"

# ============================================================
# 2. CREATE OUTPUT FOLDER
# ============================================================

import os
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================
# 3. LOAD MODEL & DATA
# ============================================================

model = joblib.load(MODEL_PATH)
df = pd.read_csv(DATASET_PATH)

df = df[FEATURES + [TARGET]].dropna()

X = df[FEATURES]
y = df[TARGET]

print("Data Loaded:", X.shape)

# ============================================================
# 4. CLASS DISTRIBUTION GRAPH
# ============================================================

plt.figure()
y.value_counts().plot(kind="bar")
plt.title("Class Distribution (Goal 2)")
plt.xlabel("Class")
plt.ylabel("Count")
plt.savefig(f"{OUTPUT_DIR}/class_distribution.png", bbox_inches="tight")
plt.close()

# ============================================================
# 5. FEATURE IMPORTANCE GRAPH
# ============================================================

importances = model.feature_importances_

plt.figure()
plt.barh(FEATURES, importances)
plt.xlabel("Importance Score")
plt.title("Feature Importance (Goal 2)")
plt.savefig(f"{OUTPUT_DIR}/feature_importance.png", bbox_inches="tight")
plt.close()

# ============================================================
# 6. CONFUSION MATRIX
# ============================================================

y_pred = model.predict(X)
cm = confusion_matrix(y, y_pred)

plt.figure()
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix (Goal 2)")
plt.savefig(f"{OUTPUT_DIR}/confusion_matrix.png", bbox_inches="tight")
plt.close()

# ============================================================
# 7. ACCURACY SCORE
# ============================================================

accuracy = accuracy_score(y, y_pred)
print("MODEL ACCURACY:", round(accuracy * 100, 2), "%")

plt.figure()
plt.bar(["Accuracy"], [accuracy])
plt.ylim(0, 1)
plt.title("Model Accuracy (Goal 2)")
plt.savefig(f"{OUTPUT_DIR}/accuracy.png", bbox_inches="tight")
plt.close()

# ============================================================
# 8. ROC CURVE (ONLY IF BINARY CLASS)
# ============================================================

if len(np.unique(y)) == 2:
    y_prob = model.predict_proba(X)[:, 1]

    fpr, tpr, _ = roc_curve(y, y_prob)
    roc_auc = auc(fpr, tpr)

    plt.figure()
    plt.plot(fpr, tpr, label=f"AUC = {roc_auc:.2f}")
    plt.plot([0, 1], [0, 1], linestyle="--")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Curve (Goal 2)")
    plt.legend()
    plt.savefig(f"{OUTPUT_DIR}/roc_curve.png", bbox_inches="tight")
    plt.close()

# ============================================================
# 9. PRECISION–RECALL CURVE (BINARY ONLY)
# ============================================================

if len(np.unique(y)) == 2:
    precision, recall, _ = precision_recall_curve(y, y_prob)

    plt.figure()
    plt.plot(recall, precision)
    plt.xlabel("Recall")
    plt.ylabel("Precision")
    plt.title("Precision–Recall Curve (Goal 2)")
    plt.savefig(f"{OUTPUT_DIR}/precision_recall_curve.png", bbox_inches="tight")
    plt.close()

# ============================================================
# DONE
# ============================================================

print("\nAll Goal 2 graphs saved inside folder:", OUTPUT_DIR)
