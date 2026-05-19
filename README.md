# NeuralEvents 🎫

A premium futuristic event booking platform for concerts, tech conferences, college fests, and live experiences across Hyderabad.

## 🚀 Deployment Guide

### Frontend → Vercel
### Backend → Render

---

## 📁 Project Structure

```
eventPlaner/
├── client/          # React + Vite frontend (deploy to Vercel)
│   ├── vercel.json  # Fixes 404 on page refresh
│   └── src/
└── server/          # Express + MongoDB backend (deploy to Render)
    └── .env.example
```

---

## 🌐 Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import `https://github.com/aruna-1819/neuralEvents`
3. Set **Root Directory** to `client`
4. Set **Framework Preset** to `Vite`
5. Add **Environment Variable**:
   - `VITE_API_URL` = your Render backend URL (e.g. `https://neuralevents-api.onrender.com`)
6. Click **Deploy**

> The `vercel.json` inside `/client` automatically fixes 404 errors on page refresh.

---

## ⚙️ Deploy Backend to Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo: `aruna-1819/neuralEvents`
3. Set **Root Directory** to `server`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add **Environment Variables**:

| Variable | Value |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Any long random secret string |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | Your Vercel frontend URL |
| `PORT` | `5000` |

---

## 🗄️ MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Free cluster
2. Create database: `neuralevents`
3. Add IP: `0.0.0.0/0` (allow all — needed for Render)
4. Get connection string → paste into `MONGO_URI`

---

## 💻 Local Development

```bash
# Terminal 1 - Frontend
cd client
npm install
npm run dev
# → http://localhost:5173

# Terminal 2 - Backend
cd server
npm install
# Create .env from .env.example
npm run server
# → http://localhost:5000
```

---

## ✅ Features

- 🎫 Event booking with QR tickets
- 👤 User authentication (JWT)
- 📊 User dashboard with upcoming events
- ⭐ Review & rating system
- 🎨 Premium glassmorphism UI
- 📱 Fully responsive
- 🔌 Offline fallback (works without backend)
