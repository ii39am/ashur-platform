import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';

export interface SignUpInput {
  fullName: string;
  email: string;
  password: string;
  nextPath?: string;
}

export interface AuthResult {
  user: User | null;
  session: Session | null;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function safeInternalPath(value: string | null | undefined, fallback = '/account') {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return fallback;
  try {
    const parsed = new URL(value, window.location.origin);
    return parsed.origin === window.location.origin ? `${parsed.pathname}${parsed.search}${parsed.hash}` : fallback;
  } catch {
    return fallback;
  }
}

export const authService = {
  configured: isSupabaseConfigured,

  async restoreSession(): Promise<Session | null> {
    const { data, error } = await (await getSupabaseClient()).auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return (await getSupabaseClient()).auth.onAuthStateChange(callback).data.subscription;
  },

  async signUp(input: SignUpInput): Promise<AuthResult> {
    const next = safeInternalPath(input.nextPath, '/account');
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    callbackUrl.searchParams.set('next', next);
    const { data, error } = await (await getSupabaseClient()).auth.signUp({
      email: normalizeEmail(input.email),
      password: input.password,
      options: {
        data: { full_name: input.fullName.trim() },
        emailRedirectTo: callbackUrl.toString(),
      },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await (await getSupabaseClient()).auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await (await getSupabaseClient()).auth.signOut();
    if (error) throw error;
  },

  async requestPasswordReset(email: string) {
    const { error } = await (await getSupabaseClient()).auth.resetPasswordForEmail(normalizeEmail(email), {
      redirectTo: new URL('/auth/reset-password', window.location.origin).toString(),
    });
    if (error) throw error;
  },

  async resendVerification(email: string, nextPath = '/account') {
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    callbackUrl.searchParams.set('next', safeInternalPath(nextPath));
    const { error } = await (await getSupabaseClient()).auth.resend({
      type: 'signup',
      email: normalizeEmail(email),
      options: { emailRedirectTo: callbackUrl.toString() },
    });
    if (error) throw error;
  },

  async updatePassword(password: string) {
    const { error } = await (await getSupabaseClient()).auth.updateUser({ password });
    if (error) throw error;
  },

  async exchangeCode(code: string) {
    const { data, error } = await (await getSupabaseClient()).auth.exchangeCodeForSession(code);
    if (error) throw error;
    return data.session;
  },
};

export function isEmailVerified(user: User | null | undefined) {
  return Boolean(user?.email_confirmed_at);
}
