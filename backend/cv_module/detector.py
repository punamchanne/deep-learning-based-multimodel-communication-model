import cv2
import mediapipe as mp
import numpy as np
import time

mp_face_mesh = mp.solutions.face_mesh

class GazeBlinkDetector:
    def __init__(self):
        self.face_mesh = mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Thresholds
        self.EAR_THRESHOLD = 0.22
        self.SMILE_RATIO = 0.40
        self.MOUTH_OPEN_RATIO = 0.03
        
        # State Tracking for Double Blink
        self.last_blink_time = 0
        self.blink_count = 0
        self.is_blinking = False

    def _dist(self, p1, p2, landmarks):
        return np.linalg.norm(np.array([landmarks[p1].x, landmarks[p1].y]) - np.array([landmarks[p2].x, landmarks[p2].y]))

    def _ear(self, eye_points, landmarks):
        v1 = self._dist(eye_points[1], eye_points[5], landmarks)
        v2 = self._dist(eye_points[2], eye_points[4], landmarks)
        h = self._dist(eye_points[0], eye_points[3], landmarks)
        return (v1 + v2) / (2.0 * h)

    def process_frame(self, img_rgb):
        results = {
            "gaze": "CENTER", "blink": False, "double_blink": False,
            "smile": False, "mouth_open": False, "eyebrows_up": False,
            "head_nod": False, "head_shake": False, "face_detected": False
        }
        
        out = self.face_mesh.process(img_rgb)
        
        if out.multi_face_landmarks:
            results["face_detected"] = True
            landmarks = out.multi_face_landmarks[0].landmark
            
            # Metrics
            face_h = self._dist(10, 152, landmarks)
            face_w = self._dist(234, 454, landmarks)
            
            # 1. Blink & Double Blink Logic
            left_ear = self._ear([33, 160, 158, 133, 153, 144], landmarks)
            right_ear = self._ear([362, 385, 387, 263, 373, 380], landmarks)
            ear = (left_ear + right_ear) / 2.0
            
            if ear < self.EAR_THRESHOLD:
                if not self.is_blinking:
                    self.is_blinking = True
                    curr_time = time.time()
                    # Check if last blink was within 500ms
                    if curr_time - self.last_blink_time < 0.5:
                        results["double_blink"] = True
                        self.last_blink_time = 0 # Reset
                    else:
                        results["blink"] = True
                        self.last_blink_time = curr_time
            else:
                self.is_blinking = False

            # 2. Gaze
            iris_x = landmarks[468].x
            eye_left = landmarks[33].x
            eye_right = landmarks[133].x
            g_ratio = (iris_x - eye_left) / (eye_right - eye_left)
            if g_ratio < 0.45: results["gaze"] = "RIGHT"
            elif g_ratio > 0.55: results["gaze"] = "LEFT"

            # 3. Head Nod & Shake
            nose = landmarks[4]
            forehead = landmarks[10]
            chin = landmarks[152]
            
            # Nod (Pitch) - Looking up or down
            nod_ratio = (nose.y - forehead.y) / (chin.y - forehead.y)
            if nod_ratio < 0.40 or nod_ratio > 0.60: results["head_nod"] = True
            
            # Shake (Yaw) - Looking left or right
            face_w = self._dist(234, 454, landmarks)
            shake_ratio = (nose.x - landmarks[234].x) / face_w
            if shake_ratio < 0.42 or shake_ratio > 0.58: results["head_shake"] = True

            # 4. Others
            if (self._dist(61, 291, landmarks) / face_w) > self.SMILE_RATIO: results["smile"] = True
            if (self._dist(13, 14, landmarks) / face_h) > self.MOUTH_OPEN_RATIO: results["mouth_open"] = True
            if (self._dist(105, 159, landmarks) / face_h) > 0.16: results["eyebrows_up"] = True

        return results

