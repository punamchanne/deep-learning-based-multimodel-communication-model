import cv2
import mediapipe as mp
import numpy as np

mp_face_mesh = mp.solutions.face_mesh

class GazeBlinkDetector:
    def __init__(self):
        self.face_mesh = mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5, # Increased confidence
            min_tracking_confidence=0.5
        )
        
        # Threshholds (Refined for better accuracy)
        self.EAR_THRESHOLD = 0.20 # Narrower for deliberate blinks
        self.SMILE_RATIO_THRESHOLD = 0.44 
        self.MOUTH_OPEN_RATIO = 0.04
        
        # Landmark indices
        self.LEFT_EYE = [33, 160, 158, 133, 153, 144]
        self.RIGHT_EYE = [362, 385, 387, 263, 373, 380]
        self.LEFT_IRIS = [474, 475, 476, 477]
        self.RIGHT_IRIS = [469, 470, 471, 472]
        
    def _dist(self, p1, p2, landmarks):
        return np.linalg.norm(np.array([landmarks[p1].x, landmarks[p1].y]) - np.array([landmarks[p2].x, landmarks[p2].y]))

    def _ear(self, eye_points, landmarks):
        v1 = self._dist(eye_points[1], eye_points[5], landmarks)
        v2 = self._dist(eye_points[2], eye_points[4], landmarks)
        h = self._dist(eye_points[0], eye_points[3], landmarks)
        return (v1 + v2) / (2.0 * h)

    def process_frame(self, img_rgb):
        results = {
            "gaze": "CENTER", 
            "blink": False, 
            "smile": False, 
            "mouth_open": False, 
            "eyebrows_up": False, 
            "face_detected": False,
            "head_tilt": "NONE" # New feature
        }
        
        out = self.face_mesh.process(img_rgb)
        
        if out.multi_face_landmarks:
            results["face_detected"] = True
            landmarks = out.multi_face_landmarks[0].landmark
            
            # 1. Face Metrics for normalization
            face_h = self._dist(10, 152, landmarks)
            face_w = self._dist(234, 454, landmarks)
            
            # 2. Blink detection (Deliberate long-blink)
            left_ear = self._ear(self.LEFT_EYE, landmarks)
            right_ear = self._ear(self.RIGHT_EYE, landmarks)
            if (left_ear + right_ear) / 2.0 < self.EAR_THRESHOLD:
                results["blink"] = True
            
            # 3. Gaze Detection (Ratio Based - Much more accurate)
            # We look at the iris horizontal position within the eye socket
            # Left Eye: 33 (outer), 133 (inner)
            iris_x = landmarks[468].x # Left Iris Center
            eye_left = landmarks[33].x
            eye_right = landmarks[133].x
            
            # Ratio: 0 (Right), 1 (Left)
            gaze_ratio = (iris_x - eye_left) / (eye_right - eye_left)
            
            if gaze_ratio < 0.42: 
                results["gaze"] = "RIGHT" # Mirrored logic
            elif gaze_ratio > 0.58: 
                results["gaze"] = "LEFT"
            else:
                # Check vertical gaze using center landmarks
                iris_y = landmarks[468].y
                eye_top = (landmarks[159].y + landmarks[160].y) / 2
                eye_bottom = (landmarks[144].y + landmarks[153].y) / 2
                v_ratio = (iris_y - eye_top) / (eye_bottom - eye_top)
                
                if v_ratio > 0.65: results["gaze"] = "DOWN"
                else: results["gaze"] = "CENTER"

            # 4. Smile & Mouth
            mouth_w = self._dist(61, 291, landmarks)
            if (mouth_w / face_w) > self.SMILE_RATIO_THRESHOLD:
                results["smile"] = True

            mouth_h = self._dist(13, 14, landmarks)
            if (mouth_h / face_h) > self.MOUTH_OPEN_RATIO:
                results["mouth_open"] = True

            # 5. Eyebrows
            eb_dist = (self._dist(105, 159, landmarks) + self._dist(334, 386, landmarks)) / 2
            if (eb_dist / face_h) > 0.16:
                results["eyebrows_up"] = True

            # 6. Head Pose (New - Highly Reliable)
            # Use nose tip vs face edges to detect tilt
            nose = landmarks[4].x
            if (nose - landmarks[234].x) / face_w < 0.40:
                results["head_tilt"] = "RIGHT"
            elif (nose - landmarks[234].x) / face_w > 0.60:
                results["head_tilt"] = "LEFT"

        return results

