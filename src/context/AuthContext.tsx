import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  sendOtp: (email: string) => Promise<{ ok: boolean; error?: string }>;
  verifyOtp: (email: string, token: string) => Promise<{ ok: boolean; error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ ok: boolean; error?: string }>;
  resetPassword: (password: string) => Promise<{ ok: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Map a Supabase auth user → our app's User shape */
function mapSupabaseUser(supaUser: Session['user']): User {
  const meta = supaUser.user_metadata ?? {};
  const name: string =
    meta.full_name ?? meta.name ?? meta.user_name ?? supaUser.email?.split('@')[0] ?? 'Explorer';
  const avatar: string =
    meta.avatar_url ?? meta.picture ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128`;

  return {
    id: supaUser.id,
    name,
    username: (meta.user_name ?? name).toLowerCase().replace(/\s+/g, ''),
    email: supaUser.email ?? '',
    avatar,
    coverImage: undefined,
    bio: meta.bio ?? '',
    location: meta.location ?? '',
    website: meta.website ?? '',
    followers: 0,
    following: 0,
    blogs: 0,
    joinDate: supaUser.created_at ?? new Date().toISOString(),
    badges: [],
    xp: 0,
    role: 'user',
    socialLinks: {},
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  // Start as true so we don't flash the login page on refresh
  const [loading, setLoading] = useState(true);

  const loadUserWithBlogCount = useCallback(async (supaUser: Session['user'] | null) => {
    if (!supaUser) {
      setUser(null);
      return;
    }
    const mapped = mapSupabaseUser(supaUser);
    
    // Fetch blog count from Supabase
    const { count, error } = await supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', supaUser.id);
      
    if (!error && count !== null) {
      mapped.blogs = count;
    }
    setUser(mapped);
  }, []);

  const refreshUser = useCallback(async () => {
    if (session?.user) {
      await loadUserWithBlogCount(session.user);
    }
  }, [session, loadUserWithBlogCount]);

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        setSession(data.session);
        await loadUserWithBlogCount(data.session.user);
      }
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        await loadUserWithBlogCount(newSession.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [loadUserWithBlogCount]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const loginWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }, []);

  const loginWithGitHub = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const sendOtp = useCallback(async (email: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    setLoading(false);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string) => {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    setLoading(false);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const resetPassword = useCallback(async (password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        loginWithGoogle,
        loginWithGitHub,
        logout,
        refreshUser,
        sendOtp,
        verifyOtp,
        sendPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
