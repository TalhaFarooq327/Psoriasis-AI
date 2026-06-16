import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { MOCK_CONSULTATIONS } from '../../data/mockData';
import { DOCTOR_MENU } from './DoctorDashboard';
import './ReviewHistory.css';

const ReviewHistory = () => {
  const [search, setSearch] = useState('');

  // Only completed/reviewed consultations
  const reviews = MOCK_CONSULTATIONS.filter(c => c.status === 'Reviewed');

  const filtered = reviews.filter(c =>
    c.patientName.toLowerCase().includes(search.toLowerCase()) ||
    c.analysisId.toLowerCase().includes(search.toLowerCase()) ||
    c.prediction.toLowerCase().includes(search.toLowerCase())
  );

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
            {filtered.map(c => (
              <div key={c.id} className="drhist__card">
                {/* Left: patient + meta */}
                <div className="drhist__card-left">
                  <div className="drhist__avatar">
                    {c.patientName.split(' ').map(w => w[0]).join('').toUpperCase()}
                  </div>
                  <div className="drhist__info">
                    <div className="drhist__name">{c.patientName}</div>
                    <div className="drhist__meta">
                      Analysis {c.analysisId} · Submitted {new Date(c.dateSubmitted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                {/* Center: prediction + confidence */}
                <div className="drhist__card-center">
                  <span className={`drhist__badge ${c.prediction.includes('No') ? 'drhist__badge--green' : 'drhist__badge--red'}`}>
                    {c.prediction.includes('No') ? '✓' : '⚠'} {c.prediction}
                  </span>
                  <div className="drhist__conf">
                    <div className="drhist__conf-bar">
                      <div className="drhist__conf-fill" style={{ width: `${c.confidence}%` }} />
                    </div>
                    <span>{c.confidence}%</span>
                  </div>
                </div>

                {/* Right: review date + status */}
                <div className="drhist__card-right">
                  <span className="drhist__badge drhist__badge--green drhist__badge--outline">✅ Reviewed</span>
                  <div className="drhist__review-date">
                    {new Date(c.reviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
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
