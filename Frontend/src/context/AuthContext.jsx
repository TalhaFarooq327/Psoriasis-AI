import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch custom profile details from DB
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.warn("Could not load user profile:", error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Error fetching profile:", err);
      return null;
    }
  };

  // Sync user state on mount and listen to auth changes
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          // Combine Supabase auth user metadata with DB profile role/name
          setUser(profile ? { ...session.user, ...profile } : session.user);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser(profile ? { ...session.user, ...profile } : session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /* ── Register via Supabase ── */
  const signUp = useCallback(async (email, password, fullName, role = 'user', additionalMetadata = {}) => {
    setLoading(true);
    try {
      // 1. Call Supabase Sign Up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            ...additionalMetadata
          }
        }
      });
      if (error) throw error;

      if (data?.user) {
        const profileData = {
          id: data.user.id,
          email: email,
          full_name: fullName,
          role: role,
          ...additionalMetadata
        };

        // 2. Insert role/name profile record into public.profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (profileError) {
          console.error("Error writing profile record to public.profiles:", profileError);
        } else {
          // Manually update user state with profile if session is active
          setUser(prev => prev ? { ...prev, ...profileData } : { ...data.user, ...profileData });
        }
      }
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Login via Supabase ── */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Logout via Supabase ── */
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Update Profile ── */
  const updateProfile = useCallback(async (updates) => {
    setLoading(true);
    try {
      const updatedUser = await api.put('/profile', updates);
      setUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
      return updatedUser;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Computed helpers ── */
  const isAuthenticated = !!user;
  const userRole = user?.role || user?.user_metadata?.role;
  const isDoctor = userRole === 'doctor';
  const isUser = userRole === 'user' || userRole === 'patient'; // Support standard patient/user role naming

  const value = {
    user,
    loading,
    signUp,
    login,
    logout,
    updateProfile,
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default AuthContext;
