import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { authService, isEmailVerified } from './authService';
import { profileService, type ProfileSummary } from './profileService';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  configured: boolean;
  verified: boolean;
  profile: ProfileSummary | null;
  profileLoading: boolean;
  refreshProfile: () => Promise<ProfileSummary | null>;
  adoptProfile: (profile: ProfileSummary) => void;
  adoptSession: (session: Session) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = authService.configured();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(configured);
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!configured) { setLoading(false); return; }
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;
    authService.onAuthStateChange((_event, nextSession) => {
      if (mounted) { setSession(nextSession); setLoading(false); }
    }).then((value) => { subscription = value; }).catch(() => { if (mounted) setLoading(false); });
    authService.restoreSession()
      .then((restored) => { if (mounted) setSession(restored); })
      .catch(() => { if (mounted) setSession(null); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; subscription?.unsubscribe(); };
  }, [configured]);

  const userId = session?.user.id;
  const verified = isEmailVerified(session?.user);
  const refreshProfile = React.useCallback(async () => {
    if (!userId || !verified) { setProfile(null); return null; }
    setProfileLoading(true);
    try { const value = await profileService.getOwnProfile(); setProfile(value); return value; }
    catch { setProfile(null); return null; }
    finally { setProfileLoading(false); }
  }, [userId, verified]);

  useEffect(() => { void refreshProfile(); }, [refreshProfile]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    loading,
    configured,
    verified,
    profile,
    profileLoading,
    refreshProfile,
    adoptProfile: setProfile,
    adoptSession: setSession,
    signOut: () => authService.signOut(),
  }), [session, loading, configured, verified, profile, profileLoading, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
