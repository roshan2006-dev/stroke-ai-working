from ml_models import StrokeSegmentationUNet
import cv2
import numpy as np
import os

print("=" * 60)
print("🔬 MODEL DEBUG TOOL")
print("=" * 60)

# Initialize model
unet = StrokeSegmentationUNet()

# Test with a completely black image
print("\n📸 Testing with BLACK image (all zeros)...")
black = np.zeros((512, 512, 3), dtype=np.uint8)
cv2.imwrite('test_black.jpg', black)
tensor, _ = unet.preprocess_image('test_black.jpg')
mask, conf, vol = unet.predict(tensor)
print(f"   Result - Confidence: {conf:.3f}, Volume: {vol:.3f} mL")
print(f"   Mask sum: {mask.sum()} pixels")

# Test with a completely white image
print("\n📸 Testing with WHITE image (all 255)...")
white = np.ones((512, 512, 3), dtype=np.uint8) * 255
cv2.imwrite('test_white.jpg', white)
tensor, _ = unet.preprocess_image('test_white.jpg')
mask, conf, vol = unet.predict(tensor)
print(f"   Result - Confidence: {conf:.3f}, Volume: {vol:.3f} mL")
print(f"   Mask sum: {mask.sum()} pixels")

# Test with random noise
print("\n📸 Testing with RANDOM NOISE...")
noise = np.random.randint(0, 255, (512, 512, 3), dtype=np.uint8)
cv2.imwrite('test_noise.jpg', noise)
tensor, _ = unet.preprocess_image('test_noise.jpg')
mask, conf, vol = unet.predict(tensor)
print(f"   Result - Confidence: {conf:.3f}, Volume: {vol:.3f} mL")
print(f"   Mask sum: {mask.sum()} pixels")

print("\n" + "=" * 60)
print("Check the output above. If ALL images give SIMILAR results,")
print("the model is not working correctly and needs to be retrained.")
print("=" * 60)