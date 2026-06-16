import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  const { user, logout } = useAuth();

  /* Close mobile sidebar on route change */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

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
            <div className="dash-sidebar__logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z" fill="white" fillOpacity="0.9"/>
                <path d="M8 12H16M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
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
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
          </button>
        </div>

        {/* User info */}
        <div className="dash-sidebar__user">
          <div className="dash-sidebar__avatar">{initials}</div>
          {!collapsed && (
            <div className="dash-sidebar__user-info">
              <span className="dash-sidebar__user-name">{user?.name}</span>
              <span className="dash-sidebar__user-role">
                {user?.role === 'doctor' ? user?.specialization : 'Patient'}
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
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <h1 className="dash-topbar__title">{title}</h1>

          <div className="dash-topbar__right">
            {/* Notification bell */}
            <button className="dash-topbar__icon-btn" aria-label="Notifications" id="dash-notifications-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="dash-topbar__notif-dot" />
            </button>
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
