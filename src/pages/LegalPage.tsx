import React from 'react';
import { Link } from 'react-router-dom';

const titles = { privacy: 'Privacy Policy', terms: 'Terms of Service', refunds: 'Refund Policy' } as const;

export function LegalPage({ type }: { type: keyof typeof titles }) {
  return <main className="min-h-screen bg-dark-950 px-4 pb-20 pt-32"><article className="mx-auto max-w-3xl">
    <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">Draft route — not a finalized legal policy</p>
    <h1 className="mt-4 text-4xl font-bold text-white">{titles[type]}</h1>
    <div className="mt-8 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-7 text-slate-300"><h2 className="text-xl font-semibold text-white">Content pending legal approval</h2><p className="mt-3 leading-7">This route is prepared for approved legal content. It does not currently present contractual terms or legal claims. Do not rely on it as a finalized policy.</p><p className="mt-4">Contact <a className="text-brand-400 underline" href="mailto:ashurplatform95@gmail.com">ashurplatform95@gmail.com</a> for current information.</p></div>
    <Link to="/" className="mt-8 inline-flex min-h-11 items-center text-brand-400">Return home</Link>
  </article></main>;
}
