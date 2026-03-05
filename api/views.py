import os
import tempfile
import cv2
import numpy as np
import json
import sys
from pathlib import Path
import logging
from datetime import datetime, timedelta

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q, Count
from django.db.models.functions import TruncDate

from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from Remote_User.models import stroke_risk_prediction_type, ClientRegister_Model
from .serializers import (
    UserSerializer, PatientSerializer, PredictionSerializer,
    PredictRequestSerializer, PredictionHistorySerializer, AlertSerializer
)

# ============================================================================
# IMPORT MODELS - FIXED
# ============================================================================
from ml_models.simple_winner import SimpleWinnerModel
from ml_models.demo_classifier import DemoClassifier

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

# Import advanced model (keep this for tabular prediction)
try:
    from advanced_features.deep_learning.advanced_stroke_model import AdvancedStrokePredictor
    ADVANCED_MODEL_AVAILABLE = True
    print("✅ Advanced model loaded in API")
except ImportError as e:
    ADVANCED_MODEL_AVAILABLE = False
    print(f"⚠️ Advanced model not available in API: {e}")

# Setup logging
logger = logging.getLogger('api')

# Load advanced model (for tabular data)
tabular_model = None
if ADVANCED_MODEL_AVAILABLE:
    try:
        tabular_model = AdvancedStrokePredictor()
        model_path = Path(__file__).parent.parent / 'advanced_models'
        if model_path.exists():
            tabular_model.load_model(str(model_path))
            print(f"✅ API Model loaded from {model_path}")
        else:
            print(f"⚠️ API Model not found at {model_path}")
    except Exception as e:
        print(f"⚠️ Error loading API model: {e}")

# ============================================================================
# WINNING MODELS (Medical Imaging) - FIXED
# ============================================================================

winning_model = None
winning_classifier = None

def get_winning_model():
    """Lazy load winning model"""
    global winning_model
    if winning_model is None:
        try:
            winning_model = SimpleWinnerModel()
            print("✅ SIMPLE WINNING model initialized")
        except Exception as e:
            print(f"⚠️ Error loading model: {e}")
            winning_model = None
    return winning_model

def get_winning_classifier():
    """Lazy load demo classifier"""
    global winning_classifier
    if winning_classifier is None:
        try:
            winning_classifier = DemoClassifier()
            print("✅ DEMO classifier initialized")
        except Exception as e:
            print(f"⚠️ Error loading classifier: {e}")
            winning_classifier = None
    return winning_classifier

# ============================================================================
# AUTHENTICATION VIEWS
# ============================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user"""
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    phoneno = request.data.get('phoneno')
    country = request.data.get('country')
    state = request.data.get('state')
    city = request.data.get('city')
    address = request.data.get('address')
    gender = request.data.get('gender')
    
    if not username or not password:
        return Response({
            'success': False,
            'error': 'Username and password required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user exists
    if User.objects.filter(username=username).exists():
        return Response({
            'success': False,
            'error': 'Username already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create user
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    
    # Create patient profile
    patient = ClientRegister_Model.objects.create(
        username=username,
        email=email,
        password=password,
        phoneno=phoneno,
        country=country,
        state=state,
        city=city,
        address=address,
        gender=gender
    )
    
    # Generate token
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'success': True,
        'message': 'User registered successfully',
        'data': {
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        }
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login user and return tokens"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        
        # Get patient profile
        try:
            patient = ClientRegister_Model.objects.get(username=username)
            patient_data = PatientSerializer(patient).data
        except ClientRegister_Model.DoesNotExist:
            patient_data = None
        
        return Response({
            'success': True,
            'message': 'Login successful',
            'data': {
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'patient': patient_data
            }
        })
    else:
        return Response({
            'success': False,
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout user"""
    try:
        refresh_token = request.data.get('refresh_token')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({
            'success': True,
            'message': 'Logged out successfully'
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

# ============================================================================
# PREDICTION VIEWS (Tabular Data)
# ============================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def predict(request):
    """Predict stroke risk from tabular data"""
    serializer = PredictRequestSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get validated data
        data = serializer.validated_data
        
        # Map field names
        model_input = {
            'gender': data['gender'],
            'age': data['age'],
            'hypertension': data['hypertension'],
            'heart_disease': data['heart_disease'],
            'ever_married': data['ever_married'],
            'work_type': data['work_type'],
            'Residence_type': data.get('residence_type') or data.get('Residence_type', 'Urban'),
            'avg_glucose_level': data['avg_glucose_level'],
            'bmi': data['bmi'],
            'smoking_status': data['smoking_status']
        }
        
        # Get patient (optional)
        patient = None
        if request.user.is_authenticated:
            try:
                patient = ClientRegister_Model.objects.get(username=request.user.username)
            except ClientRegister_Model.DoesNotExist:
                pass
        
        # Use advanced model if available
        if tabular_model:
            result = tabular_model.predict(model_input, explain=True)
            
            # Determine risk level
            if result['risk_score'] < 0.3:
                risk_level = 'LOW RISK'
            elif result['risk_score'] < 0.6:
                risk_level = 'MODERATE RISK'
            elif result['risk_score'] < 0.8:
                risk_level = 'HIGH RISK'
            else:
                risk_level = 'CRITICAL RISK'
            
            # Save prediction
            prediction_id = None
            if patient:
                prediction = stroke_risk_prediction_type.objects.create(
                    idn=data.get('idn', f"API-{datetime.now().timestamp()}"),
                    gender=data['gender'],
                    age=data['age'],
                    hypertension=data['hypertension'],
                    heart_disease=data['heart_disease'],
                    ever_married=data['ever_married'],
                    work_type=data['work_type'],
                    Residence_type=model_input['Residence_type'],
                    avg_glucose_level=data['avg_glucose_level'],
                    bmi=data['bmi'],
                    smoking_status=data['smoking_status'],
                    Prediction=risk_level
                )
                prediction_id = prediction.id
                
                if risk_level in ['HIGH RISK', 'CRITICAL RISK'] and patient:
                    trigger_alert(patient, result)
            
            logger.info(f"Prediction made: {risk_level}")
            
            return Response({
                'success': True,
                'data': {
                    'risk_level': risk_level,
                    'risk_score': result['risk_score'],
                    'probability': f"{result['risk_score']*100:.1f}%",
                    'explanation': result.get('explanation', {})
                }
            })
        else:
            return Response({
                'success': False,
                'error': 'Model not available'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ============================================================================
# SCAN UPLOAD VIEW (Medical Imaging)
# ============================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def upload_scan(request):
    """
    Upload a brain scan using SIMPLE WINNING model
    """
    try:
        # Check if file was uploaded
        if 'scan' not in request.FILES:
            return Response({
                'success': False,
                'error': 'No scan file provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        scan_file = request.FILES['scan']
        file_name = scan_file.name
        
        # Validate file size
        max_size = 50 * 1024 * 1024
        if scan_file.size > max_size:
            return Response({
                'success': False,
                'error': f'File too large. Max size: 50MB'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create temp directory
        temp_dir = os.path.join(settings.BASE_DIR, 'temp_uploads')
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save file temporarily
        temp_path = os.path.join(temp_dir, file_name)
        with open(temp_path, 'wb+') as destination:
            for chunk in scan_file.chunks():
                destination.write(chunk)
        
        print(f"📁 Processing: {file_name}")
        
        # Get models
        model = get_winning_model()
        classifier = get_winning_classifier()
        
        if model is None or classifier is None:
            return Response({
                'success': False,
                'error': 'AI models not available'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        # Process with model
        image_tensor, metadata = model.preprocess_image(temp_path)
        mask, confidence, volume = model.predict(image_tensor)
        
        # Classify
        classification = classifier.classify(model.original_image, mask, filename=file_name)
        emergency = classifier.get_emergency_instructions(classification)
        
        # Generate report
        if hasattr(classifier, 'generate_report'):
            report = classifier.generate_report(classification, emergency)
        else:
            report = None
        
        # Generate overlay
        overlay, stroke_type = model.get_overlay(mask=mask)
        
        # Save overlay
        media_dir = os.path.join(settings.MEDIA_ROOT, 'scan_results')
        os.makedirs(media_dir, exist_ok=True)
        
        safe_name = os.path.splitext(file_name)[0].replace(' ', '_')
        overlay_filename = f"overlay_{safe_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
        overlay_path = os.path.join(media_dir, overlay_filename)
        cv2.imwrite(overlay_path, cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))
        
        # Clean up
        os.remove(temp_path)
        
        # Prepare response
        response_data = {
            'success': True,
            'data': {
                'file_name': file_name,
                'stroke_type': classification['type'],
                'confidence': classification['confidence'],
                'volume_ml': classification['volume_ml'],
                'severity': classification['severity'],
                'recommendation': classification['recommendation'],
                'emergency': emergency,
                'overlay_url': f"{settings.MEDIA_URL}scan_results/{overlay_filename}"
            }
        }
        
        # Add report if available
        if report:
            response_data['data']['report'] = report
        
        return Response(response_data)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ============================================================================
# HISTORY AND STATS VIEWS - FIXED
# ============================================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_history(request):
    """Get prediction history for user"""
    try:
        # Get the patient profile
        try:
            patient = ClientRegister_Model.objects.get(username=request.user.username)
            print(f"✅ Found patient: {patient.username}")
        except ClientRegister_Model.DoesNotExist:
            print(f"⚠️ No patient profile for user: {request.user.username}")
            # Return empty list if no patient profile
            return Response({
                'success': True,
                'data': []
            })
        
        # Get ALL predictions (not filtered by anything)
        predictions = stroke_risk_prediction_type.objects.all().order_by('-created_at')[:50]
        print(f"📊 Found {predictions.count()} predictions")
        
        # Format the data for frontend
        history_data = []
        for pred in predictions:
            # Determine severity based on prediction
            if pred.Prediction in ['HIGH RISK', 'CRITICAL RISK', 'More Risk', 'High Risk']:
                severity = 'High'
                result_type = 'ISCHEMIC'
            elif pred.Prediction == 'MODERATE RISK':
                severity = 'Moderate'
                result_type = 'ISCHEMIC'
            elif pred.Prediction == 'LOW RISK':
                severity = 'Low'
                result_type = 'NORMAL'
            else:
                severity = 'None'
                result_type = 'NORMAL'
            
            # Create patient name
            patient_name = f"Patient {pred.idn}" if pred.idn else f"Patient {pred.id}"
            
            history_data.append({
                'id': pred.id,
                'name': patient_name,
                'age': pred.age,
                'gender': pred.gender or 'Unknown',
                'lastScan': pred.created_at.strftime('%Y-%m-%d'),
                'result': result_type,
                'severity': severity,
                'confidence': 0.92,
                'volume': 0
            })
        
        print(f"✅ Returning {len(history_data)} formatted records")
        
        return Response({
            'success': True,
            'data': history_data
        })
        
    except Exception as e:
        print(f"❌ History error: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stats(request):
    """Get prediction statistics"""
    try:
        # Get patient
        try:
            patient = ClientRegister_Model.objects.get(username=request.user.username)
        except ClientRegister_Model.DoesNotExist:
            # Return demo stats if no patient
            return Response({
                'success': True,
                'data': {
                    'total_predictions': 0,
                    'high_risk': 0,
                    'moderate_risk': 0,
                    'low_risk': 0,
                    'high_risk_percentage': 0,
                    'last_7_days': []
                }
            })
        
        # Get all predictions
        predictions = stroke_risk_prediction_type.objects.all()
        
        total = predictions.count()
        high_risk = predictions.filter(Prediction__in=['HIGH RISK', 'CRITICAL RISK', 'More Risk', 'High Risk']).count()
        moderate_risk = predictions.filter(Prediction='MODERATE RISK').count()
        low_risk = predictions.filter(Prediction='LOW RISK').count()
        
        return Response({
            'success': True,
            'data': {
                'total_predictions': total,
                'high_risk': high_risk,
                'moderate_risk': moderate_risk,
                'low_risk': low_risk,
                'high_risk_percentage': (high_risk / total * 100) if total > 0 else 0,
                'last_7_days': get_last_7_days_stats(predictions)
            }
        })
    except Exception as e:
        print(f"❌ Stats error: {str(e)}")
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def trigger_alert(patient, result):
    """Trigger alerts for high risk patients"""
    logger.warning(f"HIGH RISK ALERT for patient {patient.username}: {result['risk_level']}")
    return True

def get_last_7_days_stats(predictions):
    """Get stats for last 7 days"""
    last_7_days = datetime.now() - timedelta(days=7)
    recent = predictions.filter(created_at__gte=last_7_days)
    
    daily_stats = recent.annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(
        count=Count('id'),
        high_risk=Count('id', filter=Q(Prediction__in=['HIGH RISK', 'CRITICAL RISK', 'More Risk', 'High Risk']))
    ).order_by('date')
    
    return list(daily_stats)

# ============================================================================
# HEALTH CHECK
# ============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint"""
    return Response({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'tabular_model_available': tabular_model is not None,
        'winning_model_available': winning_model is not None,
        'api_version': '2.0.0'
    })