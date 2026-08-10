import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { PasswordInput } from '../components/auth/PasswordInput';
import { FormFeedback } from '../components/auth/FormFeedback';
import { authService, safeInternalPath } from '../auth/authService';
import { getSafeAuthError } from '../auth/authErrors';
import { validateEmail } from '../auth/validation';

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const destination = safeInternalPath((location.state as { from?: string } | null)?.from, '/account');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const emailError = validateEmail(email);
    if (emailError || !password) { setError(emailError || 'Enter your password.'); return; }
    setSubmitting(true); setError('');
    try { await authService.signIn(email, password); navigate(destination, { replace: true }); }
    catch (reason) { setError(getSafeAuthError(reason)); }
    finally { setSubmitting(false); }
  };

  return <AuthShell title="Sign in" description="Access your Ashur account and verified downloads.">
    <form onSubmit={submit} className="space-y-5" noValidate>
      {error && <FormFeedback type="error">{error}</FormFeedback>}
      <div><label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-200">Email address</label><input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" required /></div>
      <PasswordInput label="Password" name="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <div className="flex justify-end"><Link to="/forgot-password" className="text-sm text-brand-400 hover:text-brand-300">Forgot password?</Link></div>
      <button disabled={submitting || !authService.configured()} className="auth-submit">{submitting ? 'Signing in…' : 'Sign in'}</button>
      {!authService.configured() && <FormFeedback type="info">Authentication configuration is pending.</FormFeedback>}
    </form>
    <p className="mt-6 text-center text-sm text-slate-400">New to Ashur? <Link to="/create-account" state={{ from: destination }} className="font-semibold text-brand-400">Create account</Link></p>
  </AuthShell>;
}
