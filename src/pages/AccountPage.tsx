import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { licensingService, type LicenseSnapshot } from '../licensing/licensingService';
import { availableDownloadBuilds } from '../config/downloads';
import { FormFeedback } from '../components/auth/FormFeedback';
import { useLanguage } from '../context/LanguageContext';

export function AccountPage() {
  const { language } = useLanguage();
  const auth = useAuth();
  const navigate = useNavigate();
  const [license, setLicense] = useState<LicenseSnapshot | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { licensingService.getSnapshot().then(setLicense).catch(() => setError('Licensing information is currently unavailable.')); }, []);
  const signOut = async () => { try { await auth.signOut(); navigate('/', { replace: true }); } catch { setError('Unable to sign out. Please try again.'); } };
  const name = typeof auth.user?.user_metadata.full_name === 'string' ? auth.user.user_metadata.full_name : 'Not available';
  return <main className="min-h-screen bg-dark-950 px-4 pb-20 pt-32"><div className="mx-auto max-w-5xl">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-wider text-brand-400">Account</p><h1 className="mt-3 text-4xl font-bold text-white">Your Ashur account</h1></div><button onClick={signOut} className="min-h-11 rounded-xl border border-white/10 px-5 text-slate-200 hover:bg-white/5">Sign out</button></div>
    {error && <div className="mt-6"><FormFeedback type="error">{error}</FormFeedback></div>}
    <dl className="mt-10 grid gap-4 sm:grid-cols-2">
      {[['Name', name], ['Email', auth.user?.email ?? 'Not available'], ['Email verification', auth.verified ? 'Verified' : 'Not verified'], ['Trial status', license?.trialStatus ?? 'Not available'], ['Trial expiration', license?.trialExpiresAt ?? 'Not available'], ['Current plan', license?.planEntitlement ?? 'Not available'], ['Subscription status', license?.subscriptionStatus ?? 'Not available'], ['Available downloads', String(availableDownloadBuilds.length)]].map(([label,value]) => <div key={label} className="rounded-2xl border border-white/10 bg-dark-800 p-5"><dt className="text-sm text-slate-400">{label}</dt><dd className="mt-2 break-words font-semibold text-white">{value}</dd></div>)}
    </dl>
    <div className="mt-8 flex flex-wrap gap-3">{auth.verified ? <Link to="/download" className="auth-submit max-w-xs">View downloads</Link> : <Link to="/verify-email" className="auth-submit max-w-xs">Verify email</Link>}<Link to="/support" className="inline-flex min-h-11 items-center rounded-xl border border-white/10 px-6 text-slate-200">Support</Link></div>
    <nav aria-label={language === 'ar' ? 'الوثائق القانونية' : 'Legal documents'} className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm"><Link className="min-h-11 content-center text-brand-400" to="/terms">{language === 'ar' ? 'الشروط' : 'Terms'}</Link><Link className="min-h-11 content-center text-brand-400" to="/privacy">{language === 'ar' ? 'الخصوصية' : 'Privacy'}</Link><Link className="min-h-11 content-center text-brand-400" to="/trial-download-policy">{language === 'ar' ? 'التجربة والتنزيل' : 'Trial & downloads'}</Link><Link className="min-h-11 content-center text-brand-400" to="/refund-policy">{language === 'ar' ? 'الاسترداد' : 'Refunds'}</Link></nav>
  </div></main>;
}
