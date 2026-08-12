import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
export function AuthShell({ title, description, children, wide = false }: { title: string; description: string; children: React.ReactNode; wide?: boolean }) {
  const { language, toggleLanguage } = useLanguage();
  return <main className="min-h-screen bg-dark-950 px-4 pb-16 pt-28"><button type="button" onClick={toggleLanguage} className="fixed end-4 top-4 z-10 flex min-h-11 items-center gap-2 rounded-xl border border-brand-500/20 bg-dark-800 px-4 text-sm text-brand-400" aria-label="Switch language / تغيير اللغة"><Globe className="h-4 w-4" />{language === 'en' ? 'العربية' : 'EN'}</button><div className={`mx-auto ${wide ? 'max-w-2xl' : 'max-w-md'}`}><Link to="/" className="mb-8 flex items-center justify-center gap-3 text-xl font-bold text-white"><img src="/brand/ashur-mark.jpg" alt="" width="44" height="44" className="h-11 w-11 rounded-xl object-contain" />Ashur <span className="text-brand-400">Platform</span></Link><section className="rounded-3xl border border-white/10 bg-dark-800 p-6 shadow-xl shadow-black/20 sm:p-8"><h1 className="text-3xl font-bold text-white">{title}</h1><p className="mt-3 leading-7 text-slate-300">{description}</p><div className="mt-7">{children}</div></section></div></main>;
}
