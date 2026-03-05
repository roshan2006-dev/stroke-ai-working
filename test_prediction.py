from ml_models import StrokeSegmentationUNet, StrokeTypeClassifier
import cv2
import numpy as np

# Initialize models
print("Loading models...")
unet = StrokeSegmentationUNet()
classifier = StrokeTypeClassifier()

# Create a dummy test image (256x256 black image with a white circle)
test_image = np.zeros((256, 256, 3), dtype=np.uint8)
cv2.circle(test_image, (128, 128), 50, (255, 255, 255), -1)
cv2.imwrite('test_scan.png', test_image)

print("\n🔬 Testing with sample image...")
# Preprocess
image_tensor, metadata = unet.preprocess_image('test_scan.png')

# Get prediction
mask, confidence, volume = unet.predict(image_tensor)
print(f"✅ Segmentation complete")
print(f"   - Confidence: {confidence:.3f}")
print(f"   - Volume: {volume:.3f} mL")

# Classify
classification = classifier.estimate_hounsfield(unet.original_image, mask)
print(f"\n🩺 Classification:")
print(f"   - Type: {classification['type']}")
print(f"   - Severity: {classification['severity']}")
print(f"   - Mean HU: {classification['mean_hu']:.1f}")

# Get emergency instructions
emergency = classifier.get_emergency_instructions(classification)
print(f"\n🚨 Emergency Action: {emergency['action']}")
for instruction in emergency['instructions']:
    print(f"   • {instruction}")

# Generate overlay
overlay, stroke_type = unet.get_overlay(mask=mask)
cv2.imwrite('test_result.png', cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))
print(f"\n✅ Results saved to test_result.png")

# Generate report
report = classifier.generate_report(classification, emergency)
print(f"\n{report}")