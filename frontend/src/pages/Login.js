import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaBrain, FaLock, FaArrowLeft, FaExclamationCircle, FaUser } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import { login } from '../services/api'; // ✅ Import login function

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({ username: '', password: '' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ This should be FIRST
    setLoading(true);
    setError('');

    try {
      console.log('📤 Attempting login with:', formData);
      
      // ✅ Use the imported login function
      const response = await login(formData.username, formData.password);
      console.log('📥 Login response:', response);
      
      if (response.success) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.data));
        
        toast.success('Login successful!');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError(response.error || 'Login failed');
        toast.error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Invalid username or password';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Styles remain exactly the same...
  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1f2937, #374151, #1f2937)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
    },
    backLink: {
      position: 'absolute',
      top: '1.5rem',
      left: '1.5rem',
      color: '#d1d5db',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      textDecoration: 'none',
      fontSize: '0.875rem',
    },
    container: {
      width: '100%',
      maxWidth: '28rem',
      background: '#fff',
      borderRadius: '1.5rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      padding: '2rem',
    },
    hiddenInput: {
      display: 'none',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    logoWrapper: {
      width: '4rem',
      height: '4rem',
      background: 'linear-gradient(to right, #8b5cf6, #3b82f6)',
      borderRadius: '0.75rem',
      transform: 'rotate(45deg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
    },
    logoIcon: {
      color: '#fff',
      fontSize: '1.875rem',
      transform: 'rotate(-45deg)',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1f2937',
    },
    subtitle: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginTop: '0.25rem',
    },
    errorBox: {
      marginBottom: '1.5rem',
      padding: '0.75rem',
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#b91c1c',
      fontSize: '0.875rem',
    },
    formGroup: { marginBottom: '1.25rem' },
    label: { display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' },
    inputWrapper: { position: 'relative' },
    icon: { position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '0.875rem' },
    input: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      color: '#1f2937',
      outline: 'none',
    },
    checkboxContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', marginBottom: '1.25rem' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563' },
    checkbox: { width: '1rem', height: '1rem', accentColor: '#8b5cf6' },
    link: { color: '#8b5cf6', textDecoration: 'none' },
    button: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#fff',
      background: 'linear-gradient(to right, #8b5cf6, #3b82f6)',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
    },
    buttonDisabled: { opacity: 0.5, cursor: 'not-allowed' },
    footer: { marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' },
    demoBox: { marginTop: '1.5rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem', fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' },
    demoHighlight: { color: '#8b5cf6', fontWeight: '500' },
  };

  return (
    <div style={styles.page}>
      <Toaster position="top-right" />

      <Link to="/" style={styles.backLink}>
        <FaArrowLeft style={{ fontSize: '0.75rem' }} />
        <span>Back to Home</span>
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '28rem' }}>
        <div style={styles.container}>
          <input type="text" style={styles.hiddenInput} readOnly />
          <input type="password" style={styles.hiddenInput} readOnly />

          <div style={styles.header}>
            <div style={styles.logoWrapper}>
              <FaBrain style={styles.logoIcon} />
            </div>
            <h2 style={styles.title}>Welcome Back</h2>
            <p style={styles.subtitle}>Sign in to continue to NeuroGuardian</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <FaExclamationCircle />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Username</label>
              <div style={styles.inputWrapper}>
                <FaUser style={styles.icon} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  autoComplete="off"
                  placeholder="Enter your username"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <FaLock style={styles.icon} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.checkboxContainer}>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" style={styles.checkbox} />
                Remember me
              </label>
              <a href="#" style={styles.link}>Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '1rem', height: '1rem', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p style={styles.footer}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>
              Sign up
            </Link>
          </p>

                 </div>
      </motion.div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Login;