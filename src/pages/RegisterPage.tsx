import React, { useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { PasswordInput } from '../components/auth/PasswordInput';
import { PasswordStrength } from '../components/auth/PasswordStrength';
import { PhoneInput } from '../components/auth/PhoneInput';
import { OnboardingProgress } from '../components/auth/OnboardingProgress';
import { FormFeedback } from '../components/auth/FormFeedback';
import { authService, safeInternalPath } from '../auth/authService';
import { useAuth } from '../auth/AuthContext';
import { profileService } from '../auth/profileService';
import { getSafeAuthError } from '../auth/authErrors';
import { initialRegistrationDraft, normalizedOnboardingPayload, normalizeEmail, validatePersonal, validateSecurity, type RegistrationDraft } from '../auth/onboardingValidation';
import { clearPendingRegistration, savePendingRegistration } from '../auth/pendingRegistration';
import { registrationLegalReady } from '../config/legal';
import { awarenessSources, businessTypes, detectPhoneCountry } from '../config/onboarding';
import { useLanguage } from '../context/LanguageContext';
import { onboardingTranslations } from '../i18n/onboardingTranslations';
import { LockKeyhole } from 'lucide-react';
import { localRegistrationTestingEnabled } from '../config/localRegistrationTesting';

export function RegisterPage() {
  const { language } = useLanguage(); const copy = onboardingTranslations[language]; const auth = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const destination = safeInternalPath((location.state as { from?: string } | null)?.from, '/account');
  const localTesting = localRegistrationTestingEnabled();
  const registrationAvailable = registrationLegalReady || localTesting;
  const setupMode = Boolean(auth.user && auth.verified && !auth.profile);
  const [step, setStep] = useState(0); const [form, setForm] = useState<RegistrationDraft>(() => ({ ...initialRegistrationDraft, phoneCountry: detectPhoneCountry(), email: auth.user?.email ?? '' })); const [errors, setErrors] = useState<Record<string,string>>({}); const [feedback, setFeedback] = useState(''); const [submitting, setSubmitting] = useState(false);
  const createDisabled = submitting || !authService.configured() || !registrationAvailable || !navigator.onLine;
  const submissionLock = useRef(false);
  const update = <K extends keyof RegistrationDraft>(key: K, value: RegistrationDraft[K]) => setForm((current) => ({ ...current, [key]: value }));
  const message = (key?: string) => key ? copy.validation[key as keyof typeof copy.validation] : undefined;
  const next = () => { const found = validatePersonal(form); setErrors(found); if (!Object.keys(found).length) { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const submit = async (event: React.FormEvent) => { event.preventDefault(); if (submissionLock.current) return; const found = setupMode ? { ...(!form.acceptedTerms ? { acceptedTerms: 'terms' } : {}), ...(!form.acceptedPrivacy ? { acceptedPrivacy: 'privacy' } : {}) } : validateSecurity(form); setErrors(found); if (Object.keys(found).length) return; submissionLock.current = true; setSubmitting(true); setFeedback(''); try { const payload = normalizedOnboardingPayload(form, language); if (setupMode) { const profile = await profileService.completeRegistration(payload); auth.adoptProfile(profile); clearPendingRegistration(); let emailPending = false; try { const delivery = await profileService.requestWelcomeEmail(); emailPending = !delivery.accepted; } catch { emailPending = true; } navigate('/account-created', { replace: true, state: { emailPending, from: destination } }); } else { const email = normalizeEmail(form.email); await authService.signUp({ email, password: form.password, nextPath: destination }); savePendingRegistration({ email, nextPath: destination, payload }); navigate('/verify-email', { replace: true, state: { email, from: destination } }); } } catch (reason) { setFeedback(getSafeAuthError(reason)); } finally { submissionLock.current = false; setSubmitting(false); } };
  const choice = (name: string, value: boolean | null, change: (value: boolean) => void) => <div className="grid grid-cols-2 gap-3">{([true,false] as const).map((item) => <label key={String(item)} className={`flex min-h-12 cursor-pointer items-center justify-center rounded-xl border px-4 ${value === item ? 'border-brand-400 bg-brand-500/10 text-white' : 'border-white/10 text-slate-300'}`}><input type="radio" name={name} checked={value === item} onChange={() => change(item)} className="sr-only" />{item ? copy.common.yes : copy.common.no}</label>)}</div>;

  if (auth.user && auth.profile) return <Navigate to="/account" replace />;
  return <AuthShell title={copy.register.title} description={copy.register.description} wide><OnboardingProgress labels={copy.steps} current={step} />
    {step === 0 ? <div className="space-y-5"><div><h2 className="text-xl font-bold text-white">{copy.register.personalTitle}</h2><p className="mt-1 text-sm text-slate-400">{copy.register.personalHelp}</p></div>
      <Field label={copy.register.fullName} id="fullName" value={form.fullName} onChange={(value) => update('fullName', value)} error={message(errors.fullName)} autoComplete="name" />
      <PhoneInput country={form.phoneCountry} national={form.phoneNational} language={language} labels={{ phone: copy.register.phone, country: copy.register.country, hint: copy.register.phoneHint }} error={message(errors.phone)} onChange={(country, national) => setForm((current) => ({ ...current, phoneCountry: country, phoneNational: national }))} />
      <fieldset><legend className="mb-3 text-sm font-semibold text-slate-200">{copy.register.ownsBusiness}</legend>{choice('ownsBusiness', form.ownsBusiness, (value) => update('ownsBusiness', value))}{errors.ownsBusiness && <ErrorText>{message(errors.ownsBusiness)}</ErrorText>}</fieldset>
      {form.ownsBusiness && <div className="space-y-5 rounded-2xl border border-white/10 bg-dark-950/40 p-5"><Field label={copy.register.businessName} id="businessName" value={form.businessName} onChange={(value) => update('businessName', value)} error={message(errors.businessName)} /><SelectField label={copy.register.businessType} id="businessType" value={form.businessType} onChange={(value) => update('businessType', value as RegistrationDraft['businessType'])} error={message(errors.businessType)} options={businessTypes.map((value) => ({ value, label: copy.businessTypes[value] }))} />{form.businessType === 'other' && <Field label={copy.register.businessOther} id="businessOther" value={form.businessTypeOther} onChange={(value) => update('businessTypeOther', value)} error={message(errors.businessTypeOther)} />}<Field label={copy.register.branches} id="branches" value={form.branchCount} onChange={(value) => update('branchCount', value)} error={message(errors.branchCount)} inputMode="numeric" /></div>}
      <fieldset><legend className="mb-3 text-sm font-semibold text-slate-200">{copy.register.heard}</legend>{choice('heard', form.heardAboutAshur, (value) => update('heardAboutAshur', value))}{errors.heardAboutAshur && <ErrorText>{message(errors.heardAboutAshur)}</ErrorText>}</fieldset>
      {form.heardAboutAshur && <SelectField label={`${copy.register.source} (${copy.common.optional})`} id="source" value={form.awarenessSource} onChange={(value) => update('awarenessSource', value as RegistrationDraft['awarenessSource'])} options={awarenessSources.map((value) => ({ value, label: copy.sources[value] }))} />}
      <button type="button" onClick={next} className="auth-submit">{copy.common.continue}</button>
    </div> : <form onSubmit={submit} className="space-y-5" noValidate><div><h2 className="text-xl font-bold text-white">{copy.register.securityTitle}</h2><p className="mt-1 text-sm text-slate-400">{copy.register.securityHelp}</p></div>{feedback && <FormFeedback type="error">{feedback}</FormFeedback>}
      {!setupMode && <><Field label={copy.register.email} id="registerEmail" value={form.email} onChange={(value) => update('email', value)} error={message(errors.email)} type="email" autoComplete="email" dir="ltr" />
      <div><PasswordInput label={copy.register.password} name="newPassword" autoComplete="new-password" value={form.password} onChange={(event) => update('password', event.target.value)} error={message(errors.password)} showLabel={copy.password.show} hideLabel={copy.password.hide} /><PasswordStrength password={form.password} labels={copy.strength} /></div>
      <PasswordInput label={copy.register.confirmPassword} name="confirmPassword" autoComplete="new-password" value={form.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} error={message(errors.confirmPassword)} showLabel={copy.password.show} hideLabel={copy.password.hide} /></>}
      <Consent checked={form.acceptedTerms} onChange={(value) => update('acceptedTerms', value)} error={message(errors.acceptedTerms)}><Link to="/terms" target="_blank" className="text-brand-400 underline">{copy.register.terms}</Link></Consent>
      <Consent checked={form.acceptedPrivacy} onChange={(value) => update('acceptedPrivacy', value)} error={message(errors.acceptedPrivacy)}><Link to="/privacy" target="_blank" className="text-brand-400 underline">{copy.register.privacy}</Link></Consent>
      <Consent checked={form.marketingConsent} onChange={(value) => update('marketingConsent', value)}>{copy.register.marketing}</Consent>
      {localTesting ? <FormFeedback type="info">{copy.register.localTestingWarning}</FormFeedback> : registrationLegalReady ? <FormFeedback type="info">{copy.register.legalAgreementNotice}</FormFeedback> : <FormFeedback type="info">{copy.register.legalPending}</FormFeedback>}
      <div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setStep(0)} className="min-h-12 rounded-xl border border-white/10 px-5 text-slate-200">{copy.common.back}</button><button disabled={createDisabled} className="auth-submit gap-2 disabled:border disabled:border-white/15 disabled:bg-none disabled:bg-dark-600 disabled:text-slate-400 disabled:opacity-100">{!submitting && createDisabled && <LockKeyhole className="h-4 w-4" aria-hidden="true" />}{submitting ? copy.register.creating : copy.register.create}</button></div>
    </form>}
    {!setupMode && <p className="mt-6 text-center text-sm text-slate-400">{copy.register.haveAccount} <Link to="/sign-in" state={{ from: destination }} className="font-semibold text-brand-400">{copy.register.signIn}</Link></p>}
  </AuthShell>;
}

function Field({ label, id, value, onChange, error, ...props }: { label: string; id: string; value: string; onChange: (value: string) => void; error?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'|'onChange'>) { return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-200">{label}</label><input {...props} id={id} value={value} onChange={(event) => onChange(event.target.value)} className="auth-input" aria-invalid={Boolean(error)} />{error && <ErrorText>{error}</ErrorText>}</div>; }
function SelectField({ label, id, value, onChange, options, error }: { label: string; id: string; value: string; onChange: (value: string) => void; options: Array<{value:string;label:string}>; error?: string }) { return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-200">{label}</label><select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="auth-input" aria-invalid={Boolean(error)}><option value="">—</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{error && <ErrorText>{error}</ErrorText>}</div>; }
function Consent({ checked, onChange, children, error }: { checked: boolean; onChange: (value:boolean) => void; children: React.ReactNode; error?: string }) { return <div><label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-300"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-cyan-500" /> <span>{children}</span></label>{error && <ErrorText>{error}</ErrorText>}</div>; }
function ErrorText({ children }: { children?: React.ReactNode }) { return <p className="mt-2 text-sm text-rose-400">{children}</p>; }
