import base64
import cv2
import numpy as np
import json
from .detector import GazeBlinkDetector

detector = GazeBlinkDetector()

async def handle_websocket_stream(websocket):
    try:
        while True:
            data = await websocket.receive_text()
            if "," in data:
                header, encoded = data.split(",", 1)
            else:
                encoded = data
                
            img_bytes = base64.b64decode(encoded)
            nparr = np.frombuffer(img_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is not None:
                img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                results = detector.process_frame(img_rgb)
                await websocket.send_json(results)
    except Exception as e:
        print(f"WebSocket Error or closed: {e}")
