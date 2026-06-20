import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { api } from '../../services/api';
import { DOCTOR_MENU } from './DoctorDashboard';
import './Patients.css';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await api.get('/doctor/patients');
        setPatients(data);
      } catch (err) {
        console.error("Error fetching patients list:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout menuItems={DOCTOR_MENU} title="Patients">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: 'rgba(255,255,255,0.6)' }}>
          <div style={{ fontSize: '1.2rem' }}>Loading patient list...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={DOCTOR_MENU} title="Patients">
      <div className="dpat">
        <div className="dpat__header">
          <div>
            <h2 className="dpat__title">Patient Management</h2>
            <p className="dpat__subtitle">Search and manage patient records</p>
          </div>
          <div className="dpat__count">{patients.length} patients</div>
        </div>

        {/* ── Search ── */}
        <div className="dpat__search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by patient name, ID, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="dpat__search-input"
            id="patients-search"
          />
        </div>

        {/* ── Table ── */}
        <div className="dpat__table-card">
          <div className="dpat__table-wrap">
            <table className="dpat__table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Patient ID</th>
                  <th>Analysis Date</th>
                  <th>Prediction</th>
                  <th>Confidence</th>
                  <th>Review Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map(p => {
                  const initials = p.name
                    ? p.name.split(' ').map(w => w[0]).join('').toUpperCase()
                    : 'P';
                  const confidencePct = Math.round(p.result_confidence * 100);
                  const isHealthy = p.result_label.toLowerCase().includes('normal');
                  const isReviewed = p.status === 'reviewed';

                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="dpat__patient-cell">
                          <div className="dpat__patient-avatar">{initials}</div>
                          <div>
                            <div className="dpat__patient-name">{p.name}</div>
                            <div className="dpat__patient-email">{p.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="dpat__td-id" title={p.id}>{p.id.slice(0, 8)}...</td>
                      <td className="dpat__td-date">
                        {new Date(p.analysis_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td>
                        <span className={`dpat__badge ${isHealthy ? 'dpat__badge--green' : 'dpat__badge--red'}`} style={{ textTransform: 'capitalize' }}>
                          {isHealthy ? '✓' : '⚠'} {p.result_label}
                        </span>
                      </td>
                      <td>
                        <div className="dpat__conf">
                          <div className="dpat__conf-bar">
                            <div className="dpat__conf-fill" style={{ width: `${confidencePct}%` }} />
                          </div>
                          <span>{confidencePct}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`dpat__badge ${isReviewed ? 'dpat__badge--green' : 'dpat__badge--yellow'}`}>
                          {isReviewed ? 'Reviewed' : 'Pending Review'}
                        </span>
                      </td>
                      <td>
                        <div className="dpat__actions">
                          <Link to={`/doctor/review/${p.analysis_id}`} className="dpat__action-btn" title="View Details">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </Link>
                          {!isReviewed && (
                            <Link to={`/doctor/review/${p.analysis_id}`} className="dpat__action-btn dpat__action-btn--primary" title="Review Case">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="7" className="dpat__empty">No patients found matching your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dpat__footer">
          Showing {filtered.length} of {patients.length} patients
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Patients;
