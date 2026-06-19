import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { USER_MENU } from './UserDashboard';
import './UserProfile.css';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const handleSave = async () => {
    if (!fullName.trim()) {
      setErrorMsg('Full name cannot be empty');
      return;
    }
    setSaving(true);
    setErrorMsg('');
    setMessage('');
    try {
      await updateProfile({
        full_name: fullName.trim()
      });
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(user?.full_name || '');
    setErrorMsg('');
    setMessage('');
    setIsEditing(false);
  };

  return (
    <DashboardLayout menuItems={USER_MENU} title="Profile">
      <div className="uprof">
        {/* ── Profile Card ── */}
        <div className="uprof__card">
          <div className="uprof__avatar-wrap">
            <div className="uprof__avatar">{initials}</div>
            <div className="uprof__avatar-glow" />
          </div>
          <div className="uprof__info">
            <h2 className="uprof__name">{user?.full_name || 'User'}</h2>
            <p className="uprof__email">{user?.email}</p>
            <div className="uprof__badges">
              <span className="uprof__badge uprof__badge--blue">Patient Account</span>
              <span className="uprof__badge uprof__badge--green">Active</span>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {message && (
          <div className="uprof__note" style={{ background: 'rgba(56, 161, 105, 0.1)', border: '1px solid rgba(56, 161, 105, 0.3)', color: '#68D391' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            {message}
          </div>
        )}
        {errorMsg && (
          <div className="uprof__note" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#FC8181' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {errorMsg}
          </div>
        )}

        {/* ── Details ── */}
        <div className="uprof__section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 className="uprof__section-title" style={{ marginBottom: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Personal Information
            </h3>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="uprof__security-btn" onClick={handleCancel} style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#F87171' }}>Cancel</button>
                <button className="uprof__security-btn" onClick={handleSave} disabled={saving} style={{ borderColor: 'rgba(56, 161, 105, 0.4)', color: '#34D399', background: 'rgba(56, 161, 105, 0.1)' }}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <button className="uprof__security-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
          </div>

          <div className="uprof__fields">
            <div className="uprof__field">
              <label className="uprof__label">Full Name</label>
              <div className="uprof__input-wrap">
                <input
                  type="text"
                  className="uprof__input"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  readOnly={!isEditing}
                  id="profile-name"
                />
              </div>
            </div>
            <div className="uprof__field">
              <label className="uprof__label">Email Address</label>
              <div className="uprof__input-wrap">
                <input type="email" className="uprof__input" value={user?.email || ''} readOnly id="profile-email" />
              </div>
            </div>
            <div className="uprof__field">
              <label className="uprof__label">Phone Number</label>
              <div className="uprof__input-wrap">
                <input type="tel" className="uprof__input" value={user?.phone || '+92 300 1234567'} readOnly id="profile-phone" />
              </div>
            </div>
            <div className="uprof__field">
              <label className="uprof__label">Member Since</label>
              <div className="uprof__input-wrap">
                <input
                  type="text"
                  className="uprof__input"
                  value={user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  readOnly
                  id="profile-joined"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Security ── */}
        <div className="uprof__section">
          <h3 className="uprof__section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Security
          </h3>

          <div className="uprof__security-row">
            <div className="uprof__security-info">
              <span className="uprof__security-label">Password</span>
              <span className="uprof__security-value">••••••••••</span>
            </div>
            <button className="uprof__security-btn" onClick={() => alert('Password change can be performed via your Supabase account page.')}>
              Change Password
            </button>
          </div>

          <div className="uprof__security-row">
            <div className="uprof__security-info">
              <span className="uprof__security-label">Two-Factor Authentication</span>
              <span className="uprof__security-value">Not enabled</span>
            </div>
            <button className="uprof__security-btn" onClick={() => alert('2FA is managed through your Supabase security provider.')}>
              Enable
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
