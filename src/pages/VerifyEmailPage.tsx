import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { FormFeedback } from '../components/auth/FormFeedback';
import { OnboardingProgress } from '../components/auth/OnboardingProgress';
import { OtpInput } from '../components/auth/OtpInput';
import { authService, safeInternalPath } from '../auth/authService';
import { profileService } from '../auth/profileService';
import { clearPendingRegistration, readPendingRegistration } from '../auth/pendingRegistration';
import { onboardingConfiguration } from '../config/onboarding';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { onboardingTranslations } from '../i18n/onboardingTranslations';

const maskEmail = (email: string) => { const [local, domain] = email.split('@'); if (!domain) return ''; return `${local.slice(0,2)}${'•'.repeat(Math.max(2, Math.min(6, local.length - 2)))}@${domain}`; };
const otpError = (reason: unknown, copy: { expired: string; used: string; invalid: string }) => { const message = reason instanceof Error ? reason.message.toLowerCase() : ''; if (message.includes('expired')) return copy.expired; if (message.includes('used') || message.includes('already')) return copy.used; return copy.invalid; };

export function VerifyEmailPage() {
  const { language } = useLanguage(); const copy = onboardingTranslations[language]; const auth = useAuth(); const location = useLocation(); const navigate = useNavigate();
  const pending = useMemo(() => readPendingRegistration(), []); const state = location.state as { email?: string; from?: string; setupRequired?: boolean } | null;
  const email = state?.email ?? pending?.email ?? auth.user?.email ?? ''; const destination = safeInternalPath(state?.from ?? pending?.nextPath, '/download');
  const [code, setCode] = useState(''); const [submitting, setSubmitting] = useState(false); const [setup, setSetup] = useState(Boolean(state?.setupRequired)); const [error, setError] = useState(''); const [success, setSuccess] = useState(''); const [cooldown, setCooldown] = useState<number>(onboardingConfiguration.otpResendCooldownSeconds); const [attempts, setAttempts] = useState(0);
  const operationLock = useRef(false);
  useEffect(() => { if (!cooldown) return; const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000); return () => window.clearInterval(timer); }, [cooldown]);
  const finishProfile = async () => { if (!pending?.payload) { setError(copy.verify.setupFailed); return; } setSetup(true); setError(''); try { const profile = await profileService.completeRegistration(pending.payload); auth.adoptProfile(profile); clearPendingRegistration(); try { const delivery = await profileService.requestWelcomeEmail(); navigate('/account-created', { replace: true, state: { emailPending: !delivery.accepted, from: destination } }); } catch { navigate('/account-created', { replace: true, state: { emailPending: true, from: destination } }); } } catch { setError(copy.verify.setupFailed); } finally { setSetup(false); } };
  const verify = async (event: React.FormEvent) => { event.preventDefault(); if (operationLock.current) return; if (!navigator.onLine) { setError(copy.common.offline); return; } if (attempts >= onboardingConfiguration.maxOtpAttemptsPerPageSession) { setError(copy.verify.attempts); return; } if (code.length !== 6 || !email) { setError(email ? copy.verify.invalid : copy.verify.missing); return; } operationLock.current = true; setSubmitting(true); setError(''); try { const result = await authService.verifySignupOtp(email, code); if (!result.session) throw new Error('invalid otp'); auth.adoptSession(result.session); await finishProfile(); } catch (reason) { setAttempts((value) => value + 1); setError(otpError(reason, copy.verify)); setCode(''); } finally { operationLock.current = false; setSubmitting(false); } };
  const resend = async () => { if (!email || cooldown || operationLock.current) return; if (!navigator.onLine) { setError(copy.common.offline); return; } operationLock.current = true; setSubmitting(true); setError(''); setSuccess(''); try { await authService.resendVerification(email, destination); setSuccess(copy.verify.sent); setCooldown(onboardingConfiguration.otpResendCooldownSeconds); setAttempts(0); } catch (reason) { const message = reason instanceof Error ? reason.message.toLowerCase() : ''; setError(message.includes('rate') || message.includes('too many') ? copy.verify.rateLimit : copy.verify.invalid); } finally { operationLock.current = false; setSubmitting(false); } };
  const retrySetup = async () => { if (operationLock.current) return; operationLock.current = true; setSubmitting(true); try { await finishProfile(); } finally { operationLock.current = false; setSubmitting(false); } };
  if (!email && !auth.user) return <AuthShell title={copy.verify.title} description={copy.verify.missing}><FormFeedback type="error">{copy.verify.missing}</FormFeedback><Link to="/create-account" className="auth-submit mt-5">{copy.common.back}</Link></AuthShell>;
  return <AuthShell title={copy.verify.title} description={`${copy.verify.description} ${maskEmail(email)}`}><OnboardingProgress labels={copy.steps} current={2} />
    {error && <FormFeedback type="error">{error}</FormFeedback>}{success && <FormFeedback type="success">{success}</FormFeedback>}
    {setup ? <div className="py-6 text-center text-slate-300" aria-busy="true">{copy.verify.setup}</div> : auth.verified && !auth.profile ? pending?.payload ? <button type="button" onClick={retrySetup} disabled={submitting} className="auth-submit mt-5">{copy.verify.retrySetup}</button> : <Link to="/create-account" state={{ from: destination }} className="auth-submit mt-5">{copy.verify.retrySetup}</Link> : <form onSubmit={verify} className="mt-6 space-y-5"><OtpInput value={code} onChange={setCode} disabled={submitting} digitLabel={copy.verify.digit} /><button disabled={submitting || code.length !== 6 || attempts >= onboardingConfiguration.maxOtpAttemptsPerPageSession} className="auth-submit">{submitting ? copy.verify.verifying : copy.verify.verify}</button></form>}
    <button type="button" onClick={resend} disabled={submitting || cooldown > 0 || !email} className="mt-4 min-h-11 w-full rounded-xl border border-white/10 px-4 text-slate-200 disabled:opacity-50">{cooldown ? `${copy.verify.resendIn} ${cooldown}s` : copy.verify.resend}</button>
  </AuthShell>;
}
