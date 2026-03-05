"""
ML Models Package - Complete with ALL models
Contains original backup models, winning MONAI models, and simple working models
"""

# ============================================
# ORIGINAL MODELS (Backup - keep for safety)
# ============================================
from .unet_model import StrokeSegmentationUNet
from .classifier import StrokeTypeClassifier

# ============================================
# WINNING MONAI MODELS (State of the Art - may need tuning)
# ============================================
from .winning_model import WinningStrokeModel
from .winning_classifier import WinningClassifier

# ============================================
# SIMPLE WORKING MODELS (Recommended - just works!)
# ============================================
from .simple_winner import SimpleWinnerModel

# ============================================
# EXPORT ALL MODELS
# ============================================
__all__ = [
    # Original models (backup)
    'StrokeSegmentationUNet',
    'StrokeTypeClassifier',
    
    # Winning MONAI models (advanced)
    'WinningStrokeModel',
    'WinningClassifier',
    
    # Simple working models (RECOMMENDED)
    'SimpleWinnerModel'
]

# ============================================
# VERSION INFO
# ============================================
__version__ = '3.0.0'
__author__ = 'Stroke AI Team'
__description__ = 'Complete stroke detection models collection'

# ============================================
# HELPER FUNCTION - Get recommended model
# ============================================
def get_recommended_model():
    """Returns the recommended model for most use cases"""
    print("✅ Using SimpleWinnerModel (pre-trained ResNet34 + U-Net)")
    return SimpleWinnerModel

def get_recommended_classifier():
    """Returns the recommended classifier"""
    print("✅ Using WinningClassifier")
    return WinningClassifier