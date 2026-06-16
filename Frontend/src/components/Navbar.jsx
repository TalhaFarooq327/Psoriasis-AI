import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const dropRef   = useRef(null);
  const { user, isAuthenticated, isDoctor, logout } = useAuth();

  const isLanding = location.pathname === '/';
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/doctor');
  const isAnalyze = location.pathname === '/analyze';

  /* Scroll listener */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [location.pathname]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Don't render navbar on dashboard pages — they have their own sidebar */
  /* NOTE: This MUST be after all hooks to satisfy React Rules of Hooks */
  if (isDashboard) return null;

  const links = [
    { label: 'Home',         href: '#home' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'About',        href: '#about' },
    { label: 'FAQs',         href: '#faqs' },
  ];

  const handleNavClick = (href) => {
    setMenuOpen(false);
    if (isLanding) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      /* Navigate to landing page then scroll */
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  };

  const handleLogout = () => {
    setDropOpen(false);
    setMenuOpen(false);
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const dashboardPath = isDoctor ? '/doctor/dashboard' : '/dashboard';

  return (
    <nav className={`navbar ${scrolled && !isAnalyze ? 'navbar--scrolled' : ''} ${isAnalyze ? 'navbar--absolute' : ''}`}>
      <div className="navbar__container">

        {/* Logo → always goes to landing page */}
        <Link to="/" className="navbar__logo" id="navbar-logo">
          <div className="navbar__logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z" fill="white" fillOpacity="0.9"/>
              <path d="M8 12H16M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="navbar__logo-text">
            Psoriasis<span className="navbar__logo-accent">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="navbar__links">
          {links.map(link => (
            <li key={link.label}>
              <a
                href={link.href}
                className="navbar__link"
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Auth Area */}
        {isAuthenticated ? (
          <div className="navbar__profile-area" ref={dropRef}>
            <Link to={dashboardPath} className="navbar__dash-link" id="navbar-dashboard-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Dashboard
            </Link>

            <button
              className="navbar__profile-btn"
              onClick={() => setDropOpen(d => !d)}
              aria-label="Profile menu"
              id="navbar-profile-btn"
            >
              <div className="navbar__avatar">{initials}</div>
              <span className="navbar__profile-name">{user.name}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={`navbar__chevron ${dropOpen ? 'navbar__chevron--open' : ''}`}>
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Dropdown */}
            {dropOpen && (
              <div className="navbar__dropdown" id="navbar-profile-dropdown">
                <div className="navbar__dropdown-header">
                  <div className="navbar__dropdown-avatar">{initials}</div>
                  <div>
                    <div className="navbar__dropdown-name">{user.name}</div>
                    <div className="navbar__dropdown-email">{user.email}</div>
                  </div>
                </div>
                <div className="navbar__dropdown-divider" />

                <Link to={dashboardPath} className="navbar__dropdown-item" onClick={() => setDropOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg>
                  Dashboard
                </Link>

                {isDoctor ? (
                  <>
                    <Link to="/doctor/patients" className="navbar__dropdown-item" onClick={() => setDropOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Patients
                    </Link>
                    <Link to="/doctor/pending-reviews" className="navbar__dropdown-item" onClick={() => setDropOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Pending Reviews
                    </Link>
                    <Link to="/doctor/profile" className="navbar__dropdown-item" onClick={() => setDropOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg>
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard/history" className="navbar__dropdown-item" onClick={() => setDropOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      My Analyses
                    </Link>
                    <Link to="/dashboard/reviews" className="navbar__dropdown-item" onClick={() => setDropOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Doctor Reviews
                    </Link>
                    <Link to="/dashboard/profile" className="navbar__dropdown-item" onClick={() => setDropOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg>
                      Profile
                    </Link>
                  </>
                )}

                <div className="navbar__dropdown-divider" />
                <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="navbar__auth">
            <Link to="/login"    className="navbar__login"    id="navbar-login-btn">Login</Link>
            <Link to="/register" className="navbar__register" id="navbar-register-btn">Register</Link>
          </div>
        )}

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="navbar-hamburger"
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        {links.map(link => (
          <a
            key={link.label}
            href={link.href}
            className="navbar__mobile-link"
            onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
          >
            {link.label}
          </a>
        ))}
        <div className="navbar__mobile-auth">
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} className="navbar__register" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button className="navbar__login" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="navbar__login"    onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="navbar__register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
