# FASTAPI/config.py
from dotenv import load_dotenv
import os

load_dotenv()  # Load .env file

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
NODE_API_URL = "http://localhost:5000"  # Change if your Node backend is deployed
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")
PORT = int(os.getenv("PORT", 5000))
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
