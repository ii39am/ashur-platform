import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { PasswordInput } from '../components/auth/PasswordInput';
import { FormFeedback } from '../components/auth/FormFeedback';
import { authService } from '../auth/authService';
import { getSafeAuthError } from '../auth/authErrors';
import { validatePassword } from '../auth/validation';

export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validation = validatePassword(password);
    if (validation || password !== confirmation) { setError(validation || 'Passwords do not match.'); return; }
    setSubmitting(true); setError('');
    try { await authService.updatePassword(password); setComplete(true); }
    catch (reason) { setError(getSafeAuthError(reason)); }
    finally { setSubmitting(false); }
  };
  return <AuthShell title="Choose a new password" description="Reset links are time-limited and can only be used through a valid recovery session.">
    {complete ? <FormFeedback type="success">Your password was updated. <Link to="/account" className="underline">Continue to your account</Link>.</FormFeedback> :
      <form onSubmit={submit} className="space-y-5">
        {error && <FormFeedback type="error">{error}</FormFeedback>}
        <PasswordInput label="New password" name="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <PasswordInput label="Confirm new password" name="confirmation" autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
        <button disabled={submitting || !authService.configured()} className="auth-submit">{submitting ? 'Updating…' : 'Update password'}</button>
      </form>}
  </AuthShell>;
}
