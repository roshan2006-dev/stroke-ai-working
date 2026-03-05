import os
import nibabel as nib
import numpy as np

nifti_file = "test_images/test_input/mprage_img.nii"
print(f"🔍 Checking: {nifti_file}")
print(f"📁 File exists: {os.path.exists(nifti_file)}")
print(f"📏 File size: {os.path.getsize(nifti_file)} bytes")
print("-" * 50)

try:
    # Load the NIfTI file
    img = nib.load(nifti_file)
    data = img.get_fdata()
    
    print(f"✅ Successfully loaded!")
    print(f"   Shape: {data.shape}")
    print(f"   Data type: {data.dtype}")
    print(f"   Min value: {data.min():.2f}")
    print(f"   Max value: {data.max():.2f}")
    print(f"   Mean value: {data.mean():.2f}")
    print(f"   Has NaN: {np.any(np.isnan(data))}")
    print(f"   Has Inf: {np.any(np.isinf(data))}")
    print(f"   Header: {img.header}")
    
    # Try to visualize a slice
    if len(data.shape) >= 3:
        slice_idx = data.shape[2] // 2
        slice_data = data[:, :, slice_idx]
        print(f"\n📊 Middle slice ({slice_idx}):")
        print(f"   Shape: {slice_data.shape}")
        print(f"   Min: {slice_data.min():.2f}")
        print(f"   Max: {slice_data.max():.2f}")
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()