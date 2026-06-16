import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { MOCK_STATS_DOCTOR, MOCK_PENDING_REVIEWS, MOCK_PATIENTS } from '../../data/mockData';
import './DoctorDashboard.css';

/* ── Doctor Sidebar menu ── */
const DOCTOR_MENU = [
  { label: 'Dashboard',       path: '/doctor/dashboard',        icon: '📊' },
  { label: 'Patients',        path: '/doctor/patients',         icon: '👥' },
  { label: 'Pending Reviews', path: '/doctor/pending-reviews',  icon: '📋', badge: 5 },
  { label: 'Review History',  path: '/doctor/review-history',   icon: '✅' },
  { label: 'Profile',         path: '/doctor/profile',          icon: '👤' },
];

/* ── Animated counter ── */
const AnimatedNumber = ({ value, duration = 1200 }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{display}</span>;
};

const DoctorDashboard = () => {
  const { user } = useAuth();
  const stats = MOCK_STATS_DOCTOR;
  const recentPending = MOCK_PENDING_REVIEWS.slice(0, 3);

  return (
    <DashboardLayout menuItems={DOCTOR_MENU} title="Doctor Dashboard">
      <div className="ddash">
        {/* ── Welcome ── */}
        <div className="ddash__welcome">
          <div className="ddash__welcome-content">
            <div className="ddash__welcome-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Medical Professional
            </div>
            <h2 className="ddash__welcome-title">
              Welcome, <span>{user?.name}</span>
            </h2>
            <p className="ddash__welcome-desc">
              {user?.specialization} · {user?.hospital || 'Hospital'}
            </p>
            <p className="ddash__welcome-sub">
              You have <strong>{stats.pendingReviews} pending reviews</strong> waiting for your assessment.
            </p>
          </div>
          <div className="ddash__welcome-visual">
            <div className="ddash__welcome-icon">🩺</div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="ddash__stats">
          <div className="ddash__stat-card ddash__stat-card--patients">
            <div className="ddash__stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="ddash__stat-value"><AnimatedNumber value={stats.totalPatients} /></div>
              <div className="ddash__stat-label">Total Patients</div>
            </div>
          </div>

          <div className="ddash__stat-card ddash__stat-card--pending">
            <div className="ddash__stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="ddash__stat-value"><AnimatedNumber value={stats.pendingReviews} /></div>
              <div className="ddash__stat-label">Pending Reviews</div>
            </div>
          </div>

          <div className="ddash__stat-card ddash__stat-card--completed">
            <div className="ddash__stat-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="ddash__stat-value"><AnimatedNumber value={stats.completedReviews} /></div>
              <div className="ddash__stat-label">Completed Reviews</div>
            </div>
          </div>
        </div>

        {/* ── Recent Pending Reviews ── */}
        <div className="ddash__section">
          <div className="ddash__section-header">
            <h3 className="ddash__section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Recent Pending Reviews
            </h3>
            <Link to="/doctor/pending-reviews" className="ddash__section-link">
              View All ({MOCK_PENDING_REVIEWS.length}) →
            </Link>
          </div>

          <div className="ddash__review-list">
            {recentPending.map(r => (
              <div key={r.id} className="ddash__review-card">
                <div className="ddash__review-avatar">
                  {r.patientName.split(' ').map(w => w[0]).join('').toUpperCase()}
                </div>
                <div className="ddash__review-info">
                  <div className="ddash__review-name">{r.patientName}</div>
                  <div className="ddash__review-meta">
                    {r.prediction} · {r.confidence}% confidence
                  </div>
                </div>
                <div className="ddash__review-right">
                  <span className="ddash__review-date">
                    {new Date(r.dateSubmitted).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <Link to={`/doctor/review/${r.id}`} className="ddash__review-btn">
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="ddash__actions">
          <Link to="/doctor/pending-reviews" className="ddash__action-card">
            <div className="ddash__action-icon ddash__action-icon--blue">📋</div>
            <span>View Pending Reviews</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <Link to="/doctor/patients" className="ddash__action-card">
            <div className="ddash__action-icon ddash__action-icon--green">👥</div>
            <span>Search Patients</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <Link to="/doctor/review-history" className="ddash__action-card">
            <div className="ddash__action-icon ddash__action-icon--cyan">✅</div>
            <span>Review History</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export { DOCTOR_MENU };
export default DoctorDashboard;
