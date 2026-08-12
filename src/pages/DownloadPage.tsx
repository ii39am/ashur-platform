import React, { useMemo, useState } from 'react';
import { availableDownloadBuilds, detectRecommendedPlatform, type SupportedPlatform } from '../config/downloads';
import { FormFeedback } from '../components/auth/FormFeedback';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function DownloadPage() {
  const { language } = useLanguage();
  const recommended = useMemo(() => detectRecommendedPlatform(navigator.userAgent), []);
  const [platform, setPlatform] = useState<SupportedPlatform | 'all'>(recommended ?? 'all');
  const builds = platform === 'all' ? availableDownloadBuilds : availableDownloadBuilds.filter((build) => build.platform === platform);
  const offline = !navigator.onLine;
  return <main className="min-h-screen bg-dark-950 px-4 pb-20 pt-32">
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">Verified account download</p>
      <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Download Ashur free trial</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Downloads require a signed-in account with a verified email. Platform detection only changes the recommendation; you stay in control.</p>
      {offline && <div className="mt-6"><FormFeedback type="error">You appear to be offline. Downloads are unavailable until your connection returns.</FormFeedback></div>}
      <fieldset className="mt-8"><legend className="mb-3 font-semibold text-white">Choose a platform</legend><div className="flex flex-wrap gap-2">{(['all','windows','macos','linux'] as const).map((item) => <button key={item} type="button" onClick={() => setPlatform(item)} className={`min-h-11 rounded-xl border px-4 capitalize ${platform === item ? 'border-brand-500 bg-brand-500/15 text-white' : 'border-white/10 text-slate-300'}`}>{item}{item === recommended ? ' (recommended)' : ''}</button>)}</div></fieldset>
      {builds.length === 0 ? <section className="mt-10 rounded-3xl border border-white/10 bg-dark-800 p-8"><h2 className="text-2xl font-bold text-white">Builds are temporarily unavailable</h2><p className="mt-3 max-w-2xl text-slate-300">No installer with complete, verified metadata and a real download URL is configured. Nothing will download automatically.</p><a href="mailto:ashurplatform95@gmail.com?subject=Ashur%20ERP%20Trial%20Availability" className="mt-6 inline-flex min-h-11 items-center text-brand-400">Contact support about availability</a></section> : <div className="mt-10 grid gap-5 md:grid-cols-2">{builds.map((build) => <article key={build.id} className="rounded-3xl border border-white/10 bg-dark-800 p-7"><h2 className="text-2xl font-bold text-white">{build.productName}</h2><p className="mt-2 text-slate-300">Version {build.version} · {build.architecture}</p><a href={build.publicDownloadUrl} className="auth-submit mt-6" download>Download for {build.platform}</a></article>)}</div>}
      <section className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm leading-6 text-slate-300">Website access control is not a licensing system. Trial activation and enforcement still require a server-side licensing service in the application and backend.</section>
      <p className="mt-5 text-sm text-slate-400">{language === 'ar' ? <>راجع <Link to="/trial-download-policy" className="text-brand-400 underline">مسودة سياسة التجربة والتنزيل</Link>. وهي غير معتمدة أو نافذة بعد.</> : <>Review the <Link to="/trial-download-policy" className="text-brand-400 underline">draft Trial and Download Policy</Link>. It is not yet approved or effective.</>}</p>
    </div>
  </main>;
}
