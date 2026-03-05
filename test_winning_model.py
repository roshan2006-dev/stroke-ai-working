from ml_models import WinningStrokeModel, WinningClassifier
import os
import cv2

print("=" * 60)
print("🏆 TESTING WINNING STROKE MODEL")
print("=" * 60)

# Initialize models
print("\n📦 Initializing models...")
model = WinningStrokeModel()
classifier = WinningClassifier()

# Check test_images folder
test_dir = "test_images"
if not os.path.exists(test_dir):
    os.makedirs(test_dir)
    print(f"📁 Created {test_dir} folder")

# Look for test images
images = []
for ext in ['*.jpg', '*.jpeg', '*.png']:
    import glob
    images.extend(glob.glob(f"{test_dir}/{ext}"))

if not images:
    print("\n⚠️ No test images found in test_images folder")
    print("Please add some test images first")
else:
    for img_path in images[:3]:  # Test first 3 images
        print(f"\n📸 Testing: {img_path}")
        try:
            # Process
            tensor, metadata = model.preprocess_image(img_path)
            mask, confidence, volume = model.predict(tensor)
            
            # Classify
            result = classifier.classify(model.original_image, mask)
            
            print(f"   ✅ Type: {result['type']}")
            print(f"   ✅ Confidence: {result['confidence']*100:.1f}%")
            print(f"   ✅ Volume: {result['volume_ml']:.2f} mL")
            print(f"   ✅ Severity: {result['severity']}")
            
            # Show image stats
            gray = cv2.cvtColor(model.original_image, cv2.COLOR_RGB2GRAY)
            print(f"   📊 Image stats - Mean: {gray.mean():.1f}, Std: {gray.std():.1f}")
            
        except Exception as e:
            print(f"   ❌ Error: {e}")

print("\n" + "=" * 60)
print("✅ Test complete!")
print("=" * 60)