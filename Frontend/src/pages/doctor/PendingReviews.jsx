import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { MOCK_PENDING_REVIEWS } from '../../data/mockData';
import { DOCTOR_MENU } from './DoctorDashboard';
import './PendingReviews.css';

const PendingReviews = () => {
  return (
    <DashboardLayout menuItems={DOCTOR_MENU} title="Pending Reviews">
      <div className="dpend">
        <div className="dpend__header">
          <div>
            <h2 className="dpend__title">Pending Reviews</h2>
            <p className="dpend__subtitle">Patient analyses waiting for your professional assessment</p>
          </div>
          <div className="dpend__count">{MOCK_PENDING_REVIEWS.length} pending</div>
        </div>

        {/* ── Cards grid ── */}
        <div className="dpend__grid">
          {MOCK_PENDING_REVIEWS.map(r => (
            <div key={r.id} className="dpend__card">
              {/* Image placeholder */}
              <div className="dpend__card-image">
                <div className="dpend__card-image-placeholder">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                    <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Skin Image</span>
                </div>
              </div>

              <div className="dpend__card-body">
                {/* Patient info */}
                <div className="dpend__card-patient">
                  <div className="dpend__card-avatar">
                    {r.patientName.split(' ').map(w => w[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <div className="dpend__card-name">{r.patientName}</div>
                    <div className="dpend__card-id">ID: {r.patientId}</div>
                  </div>
                </div>

                {/* Details */}
                <div className="dpend__card-details">
                  <div className="dpend__card-detail">
                    <span className="dpend__card-detail-label">Prediction</span>
                    <span className="dpend__card-detail-value dpend__card-detail-value--red">
                      ⚠ {r.prediction}
                    </span>
                  </div>
                  <div className="dpend__card-detail">
                    <span className="dpend__card-detail-label">Confidence</span>
                    <span className="dpend__card-detail-value">{r.confidence}%</span>
                  </div>
                  <div className="dpend__card-detail">
                    <span className="dpend__card-detail-label">Submitted</span>
                    <span className="dpend__card-detail-value">
                      {new Date(r.dateSubmitted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PendingReviews;
