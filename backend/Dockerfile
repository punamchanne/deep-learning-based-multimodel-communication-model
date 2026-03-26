FROM python:3.11

WORKDIR /app

# Install system dependencies required by MediaPipe and OpenCV
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip uninstall -y opencv-python opencv-contrib-python && \
    pip install --no-cache-dir opencv-python-headless opencv-contrib-python-headless

COPY . .

# Run the FastAPI server
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
