import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { DOCTOR_MENU } from './DoctorDashboard';
import './DoctorProfile.css';

const DoctorProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [specialization, setSpecialization] = useState(user?.specialization || '');
  const [licenseNo, setLicenseNo] = useState(user?.license_no || '');
  const [hospital, setHospital] = useState(user?.hospital || '');
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
        full_name: fullName.trim(),
        specialization: specialization.trim(),
        license_no: licenseNo.trim(),
        hospital: hospital.trim()
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
    setSpecialization(user?.specialization || '');
    setLicenseNo(user?.license_no || '');
    setHospital(user?.hospital || '');
    setErrorMsg('');
    setMessage('');
    setIsEditing(false);
  };

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
            <h2 className="dprof__name">{user?.full_name || 'Doctor'}</h2>
            <p className="dprof__email">{user?.email}</p>
            <div className="dprof__badges">
              <span className="dprof__badge dprof__badge--teal">Medical Professional</span>
              <span className="dprof__badge dprof__badge--blue">{user?.specialization || 'Dermatology'}</span>
              <span className="dprof__badge dprof__badge--green">Active</span>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {message && (
          <div className="dprof__note" style={{ background: 'rgba(56, 161, 105, 0.1)', border: '1px solid rgba(56, 161, 105, 0.3)', color: '#68D391' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            {message}
          </div>
        )}
        {errorMsg && (
          <div className="dprof__note" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#FC8181' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {errorMsg}
          </div>
        )}

        {/* ── Professional Info ── */}
        <div className="dprof__section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 className="dprof__section-title" style={{ marginBottom: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Professional Information
            </h3>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="dprof__security-btn" onClick={handleCancel} style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#F87171' }}>Cancel</button>
                <button className="dprof__security-btn" onClick={handleSave} disabled={saving} style={{ borderColor: 'rgba(56, 161, 105, 0.4)', color: '#34D399', background: 'rgba(56, 161, 105, 0.1)' }}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <button className="dprof__security-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
          </div>

          <div className="dprof__fields">
            <div className="dprof__field">
              <label className="dprof__label">Full Name</label>
              <div className="dprof__input-wrap">
                <input
                  type="text"
                  className="dprof__input"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  readOnly={!isEditing}
                  id="dprof-name"
                />
              </div>
            </div>
            <div className="dprof__field">
              <label className="dprof__label">Email Address</label>
              <div className="dprof__input-wrap">
                <input type="email" className="dprof__input" value={user?.email || ''} readOnly id="dprof-email" />
              </div>
            </div>
            <div className="dprof__field">
              <label className="dprof__label">Specialization</label>
              <div className="dprof__input-wrap">
                <input
                  type="text"
                  className="dprof__input"
                  value={specialization}
                  onChange={e => setSpecialization(e.target.value)}
                  readOnly={!isEditing}
                  id="dprof-specialization"
                />
              </div>
            </div>
            <div className="dprof__field">
              <label className="dprof__label">License Number (PMC)</label>
              <div className="dprof__input-wrap">
                <input
                  type="text"
                  className="dprof__input"
                  value={licenseNo}
                  onChange={e => setLicenseNo(e.target.value)}
                  readOnly={!isEditing}
                  id="dprof-license"
                />
              </div>
            </div>
            <div className="dprof__field">
              <label className="dprof__label">Hospital / Clinic</label>
              <div className="dprof__input-wrap">
                <input
                  type="text"
                  className="dprof__input"
                  value={hospital}
                  onChange={e => setHospital(e.target.value)}
                  readOnly={!isEditing}
                  id="dprof-hospital"
                />
              </div>
            </div>
            <div className="dprof__field">
              <label className="dprof__label">Member Since</label>
              <div className="dprof__input-wrap">
                <input
                  type="text"
                  className="dprof__input"
                  value={user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  readOnly
                  id="dprof-joined"
                />
              </div>
            </div>
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
            <button className="dprof__security-btn" onClick={() => alert('Password change can be performed via your Supabase account page.')}>
              Change Password
            </button>
          </div>
          <div className="dprof__security-row">
            <div className="dprof__security-info">
              <span className="dprof__security-label">Two-Factor Authentication</span>
              <span className="dprof__security-value">Not enabled</span>
            </div>
            <button className="dprof__security-btn" onClick={() => alert('2FA is managed through your Supabase security provider.')}>
              Enable
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorProfile;
