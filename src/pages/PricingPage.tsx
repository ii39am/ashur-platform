import React from 'react';
import { confirmedPricingPlans, pricingPolicy } from '../config/pricing';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function PricingPage() {
  const { language } = useLanguage();
  return <main className="min-h-screen bg-dark-950 px-4 pb-20 pt-32">
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">Pricing</p>
      <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Straightforward pricing, once confirmed</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Commercial terms, currency, taxes, limits, and billing policies are still awaiting approval. No unconfirmed price is shown.</p>
      {confirmedPricingPlans.length ? <div className="mt-12 grid gap-6 md:grid-cols-3">{confirmedPricingPlans.map((plan) => <article key={plan.id} className="rounded-3xl border border-white/10 bg-dark-800 p-7"><h2 className="text-2xl font-bold text-white">{plan.name}</h2><p className="mt-3 text-slate-300">{plan.description}</p></article>)}</div> : <section className="mt-12 rounded-3xl border border-white/10 bg-dark-800 p-8"><h2 className="text-2xl font-bold text-white">Public plans are not available yet</h2><p className="mt-3 max-w-2xl text-slate-300">No checkout or card collection is implemented, and a verified sales contact has not yet been published.</p><Link to="/support" className="auth-submit mt-6 max-w-xs">View support status</Link></section>}
      <section className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm text-slate-300"><h2 className="font-semibold text-white">Policies pending confirmation</h2><p className="mt-2">Tax treatment, refunds, payment methods, renewal terms, trial duration, and limits are not yet published.</p><span className="sr-only">{Object.values(pricingPolicy).join(',')}</span></section>
      <p className="mt-5 text-sm text-slate-400">{language === 'ar' ? <>تبقى <Link to="/refund-policy" className="text-brand-400 underline">سياسة الاسترداد</Link> مسودة غير نافذة. وتظل إجراءات الدفع معطلة حتى اعتماد الشروط التجارية والقانونية.</> : <>The <Link to="/refund-policy" className="text-brand-400 underline">Refund Policy</Link> remains a non-effective draft. Payment actions stay disabled until commercial and legal terms are approved.</>}</p>
    </div>
  </main>;
}
