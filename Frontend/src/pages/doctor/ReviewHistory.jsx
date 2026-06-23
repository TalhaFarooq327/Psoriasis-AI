import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { DOCTOR_MENU } from './DoctorDashboard';
import './ReviewHistory.css';

const ReviewHistory = () => {
  const { reviewHistory, reviewHistoryLoading, fetchReviewHistory } = useAuth();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchReviewHistory();
  }, [fetchReviewHistory]);

  const reviews = reviewHistory;

  const filtered = reviews.filter(r =>
    r.patient_name.toLowerCase().includes(search.toLowerCase()) ||
    String(r.analysis_id).includes(search) ||
    r.result_label.toLowerCase().includes(search.toLowerCase())
  );

  if (reviewHistoryLoading) {
    return (
      <DashboardLayout menuItems={DOCTOR_MENU} title="Review History">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: 'rgba(255,255,255,0.6)' }}>
          <div style={{ fontSize: '1.2rem' }}>Loading review history...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={DOCTOR_MENU} title="Review History">
      <div className="drhist">
        {/* ── Header ── */}
        <div className="drhist__header">
          <div>
            <h2 className="drhist__title">Review History</h2>
            <p className="drhist__subtitle">All your completed patient reviews and assessments</p>
          </div>
          <div className="drhist__count">{reviews.length} completed</div>
        </div>

        {/* ── Search ── */}
        <div className="drhist__search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by patient, analysis ID, or prediction..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="drhist__search-input"
            id="review-history-search"
          />
        </div>

        {/* ── List ── */}
        {filtered.length > 0 ? (
          <div className="drhist__list">
            {filtered.map(r => {
              const confidencePct = Math.round(r.result_confidence * 100);
              const isHealthy = r.result_label.toLowerCase().includes('normal');

              return (
                <div key={r.review_id} className="drhist__card">
                  {/* Left: patient + meta */}
                  <div className="drhist__card-left">
                    <div className="drhist__avatar">
                      {r.patient_name.split(' ').map(w => w[0]).join('').toUpperCase()}
                    </div>
                    <div className="drhist__info">
                      <div className="drhist__name">{r.patient_name}</div>
                      <div className="drhist__meta">
                        Analysis #{r.analysis_id} · Submitted {new Date(r.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {/* Center: prediction + confidence */}
                  <div className="drhist__card-center">
                    <span className={`drhist__badge ${isHealthy ? 'drhist__badge--green' : 'drhist__badge--red'}`} style={{ textTransform: 'capitalize' }}>
                      {isHealthy ? '✓' : '⚠'} {r.result_label}
                    </span>
                    <div className="drhist__conf">
                      <div className="drhist__conf-bar">
                        <div className="drhist__conf-fill" style={{ width: `${confidencePct}%` }} />
                      </div>
                      <span>{confidencePct}%</span>
                    </div>
                  </div>

                  {/* Right: review date + status */}
                  <div className="drhist__card-right">
                    <span className="drhist__badge drhist__badge--green drhist__badge--outline">✅ Reviewed</span>
                    <div className="drhist__review-date">
                      {new Date(r.review_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="drhist__empty">
            <div className="drhist__empty-icon">📋</div>
            <p>{search ? 'No reviews match your search.' : 'No completed reviews yet.'}</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="drhist__footer">
            Showing {filtered.length} of {reviews.length} completed reviews
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReviewHistory;
