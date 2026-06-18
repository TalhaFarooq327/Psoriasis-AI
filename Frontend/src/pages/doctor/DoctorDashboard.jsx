import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import AnimatedNumber from '../../components/AnimatedNumber';
import './DoctorDashboard.css';

/* ── Doctor Sidebar menu ── */
const DOCTOR_MENU = [
  { label: 'Dashboard',       path: '/doctor/dashboard',        icon: '📊' },
  { label: 'Patients',        path: '/doctor/patients',         icon: '👥' },
  { label: 'Pending Reviews', path: '/doctor/pending-reviews',  icon: '📋' },
  { label: 'Review History',  path: '/doctor/review-history',   icon: '✅' },
  { label: 'Profile',         path: '/doctor/profile',          icon: '👤' },
];

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctorData = async () => {
      try {
        const data = await api.get('/doctor/pending-reviews');
        setPendingReviews(data);
      } catch (err) {
        console.error("Error loading doctor pending reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDoctorData();
  }, []);

  const totalPatients = new Set(pendingReviews.map(r => r.patient_email)).size;
  const pendingCount = pendingReviews.length;
  // Completed reviews can be calculated or mocked as 0 / database counts
  const completedReviews = 0;

  const recentPending = pendingReviews.slice(0, 3);

  if (loading) {
    return (
      <DashboardLayout menuItems={DOCTOR_MENU} title="Doctor Dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: 'rgba(255,255,255,0.6)' }}>
          <div style={{ fontSize: '1.2rem' }}>Loading doctor dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

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
              Welcome, <span>Dr. {user?.full_name?.split(' ').slice(-1)[0] || user?.full_name || 'Doctor'}</span>
            </h2>
            <p className="ddash__welcome-desc">
              {user?.specialization || 'Dermatology'} · {user?.hospital || 'Partner Hospital'}
            </p>
            <p className="ddash__welcome-sub">
              You have <strong>{pendingCount} pending reviews</strong> waiting for your assessment.
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
              <div className="ddash__stat-value"><AnimatedNumber value={totalPatients} /></div>
              <div className="ddash__stat-label">Active Patients Queue</div>
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
              <div className="ddash__stat-value"><AnimatedNumber value={pendingCount} /></div>
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
              <div className="ddash__stat-value"><AnimatedNumber value={completedReviews} /></div>
              <div className="ddash__stat-label">Session Reviews</div>
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
              View All ({pendingCount}) →
            </Link>
          </div>

          <div className="ddash__review-list">
            {recentPending.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                No pending reviews found. Outstanding tasks are clear!
              </div>
            ) : (
              recentPending.map(r => {
                const initials = r.patient_name
                  ? r.patient_name.split(' ').map(w => w[0]).join('').toUpperCase()
                  : 'P';
                const confidencePct = Math.round(r.result_confidence * 100);
                return (
                  <div key={r.id} className="ddash__review-card">
                    <div className="ddash__review-avatar">
                      {initials}
                    </div>
                    <div className="ddash__review-info">
                      <div className="ddash__review-name">{r.patient_name}</div>
                      <div className="ddash__review-meta" style={{ textTransform: 'capitalize' }}>
                        {r.result_label} · {confidencePct}% confidence
                      </div>
                    </div>
                    <div className="ddash__review-right">
                      <span className="ddash__review-date">
                        {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      {/* Navigate to the detail view of the specific analysis */}
                      <Link to={`/doctor/review/${r.id}`} className="ddash__review-btn">
                        Review
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
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
