from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Import CORS
import pandas as pd
import xgboost as xgb
import numpy as np

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all routes

# Load the saved model (JSON format)
model = xgb.XGBClassifier()
model.load_model("dropout_model.json")

def preprocess(df):
    # Convert gender to one-hot (gender_F, gender_M)
    df['gender_F'] = (df['gender'] == 'F').astype(int)
    df['gender_M'] = (df['gender'] == 'M').astype(int)

    # Select features used for prediction
    features = ['gpa', 'attendance_rate', 'age', 'gender_F', 'gender_M']
    return df[features]

@app.route('/predict-csv', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # Read CSV into DataFrame
    df = pd.read_csv(file)
    
    # Preprocess features
    X = preprocess(df)
    
    # Get prediction probabilities for class 1 (dropout)
    probs = model.predict_proba(X)[:, 1]
    preds = np.where(probs >= 0.5, "Dropout Risk", "Not at Risk")

    # Build response
    results = []
    for i in range(len(df)):
        results.append({
            "student_id": int(df.loc[i, "student_id"]),
            "prediction": preds[i],
            "probability_dropout": float(probs[i])
        })

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
