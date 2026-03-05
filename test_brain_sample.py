from ml_models import StrokeSegmentationUNet, StrokeTypeClassifier
import cv2
import os

print("=" * 60)
print("🔬 TESTING WITH BRAIN SAMPLE MRI")
print("=" * 60)

# Initialize models
unet = StrokeSegmentationUNet()
classifier = StrokeTypeClassifier()

# Test with brain_sample.png
image_path = "test_images/brain_sample.png"

if os.path.exists(image_path):
    print(f"\n📂 Testing: {image_path}")
    
    # Process
    image_tensor, metadata = unet.preprocess_image(image_path)
    mask, confidence, volume = unet.predict(image_tensor)
    
    # Classify
    classification = classifier.estimate_hounsfield(unet.original_image, mask)
    emergency = classifier.get_emergency_instructions(classification)
    
    # Results
    print(f"\n✅ RESULTS:")
    print(f"   Type: {classification['type']}")
    print(f"   Confidence: {confidence:.3f}")
    print(f"   Volume: {volume:.2f} mL")
    print(f"   Severity: {classification['severity']}")
    
    # Generate overlay
    overlay, stroke_type = unet.get_overlay(mask=mask)
    cv2.imwrite("brain_sample_result.png", cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))
    print(f"✅ Saved: brain_sample_result.png")
    
    # Generate report
    report = classifier.generate_report(classification, emergency)
    print(f"\n{report}")
else:
    print(f"❌ File not found: {image_path}")