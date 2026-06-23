import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import { DOCTOR_MENU } from './DoctorDashboard';
import './ReviewDetail.css';

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPendingReviews, fetchPatients, fetchReviewHistory } = useAuth();

  const [analysis, setAnalysis] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    recommendation: '',
    clinicalNotes: '',
    nextSteps: '',
    severity: 'moderate',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/analyses/${id}`);
        setAnalysis(data.analysis);
        setReviews(data.reviews);
        
        // Pre-fill form if review already exists
        if (data.reviews && data.reviews.length > 0) {
          setSubmitted(true);
        }
      } catch (err) {
        console.error("Error loading case detail:", err);
        setError(err.message || 'Case detail not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchCaseDetails();
  }, [id]);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.recommendation.trim()) return;

    setSubmitting(true);
    try {
      // Consolidate the form details into a structured feedback string
      const consolidatedFeedback = `
Severity: ${form.severity.toUpperCase()}
Recommendation: ${form.recommendation}
Clinical Notes: ${form.clinicalNotes || 'None'}
Next Steps: ${form.nextSteps || 'None'}
      `.trim();

      await api.put(`/doctor/reviews/${id}`, {
        feedback: consolidatedFeedback
      });
      setSubmitted(true);
      
      // Refresh doctor page caches
      fetchPendingReviews(true);
      fetchPatients(true);
      fetchReviewHistory(true);
    } catch (err) {
      alert(err.message || 'Failed to submit case review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout menuItems={DOCTOR_MENU} title="Review Case">
        <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
          Loading case details...
        </div>
      </DashboardLayout>
    );
  }

  if (error || !analysis) {
    return (
      <DashboardLayout menuItems={DOCTOR_MENU} title="Review Case">
        <div className="drev-detail__not-found">
          <div className="drev-detail__not-found-icon">🔍</div>
          <h2>Case Not Found</h2>
          <p>{error || `The review case with ID ${id} could not be loaded.`}</p>
          <Link to="/doctor/pending-reviews" className="drev-detail__back-btn">
            ← Back to Pending Reviews
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const patientName = analysis.patient_name || 'Patient';
  const initials = patientName.split(' ').map(w => w[0]).join('').toUpperCase();
  const confidence = Math.round(analysis.result_confidence * 100);
  const prediction = analysis.result_label;
  const isHealthy = prediction.toLowerCase().includes('normal');

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
          <div className="drev-detail__id-badge">#{analysis.id}</div>
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
                  <div className="drev-detail__patient-id">ID: {analysis.user_id.slice(0, 8)}...</div>
                </div>
              </div>
              <div className="drev-detail__fields">
                <div className="drev-detail__field">
                  <span className="drev-detail__field-label">Email Address</span>
                  <span className="drev-detail__field-value" style={{ color: 'white' }}>{analysis.patient_email}</span>
                </div>
                <div className="drev-detail__field">
                  <span className="drev-detail__field-label">Date Submitted</span>
                  <span className="drev-detail__field-value">
                    {new Date(analysis.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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

              {/* Real Uploaded Image from Supabase */}
              <div className="drev-detail__image-box" style={{ background: '#1A202C', padding: 4 }}>
                <img
                  src={analysis.image_url}
                  alt="Skin Scan Case"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '350px',
                    objectFit: 'contain',
                    borderRadius: '6px'
                  }}
                />
              </div>

              {/* Prediction badge */}
              <div className="drev-detail__ai-result">
                <div className="drev-detail__prediction">
                  <span className="drev-detail__pred-label">Prediction</span>
                  <span className={`drev-detail__pred-badge ${isHealthy ? 'drev-detail__pred-badge--green' : 'drev-detail__pred-badge--red'}`} style={{ textTransform: 'capitalize' }}>
                    {isHealthy ? '✓' : '⚠'} {prediction}
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
                <div className="drev-detail__success-summary" style={{ whiteSpace: 'pre-wrap', textAlign: 'left', background: 'rgba(0,0,0,0.2)' }}>
                  {reviews[0]?.feedback || `Severity: ${form.severity.toUpperCase()}\nRecommendation: ${form.recommendation}\nClinical Notes: ${form.clinicalNotes || 'None'}\nNext Steps: ${form.nextSteps || 'None'}`}
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
                    placeholder="Describe your clinical observations (lesion patterns, scaling, etc.)..."
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
                    placeholder="e.g., Schedule follow-up in 2 weeks, monitor scaling..."
                    value={form.nextSteps}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="drev-detail__submit-btn" disabled={submitting} id="submit-review-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {submitting ? 'Submitting...' : 'Submit Review'}
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
