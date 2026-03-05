from ml_models import StrokeSegmentationUNet, StrokeTypeClassifier
import cv2
import numpy as np
import matplotlib.pyplot as plt

# Initialize models
print("Loading models...")
unet = StrokeSegmentationUNet()
classifier = StrokeTypeClassifier()

# Create a REALISTIC brain scan-like image (grayscale with brain-like patterns)
def create_realistic_brain_scan():
    """Create a simulated brain CT scan image"""
    # Create base image (grayscale)
    img = np.zeros((512, 512), dtype=np.uint8)
    
    # Add brain-like elliptical shape
    cv2.ellipse(img, (256, 256), (200, 150), 0, 0, 360, 100, -1)
    
    # Add ventricles (dark spots)
    cv2.ellipse(img, (200, 220), (30, 20), 0, 0, 360, 30, -1)
    cv2.ellipse(img, (312, 220), (30, 20), 0, 0, 360, 30, -1)
    
    # Add some texture (noise) to make it look realistic
    noise = np.random.normal(0, 15, img.shape).astype(np.int16)
    img = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    
    # Add a stroke lesion (bright spot for hemorrhagic or dark for ischemic)
    # This one will be ischemic (dark area)
    cv2.circle(img, (300, 280), 40, 40, -1)  # Dark lesion
    
    # Convert to 3-channel for the model
    img_rgb = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
    
    return img_rgb, img

# Create realistic scan
realistic_scan, grayscale_scan = create_realistic_brain_scan()
cv2.imwrite('realistic_scan.png', cv2.cvtColor(realistic_scan, cv2.COLOR_RGB2BGR))

print("\n🔬 Testing with realistic brain scan...")

# Save original for reference
cv2.imwrite('original_scan.png', grayscale_scan)

# Preprocess
image_tensor, metadata = unet.preprocess_image('realistic_scan.png')

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

# Generate overlay with proper medical colors
overlay, stroke_type = unet.get_overlay(mask=mask)

# Create a professional medical visualization
fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# Original scan
axes[0].imshow(grayscale_scan, cmap='gray')
axes[0].set_title('Original Brain CT Scan', fontsize=14, fontweight='bold')
axes[0].axis('off')

# Segmentation mask
axes[1].imshow(mask, cmap='hot')
axes[1].set_title(f'AI Detection: {classification["type"]}', fontsize=14, fontweight='bold')
axes[1].axis('off')

# Overlay result
overlay_rgb = cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR)
axes[2].imshow(cv2.cvtColor(overlay, cv2.COLOR_RGB2RGB))
axes[2].set_title(f'Result: {volume:.1f} mL Lesion', fontsize=14, fontweight='bold')
axes[2].axis('off')

plt.tight_layout()
plt.savefig('medical_report.png', dpi=150, bbox_inches='tight')
plt.show()

print(f"\n✅ Medical report saved to medical_report.png")

# Generate professional report
report = classifier.generate_report(classification, emergency)
print(f"\n{report}")

# Also save the overlay separately
cv2.imwrite('lesion_overlay.png', cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))
print(f"✅ Lesion overlay saved to lesion_overlay.png")

# Print actual colors used
print(f"\n🎨 Visualization Colors:")
print(f"   - Ischemic lesions: 🔴 RED (dark areas in scan)")
print(f"   - Hemorrhagic lesions: 🟠 ORANGE (bright areas in scan)")
print(f"   - Normal tissue: preserved in grayscale")