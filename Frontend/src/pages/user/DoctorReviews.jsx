import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { MOCK_CONSULTATIONS } from '../../data/mockData';
import { USER_MENU } from './UserDashboard';
import './DoctorReviews.css';

const TABS = [
  { key: 'all', label: 'All Requests' },
  { key: 'pending', label: 'Pending' },
  { key: 'reviewed', label: 'Reviewed' },
];

const DoctorReviews = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = MOCK_CONSULTATIONS.filter(c => {
    if (activeTab === 'pending') return c.status === 'Pending Review';
    if (activeTab === 'reviewed') return c.status === 'Reviewed';
    return true;
  });

  const pendingCount = MOCK_CONSULTATIONS.filter(c => c.status === 'Pending Review').length;
  const reviewedCount = MOCK_CONSULTATIONS.filter(c => c.status === 'Reviewed').length;

  return (
    <DashboardLayout menuItems={USER_MENU} title="Doctor Reviews">
      <div className="drev">
        {/* ── Header ── */}
        <div className="drev__header">
          <div>
            <h2 className="drev__title">Doctor Reviews</h2>
            <p className="drev__subtitle">Track your consultation requests and doctor responses</p>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="drev__stats">
          <div className="drev__stat">
            <span className="drev__stat-num">{MOCK_CONSULTATIONS.length}</span>
            <span className="drev__stat-label">Total Requests</span>
          </div>
          <div className="drev__stat-divider" />
          <div className="drev__stat">
            <span className="drev__stat-num drev__stat-num--yellow">{pendingCount}</span>
            <span className="drev__stat-label">Pending</span>
          </div>
          <div className="drev__stat-divider" />
          <div className="drev__stat">
            <span className="drev__stat-num drev__stat-num--green">{reviewedCount}</span>
            <span className="drev__stat-label">Reviewed</span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="drev__tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`drev__tab ${activeTab === tab.key ? 'drev__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.key === 'pending' && pendingCount > 0 && (
                <span className="drev__tab-badge">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Cards ── */}
        <div className="drev__list">
          {filtered.length > 0 ? filtered.map(c => {
            const isExpanded = expandedId === c.id;
            const isPending = c.status === 'Pending Review';

            return (
              <div key={c.id} className={`drev__card ${isPending ? 'drev__card--pending' : 'drev__card--reviewed'}`}>
                <div className="drev__card-header" onClick={() => setExpandedId(isExpanded ? null : c.id)}>
                  <div className="drev__card-icon">
                    {isPending ? '⏳' : '✅'}
                  </div>
                  <div className="drev__card-info">
                    <div className="drev__card-pred">{c.prediction}</div>
                    <div className="drev__card-meta">
                      Confidence: {c.confidence}% · Submitted {new Date(c.dateSubmitted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <span className={`drev__badge ${isPending ? 'drev__badge--yellow' : 'drev__badge--green'}`}>
                    {c.status}
                  </span>
                  <svg
                    width="18" height="18" viewBox="0 0 24 24" fill="none"
                    className={`drev__card-chevron ${isExpanded ? 'drev__card-chevron--open' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="drev__card-body">
                    <div className="drev__card-divider" />

                    {/* Analysis info */}
                    <div className="drev__detail-grid">
                      <div className="drev__detail">
                        <span className="drev__detail-label">Analysis ID</span>
                        <span className="drev__detail-value">{c.analysisId}</span>
                      </div>
                      <div className="drev__detail">
                        <span className="drev__detail-label">Doctor</span>
                        <span className="drev__detail-value">{c.doctorName}</span>
                      </div>
                      <div className="drev__detail">
                        <span className="drev__detail-label">Confidence</span>
                        <span className="drev__detail-value">{c.confidence}%</span>
                      </div>
                      <div className="drev__detail">
                        <span className="drev__detail-label">Date Submitted</span>
                        <span className="drev__detail-value">{new Date(c.dateSubmitted).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Doctor response (if reviewed) */}
                    {!isPending && (
                      <div className="drev__response">
                        <h4 className="drev__response-title">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          Doctor's Response
                          <span className="drev__response-date">
                            Reviewed on {new Date(c.reviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </h4>

                        <div className="drev__response-section">
                          <div className="drev__response-label">Recommendation</div>
                          <p className="drev__response-text">{c.doctorRecommendation}</p>
                        </div>

                        <div className="drev__response-section">
                          <div className="drev__response-label">Clinical Notes</div>
                          <p className="drev__response-text">{c.doctorNotes}</p>
                        </div>

                        <div className="drev__response-section">
                          <div className="drev__response-label">Suggested Next Steps</div>
                          <p className="drev__response-text">{c.suggestedNextSteps}</p>
                        </div>
                      </div>
                    )}

                    {isPending && (
                      <div className="drev__pending-msg">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Your request is being reviewed by {c.doctorName}. You'll be notified once the review is complete.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }) : (
            <div className="drev__empty">
              <div className="drev__empty-icon">📋</div>
              <p>No consultation requests found for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorReviews;
