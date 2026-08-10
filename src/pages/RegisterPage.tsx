import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { PasswordInput } from '../components/auth/PasswordInput';
import { FormFeedback } from '../components/auth/FormFeedback';
import { authService, safeInternalPath } from '../auth/authService';
import { getSafeAuthError } from '../auth/authErrors';
import { validateRegistration } from '../auth/validation';
import { registrationLegalReady } from '../config/legal';

export function RegisterPage() {
  const location = useLocation();
  const destination = safeInternalPath((location.state as { from?: string } | null)?.from, '/account');
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', acceptedLegal: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const update = (key: keyof typeof form, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateRegistration(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true); setFeedback(null);
    try {
      await authService.signUp({ fullName: form.fullName, email: form.email, password: form.password, nextPath: destination });
      setFeedback({ type: 'success', message: 'Check your email to verify your account. The link will return you to your requested destination.' });
    } catch (reason) { setFeedback({ type: 'error', message: getSafeAuthError(reason) }); }
    finally { setSubmitting(false); }
  };

  return <AuthShell title="Create account" description="Create a secure account. Email verification is required before trial downloads.">
    <form onSubmit={submit} className="space-y-5" noValidate>
      {feedback && <FormFeedback type={feedback.type}>{feedback.message}</FormFeedback>}
      <div><label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-slate-200">Full name</label><input id="fullName" autoComplete="name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className="auth-input" aria-invalid={Boolean(errors.fullName)} />{errors.fullName && <p className="mt-2 text-sm text-rose-400">{errors.fullName}</p>}</div>
      <div><label htmlFor="registerEmail" className="mb-2 block text-sm font-semibold text-slate-200">Email address</label><input id="registerEmail" type="email" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="auth-input" aria-invalid={Boolean(errors.email)} />{errors.email && <p className="mt-2 text-sm text-rose-400">{errors.email}</p>}</div>
      <PasswordInput label="Password" name="newPassword" autoComplete="new-password" value={form.password} onChange={(e) => update('password', e.target.value)} error={errors.password} />
      <PasswordInput label="Confirm password" name="confirmPassword" autoComplete="new-password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} error={errors.confirmPassword} />
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-300"><input type="checkbox" checked={form.acceptedLegal} onChange={(e) => update('acceptedLegal', e.target.checked)} className="mt-1 h-5 w-5 accent-cyan-500" /><span>I accept the <Link to="/terms" className="text-brand-400 underline">Terms of Service</Link> and <Link to="/privacy" className="text-brand-400 underline">Privacy Policy</Link>.</span></label>
      {errors.acceptedLegal && <p className="text-sm text-rose-400">{errors.acceptedLegal}</p>}
      <button disabled={submitting || !authService.configured() || !registrationLegalReady} className="auth-submit">{submitting ? 'Creating account…' : 'Create account'}</button>
      {!authService.configured() && <FormFeedback type="info">Authentication configuration is pending.</FormFeedback>}
      {!registrationLegalReady && <FormFeedback type="info">Registration will become available after the Terms of Service and Privacy Policy are legally approved.</FormFeedback>}
    </form>
    <p className="mt-6 text-center text-sm text-slate-400">Already registered? <Link to="/sign-in" state={{ from: destination }} className="font-semibold text-brand-400">Sign in</Link></p>
  </AuthShell>;
}
