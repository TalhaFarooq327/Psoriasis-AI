import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DOCTOR_MENU } from './DoctorDashboard';
import './DoctorProfile.css';

const DoctorProfile = () => {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <DashboardLayout menuItems={DOCTOR_MENU} title="Profile">
      <div className="dprof">
        {/* ── Profile Card ── */}
        <div className="dprof__card">
          <div className="dprof__avatar-wrap">
            <div className="dprof__avatar">{initials}</div>
            <div className="dprof__avatar-glow" />
          </div>
          <div className="dprof__info">
            <h2 className="dprof__name">{user?.name}</h2>
            <p className="dprof__email">{user?.email}</p>
            <div className="dprof__badges">
              <span className="dprof__badge dprof__badge--teal">Medical Professional</span>
              <span className="dprof__badge dprof__badge--blue">{user?.specialization || 'Dermatology'}</span>
              <span className="dprof__badge dprof__badge--green">Active</span>
            </div>
          </div>
        </div>

        {/* ── Professional Info ── */}
        <div className="dprof__section">
          <h3 className="dprof__section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Professional Information
          </h3>
          <div className="dprof__fields">
            <div className="dprof__field">
              <label className="dprof__label">Full Name</label>
              <div className="dprof__input-wrap">
                <input type="text" className="dprof__input" defaultValue={user?.name} readOnly id="dprof-name" />
              </div>
            </div>
            <div className="dprof__field">
              <label className="dprof__label">Email Address</label>
              <div className="dprof__input-wrap">
                <input type="email" className="dprof__input" defaultValue={user?.email} readOnly id="dprof-email" />
              </div>
            </div>
            <div className="dprof__field">
              <label className="dprof__label">Specialization</label>
              <div className="dprof__input-wrap">
                <input type="text" className="dprof__input" defaultValue={user?.specialization || 'Dermatology'} readOnly id="dprof-specialization" />
              </div>
            </div>
            <div className="dprof__field">
              <label className="dprof__label">License Number (PMC)</label>
              <div className="dprof__input-wrap">
                <input type="text" className="dprof__input" defaultValue={user?.licenseNo || 'PMC-48291'} readOnly id="dprof-license" />
              </div>
            </div>
            <div className="dprof__field">
              <label className="dprof__label">Hospital / Clinic</label>
              <div className="dprof__input-wrap">
                <input type="text" className="dprof__input" defaultValue={user?.hospital || 'Shifa International Hospital'} readOnly id="dprof-hospital" />
              </div>
            </div>
            <div className="dprof__field">
              <label className="dprof__label">Member Since</label>
              <div className="dprof__input-wrap">
                <input type="text" className="dprof__input" defaultValue={
                  user?.joinDate
                    ? new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : 'June 10, 2024'
                } readOnly id="dprof-joined" />
              </div>
            </div>
          </div>
          <div className="dprof__note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Profile editing will be available once Supabase Auth is integrated.
          </div>
        </div>

        {/* ── Security ── */}
        <div className="dprof__section">
          <h3 className="dprof__section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Security
          </h3>
          <div className="dprof__security-row">
            <div className="dprof__security-info">
              <span className="dprof__security-label">Password</span>
              <span className="dprof__security-value">••••••••••</span>
            </div>
            <button className="dprof__security-btn" onClick={() => alert('Password change coming with Supabase Auth integration')}>
              Change Password
            </button>
          </div>
          <div className="dprof__security-row">
            <div className="dprof__security-info">
              <span className="dprof__security-label">Two-Factor Authentication</span>
              <span className="dprof__security-value">Not enabled</span>
            </div>
            <button className="dprof__security-btn" onClick={() => alert('2FA coming with Supabase Auth integration')}>
              Enable
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorProfile;
