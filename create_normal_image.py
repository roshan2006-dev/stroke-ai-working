import cv2
import numpy as np
import os

# Create test_images folder if it doesn't exist
os.makedirs('test_images', exist_ok=True)

print("Creating a truly normal brain image with NO lesions...")

# Create a blank uniform brain image
img = np.ones((512, 512), dtype=np.uint8) * 128  # Uniform gray

# Add very subtle brain-like shape (barely visible)
cv2.ellipse(img, (256,256), (180,140), 0,0,360, 140, -1)

# NO ventricles, NO lesions - just smooth brain

# Add minimal noise
noise = np.random.normal(0, 3, img.shape).astype(np.int16)
img = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)

# Convert to 3-channel
img_rgb = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)

# Save the image
output_path = 'test_images/true_normal.jpg'
cv2.imwrite(output_path, img_rgb)
print(f"✅ Created: {output_path}")
print(f"File exists: {os.path.exists(output_path)}")