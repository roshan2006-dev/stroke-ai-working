import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  FaUpload, FaFileMedical, FaTimes
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import ResultsCard from '../ResultsCard';

const ScanAnalysis = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
      toast.success(`File selected: ${selectedFile.name}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.dcm'],
      'application/octet-stream': ['.nii', '.nii.gz']
    },
    maxSize: 50 * 1024 * 1024
  });

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file first');
    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('scan', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/upload-scan/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => setProgress(Math.round((event.loaded * 100) / event.total))
      });

      if (response.data.success) {
        setResult(response.data.data);
        toast.success('Analysis complete!');
      } else {
        toast.error(response.data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to connect to server');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  if (result) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <button
          onClick={resetAnalysis}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6B46C1',
            color: '#FFFFFF',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            alignSelf: 'flex-start'
          }}
        >
          ← Upload New Scan
        </button>
        <ResultsCard result={result} onReset={resetAnalysis} />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>Brain Scan Analysis</h2>
        <p style={{ color: '#A0AEC0' }}>Upload CT/MRI scans for instant stroke detection</p>
      </div>

      {/* Upload Area */}
      <motion.div
        {...getRootProps()}
        whileHover={{ scale: 1.02 }}
        style={{
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: '0.75rem',
          backgroundColor: isDragActive ? 'rgba(128,90,213,0.1)' : 'rgba(255,255,255,0.05)',
          border: isDragActive ? '2px dashed #805AD5' : '2px dashed rgba(255,255,255,0.2)'
        }}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <img src={preview} alt="Preview" style={{ maxHeight: '16rem', borderRadius: '0.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
            <p style={{ color: '#FFFFFF', fontWeight: 500 }}>{file.name}</p>
            <p style={{ color: '#A0AEC0', fontSize: '0.875rem' }}>{(file.size / (1024*1024)).toFixed(2)} MB</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <FaUpload size={64} color={isDragActive ? '#805AD5' : '#718096'} />
            <div>
              <p style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 500 }}>
                {isDragActive ? 'Drop your scan here' : 'Drag & drop or click to upload'}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#A0AEC0', marginTop: '0.5rem' }}>
                Supports: NIfTI (.nii), DICOM (.dcm), MRI/CT Images (PNG, JPG)
              </p>
              <p style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.25rem' }}>Max file size: 50MB</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Selected File Info */}
      <AnimatePresence>
        {file && !preview && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <FaFileMedical size={24} color="#805AD5" />
              <div>
                <p style={{ color: '#FFFFFF', fontWeight: 500 }}>{file.name}</p>
                <p style={{ fontSize: '0.875rem', color: '#A0AEC0' }}>{(file.size / (1024*1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={() => { setFile(null); toast.success('File removed'); }} style={{ padding: '0.5rem', cursor: 'pointer', backgroundColor: 'transparent', border: 'none' }}>
              <FaTimes color="#A0AEC0" size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            flex: 1,
            padding: '1rem',
            borderRadius: '0.75rem',
            fontWeight: 600,
            color: '#FFFFFF',
            background: (!file || loading) ? '#4A5568' : 'linear-gradient(90deg, #805AD5, #4299E1)',
            cursor: (!file || loading) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '1.25rem', height: '1.25rem', border: '2px solid #FFFFFF', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <span>Analyzing... {progress}%</span>
            </div>
          ) : (
            <>
              <FaUpload /> <span>Analyze Scan</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {loading && (
        <div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#A0AEC0', marginBottom: '0.5rem' }}>
            <span>Processing scan...</span>
            <span>{progress}%</span>
          </div>
          <div style={{ width: '100%', height: '0.5rem', backgroundColor: '#4A5568', borderRadius: '0.25rem', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #805AD5, #4299E1)' }} />
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <InfoCard icon="🔍" title="AI Detection" description="U-Net deep learning model with 94% accuracy" />
        <InfoCard icon="⚡" title="Fast Analysis" description="Results in under 30 seconds" />
        <InfoCard icon="🏥" title="Clinical Ready" description="FHIR integration for hospital systems" />
      </div>
    </motion.div>
  );
};

const InfoCard = ({ icon, title, description }) => (
  <div style={{ padding: '1rem', textAlign: 'center', borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', flex: 1 }}>
    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
    <h3 style={{ color: '#FFFFFF', fontWeight: 500, marginBottom: '0.25rem' }}>{title}</h3>
    <p style={{ fontSize: '0.75rem', color: '#A0AEC0' }}>{description}</p>
  </div>
);

export default ScanAnalysis;