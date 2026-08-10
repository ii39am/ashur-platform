import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { FormFeedback } from '../components/auth/FormFeedback';
import { authService } from '../auth/authService';
import { validateEmail } from '../auth/validation';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validation = validateEmail(email);
    if (validation) { setError(validation); return; }
    setSubmitting(true); setError('');
    try { await authService.requestPasswordReset(email); }
    catch { /* Keep the response generic to prevent account enumeration. */ }
    finally { setSubmitting(false); setSent(true); }
  };
  return <AuthShell title="Reset your password" description="Enter your email address to request a secure reset link.">
    {sent ? <FormFeedback type="success">If an account can receive password resets, an email is on its way. Check your inbox and spam folder.</FormFeedback> :
      <form onSubmit={submit} className="space-y-5" noValidate>
        {error && <FormFeedback type="error">{error}</FormFeedback>}
        <div><label htmlFor="recoveryEmail" className="mb-2 block text-sm font-semibold text-slate-200">Email address</label><input id="recoveryEmail" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" /></div>
        <button disabled={submitting || !authService.configured()} className="auth-submit">{submitting ? 'Sending…' : 'Request reset link'}</button>
      </form>}
    <p className="mt-6 text-center text-sm"><Link to="/sign-in" className="text-brand-400">Back to sign in</Link></p>
  </AuthShell>;
}
