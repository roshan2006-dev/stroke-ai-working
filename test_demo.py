import json
import random

print("=" * 60)
print("STROKE AI DEMO MODE")
print("=" * 60)

# Fake results for different image types
results = {
    "ischemic": {
        "stroke_type": "ISCHEMIC",
        "confidence": 0.92,
        "volume_ml": 24.5,
        "severity": "MODERATE",
        "mean_hu": -38.2,
        "recommendation": "Thrombolytic therapy within 4.5 hours"
    },
    "hemorrhagic": {
        "stroke_type": "HEMORRHAGIC",
        "confidence": 0.94,
        "volume_ml": 38.5,
        "severity": "SEVERE",
        "mean_hu": 72.3,
        "recommendation": "Emergency neurosurgery required"
    },
    "normal": {
        "stroke_type": "NORMAL",
        "confidence": 0.98,
        "volume_ml": 0,
        "severity": "NONE",
        "mean_hu": 0,
        "recommendation": "No abnormalities detected"
    }
}

print("\n📸 Choose test image type:")
print("1. Ischemic Stroke (blood clot)")
print("2. Hemorrhagic Stroke (bleeding)")
print("3. Normal Brain")

choice = input("\nEnter choice (1/2/3): ")

if choice == "1":
    result = results["ischemic"]
    print("\n✅ ISCHEMIC STROKE DETECTED!")
elif choice == "2":
    result = results["hemorrhagic"]
    print("\n✅ HEMORRHAGIC STROKE DETECTED!")
else:
    result = results["normal"]
    print("\n✅ NORMAL BRAIN - No stroke detected")

print(f"\n📊 Results:")
print(f"   Type: {result['stroke_type']}")
print(f"   Confidence: {result['confidence']*100:.1f}%")
print(f"   Volume: {result['volume_ml']} mL")
print(f"   Severity: {result['severity']}")
print(f"   Recommendation: {result['recommendation']}")