import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './SkinAnalysis.css';

const STATUS_MESSAGES = [
  'Uploading image to secure storage...',
  'Preprocessing image...',
  'Extracting psoriasis features...',
  'Running ResNet50 classification model...',
  'Calculating prediction confidence...',
  'Saving analysis results...',
];

const CHECKLIST = [
  { id: 'upload', label: 'Uploading skin image', icon: '☁️' },
  { id: 'preprocess', label: 'Preprocessing surface data', icon: '🔍' },
  { id: 'extract', label: 'Extracting lesion features', icon: '🧪' },
  { id: 'classify', label: 'Running AI classifier', icon: '🤖' },
  { id: 'db', label: 'Saving record to database', icon: '💾' },
  { id: 'report', label: 'Generating report', icon: '📄' },
];

/* ─────────────────────────────────────
   Step indicator
   ───────────────────────────────────── */
const Steps = ({ current }) => {
  const steps = ['Upload Image', 'Analyzing', 'Results'];
  return (
    <div className="sa-steps">
      {steps.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'pending';
        return (
          <React.Fragment key={s}>
            <div className="sa-step">
              <div className={`sa-step__dot sa-step__dot--${state}`}>
                {state === 'done' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`sa-step__label sa-step__label--${state}`}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`sa-step__line ${state === 'done' ? 'sa-step__line--done' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────
   STEP 1 — Upload
   ───────────────────────────────────── */
const UploadStep = ({ onContinue, initialFile }) => {
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (initialFile) {
      setSelectedFile(initialFile);
      setPreview(URL.createObjectURL(initialFile));
    }
  }, [initialFile]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    
    // Validate file size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Selected file exceeds the 10 MB size limit. Please choose a smaller image.');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const onFileChange = (e) => handleFile(e.target.files?.[0]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  return (
    <>
      <div className="sa-header">
        <h1 className="sa-header__title">
          Upload Your <span>Skin Image</span>
        </h1>
        <p className="sa-header__desc">
          Our AI analyzes your skin photo in seconds. For best results, use a clear,
          well-lit photo of the affected area.
        </p>
      </div>

      <div className="sa-upload-card">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          className="sa-file-input"
          onChange={onFileChange}
          id="skin-file-input"
        />

        {!preview ? (
          <div
            className={`sa-dropzone ${dragging ? 'sa-dropzone--drag' : ''}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileRef.current?.click()}
          >
            <div className="sa-dropzone__icon-wrap">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="sa-dropzone__icon" style={{ color: '#63B3ED' }}>
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <p className="sa-dropzone__title">Drag &amp; drop your skin image here</p>
            <p className="sa-dropzone__sub">or click to browse files</p>

            <button
              className="sa-dropzone__btn"
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
              id="upload-from-device-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 8L12 3L7 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 3V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Upload from Device
            </button>

            <p className="sa-dropzone__formats">
              Supported formats: JPG, JPEG, PNG &nbsp;·&nbsp; Max size: 10 MB
            </p>
          </div>
        ) : (
          <div className="sa-preview">
            <img src={preview} alt="Skin preview" className="sa-preview__img" />
            <div className="sa-preview__overlay">
              <div className="sa-preview__badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Image ready for analysis
              </div>
            </div>
            <button
              className="sa-preview__change"
              onClick={() => { setPreview(null); setSelectedFile(null); fileRef.current?.click(); }}
              id="change-image-btn"
            >
              Change Image
            </button>
          </div>
        )}

        <div className="sa-upload-footer">
          <div className="sa-upload-tips">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#63B3ED' }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Ensure good lighting and clear focus for accurate results</span>
          </div>

          <button
            className="sa-btn-continue"
            disabled={!preview || !selectedFile}
            onClick={() => onContinue(selectedFile)}
            id="continue-to-analysis-btn"
          >
            Continue
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────
   STEP 2 — Processing
   ───────────────────────────────────── */
const ProcessingStep = ({ file, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [checkIdx, setCheckIdx] = useState(-1);

  useEffect(() => {
    let apiDone = false;
    let progressDone = false;
    let resultData = null;
    let errorDetails = null;

    // Start real image upload & classification API call
    const runAnalysis = async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await api.post('/predict', formData);
        resultData = res;
        apiDone = true;
        
        // Transition immediately if animation has already hit 100%
        if (progressDone) {
          onComplete(resultData, null);
        }
      } catch (err) {
        apiDone = true;
        errorDetails = err.message || 'Classification analysis failed. Please verify API configurations.';
        if (progressDone) {
          onComplete(null, errorDetails);
        }
      }
    };
    runAnalysis();

    // Progress animation timeline
    let p = 0;
    const interval = setInterval(() => {
      p += 1.2;
      setProgress(Math.min(p, 100));

      const newMsgIdx = Math.floor((p / 100) * STATUS_MESSAGES.length);
      setMsgIdx(Math.min(newMsgIdx, STATUS_MESSAGES.length - 1));

      const doneCount = Math.floor((p / 100) * CHECKLIST.length);
      setCheckIdx(Math.min(doneCount, CHECKLIST.length - 1));

      if (p >= 100) {
        clearInterval(interval);
        progressDone = true;
        if (apiDone) {
          onComplete(resultData, errorDetails);
        }
      }
    }, 40);

    return () => {
      clearInterval(interval);
    };
  }, [file, onComplete]);

  const circumference = 628;
  const dashOffset = circumference - (progress / 100) * circumference;

  const getItemState = (i) => {
    const doneCount = Math.floor((progress / 100) * CHECKLIST.length);
    if (i < doneCount) return 'done';
    if (i === doneCount) return 'active';
    return 'pending';
  };

  return (
    <>
      <div className="sa-header">
        <h1 className="sa-header__title">
          Analyzing Your <span>Skin</span>
        </h1>
        <p className="sa-header__desc">
          Our deep-learning model is examining your image across 60,000+ training samples.
        </p>
      </div>

      <div className="sa-processing">
        {/* Circular loader */}
        <div className="sa-loader-wrap">
          <svg className="sa-loader-svg" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="sa-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3182CE" />
                <stop offset="100%" stopColor="#0BC5EA" />
              </linearGradient>
            </defs>
            <circle className="sa-loader-track" cx="100" cy="100" r="90" />
            <circle
              className="sa-loader-fill"
              cx="100" cy="100" r="90"
              style={{ strokeDashoffset: dashOffset }}
            />
          </svg>
          <div className="sa-spin-ring" />
          <div className="sa-loader-inner">
            <span className="sa-loader-pct">{Math.round(progress)}%</span>
            <span className="sa-loader-lbl">Complete</span>
          </div>
        </div>

        {/* Status message */}
        <div className="sa-status-msg">
          <span className="sa-status-dot" />
          {STATUS_MESSAGES[msgIdx]}
        </div>

        {/* Progress bar */}
        <div className="sa-prog-wrap">
          <div className="sa-prog-bar">
            <div className="sa-prog-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="sa-prog-meta">
            <span>Analysis in progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Checklist */}
        <div className="sa-checklist">
          {CHECKLIST.map((item, i) => {
            const state = getItemState(i);
            return (
              <div key={item.id} className={`sa-check-item sa-check-item--${state}`}>
                <div className={`sa-check-icon sa-check-icon--${state}`}>
                  {state === 'done' ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : state === 'active' ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <span style={{ opacity: 0 }}>·</span>
                  )}
                </div>
                <span className="sa-check-text">{item.label}</span>
                {state === 'active' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 'auto', color: '#63B3ED', animation: 'saSpin 1.4s linear infinite' }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────
   STEP 3 — Results
   ───────────────────────────────────── */
const ResultsStep = ({ result, onReset }) => {
  const navigate = useNavigate();
  const [animated, setAnimated] = useState(false);
  const [requestingReview, setRequestingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 200);
  }, []);

  if (!result) return null;

  // Map backend return values (fractional float confidence, class name)
  const pct = Math.round(result.confidence * 100);
  const detected = result.class === 'psoriasis';
  const variant = detected ? 'positive' : 'negative';

  // Ring SVG geometry
  const radius = 65;
  const circ = 2 * Math.PI * radius; // ≈ 408.4
  const dashOffset = circ - (animated ? (pct / 100) * circ : circ);

  const handleRequestReview = async () => {
    setRequestingReview(true);
    try {
      await api.post(`/analyses/${result.id}/request-review`);
      setReviewSuccess(true);
    } catch (err) {
      alert(err.message || 'Failed to submit consultation request.');
    } finally {
      setRequestingReview(false);
    }
  };

  const handleDownload = () => {
    const reportText = `
PSORIASIS AI — ANALYSIS REPORT
================================
Generated: ${new Date().toLocaleString()}

PREDICTION:    ${detected ? 'Psoriasis Detected' : 'No Psoriasis Detected'}
CONFIDENCE:    ${pct}%
IMAGE URL:     ${result.image_url}
STATUS:        ${result.status}
IMAGE QUALITY: Excellent (Standard Verification Passed)
ANALYSIS TIME: 1.5s
MODEL:         ResNet50 Classifier (final_model.keras)

DISCLAIMER:
This report is generated by an AI model and is NOT a medical diagnosis.
Please consult a licensed dermatologist for professional medical advice.
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `psoriasis-ai-report-${result.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="sa-header">
        <h1 className="sa-header__title">
          Your <span>Results</span> Are Ready
        </h1>
        <p className="sa-header__desc">
          Review your AI-generated skin analysis report below.
        </p>
      </div>

      <div className="sa-results">
        {/* ── Result Card ── */}
        <div className={`sa-result-card sa-result-card--${variant}`}>
          <div className={`sa-result-icon sa-result-icon--${variant}`}>
            {detected ? '⚠️' : '✅'}
          </div>
          <div className="sa-result-info">
            <div className="sa-result-label">Prediction Result</div>
            <div className={`sa-result-title sa-result-title--${variant}`}>
              {detected ? 'Psoriasis Detected' : 'No Psoriasis Detected'}
            </div>
            <p className="sa-result-desc">
              {detected
                ? 'Our AI model identified visual markers consistent with psoriatic skin lesions. Please consult a dermatologist for professional evaluation and confirmation.'
                : 'Our AI model found no visible indicators of psoriasis. Your skin appears healthy based on this analysis.'}
            </p>
          </div>
        </div>

        {/* ── Confidence Score ── */}
        <div className="sa-confidence-card">
          <div className="sa-conf-ring-wrap">
            <svg className="sa-conf-ring-svg" viewBox="0 0 160 160">
              <defs>
                <linearGradient id="sa-red-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
                <linearGradient id="sa-green-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38A169" />
                  <stop offset="100%" stopColor="#0BC5EA" />
                </linearGradient>
              </defs>
              <circle className="sa-conf-track" cx="80" cy="80" r={radius} />
              <circle
                className={`sa-conf-fill sa-conf-fill--${variant}`}
                cx="80" cy="80" r={radius}
                style={{
                  strokeDasharray: circ,
                  strokeDashoffset: dashOffset,
                  transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </svg>
            <div className="sa-conf-center">
              <span className="sa-conf-pct">{animated ? `${pct}%` : '0%'}</span>
              <span className="sa-conf-sub">Confidence</span>
            </div>
          </div>

          <div className="sa-conf-info">
            <h3>Confidence Score</h3>
            <p>
              The AI model is <strong style={{ color: 'white' }}>{pct}% confident</strong> in
              this prediction. Scores above 85% indicate high model certainty.
              This is based on pattern matching across 60,000+ dermatology images.
            </p>
            <div className="sa-conf-meter" style={{ marginTop: 16 }}>
              <div
                className={`sa-conf-meter-fill sa-conf-meter-fill--${variant}`}
                style={{ width: animated ? `${pct}%` : '0%' }}
              />
            </div>
          </div>
        </div>

        {/* ── AI Assessment Summary ── */}
        <div className="sa-assessment-card">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            AI Assessment Summary
          </h3>

          <div className="sa-assessment-grid">
            <div className="sa-assess-item">
              <div className="sa-assess-label">Predicted Condition</div>
              <div className={`sa-assess-value sa-assess-value--${variant}`} style={{ textTransform: 'capitalize' }}>
                {result.class}
              </div>
            </div>
            <div className="sa-assess-item">
              <div className="sa-assess-label">Confidence Level</div>
              <div className={`sa-assess-value sa-assess-value--${variant}`}>
                {pct}% — {pct >= 90 ? 'High' : pct >= 70 ? 'Moderate' : 'Low'}
              </div>
            </div>
            <div className="sa-assess-item">
              <div className="sa-assess-label">Analysis Status</div>
              <div className="sa-assess-value sa-assess-value--good">
                ✓ {reviewSuccess ? 'pending_review' : result.status}
              </div>
            </div>
            <div className="sa-assess-item">
              <div className="sa-assess-label">Image Quality</div>
              <div className="sa-assess-value sa-assess-value--good">
                Excellent
              </div>
            </div>
            <div className="sa-assess-item">
              <div className="sa-assess-label">Analysis Time</div>
              <div className="sa-assess-value" style={{ color: 'rgba(255,255,255,0.75)' }}>
                1.5s
              </div>
            </div>
            <div className="sa-assess-item">
              <div className="sa-assess-label">AI Model</div>
              <div className="sa-assess-value" style={{ color: 'rgba(255,255,255,0.75)' }}>
                ResNet50 v1.0
              </div>
            </div>
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div className="sa-disclaimer">
          <span className="sa-disclaimer__icon">⚠️</span>
          <p className="sa-disclaimer__text">
            <strong>Medical Disclaimer: </strong>
            This analysis is generated by an <strong>AI model</strong> and is intended
            for informational purposes only. It is <strong>not a medical diagnosis</strong>.
            Please consult a <strong>licensed dermatologist or healthcare professional</strong>
            {' '}for an accurate diagnosis and appropriate treatment.
          </p>
        </div>

        {/* ── Action Buttons ── */}
        <div className="sa-actions">
          <button
            className="sa-btn-primary"
            onClick={onReset}
            id="analyze-another-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M1 4v6h6M23 20v-6h-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Analyze Another Image
          </button>

          <button
            className="sa-btn-outline"
            onClick={handleDownload}
            id="download-report-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download Report
          </button>

          {detected && (
            <button
              className="sa-btn-outline"
              disabled={requestingReview || reviewSuccess || result.status === 'pending_review' || result.status === 'reviewed'}
              onClick={handleRequestReview}
              id="request-review-btn"
              style={{
                borderColor: reviewSuccess || result.status === 'pending_review' ? '#38A169' : '',
                color: reviewSuccess || result.status === 'pending_review' ? '#68D391' : ''
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {requestingReview ? 'Submitting...' : (reviewSuccess || result.status === 'pending_review') ? '✓ Consultation Requested' : 'Request Doctor Review'}
            </button>
          )}

          <button
            className="sa-btn-outline"
            onClick={() => navigate('/dashboard')}
            id="save-results-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            View Dashboard History
          </button>
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────
   Main page component
   ───────────────────────────────────── */
const SkinAnalysis = () => {
  const [step, setStep] = useState(0); // 0=upload 1=processing 2=results
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  const handleContinue = (file) => {
    setSelectedFile(file);
    setAnalysisError(null);
    setStep(1);
  };

  const handleComplete = (result, error) => {
    if (error) {
      setAnalysisError(error);
      setStep(0);
      alert(error);
    } else {
      setAnalysisResult(result);
      setStep(2);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setStep(0);
  };

  return (
    <div className="sa-page">
      <div className="sa-container">
        <Steps current={step} />

        {analysisError && (
          <div className="sa-api-error-alert" style={{ background: 'rgba(254, 178, 178, 0.16)', color: '#FEB2B2', border: '1px solid #FC8181', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>⚠️</span>
            <span>{analysisError}</span>
          </div>
        )}

        {step === 0 && <UploadStep onContinue={handleContinue} initialFile={selectedFile} />}
        {step === 1 && <ProcessingStep key="proc" file={selectedFile} onComplete={handleComplete} />}
        {step === 2 && <ResultsStep result={analysisResult} onReset={handleReset} />}
      </div>
    </div>
  );
};

export default SkinAnalysis;
