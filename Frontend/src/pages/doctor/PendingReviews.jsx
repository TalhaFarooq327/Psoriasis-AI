import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { api } from '../../services/api';
import { DOCTOR_MENU } from './DoctorDashboard';
import './PendingReviews.css';

const PendingReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const data = await api.get('/doctor/pending-reviews');
        setReviews(data);
      } catch (err) {
        console.error("Error loading pending reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  if (loading) {
    return (
      <DashboardLayout menuItems={DOCTOR_MENU} title="Pending Reviews">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: 'rgba(255,255,255,0.6)' }}>
          <div style={{ fontSize: '1.2rem' }}>Loading pending reviews...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={DOCTOR_MENU} title="Pending Reviews">
      <div className="dpend">
        <div className="dpend__header">
          <div>
            <h2 className="dpend__title">Pending Reviews</h2>
            <p className="dpend__subtitle">Patient analyses waiting for your professional assessment</p>
          </div>
          <div className="dpend__count">{reviews.length} pending</div>
        </div>

        {/* ── Cards grid ── */}
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.4)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
            <p style={{ fontSize: '1rem' }}>No pending reviews — your queue is clear!</p>
          </div>
        ) : (
          <div className="dpend__grid">
            {reviews.map(r => {
              const initials = r.patient_name
                ? r.patient_name.split(' ').map(w => w[0]).join('').toUpperCase()
                : 'P';
              const confidencePct = Math.round(r.result_confidence * 100);
              const isHealthy = r.result_label.toLowerCase().includes('normal');

              return (
                <div key={r.id} className="dpend__card">
                  {/* Image */}
                  <div className="dpend__card-image">
                    {r.image_url ? (
                      <img
                        src={r.image_url}
                        alt="Skin Scan"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    ) : (
                      <div className="dpend__card-image-placeholder">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                          <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Skin Image</span>
                      </div>
                    )}
                  </div>

                  <div className="dpend__card-body">
                    {/* Patient info */}
                    <div className="dpend__card-patient">
                      <div className="dpend__card-avatar">{initials}</div>
                      <div>
                        <div className="dpend__card-name">{r.patient_name}</div>
                        <div className="dpend__card-id">{r.patient_email}</div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="dpend__card-details">
                      <div className="dpend__card-detail">
                        <span className="dpend__card-detail-label">Prediction</span>
                        <span className={`dpend__card-detail-value ${isHealthy ? 'dpend__card-detail-value--green' : 'dpend__card-detail-value--red'}`} style={{ textTransform: 'capitalize' }}>
                          {isHealthy ? '✓' : '⚠'} {r.result_label}
                        </span>
                      </div>
                      <div className="dpend__card-detail">
                        <span className="dpend__card-detail-label">Confidence</span>
                        <span className="dpend__card-detail-value">{confidencePct}%</span>
                      </div>
                      <div className="dpend__card-detail">
                        <span className="dpend__card-detail-label">Submitted</span>
                        <span className="dpend__card-detail-value">
                          {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <Link to={`/doctor/review/${r.id}`} className="dpend__card-btn" id={`review-btn-${r.id}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Review Case
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PendingReviews;
