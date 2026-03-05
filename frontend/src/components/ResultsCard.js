import React from 'react';
import { motion } from 'framer-motion';

const ResultsCard = ({ result, onReset }) => {
  const isScanResult = result.stroke_type !== undefined;

  // For form predictions
  const risk_level = result.risk_level || 'UNKNOWN';
  const risk_score = result.risk_score || 0;
  const probability = result.probability || '0%';
  const explanation = result.explanation || null;

  // For scan results
  const stroke_type = result.stroke_type || risk_level;
  const confidence = result.confidence || risk_score;
  const volume_ml = result.volume_ml || 0;
  const severity = result.severity || 'NONE';
  const recommendation = result.recommendation || '';
  const emergency = result.emergency || null;
  const report = result.report || null;

  const getRiskLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'ischemic': return '#ef4444';
      case 'hemorrhagic': return '#f97316';
      case 'normal': return '#10b981';
      case 'analyzing': return '#3b82f6';
      case 'no risk': return '#10b981';
      case 'moderate risk': return '#f97316';
      case 'high risk': return '#ef4444';
      case 'critical risk': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getRiskLevelEmoji = (level) => {
    switch (level?.toLowerCase()) {
      case 'ischemic': return '🔴';
      case 'hemorrhagic': return '🟠';
      case 'normal': return '🟢';
      case 'analyzing': return '🔍';
      case 'no risk': return '🟢';
      case 'moderate risk': return '🟡';
      case 'high risk': return '🔴';
      case 'critical risk': return '🟣';
      default: return '⚪';
    }
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const displayType = isScanResult ? stroke_type : risk_level;
  const displayConfidence = isScanResult ? confidence : risk_score;
  const riskColor = getRiskLevelColor(displayType);
  const riskEmoji = getRiskLevelEmoji(displayType);
  const confidencePercent = (displayConfidence * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '1rem',
        padding: '1.5rem',
        maxWidth: '700px',
        margin: '1rem auto',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>🧠 Stroke Analysis Result</h2>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{formatDate()}</div>
      </div>

      {/* Main Result */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        {/* Left - Risk Score */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 0.5rem auto' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="8"/>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={riskColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${displayConfidence * 283} 283`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' }}>
              {confidencePercent}%
            </div>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.25rem', color: riskColor }}>
            {riskEmoji} {displayType}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Confidence Score</div>
          {probability && <div style={{ fontSize: '0.8rem', color: '#d1d5db', marginTop: '0.25rem' }}>{probability}</div>}
        </div>

        {/* Right - Metrics */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '1rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Key Metrics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {isScanResult && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#d1d5db' }}>
                <span>Volume:</span>
                <span>{volume_ml.toFixed(2)} mL</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#d1d5db' }}>
              <span>Severity:</span>
              <span style={{
                padding: '2px 6px',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: '500',
                backgroundColor:
                  severity === 'CRITICAL' ? 'rgba(139,92,246,0.2)' :
                  severity === 'SEVERE' ? 'rgba(251,146,60,0.2)' :
                  severity === 'HIGH' ? 'rgba(239,68,68,0.2)' :
                  severity === 'MODERATE' ? 'rgba(253,224,71,0.2)' :
                  severity === 'MILD' ? 'rgba(16,185,129,0.2)' :
                  'rgba(107,114,128,0.2)',
                color:
                  severity === 'CRITICAL' ? '#8b5cf6' :
                  severity === 'SEVERE' ? '#f97316' :
                  severity === 'HIGH' ? '#ef4444' :
                  severity === 'MODERATE' ? '#facc15' :
                  severity === 'MILD' ? '#10b981' :
                  '#6b7280'
              }}>
                {severity}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation for form predictions */}
      {explanation && explanation.factors && (
        <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>📊 Key Factors</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {explanation.factors.slice(0, 3).map((factor, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#d1d5db' }}>
                <span>{factor.feature}:</span>
                <span style={{ color: factor.direction === 'increases' ? '#ef4444' : '#10b981' }}>
                  {factor.direction} ({factor.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency */}
      {emergency && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.8rem',
          backgroundColor: emergency.color + '25',
          borderLeft: `3px solid ${emergency.color}`
        }}>
          <div style={{ fontWeight: '500', marginBottom: '0.25rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>🚨</span> {emergency.action}
          </div>
          <ul style={{ marginLeft: '1rem', listStyleType: 'disc', color: '#d1d5db', fontSize: '0.75rem' }}>
            {emergency.instructions?.slice(0, 2).map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendation */}
      {recommendation && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(139,92,246,0.1)', borderRadius: '0.5rem', border: '1px solid rgba(139,92,246,0.2)' }}>
          <p style={{ fontSize: '0.8rem', color: '#8b5cf6' }}>{recommendation}</p>
        </div>
      )}

      {/* Full Report */}
      {report && (
        <details style={{ marginBottom: '1rem', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <summary style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: '500', color: '#a78bfa', userSelect: 'none' }}>
            📋 View Full Medical Report
          </summary>
          <pre style={{
            margin: 0,
            padding: '1rem',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '0 0 0.5rem 0.5rem',
            fontSize: '0.75rem',
            color: '#d1d5db',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {report}
          </pre>
        </details>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={onReset}
          style={{
            flex: 1,
            padding: '0.5rem 1rem',
            background: 'linear-gradient(90deg,#8b5cf6,#3b82f6)',
            color: 'white',
            fontSize: '0.85rem',
            fontWeight: '500',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          🔄 New Analysis
        </button>
        <button
          onClick={() => window.print()}
          style={{
            flex: 1,
            padding: '0.5rem 1rem',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            fontSize: '0.85rem',
            fontWeight: '500',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            backgroundColor: 'transparent'
          }}
        >
          🖨️ Print
        </button>
      </div>
    </motion.div>
  );
};

export default ResultsCard;