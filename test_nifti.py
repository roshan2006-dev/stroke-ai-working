from ml_models import StrokeSegmentationUNet, StrokeTypeClassifier
import cv2
import os

print("=" * 60)
print("🔬 TESTING WITH REAL NIfTI MEDICAL SCAN")
print("=" * 60)

# Initialize models
unet = StrokeSegmentationUNet()
classifier = StrokeTypeClassifier()

# Test with the MRI scan
nifti_file = "test_images/test_input/mprage_img.nii"

if os.path.exists(nifti_file):
    print(f"\n📂 Testing: {nifti_file}")
    
    # Process NIfTI file (your preprocess_image handles it!)
    image_tensor, metadata = unet.preprocess_image(nifti_file)
    mask, confidence, volume = unet.predict(image_tensor)
    
    # Classify
    classification = classifier.estimate_hounsfield(unet.original_image, mask)
    emergency = classifier.get_emergency_instructions(classification)
    
    # Results
    print(f"\n✅ RESULTS FROM REAL MRI:")
    print(f"   Type: {classification['type']}")
    print(f"   Confidence: {confidence:.3f}")
    print(f"   Volume: {volume:.2f} mL")
    print(f"   Severity: {classification['severity']}")
    
    # Generate overlay
    overlay, stroke_type = unet.get_overlay(mask=mask)
    cv2.imwrite("nifti_result.png", cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))
    print(f"✅ Saved: nifti_result.png")
    
    # Also try the CT scan if available
    ct_file = "test_images/test_input/ct_img.nii"
    if os.path.exists(ct_file):
        print(f"\n📂 Testing CT scan: {ct_file}")
        ct_tensor, ct_meta = unet.preprocess_image(ct_file)
        ct_mask, ct_conf, ct_vol = unet.predict(ct_tensor)
        ct_class = classifier.estimate_hounsfield(unet.original_image, ct_mask)
        print(f"   CT Result: {ct_class['type']} - {ct_class['severity']}")
    
    # Generate report
    report = classifier.generate_report(classification, emergency)
    print(f"\n{report}")
else:
    print(f"❌ File not found: {nifti_file}")