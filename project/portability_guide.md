# Portability Guide: Running Maniha on a new PC

To run this project on a different machine, follow these steps:

## 1. Prerequisites
- **Node.js** (v18+)
- **Python** (3.9+)
- **MongoDB Atlas Account** (or local MongoDB)

## 2. Dependencies
Run these commands in their respective folders:
- **Backend**: `cd backend && npm install`
- **Frontend**: `cd frontend && npm install`
- **ML Server**: `cd backend/fastapi && pip install -r requirements.txt`

## 3. Environment Variables (.env)
You **MUST** copy the `.env` files manually as they are gitignored.

### backend/.env
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_INTERNAL_TOKEN=maniha
```

### frontend/.env
```env
VITE_API_URL=http://localhost:5000/api
VITE_FASTAPI_URL=http://localhost:8000/api
```

### backend/fastapi/.env (Optional)
```env
NODE_API_URL=http://localhost:5000/api
NODE_INTERNAL_TOKEN=maniha
```

## 4. ML Model Files
Ensure these files exist in `backend/fastapi/`:
- `risk_model.pkl`
- `label_encoder.pkl`

## 5. Starting the Project
1. Start Node: `node server.js`
2. Start FastAPI: `python app.py`
3. Start Frontend: `npm run dev`
