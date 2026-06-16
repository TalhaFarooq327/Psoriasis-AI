import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_USER, MOCK_DOCTOR } from '../data/mockData';

/* ═══════════════════════════════════════
   AUTH CONTEXT
   Mock authentication for development.
   Will be replaced with Supabase Auth.
   ═══════════════════════════════════════ */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  /* ── Login (mock) ── */
  const login = useCallback((role = 'user', customData = null) => {
    if (role === 'doctor') {
      setUser({ ...MOCK_DOCTOR, ...customData, role: 'doctor' });
    } else {
      setUser({ ...MOCK_USER, ...customData, role: 'user' });
    }
  }, []);

  /* ── Logout ── */
  const logout = useCallback(() => {
    setUser(null);
  }, []);

  /* ── Computed helpers ── */
  const isAuthenticated = !!user;
  const isDoctor = user?.role === 'doctor';
  const isUser = user?.role === 'user';

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isDoctor,
    isUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* ── Hook ── */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default AuthContext;
