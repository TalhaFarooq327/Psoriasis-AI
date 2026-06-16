import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { MOCK_PENDING_REVIEWS, MOCK_PATIENTS } from '../../data/mockData';
import { DOCTOR_MENU } from './DoctorDashboard';
import './ReviewDetail.css';

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Try to find from pending reviews first, fallback to patients
  const review = MOCK_PENDING_REVIEWS.find(r => r.id === id)
    || MOCK_PATIENTS.find(p => p.id === id);

  const [form, setForm] = useState({
    recommendation: '',
    clinicalNotes: '',
    nextSteps: '',
    severity: 'moderate',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.recommendation.trim()) return;
    setSubmitted(true);
  };

  if (!review) {
    return (
      <DashboardLayout menuItems={DOCTOR_MENU} title="Review Case">
        <div className="drev-detail__not-found">
          <div className="drev-detail__not-found-icon">🔍</div>
          <h2>Case Not Found</h2>
          <p>The review with ID <strong>{id}</strong> could not be found.</p>
          <Link to="/doctor/pending-reviews" className="drev-detail__back-btn">
            ← Back to Pending Reviews
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const patientName = review.patientName || review.name;
  const initials = patientName.split(' ').map(w => w[0]).join('').toUpperCase();
  const confidence = review.confidence;
  const prediction = review.prediction;
  const dateSubmitted = review.dateSubmitted || review.analysisDate;
  const analysisId = review.analysisId || review.id;

  return (
    <DashboardLayout menuItems={DOCTOR_MENU} title="Review Case">
      <div className="drev-detail">

        {/* ── Back breadcrumb ── */}
        <Link to="/doctor/pending-reviews" className="drev-detail__breadcrumb">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Pending Reviews
        </Link>

        {/* ── Page title ── */}
        <div className="drev-detail__header">
          <div>
            <h2 className="drev-detail__title">Review Case</h2>
            <p className="drev-detail__subtitle">Provide your professional assessment for this patient analysis</p>
          </div>
          <div className="drev-detail__id-badge">#{review.id}</div>
        </div>

        <div className="drev-detail__layout">

          {/* ── Left: Patient info + AI result ── */}
          <div className="drev-detail__left">

            {/* Patient card */}
            <div className="drev-detail__card">
              <h3 className="drev-detail__card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Patient Information
              </h3>
              <div className="drev-detail__patient">
                <div className="drev-detail__avatar">{initials}</div>
                <div>
                  <div className="drev-detail__patient-name">{patientName}</div>
                  <div className="drev-detail__patient-id">ID: {review.patientId || review.id}</div>
                </div>
              </div>
              <div className="drev-detail__fields">
                <div className="drev-detail__field">
                  <span className="drev-detail__field-label">Analysis ID</span>
                  <span className="drev-detail__field-value">{analysisId}</span>
                </div>
                <div className="drev-detail__field">
                  <span className="drev-detail__field-label">Date Submitted</span>
                  <span className="drev-detail__field-value">
                    {new Date(dateSubmitted).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Result card */}
            <div className="drev-detail__card">
              <h3 className="drev-detail__card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                AI Analysis Result
              </h3>

              {/* Image placeholder */}
              <div className="drev-detail__image-box">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                  <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Skin Image</span>
                <span className="drev-detail__image-note">Image will display after backend integration</span>
              </div>

              {/* Prediction badge */}
              <div className="drev-detail__ai-result">
                <div className="drev-detail__prediction">
                  <span className="drev-detail__pred-label">Prediction</span>
                  <span className={`drev-detail__pred-badge ${prediction.includes('No') ? 'drev-detail__pred-badge--green' : 'drev-detail__pred-badge--red'}`}>
                    {prediction.includes('No') ? '✓' : '⚠'} {prediction}
                  </span>
                </div>
                <div className="drev-detail__conf-section">
                  <div className="drev-detail__conf-header">
                    <span>AI Confidence</span>
                    <strong>{confidence}%</strong>
                  </div>
                  <div className="drev-detail__conf-bar">
                    <div
                      className={`drev-detail__conf-fill ${confidence >= 90 ? 'drev-detail__conf-fill--high' : confidence >= 75 ? 'drev-detail__conf-fill--med' : 'drev-detail__conf-fill--low'}`}
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Review form ── */}
          <div className="drev-detail__right">
            {submitted ? (
              <div className="drev-detail__success">
                <div className="drev-detail__success-icon">✅</div>
                <h3>Review Submitted!</h3>
                <p>Your assessment has been recorded and the patient will be notified.</p>
                <div className="drev-detail__success-summary">
                  <div className="drev-detail__success-row">
                    <span>Severity</span>
                    <strong style={{ textTransform: 'capitalize' }}>{form.severity}</strong>
                  </div>
                  <div className="drev-detail__success-row">
                    <span>Recommendation</span>
                    <strong>{form.recommendation.slice(0, 60)}{form.recommendation.length > 60 ? '…' : ''}</strong>
                  </div>
                </div>
                <div className="drev-detail__success-actions">
                  <Link to="/doctor/pending-reviews" className="drev-detail__success-btn drev-detail__success-btn--primary">
                    View Pending Reviews
                  </Link>
                  <Link to="/doctor/dashboard" className="drev-detail__success-btn drev-detail__success-btn--secondary">
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <form className="drev-detail__form" onSubmit={handleSubmit}>
                <h3 className="drev-detail__form-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Your Medical Assessment
                </h3>

                {/* Severity */}
                <div className="drev-detail__field-group">
                  <label className="drev-detail__label" htmlFor="severity">Severity Assessment</label>
                  <select
                    id="severity"
                    name="severity"
                    className="drev-detail__select"
                    value={form.severity}
                    onChange={handleChange}
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                    <option value="very-severe">Very Severe</option>
                    <option value="inconclusive">Inconclusive — needs in-person exam</option>
                  </select>
                </div>

                {/* Recommendation */}
                <div className="drev-detail__field-group">
                  <label className="drev-detail__label" htmlFor="recommendation">
                    Recommendation <span className="drev-detail__required">*</span>
                  </label>
                  <textarea
                    id="recommendation"
                    name="recommendation"
                    className="drev-detail__textarea"
                    rows={4}
                    placeholder="Describe your treatment recommendation (e.g., topical corticosteroids, phototherapy, in-person appointment)..."
                    value={form.recommendation}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Clinical Notes */}
                <div className="drev-detail__field-group">
                  <label className="drev-detail__label" htmlFor="clinicalNotes">Clinical Notes</label>
                  <textarea
                    id="clinicalNotes"
                    name="clinicalNotes"
                    className="drev-detail__textarea"
                    rows={3}
                    placeholder="Describe your clinical observations (lesion patterns, erythema, scaling, etc.)..."
                    value={form.clinicalNotes}
                    onChange={handleChange}
                  />
                </div>

                {/* Next Steps */}
                <div className="drev-detail__field-group">
                  <label className="drev-detail__label" htmlFor="nextSteps">Suggested Next Steps</label>
                  <textarea
                    id="nextSteps"
                    name="nextSteps"
                    className="drev-detail__textarea"
                    rows={3}
                    placeholder="e.g., Schedule follow-up in 2 weeks, monitor for side effects, blood work..."
                    value={form.nextSteps}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="drev-detail__submit-btn" id="submit-review-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReviewDetail;
