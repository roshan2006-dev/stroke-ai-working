from ml_models.simple_winner import SimpleWinnerModel
from ml_models.winning_classifier import WinningClassifier
import cv2
import os

print("=" * 60)
print("🧪 TESTING SIMPLE MODEL + CLASSIFIER")
print("=" * 60)

# Initialize models
print("\n📦 Initializing models...")
model = SimpleWinnerModel()
classifier = WinningClassifier()

# Test with different images
test_images = [
    "test_images/test_hemorrhagic.jpg",
    "test_images/test_ischemic.jpg", 
    "test_images/true_normal.jpg"
]

for img_path in test_images:
    if os.path.exists(img_path):
        print(f"\n{'='*40}")
        print(f"📸 Testing: {os.path.basename(img_path)}")
        print(f"{'='*40}")
        
        # Process
        tensor, _ = model.preprocess_image(img_path)
        mask, conf, vol = model.predict(tensor)
        
        # Classify
        result = classifier.classify(model.original_image, mask)
        
        print(f"\n✅ RESULT:")
        print(f"   Type: {result['type']}")
        print(f"   Confidence: {result['confidence']*100:.1f}%")
        print(f"   Volume: {result['volume_ml']:.2f} mL")
        print(f"   Severity: {result['severity']}")
        
        # Show emergency instructions
        emergency = classifier.get_emergency_instructions(result)
        print(f"\n🚨 Emergency: {emergency['action']}")
    else:
        print(f"\n⚠️ Image not found: {img_path}")

print("\n" + "=" * 60)
print("✅ Test complete!")
print("=" * 60)