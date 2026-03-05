from PIL import Image
import numpy as np
import os

image_path = "test_images/Demo1.jpg"  # Update path to your image

if os.path.exists(image_path):
    img = Image.open(image_path)
    print(f"Image: {image_path}")
    print(f"Size: {img.size}")
    print(f"Mode: {img.mode}")
    
    img_array = np.array(img)
    print(f"Array shape: {img_array.shape}")
else:
    print(f"File not found: {image_path}")