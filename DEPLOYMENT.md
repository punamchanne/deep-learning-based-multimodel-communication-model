# GazeSense Deployment Guide

This document provides step-by-step instructions to deploy the GazeSense platform to production using free cloud services.

---

## 🚀 1. Deploying the Backend (FastAPI + WebSocket)

We recommend deploying the backend on **Render**, **Railway**, or **Koyeb** since they offer good support for Python, WebSockets, and free tiers.

### Recommended Platform: [Render (render.com)](https://render.com/)

**Steps:**
1. Log in to Render and click **New+** \> **Web Service**.
2. Connect your GitHub repository (`punamchanne/deep-learning-based-multimodel-communication-model`).
3. Set the following configuration:
   - **Name**: `gazesense-backend`
   - **Root Directory**: `backend` (Important: Specify the `backend` folder)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables**: Open the "Advanced" section and add the variables from your `backend/.env`:
   - `MONGO_URL`: `mongodb+srv://punamproject:punamproject%40123@road2tech.vajimqu.mongodb.net/?appName=road2tech`
   - `SECRET_KEY`: `yoursecretkeyhere`
5. Click **Create Web Service**. 
6. Wait for the deploy to finish. Render will give you a URL (e.g., `https://gazesense-backend.onrender.com`).

**Save this URL!** You will need it for the frontend.

---

## 🌐 2. Deploying the Frontend (React + Vite)

We recommend deploying the frontend to **Vercel** or **Netlify** for their speed and native support for React/Vite.

### Recommended Platform: [Vercel (vercel.com)](https://vercel.com/)

**Steps:**
1. First, make sure you know the backend URL you got from Render (or Railway). Let's assume it is `https://gazesense-backend.onrender.com`.
2. Determine the WebSocket URL: Replace `https://` with `wss://`. Your WebSocket URL will be `wss://gazesense-backend.onrender.com`.
3. Log in to Vercel and click **Add New** \> **Project**.
4. Import your GitHub repository (`punamchanne/deep-learning-based-multimodel-communication-model`).
5. Set the following configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (Important: Select the `frontend` folder)
6. **Environment Variables**: Open the "Environment Variables" section and set the following based on your backend URL:
   - `VITE_API_URL`: `https://gazesense-backend.onrender.com`
   - `VITE_WS_URL`: `wss://gazesense-backend.onrender.com`
7. Click **Deploy**.
8. Wait for Vercel to finish building.

## 🎉 You're Done!
Once Vercel finishes, click the domain they provide to use your live, deployed **GazeSense** application from anywhere!
