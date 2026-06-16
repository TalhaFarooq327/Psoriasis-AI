import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import AuthIllustration from '../components/AuthIllustration';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [role, setRole] = useState('user'); // 'user' | 'doctor'

  /* ─── Validation ─── */
  const validate = () => {
    const e = {};
    if (!formData.email.trim()) e.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Please enter a valid email address.';
    if (!formData.password) e.password = 'Password is required.';
    return e;
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    setApiError('');
  };

  /* ─── Submit ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');

    /* TODO: replace with real Flask API call
       const res = await fetch('/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email: formData.email, password: formData.password, remember }),
       });
       const data = await res.json();
       if (!res.ok) { setApiError(data.message); setLoading(false); return; }
    */

    await new Promise(r => setTimeout(r, 1000)); // simulate network
    login(role); // set mock user in AuthContext
    setLoading(false);
    navigate(role === 'doctor' ? '/doctor/dashboard' : '/dashboard');
  };

  return (
    <div className="auth-page login-page">
      {/* ── Left Panel ── */}
      <div className="auth-panel auth-panel--left">
        <div className="auth-panel__inner">
          <AuthIllustration variant="login" />

          <div className="auth-panel__copy">
            <h1 className="auth-panel__title">Welcome Back</h1>
            <p className="auth-panel__desc">
              Sign in to access your psoriasis analysis history and continue monitoring your skin health.
            </p>
          </div>

          <div className="auth-panel__badges">
            <span className="auth-badge"><span className="auth-badge__dot auth-badge__dot--blue"></span>AI-Powered Analysis</span>

            <span className="auth-badge"><span className="auth-badge__dot auth-badge__dot--teal"></span>Secure &amp; Private</span>
          </div>
        </div>

        {/* decorative blobs */}
        <div className="auth-blob auth-blob--1" aria-hidden="true"></div>
        <div className="auth-blob auth-blob--2" aria-hidden="true"></div>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-panel auth-panel--right">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Sign In</h2>
            <p className="auth-form-sub">Enter your credentials to continue</p>
          </div>

          {/* ── Role toggle (mock auth only) ── */}
          <div className="auth-role-toggle">
            <button
              type="button"
              className={`auth-role-btn ${role === 'user' ? 'auth-role-btn--active' : ''}`}
              onClick={() => setRole('user')}
              id="role-user-btn"
            >
              👤 Patient
            </button>
            <button
              type="button"
              className={`auth-role-btn ${role === 'doctor' ? 'auth-role-btn--active' : ''}`}
              onClick={() => setRole('doctor')}
              id="role-doctor-btn"
            >
              🩺 Doctor
            </button>
          </div>

          {apiError && (
            <div className="auth-alert auth-alert--error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              {apiError}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <FormInput
              id="login-email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              }
            />

            <FormInput
              id="login-password"
              label="Password"
              type={showPass ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              error={errors.password}
              placeholder="Enter your password"
              autoComplete="current-password"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.8" /><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              }
              suffix={
                <button
                  type="button"
                  className="input-toggle-btn"
                  onClick={() => setShowPass(p => !p)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /></svg>
                  }
                </button>
              }
            />

            <div className="auth-form-row">
              <label className="auth-checkbox" htmlFor="remember-me">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <span className="auth-checkbox__box"></span>
                <span className="auth-checkbox__label">Remember me</span>
              </label>
              <a href="#forgot" className="auth-forgot-link">Forgot password?</a>
            </div>

            <button
              type="submit"
              className={`auth-btn auth-btn--primary ${loading ? 'auth-btn--loading' : ''}`}
              disabled={loading}
              id="login-submit-btn"
            >
              {loading
                ? <><span className="auth-spinner"></span>Signing in…</>
                : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 3h6v6M10 14L21 3M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>Sign In</>
              }
            </button>



          </form>

          <p className="auth-switch-text">
            Don't have an account?{' '}
            <Link to="/register" className="auth-switch-link">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
