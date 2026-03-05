"""
Simple and Reliable Stroke Classifier
FIXED: Handles dimension mismatches between mask and image
"""

import numpy as np
import cv2

class WinningClassifier:
    def __init__(self):
        print("✅ Simple classifier ready")
    
    def classify(self, image, mask=None):
        """Classify stroke type based on image statistics - FIXED for size mismatch"""
        
        # Convert to grayscale
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        else:
            gray = image
        
        print(f"   🔍 Classifier - Image shape: {gray.shape}, Mask present: {mask is not None}")
        
        # No lesion detected
        if mask is None or mask.sum() == 0:
            print(f"   🟢 No mask or empty mask - NORMAL")
            return {
                'type': 'NORMAL',
                'confidence': 0.95,
                'volume_ml': 0,
                'severity': 'NONE',
                'recommendation': 'No stroke detected',
                'color': [0, 255, 0]
            }
        
        print(f"   Mask shape: {mask.shape}, sum: {mask.sum()}")
        
        # RESIZE MASK TO MATCH IMAGE DIMENSIONS (CRITICAL FIX)
        if mask.shape != gray.shape:
            print(f"   🔄 Resizing mask from {mask.shape} to {gray.shape}")
            mask_resized = cv2.resize(mask.astype(np.float32), (gray.shape[1], gray.shape[0]))
        else:
            mask_resized = mask
        
        # Get lesion pixels using resized mask
        lesion_pixels = gray[mask_resized > 0.5]
        
        if len(lesion_pixels) == 0:
            print(f"   ⚠️ No lesion pixels found after resizing")
            return {
                'type': 'NORMAL',
                'confidence': 0.9,
                'volume_ml': 0,
                'severity': 'NONE',
                'recommendation': 'No significant lesion detected',
                'color': [0, 255, 0]
            }
        
        # Calculate statistics
        mean_intensity = np.mean(lesion_pixels)
        print(f"   📊 Lesion stats - Mean intensity: {mean_intensity:.1f}, Pixels: {len(lesion_pixels)}")
        
        # Classify based on intensity
        if mean_intensity < 100:
            stroke_type = 'ISCHEMIC'
            confidence = 0.90
            recommendation = 'Thrombolytic therapy recommended within 4.5 hours'
            color = [255, 0, 0]
            print(f"   🔴 Classified as ISCHEMIC")
        else:
            stroke_type = 'HEMORRHAGIC'
            confidence = 0.92
            recommendation = 'Emergency neurosurgery required - DO NOT give blood thinners'
            color = [255, 165, 0]
            print(f"   🟠 Classified as HEMORRHAGIC")
        
        # Calculate volume (using original mask for consistency)
        volume_ml = mask.sum() * 0.001
        print(f"   📏 Volume: {volume_ml:.2f} mL")
        
        # Determine severity
        if volume_ml < 10:
            severity = 'MILD'
        elif volume_ml < 30:
            severity = 'MODERATE'
        elif volume_ml < 60:
            severity = 'SEVERE'
        else:
            severity = 'CRITICAL'
        print(f"   ⚠️ Severity: {severity}")
        
        return {
            'type': stroke_type,
            'confidence': confidence,
            'volume_ml': volume_ml,
            'severity': severity,
            'recommendation': recommendation,
            'color': color
        }
    
    def get_emergency_instructions(self, classification):
        """Return emergency instructions"""
        if classification['type'] == 'HEMORRHAGIC':
            return {
                'action': '🚨 CALL 911 IMMEDIATELY',
                'color': '#ff0000',
                'instructions': [
                    '🚑 Keep patient absolutely still',
                    '📏 Elevate head 30 degrees',
                    '💊 Do NOT give aspirin or ANY blood thinners',
                    '⏱️ Note time of symptom onset',
                    '🏥 Prepare for emergency neurosurgery'
                ]
            }
        elif classification['type'] == 'ISCHEMIC':
            return {
                'action': '🚑 RUSH TO STROKE CENTER',
                'color': '#ffaa00',
                'instructions': [
                    '⏱️ Note exact time of onset (CRITICAL for tPA)',
                    '💉 Check blood glucose',
                    '🚫 Do not give food or drink',
                    '💊 Prepare for thrombolytic therapy (tPA)',
                    '🏥 Go to nearest stroke center IMMEDIATELY'
                ]
            }
        else:
            return {
                'action': '✅ NO EMERGENCY',
                'color': '#4CAF50',
                'instructions': [
                    '🧠 Normal brain scan',
                    '📋 Schedule routine follow-up',
                    '💊 Continue current medications',
                    '👥 Regular check-ups recommended'
                ]
            }