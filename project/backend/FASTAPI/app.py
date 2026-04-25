from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import joblib
import requests
import os

# Local import
try:
    from .feature_extractor import extract_features_from_files
except ImportError:
    from feature_extractor import extract_features_from_files

# ---------------- ENV & Config ----------------
NODE_API_URL = "http://localhost:5000/api"
NODE_INTERNAL_TOKEN = "maniha"

print(f"ML Server initialized with NODE_API_URL: {NODE_API_URL}")
print(f"ML Server using Internal Token: {NODE_INTERNAL_TOKEN}")

MODEL_PATH = r"risk_model.pkl"
LABEL_ENCODER_PATH = r"label_encoder.pkl"

# ---------------- FastAPI App ----------------
app = FastAPI(title="Startup Risk Prediction API")

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Load ML Model ----------------
try:
    model = joblib.load(MODEL_PATH)
    label_encoder = joblib.load(LABEL_ENCODER_PATH)
except Exception as e:
    print(f"Warning: Failed to load model or label encoder: {e}")
    model = None
    label_encoder = None

# ---------------- Health Check ----------------
@app.get("/api/health")
def health_check():
    return {"status": "ok"}

# ---------------- Predict Risk ----------------
@app.post("/api/predict-risk-files/{idea_id}")
async def predict_risk_files(idea_id: str):
    if not model or not label_encoder:
        raise HTTPException(status_code=500, detail="ML model not loaded")

    # ---- Fetch idea from Node backend ----
    try:
        res = requests.get(
            f"{NODE_API_URL}/ideas/internal/{idea_id}",
            headers={"x-internal-token": NODE_INTERNAL_TOKEN},
            timeout=10
        )
        res.raise_for_status()
        idea = res.json().get("data")
    except requests.HTTPError as e:
        status_code = e.response.status_code
        try:
            detail = e.response.json().get("message", "Node backend returned error")
        except:
            detail = f"Node backend returned {status_code}"
        raise HTTPException(status_code=status_code, detail=f"Node error: {detail}")
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")

    if not idea:
        raise HTTPException(status_code=404, detail="Idea data is empty")

    # ---- Required files ----
    required_files = ["businessPlan", "marketResearch", "financials"]
    missing_files = []

    if not idea.get("files"):
        raise HTTPException(
            status_code=400,
            detail=f"No files found. Missing: {', '.join(required_files)}"
        )

    for key in required_files:
        if key not in idea["files"] or not idea["files"][key]:
            missing_files.append(key)
            
    if missing_files:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required files for risk analysis: {', '.join(missing_files)}" 
        )

    # ---- Download files ----
    files_data = {}
    for key in required_files:
        file_url = f"{NODE_API_URL}/ideas/internal/{idea_id}/files/{key}"
        try:
            r = requests.get(
                file_url, 
                headers={"x-internal-token": NODE_INTERNAL_TOKEN},
                timeout=10
            )
            r.raise_for_status()
            files_data[key] = r.content
        except requests.RequestException:
             # Should be rare if we checked existence, but link could be broken
            raise HTTPException(
                status_code=400,
                detail=f"Failed to download valid file for {key}"
            )

    # ---- Extract features ----
    try:
        features = extract_features_from_files(files_data)
        features_array = np.array([features])
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Feature extraction failed: {str(e)}"
        )

    # ---- Predict risk ----
    try:
        prediction = model.predict(features_array)[0]
        risk = label_encoder.inverse_transform([prediction])[0]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

    return {
        "risk": risk,
        "used_files": list(files_data.keys()),
        "features": features
    }

if __name__ == "__main__":
    import uvicorn
    # Use 127.0.0.1 explicitly to avoid issues with some Windows configs
    uvicorn.run(app, host="127.0.0.1", port=8000)
