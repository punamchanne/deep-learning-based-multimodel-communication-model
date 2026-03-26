# GazeSense Communication System

A full-stack web-based assistive communication system that enables users to communicate using eye gaze and blink detection via a webcam.

## Features
- **Real-Time Communication**: Look left/right to navigate choices ("Yes", "No") and blink to select.
- **Microservice Architecture**: Python/FastAPI backend and React/Vite/Tailwind frontend.
- **Computer Vision**: Utilizes OpenCV and MediaPipe for low-latency facial landmark detection (Gaze & Blink).
- **Text-to-Speech (TTS)**: Reads user selections aloud.
- **User Authentication**: Secure authentication with MongoDB to save individual communication logs.

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- Python (3.11+ recommended)
- MongoDB Database (Running on default port `27017`)

### 1. Backend Setup (FastAPI & Computer Vision)

```bash
cd backend
python -m venv .venv
# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/Mac:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup (React & Vite)

```bash
cd frontend
npm install
npm run dev
```

### Usage
- Once both servers are running, access the web app via `http://localhost:5173`.
- Create an account or log in.
- Navigate to the Dashboard and grant webcam access.
- Start communicating through head and eye gestures.
