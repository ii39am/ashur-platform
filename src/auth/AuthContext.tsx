import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { authService, isEmailVerified } from './authService';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  configured: boolean;
  verified: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = authService.configured();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(configured);

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

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    loading,
    configured,
    verified: isEmailVerified(session?.user),
    signOut: () => authService.signOut(),
  }), [session, loading, configured]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
