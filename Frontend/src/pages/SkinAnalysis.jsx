import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SkinAnalysis.css';

/* ─────────────────────────────────────
   Mock result data
   ───────────────────────────────────── */
const MOCK_RESULT = {
  condition: 'Psoriasis',
  detected: true,
  confidence: 92,
  status: 'Completed',
  imageQuality: 'Excellent',
  analysisTime: '1.8s',
  modelVersion: 'DermAI v3.2',
};

const STATUS_MESSAGES = [
  'Preprocessing image...',
  'Enhancing lesion visibility...',
  'Extracting psoriasis features...',
  'Running classification model...',
  'Calculating confidence score...',
  'Generating diagnostic report...',
];

const CHECKLIST = [
  { id: 'scan', label: 'Scanning skin surface', icon: '🔍' },
  { id: 'acne', label: 'Detecting acne & lesions', icon: '🧪' },
  { id: 'tone', label: 'Evaluating skin tone', icon: '🎨' },
  { id: 'texture', label: 'Checking skin texture', icon: '📊' },
  { id: 'classify', label: 'Running AI classifier', icon: '🤖' },
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
const UploadStep = ({ onContinue }) => {
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
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
              onClick={() => { setPreview(null); fileRef.current?.click(); }}
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
            disabled={!preview}
            onClick={onContinue}
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
const ProcessingStep = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [checkIdx, setCheckIdx] = useState(-1);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += 0.9;
      setProgress(Math.min(p, 100));

      // Update status message
      const newMsgIdx = Math.floor((p / 100) * STATUS_MESSAGES.length);
      setMsgIdx(Math.min(newMsgIdx, STATUS_MESSAGES.length - 1));

      // Update checklist
      const doneCount = Math.floor((p / 100) * CHECKLIST.length);
      setCheckIdx(Math.min(doneCount, CHECKLIST.length - 1));

      if (p >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

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
const ResultsStep = ({ onReset }) => {
  const [animated, setAnimated] = useState(false);
  const result = MOCK_RESULT;

  useEffect(() => {
    setTimeout(() => setAnimated(true), 200);
  }, []);

  const pct = result.confidence;
  const detected = result.detected;
  const variant = detected ? 'positive' : 'negative';

  // Ring SVG geometry
  const radius = 65;
  const circ = 2 * Math.PI * radius; // ≈ 408.4
  const dashOffset = circ - (animated ? (pct / 100) * circ : circ);

  const handleDownload = () => {
    const reportText = `
PSORIASIS AI — ANALYSIS REPORT
================================
Generated: ${new Date().toLocaleString()}

PREDICTION:    ${result.detected ? 'Psoriasis Detected' : 'No Psoriasis Detected'}
CONFIDENCE:    ${result.confidence}%
CONDITION:     ${result.condition}
STATUS:        ${result.status}
IMAGE QUALITY: ${result.imageQuality}
ANALYSIS TIME: ${result.analysisTime}
MODEL:         ${result.modelVersion}

DISCLAIMER:
This report is generated by an AI model and is NOT a medical diagnosis.
Please consult a licensed dermatologist for professional medical advice.
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'psoriasis-ai-report.txt';
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
              <div className={`sa-assess-value sa-assess-value--${variant}`}>
                {result.condition}
              </div>
            </div>
            <div className="sa-assess-item">
              <div className="sa-assess-label">Confidence Level</div>
              <div className={`sa-assess-value sa-assess-value--${variant}`}>
                {result.confidence}% — {result.confidence >= 90 ? 'High' : result.confidence >= 70 ? 'Moderate' : 'Low'}
              </div>
            </div>
            <div className="sa-assess-item">
              <div className="sa-assess-label">Analysis Status</div>
              <div className="sa-assess-value sa-assess-value--good">
                ✓ {result.status}
              </div>
            </div>
            <div className="sa-assess-item">
              <div className="sa-assess-label">Image Quality</div>
              <div className="sa-assess-value sa-assess-value--good">
                {result.imageQuality}
              </div>
            </div>
            <div className="sa-assess-item">
              <div className="sa-assess-label">Analysis Time</div>
              <div className="sa-assess-value" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {result.analysisTime}
              </div>
            </div>
            <div className="sa-assess-item">
              <div className="sa-assess-label">AI Model</div>
              <div className="sa-assess-value" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {result.modelVersion}
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

          <button
            className="sa-btn-outline"
            onClick={() => alert('Results saved! (mock action)')}
            id="save-results-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Save Results
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
  const navigate = useNavigate();

  const handleContinue = () => setStep(1);
  const handleComplete = () => setStep(2);
  const handleReset = () => setStep(0);

  return (
    <div className="sa-page">
      <div className="sa-container">
        <Steps current={step} />

        {step === 0 && <UploadStep onContinue={handleContinue} />}
        {step === 1 && <ProcessingStep key="proc" onComplete={handleComplete} />}
        {step === 2 && <ResultsStep onReset={handleReset} />}
      </div>
    </div>
  );
};

export default SkinAnalysis;
