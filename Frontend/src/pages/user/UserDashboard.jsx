import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import DashboardLayout from '../../components/DashboardLayout';
import AnimatedNumber from '../../components/AnimatedNumber';
import './UserDashboard.css';

/* ── Sidebar menu items ── */
const USER_MENU = [
  { label: 'Dashboard',      path: '/dashboard',          icon: '📊' },
  { label: 'Analysis History',path: '/dashboard/history',  icon: '🕐' },
  { label: 'New Analysis',   path: '/analyze',            icon: '🔬' },
  { label: 'Doctor Reviews', path: '/dashboard/reviews',  icon: '👨‍⚕️' },
  { label: 'Profile',        path: '/dashboard/profile',  icon: '👤' },
];

const UserDashboard = () => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.get('/analyses');
        setAnalyses(data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const firstName = user?.full_name?.split(' ')[0] || 'User';

  // Compute stats dynamically from the actual DB data
  const totalAnalyses = analyses.length;
  const consultationsRequested = analyses.filter(a => a.status === 'pending_review' || a.status === 'reviewed').length;
  const reviewsCompleted = analyses.filter(a => a.status === 'reviewed').length;

  const recentAnalyses = analyses.slice(0, 3);
  const pendingConsults = analyses.filter(a => a.status === 'pending_review');

  if (loading) {
    return (
      <DashboardLayout menuItems={USER_MENU} title="Dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: 'rgba(255,255,255,0.6)' }}>
          <div style={{ fontSize: '1.2rem' }}>Loading dashboard data...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={USER_MENU} title="Dashboard">
      <div className="udash">
        {/* ── Welcome Section ── */}
        <div className="udash__welcome">
          <div className="udash__welcome-content">
            <h2 className="udash__welcome-title">
              Welcome back, <span>{firstName}</span> 👋
            </h2>
            <p className="udash__welcome-desc">
              Here's an overview of your psoriasis analysis activity. Keep tracking your skin health for better outcomes.
            </p>
            <Link to="/analyze" className="udash__welcome-btn" id="udash-new-analysis-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Start New Analysis
            </Link>
          </div>
          <div className="udash__welcome-visual">
            <div className="udash__welcome-icon">🔬</div>
          </div>
        </div>

        {/* ── Stats Cards ── */}
        <div className="udash__stats">
          <div className="udash__stat-card">
            <div className="udash__stat-icon udash__stat-icon--blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="udash__stat-info">
              <div className="udash__stat-value"><AnimatedNumber value={totalAnalyses} /></div>
              <div className="udash__stat-label">Total Analyses</div>
            </div>
          </div>

          <div className="udash__stat-card">
            <div className="udash__stat-icon udash__stat-icon--green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="udash__stat-info">
              <div className="udash__stat-value"><AnimatedNumber value={consultationsRequested} /></div>
              <div className="udash__stat-label">Doctor Consultations</div>
            </div>
          </div>

          <div className="udash__stat-card">
            <div className="udash__stat-icon udash__stat-icon--cyan">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="udash__stat-info">
              <div className="udash__stat-value"><AnimatedNumber value={reviewsCompleted} /></div>
              <div className="udash__stat-label">Reviews Completed</div>
            </div>
          </div>
        </div>

        {/* ── Recent Analyses ── */}
        <div className="udash__section">
          <div className="udash__section-header">
            <h3 className="udash__section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Recent Analyses
            </h3>
            <Link to="/dashboard/history" className="udash__section-link">
              View All →
            </Link>
          </div>

          <div className="udash__table-wrap">
            {recentAnalyses.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                No analysis history found. Start a new analysis to see results here!
              </div>
            ) : (
              <table className="udash__table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Prediction</th>
                    <th>Confidence</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAnalyses.map(a => {
                    const confidencePct = Math.round(a.result_confidence * 100);
                    const isHealthy = a.result_label.toLowerCase().includes('normal');
                    return (
                      <tr key={a.id}>
                        <td className="udash__table-date">
                          {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td>
                          <span className={`udash__badge ${isHealthy ? 'udash__badge--green' : 'udash__badge--red'}`} style={{ textTransform: 'capitalize' }}>
                            {a.result_label}
                          </span>
                        </td>
                        <td>
                          <div className="udash__conf">
                            <div className="udash__conf-bar">
                              <div className="udash__conf-fill" style={{ width: `${confidencePct}%` }} />
                            </div>
                            <span>{confidencePct}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`udash__badge ${a.status === 'reviewed' ? 'udash__badge--green' : a.status === 'pending_review' ? 'udash__badge--yellow' : 'udash__badge--blue'}`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Pending Consultations ── */}
        {pendingConsults.length > 0 && (
          <div className="udash__section">
            <div className="udash__section-header">
              <h3 className="udash__section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Pending Doctor Reviews
              </h3>
              <Link to="/dashboard/reviews" className="udash__section-link">
                View All →
              </Link>
            </div>

            <div className="udash__consult-list">
              {pendingConsults.map(a => {
                const confidencePct = Math.round(a.result_confidence * 100);
                return (
                  <div key={a.id} className="udash__consult-card">
                    <div className="udash__consult-icon">⏳</div>
                    <div className="udash__consult-info">
                      <div className="udash__consult-pred" style={{ textTransform: 'capitalize', color: 'white', fontWeight: 500 }}>
                        {a.result_label}
                      </div>
                      <div className="udash__consult-meta">
                        Confidence: {confidencePct}% · Submitted {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <span className="udash__badge udash__badge--yellow">{a.status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export { USER_MENU };
export default UserDashboard;
