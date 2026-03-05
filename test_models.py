from ml_models import StrokeSegmentationUNet, StrokeTypeClassifier

print("=" * 50)
print("Testing StrokeSegmentationUNet...")
unet = StrokeSegmentationUNet()
print("✅ U-Net initialized successfully")

print("\nTesting StrokeTypeClassifier...")
classifier = StrokeTypeClassifier()
print("✅ Classifier initialized successfully")

print("\n" + "=" * 50)
print("🎉 All models are ready to use!")
print("=" * 50)