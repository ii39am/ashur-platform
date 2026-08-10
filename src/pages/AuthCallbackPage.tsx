import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { FormFeedback } from '../components/auth/FormFeedback';
import { authService, safeInternalPath } from '../auth/authService';
import { getSafeAuthError } from '../auth/authErrors';

export function AuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  useEffect(() => {
    const providerError = params.get('error_description') || params.get('error');
    if (providerError) { setError('This authentication link is invalid or has expired. Please request a new one.'); return; }
    const next = safeInternalPath(params.get('next'), '/account');
    const code = params.get('code');
    const finish = code ? authService.exchangeCode(code) : authService.restoreSession();
    finish.then((session) => {
      if (!session) throw new Error('INVALID_AUTH_LINK');
      navigate(next, { replace: true });
    }).catch((reason) => setError(getSafeAuthError(reason)));
  }, [navigate, params]);
  return <AuthShell title="Confirming your account" description="Please wait while we validate the secure authentication response.">
    {error ? <><FormFeedback type="error">{error}</FormFeedback><Link to="/sign-in" className="mt-5 inline-flex text-brand-400">Return to sign in</Link></> : <p aria-busy="true" className="text-slate-300">Validating link…</p>}
  </AuthShell>;
}
