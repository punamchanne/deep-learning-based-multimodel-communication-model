import cv2
import mediapipe as mp
import numpy as np

mp_face_mesh = mp.solutions.face_mesh

class GazeBlinkDetector:
    def __init__(self):
        self.face_mesh = mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.3,
            min_tracking_confidence=0.3
        )
        
        # EAR thresholds
        self.EAR_THRESHOLD = 0.23
        
        # Landmark indices (subset for left and right eyes)
        self.LEFT_EYE = [33, 160, 158, 133, 153, 144]
        self.RIGHT_EYE = [362, 385, 387, 263, 373, 380]
        self.LEFT_IRIS = [474, 475, 476, 477]
        
    def _dist(self, p1, p2, landmarks):
        return np.linalg.norm(np.array([landmarks[p1].x, landmarks[p1].y]) - np.array([landmarks[p2].x, landmarks[p2].y]))

    def _ear(self, eye_points, landmarks):
        # Calculate Eye Aspect Ratio
        # Vertical distances
        v1 = self._dist(eye_points[1], eye_points[5], landmarks)
        v2 = self._dist(eye_points[2], eye_points[4], landmarks)
        # Horizontal distance
        h = self._dist(eye_points[0], eye_points[3], landmarks)
        return (v1 + v2) / (2.0 * h)


    def process_frame(self, img_rgb):
        results = {"gaze": "CENTER", "blink": False, "smile": False, "mouth_open": False, "eyebrows_up": False, "face_detected": False}
        out = self.face_mesh.process(img_rgb)
        
        if out.multi_face_landmarks:
            results["face_detected"] = True
            landmarks = out.multi_face_landmarks[0].landmark

            
            # Face scale (for normalization)
            face_h = self._dist(10, 152, landmarks)
            face_w = self._dist(234, 454, landmarks)
            
            # 1. Blink detection
            left_ear = self._ear(self.LEFT_EYE, landmarks)
            right_ear = self._ear(self.RIGHT_EYE, landmarks)
            if (left_ear + right_ear) / 2.0 < self.EAR_THRESHOLD:
                results["blink"] = True
                
            # 2. Gaze Detection (Improved)
            iris_cx = sum([landmarks[i].x for i in self.LEFT_IRIS]) / 4
            iris_cy = sum([landmarks[i].y for i in self.LEFT_IRIS]) / 4
            eye_cx = (landmarks[self.LEFT_EYE[0]].x + landmarks[self.LEFT_EYE[3]].x) / 2
            eye_cy = (landmarks[self.LEFT_EYE[1]].y + landmarks[self.LEFT_EYE[5]].y) / 2
            
            x_diff = iris_cx - eye_cx
            y_diff = iris_cy - eye_cy
            
            # Prioritize Vertical Gaze (Uncomfortable)
            if y_diff > 0.005: 
                results["gaze"] = "DOWN"
            # Inverting Horizontal Gaze to match mirrored webcam
            elif x_diff < -0.006: 
                results["gaze"] = "RIGHT"
            elif x_diff > 0.006: 
                results["gaze"] = "LEFT"
            else: 
                results["gaze"] = "CENTER"



            
            # 3. Smile detection (mouth width / face width)
            mouth_w = self._dist(61, 291, landmarks)
            if (mouth_w / face_w) > 0.42:
                results["smile"] = True

            # 4. Mouth Open detection (lip distance / face height)
            mouth_h = self._dist(13, 14, landmarks)
            if (mouth_h / face_h) > 0.03:
                results["mouth_open"] = True

            # 5. Eyebrows Up detection
            left_eb_dist = self._dist(105, 159, landmarks)
            right_eb_dist = self._dist(334, 386, landmarks)
            if ((left_eb_dist + right_eb_dist) / face_h) > 0.15:
                results["eyebrows_up"] = True


                
        return results

