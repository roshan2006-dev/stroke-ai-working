import sys
print(f"Python executable: {sys.executable}")
print(f"Python version: {sys.version}")
print(f"Python path: {sys.path}")

try:
    import pandas
    print(f"✅ Pandas found at: {pandas.__file__}")
    print(f"Pandas version: {pandas.__version__}")
except ImportError as e:
    print(f"❌ Pandas import error: {e}")

try:
    import numpy
    print(f"✅ NumPy found at: {numpy.__file__}")
    print(f"NumPy version: {numpy.__version__}")
except ImportError as e:
    print(f"❌ NumPy import error: {e}")

try:
    import sklearn
    print(f"✅ Scikit-learn found at: {sklearn.__file__}")
    print(f"Scikit-learn version: {sklearn.__version__}")
except ImportError as e:
    print(f"❌ Scikit-learn import error: {e}")

print("\nTest complete!")