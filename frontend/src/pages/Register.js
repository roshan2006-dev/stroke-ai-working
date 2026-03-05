import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBrain, FaUser, FaEnvelope, FaLock, FaPhone, 
  FaVenusMars, FaArrowLeft, FaExclamationCircle,
  FaGlobe, FaMapMarkerAlt, FaCity, FaHome
} from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import { register } from '../services/api'; // ✅ Import register function

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneno: '',
    country: '',
    state: '',
    city: '',
    address: '',
    gender: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.phoneno) {
      setError('Please fill all required fields'); return false;
    }
    if (formData.password.length < 6) { 
      setError('Password must be at least 6 characters'); return false; 
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) { 
      setError('Please enter a valid email'); return false; 
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.country || !formData.state || !formData.city || !formData.address || !formData.gender) {
      setError('Please fill all required fields'); return false;
    }
    return true;
  };

  const handleNext = () => { 
    if (validateStep1()) { 
      setStep(2); 
      setError(''); 
    } 
  };

  const handleBack = () => { 
    setStep(1); 
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setLoading(true); 
    setError('');

    try {
      console.log('📤 Sending registration data:', formData);
      
      // ✅ Use the imported register function
      const response = await register(formData);
      console.log('📥 Registration response:', response);
      
      if (response.success) {
        toast.success('Registration successful! Please login.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.error || 'Registration failed');
        toast.error(response.error || 'Registration failed');
      }
    } catch (err) {
      console.error('❌ Registration error:', err);
      console.error('❌ Error response:', err.response?.data);
      
      // ✅ Better error messages
      const errorMsg = err.response?.data?.error || err.message || 'Registration failed. Username may already exist.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally { 
      setLoading(false); 
    }
  };

  // Try a different username if you keep getting "username already exists"
  // Suggestions: testuser2, testuser3, john_doe, etc.

  // Inline styles (keeping your styling exactly as is)
  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1f2937, #374151, #1f2937)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', position: 'relative'
    },
    backLink: {
      position: 'absolute', top: '1.5rem', left: '1.5rem', color: '#d1d5db',
      display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.875rem'
    },
    container: {
      width: '100%', maxWidth: '28rem', background: '#fff', borderRadius: '1.5rem', padding: '2rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
    },
    header: { textAlign: 'center', marginBottom: '1.5rem' },
    logoWrapper: { width: '4rem', height: '4rem', background: 'linear-gradient(to right, #8b5cf6, #3b82f6)',
                   borderRadius: '0.75rem', transform: 'rotate(45deg)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1rem' },
    logoIcon: { color: '#fff', fontSize: '1.875rem', transform: 'rotate(-45deg)' },
    title: { fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' },
    subtitle: { fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' },
    progressCircle: (active) => ({
      width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '0.875rem', fontWeight: 500,
      background: active ? '#8b5cf6' : '#e5e7eb', color: active ? '#fff' : '#6b7280'
    }),
    progressLine: (active) => ({
      width: '4rem', height: '0.25rem', background: active ? '#8b5cf6' : '#e5e7eb', margin: '0 0.5rem'
    }),
    errorBox: { marginBottom: '1.5rem', padding: '0.75rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c', fontSize: '0.875rem' },
    formGroup: { marginBottom: '1rem' },
    label: { display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' },
    inputWrapper: { position: 'relative' },
    icon: { position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '0.875rem' },
    input: { width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#1f2937', outline: 'none' },
    select: { width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#1f2937', outline: 'none', appearance: 'none' },
    button: { width: '100%', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#fff', background: 'linear-gradient(to right, #8b5cf6, #3b82f6)', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' },
    buttonDisabled: { opacity: 0.5, cursor: 'not-allowed' },
    buttonGray: { width: '100%', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', background: '#f3f4f6', border: 'none', cursor: 'pointer' },
    footer: { marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' },
    link: { color: '#8b5cf6', textDecoration: 'none' }
  };

  return (
    <div style={styles.page}>
      <Toaster position="top-right" />

      <Link to="/" style={styles.backLink}>
        <FaArrowLeft style={{ fontSize: '0.75rem' }} /> Back to Home
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '28rem' }}>
        <div style={styles.container}>
          <div style={styles.header}>
            <div style={styles.logoWrapper}><FaBrain style={styles.logoIcon} /></div>
            <h2 style={styles.title}>Create Account</h2>
            <p style={styles.subtitle}>Join NeuroGuardian today</p>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={styles.progressCircle(step >= 1)}>1</div>
            <div style={styles.progressLine(step >= 2)} />
            <div style={styles.progressCircle(step >= 2)}>2</div>
          </div>

          {error && <div style={styles.errorBox}><FaExclamationCircle /> <span>{error}</span></div>}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['username','email','password','phoneno'].map((field, i) => {
                  const icons = [FaUser, FaEnvelope, FaLock, FaPhone];
                  const placeholders = ['Choose a username','Enter your email','Minimum 6 characters','Enter your phone number'];
                  const type = field==='password'?'password': field==='email'?'email':'text';
                  const Icon = icons[i];
                  return (
                    <div key={field} style={styles.formGroup}>
                      <label style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)} *</label>
                      <div style={styles.inputWrapper}>
                        <Icon style={styles.icon} />
                        <input type={type} name={field} value={formData[field]} onChange={handleChange} required placeholder={placeholders[i]} style={styles.input} autoComplete="off" />
                      </div>
                    </div>
                  );
                })}
                <button type="button" onClick={handleNext} style={styles.button}>Next Step</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  {name:'country', icon:FaGlobe, placeholder:'Enter your country'},
                  {name:'state', icon:FaMapMarkerAlt, placeholder:'Enter your state'},
                  {name:'city', icon:FaCity, placeholder:'Enter your city'},
                  {name:'address', icon:FaHome, placeholder:'Enter your address'}
                ].map(({name, icon:Icon, placeholder}) => (
                  <div key={name} style={styles.formGroup}>
                    <label style={styles.label}>{name.charAt(0).toUpperCase()+name.slice(1)} *</label>
                    <div style={styles.inputWrapper}>
                      <Icon style={styles.icon} />
                      <input type="text" name={name} value={formData[name]} onChange={handleChange} required placeholder={placeholder} style={styles.input} autoComplete="off" />
                    </div>
                  </div>
                ))}

                <div style={styles.formGroup}>
                  <label style={styles.label}>Gender *</label>
                  <div style={styles.inputWrapper}>
                    <FaVenusMars style={styles.icon}/>
                    <select name="gender" value={formData.gender} onChange={handleChange} required style={styles.select}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" onClick={handleBack} style={styles.buttonGray}>Back</button>
                  <button type="submit" disabled={loading} style={{...styles.button, ...(loading?styles.buttonDisabled:{})}}>{loading?'Creating...':'Sign Up'}</button>
                </div>
              </motion.div>
            )}
          </form>

          <p style={styles.footer}>Already have an account? <Link to="/login" style={styles.link}>Sign in</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;