import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { FormFeedback } from '../components/auth/FormFeedback';
import { useAuth } from '../auth/AuthContext';
import { authService } from '../auth/authService';
import { getSafeAuthError } from '../auth/authErrors';

export function VerifyEmailPage() {
  const auth = useAuth();
  const location = useLocation();
  const destination = (location.state as { from?: string } | null)?.from ?? '/download';
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const resend = async () => {
    if (!auth.user?.email) return;
    setSending(true); setError(''); setFeedback('');
    try { await authService.resendVerification(auth.user.email, destination); setFeedback('A new verification message has been requested. Check your inbox and spam folder.'); }
    catch (reason) { setError(getSafeAuthError(reason)); }
    finally { setSending(false); }
  };
  return <AuthShell title="Verify your email" description="A verified email address is required before protected trial downloads are shown.">
    {auth.verified ? <FormFeedback type="success">Your email is verified. <Link to={destination} className="underline">Continue</Link>.</FormFeedback> : <FormFeedback type="info">Open the verification message from Supabase and use its secure link. Expired or reused links will be rejected safely.</FormFeedback>}
    {!auth.verified && <button type="button" onClick={resend} disabled={sending} className="auth-submit mt-5">{sending ? 'Sending…' : 'Resend verification email'}</button>}
    {feedback && <div className="mt-4"><FormFeedback type="success">{feedback}</FormFeedback></div>}
    {error && <div className="mt-4"><FormFeedback type="error">{error}</FormFeedback></div>}
  </AuthShell>;
}
