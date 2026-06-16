import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { USER_MENU } from './UserDashboard';
import './UserProfile.css';

const UserProfile = () => {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

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
            <h2 className="uprof__name">{user?.name}</h2>
            <p className="uprof__email">{user?.email}</p>
            <div className="uprof__badges">
              <span className="uprof__badge uprof__badge--blue">Patient Account</span>
              <span className="uprof__badge uprof__badge--green">Active</span>
            </div>
          </div>
        </div>

        {/* ── Details ── */}
        <div className="uprof__section">
          <h3 className="uprof__section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Personal Information
          </h3>

          <div className="uprof__fields">
            <div className="uprof__field">
              <label className="uprof__label">Full Name</label>
              <div className="uprof__input-wrap">
                <input type="text" className="uprof__input" defaultValue={user?.name} readOnly id="profile-name" />
              </div>
            </div>
            <div className="uprof__field">
              <label className="uprof__label">Email Address</label>
              <div className="uprof__input-wrap">
                <input type="email" className="uprof__input" defaultValue={user?.email} readOnly id="profile-email" />
              </div>
            </div>
            <div className="uprof__field">
              <label className="uprof__label">Phone Number</label>
              <div className="uprof__input-wrap">
                <input type="tel" className="uprof__input" defaultValue={user?.phone || '+92 300 1234567'} readOnly id="profile-phone" />
              </div>
            </div>
            <div className="uprof__field">
              <label className="uprof__label">Member Since</label>
              <div className="uprof__input-wrap">
                <input type="text" className="uprof__input" defaultValue={new Date(user?.joinDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} readOnly id="profile-joined" />
              </div>
            </div>
          </div>

          <div className="uprof__note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Profile editing will be available once Supabase Auth is integrated.
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
            <button className="uprof__security-btn" onClick={() => alert('Password change coming with Supabase Auth integration')}>
              Change Password
            </button>
          </div>

          <div className="uprof__security-row">
            <div className="uprof__security-info">
              <span className="uprof__security-label">Two-Factor Authentication</span>
              <span className="uprof__security-value">Not enabled</span>
            </div>
            <button className="uprof__security-btn" onClick={() => alert('2FA coming with Supabase Auth integration')}>
              Enable
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
