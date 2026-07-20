import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './DashboardLayout.css';

/* ═══════════════════════════════════════
   DASHBOARD LAYOUT
   Reusable sidebar + content layout
   for both User and Doctor dashboards.
   ═══════════════════════════════════════ */

const DashboardLayout = ({ menuItems = [], title = 'Dashboard', children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isDoctor } = useAuth();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('read_notif_ids')) || [];
    } catch {
      return [];
    }
  });
  const notifRef = useRef(null);

  /* Close mobile sidebar on route change */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Fetch notifications based on role */
  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      try {
        if (isDoctor) {
          // Fetch pending reviews for doctors
          const data = await api.get('/doctor/pending-reviews');
          const notifs = data.map(item => ({
            id: `req-${item.id}`,
            text: `New review requested for scan #${item.id} by ${item.patient_name || 'Patient'}.`,
            time: item.created_at,
            path: `/doctor/review/${item.id}`
          }));
          setNotifications(notifs);
        } else {
          // Fetch completed analyses for patients
          const data = await api.get('/analyses');
          const reviewed = data.filter(a => a.status === 'reviewed');
          const notifs = reviewed.map(item => {
            const doctorName = item.reviews && item.reviews.length > 0 ? item.reviews[0].doctor?.full_name : 'Dermatologist';
            return {
              id: `drev-${item.id}`,
              text: `Dr. ${doctorName} has submitted a review for scan #${item.id}.`,
              time: item.reviews && item.reviews.length > 0 ? item.reviews[0].created_at : item.created_at,
              path: '/dashboard/reviews'
            };
          });
          setNotifications(notifs);
        }
      } catch (err) {
        console.error("Error loading notifications:", err);
      }
    };

    loadNotifications();

    // Poll every 30 seconds for live updates
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const unreadNotifications = notifications.filter(n => !readIds.includes(n.id));
  const hasUnread = unreadNotifications.length > 0;

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    const updated = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(updated);
    localStorage.setItem('read_notif_ids', JSON.stringify(updated));
  };

  const handleNotificationClick = (notif) => {
    if (!readIds.includes(notif.id)) {
      const updated = [...readIds, notif.id];
      setReadIds(updated);
      localStorage.setItem('read_notif_ids', JSON.stringify(updated));
    }
    setNotifOpen(false);
    navigate(notif.path);
  };

  return (
    <div className="dash-layout">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="dash-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`dash-sidebar ${collapsed ? 'dash-sidebar--collapsed' : ''} ${mobileOpen ? 'dash-sidebar--mobile-open' : ''}`}>
        {/* Sidebar header */}
        <div className="dash-sidebar__header">
          <Link to="/" className="dash-sidebar__logo">
          
              <img src="/logo.png" alt="Psoriasis AI Logo" className="dash-sidebar__logo-img" style={{ width: '50px', height: 'auto', objectFit: 'contain' }} />
            
            {!collapsed && (
              <span className="dash-sidebar__logo-text">
                Psoriasis<span className="dash-sidebar__logo-accent">AI</span>
              </span>
            )}
          </Link>

          <button
            className="dash-sidebar__toggle"
            onClick={() => setCollapsed(c => !c)}
            aria-label="Toggle sidebar"
            id="sidebar-toggle-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              {collapsed ? (
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>

        {/* User info */}
        <div className="dash-sidebar__user">
          <div className="dash-sidebar__avatar">{initials}</div>
          {!collapsed && (
            <div className="dash-sidebar__user-info">
              <span className="dash-sidebar__user-name">{user?.full_name || 'User'}</span>
              <span className="dash-sidebar__user-role">
                {isDoctor ? user?.specialization : 'Patient'}
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="dash-sidebar__nav">
          <div className="dash-sidebar__nav-label">
            {!collapsed && 'MENU'}
          </div>
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`dash-sidebar__link ${isActive ? 'dash-sidebar__link--active' : ''}`}
                title={collapsed ? item.label : undefined}
                id={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span className="dash-sidebar__link-icon">{item.icon}</span>
                {!collapsed && <span className="dash-sidebar__link-text">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="dash-sidebar__badge">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="dash-sidebar__footer">
          <button
            className="dash-sidebar__link dash-sidebar__logout"
            onClick={handleLogout}
            id="sidebar-logout-btn"
          >
            <span className="dash-sidebar__link-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {!collapsed && <span className="dash-sidebar__link-text">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className={`dash-main ${collapsed ? 'dash-main--expanded' : ''}`}>
        {/* Top bar */}
        <div className="dash-topbar">
          <button
            className="dash-topbar__hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            id="dash-mobile-menu-btn"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <h1 className="dash-topbar__title">{title}</h1>

          <div className="dash-topbar__right" style={{ position: 'relative' }} ref={notifRef}>
            {/* Notification bell */}
            <button
              className={`dash-topbar__icon-btn ${notifOpen ? 'dash-topbar__icon-btn--active' : ''}`}
              aria-label="Notifications"
              id="dash-notifications-btn"
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {hasUnread && <span className="dash-topbar__notif-dot" />}
            </button>

            {/* Notifications Dropdown */}
            {notifOpen && (
              <div className="dash-notif-dropdown" id="notifications-dropdown">
                <div className="dash-notif-dropdown__header">
                  <span className="dash-notif-dropdown__title">Notifications</span>
                  {hasUnread && (
                    <button className="dash-notif-dropdown__clear-btn" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="dash-notif-dropdown__list">
                  {notifications.length > 0 ? (
                    notifications.map(n => {
                      const isUnread = !readIds.includes(n.id);
                      return (
                        <div
                          key={n.id}
                          className={`dash-notif-dropdown__item ${isUnread ? 'dash-notif-dropdown__item--unread' : ''}`}
                          onClick={() => handleNotificationClick(n)}
                        >
                          <div className="dash-notif-dropdown__item-marker" />
                          <div className="dash-notif-dropdown__item-content">
                            <p className="dash-notif-dropdown__item-text">{n.text}</p>
                            <span className="dash-notif-dropdown__item-time">
                              {new Date(n.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="dash-notif-dropdown__empty">
                      <span>🔔</span>
                      <p>You have no notifications yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <div className="dash-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
