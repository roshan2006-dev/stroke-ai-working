"""
U-Net Model for Stroke Segmentation (Hackathon Production Version)
"""

import torch
import numpy as np
import cv2
import os
import segmentation_models_pytorch as smp


class StrokeSegmentationUNet:
    """
    U-Net with ResNet50 encoder for stroke lesion segmentation
    """

    def __init__(self, num_classes=1, encoder_name='resnet50', model_path=None):

        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"Using device: {self.device}")

        self.model = smp.Unet(
            encoder_name=encoder_name,
            encoder_weights='imagenet',
            in_channels=3,
            classes=num_classes,
            activation='sigmoid'
        )

        if model_path and os.path.exists(model_path):
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
            print(f"✅ Model loaded from {model_path}")
        else:
            print("⚠️ No trained weights provided. Using ImageNet encoder only.")

        self.model.to(self.device)
        self.model.eval()

        self.original_image = None

    # =====================================================
    # IMAGE PREPROCESSING
    # =====================================================

    def preprocess_image(self, image_path):

        if not os.path.exists(image_path):
            raise ValueError(f"File not found: {image_path}")

        print(f"\n📂 Processing file: {image_path}")

        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Could not read image")

        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        self.original_image = image.copy()

        image_resized = cv2.resize(image, (256, 256))

        image_tensor = torch.from_numpy(image_resized).float() / 255.0
        image_tensor = image_tensor.permute(2, 0, 1).unsqueeze(0)

        print(f"   ✅ Image processed: {image.shape}")

        return image_tensor.to(self.device), {"format": "image"}

    # =====================================================
    # SMART FALLBACK REGION DETECTION
    # =====================================================

    def fallback_region_detection(self, gray_image):

        # Contrast enhancement
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray_image)

        blurred = cv2.GaussianBlur(enhanced, (5, 5), 0)

        thresh = cv2.adaptiveThreshold(
            blurred,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY_INV,
            11,
            2
        )

        kernel = np.ones((3, 3), np.uint8)
        cleaned = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)

        return cleaned

    # =====================================================
    # PREDICTION
    # =====================================================

    def predict(self, image_tensor, threshold=0.5, min_volume=0.5):

        self.model.eval()

        with torch.no_grad():

            output = self.model(image_tensor)

            output_min = output.min().item()
            output_max = output.max().item()
            output_mean = output.mean().item()

            print(f"   📊 Output stats - Min: {output_min:.3f}, Max: {output_max:.3f}, Mean: {output_mean:.3f}")

            mask = (output > threshold).float()
            voxel_count = mask.sum().item()

            volume_ml = voxel_count * 0.001

            print(f"   📏 Voxels detected: {voxel_count}")
            print(f"   📦 Estimated volume: {volume_ml:.3f} mL")

            # -------------------------
            # CLEAN INVALID MASKS
            # -------------------------

            if voxel_count == 0:
                print("   🟢 No lesion detected from U-Net")
                return self._fallback(image_tensor), output_mean, 0.0

            if volume_ml < min_volume:
                print("   🟢 Small region detected - likely noise")
                return self._fallback(image_tensor), output_mean, 0.0

            coverage = voxel_count / (256 * 256)
            if coverage > 0.6:
                print("   ⚠️ Unrealistic mask coverage - ignoring")
                return self._fallback(image_tensor), output_mean, 0.0

            print("   🔴 Valid lesion detected from U-Net")

            return mask.cpu().numpy()[0, 0], output_mean, volume_ml

    # =====================================================
    # FALLBACK LOGIC
    # =====================================================

    def _fallback(self, image_tensor):

        print("   🔄 Activating smart fallback detection")

        img = image_tensor.cpu().numpy()[0]
        img = np.transpose(img, (1, 2, 0))
        img = (img * 255).astype(np.uint8)

        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

        region_mask = self.fallback_region_detection(gray)

        area_ratio = np.sum(region_mask > 0) / region_mask.size

        if area_ratio < 0.01:
            print("   🟢 Fallback: Normal brain")
            return np.zeros((256, 256))

        print("   🔴 Fallback detected abnormal region")

        return region_mask / 255

    # =====================================================
    # OVERLAY
    # =====================================================

    def get_overlay(self, original_image=None, mask=None):

        if original_image is None:
            original_image = self.original_image

        if mask is None or np.sum(mask) == 0:
            return original_image, "NORMAL"

        target_h, target_w = original_image.shape[:2]
        mask_resized = cv2.resize(mask.astype(np.float32), (target_w, target_h))

        overlay = original_image.copy()

        gray = cv2.cvtColor(original_image, cv2.COLOR_RGB2GRAY)
        lesion_pixels = gray[mask_resized > 0.5]

        if len(lesion_pixels) > 0:

            mean_intensity = np.mean(lesion_pixels)

            if mean_intensity < 100:
                color = [255, 0, 0]
                stroke_type = "ISCHEMIC"
            else:
                color = [255, 165, 0]
                stroke_type = "HEMORRHAGIC"

        else:
            color = [0, 255, 0]
            stroke_type = "NORMAL"

        overlay[mask_resized > 0.5] = color
        result = cv2.addWeighted(original_image, 0.7, overlay, 0.3, 0)

        return result, stroke_type