import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Menu, Search, UserRound, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../auth/AuthContext';

export const Navbar: React.FC<{ onOpenSearch: () => void }> = ({ onOpenSearch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { t, language, toggleLanguage } = useLanguage();
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const ar = language === 'ar';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMobileOpen(false); setAccountOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); setAccountOpen(false); }, [location.pathname, location.hash]);

  const links = [
    { label: t.nav.features, to: '/#features' },
    { label: ar ? 'آلية العمل' : 'How it works', to: '/#timeline' },
    { label: t.nav.industries, to: '/#industries' },
    { label: ar ? 'الأسعار' : 'Pricing', to: '/pricing' },
  ];

  const signOut = async () => { await auth.signOut(); navigate('/'); };

  return <>
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? 'glass-navbar py-3' : 'py-5'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5"><img src="/brand/ashur-mark.jpg" alt="" width="40" height="40" className="h-10 w-10 rounded-lg object-contain" /><span className="text-xl font-bold text-white">{t.brandName}<span className="text-brand-400">{t.brandSuffix}</span></span></Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">{links.map((link) => <Link key={link.to} to={link.to} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white">{link.label}</Link>)}</nav>
        <div className="hidden items-center gap-2 lg:flex">
          <button onClick={onOpenSearch} className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-white" aria-label="Open quick navigation"><Search className="h-4 w-4" /></button>
          <button onClick={toggleLanguage} className="flex min-h-11 items-center gap-1.5 rounded-xl border border-brand-500/20 bg-brand-500/10 px-3 text-xs font-semibold text-brand-400" aria-label="Switch language"><Globe className="h-4 w-4" />{language === 'en' ? 'العربية' : 'EN'}</button>
          <Link to="/download" className="inline-flex min-h-11 items-center rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-100 hover:bg-white/5">{ar ? 'تحميل التجربة' : 'Download trial'}</Link>
          {auth.loading ? <span className="h-11 w-28 animate-pulse rounded-xl bg-white/5" aria-label="Restoring account" /> : auth.user ? <div className="relative"><button onClick={() => setAccountOpen((open) => !open)} className="flex min-h-11 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white" aria-expanded={accountOpen}><UserRound className="h-4 w-4" />{ar ? 'الحساب' : 'Account'}</button>{accountOpen && <div className="absolute right-0 top-14 w-48 rounded-xl border border-white/10 bg-dark-800 p-2 shadow-xl"><Link to="/account" className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/5">{ar ? 'لوحة الحساب' : 'Account dashboard'}</Link><button onClick={signOut} className="w-full rounded-lg px-3 py-2 text-start text-sm text-slate-200 hover:bg-white/5">{ar ? 'تسجيل الخروج' : 'Sign out'}</button></div>}</div> : <><Link to="/sign-in" className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-slate-200">{ar ? 'تسجيل الدخول' : 'Sign in'}</Link><Link to="/create-account" className="inline-flex min-h-11 items-center rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white">{ar ? 'إنشاء حساب' : 'Create account'}</Link></>}
        </div>
        <div className="flex items-center gap-2 lg:hidden"><button onClick={toggleLanguage} className="min-h-11 rounded-lg border border-brand-500/20 bg-brand-500/10 px-3 text-xs font-bold text-brand-400" aria-label="Switch language">{language === 'en' ? 'عربي' : 'EN'}</button><button onClick={() => setMobileOpen((open) => !open)} className="flex h-11 w-11 items-center justify-center text-white" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>{mobileOpen ? <X /> : <Menu />}</button></div>
      </div>
    </header>
    <AnimatePresence>{mobileOpen && <motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><button className="absolute inset-0 h-full w-full bg-black/60" onClick={() => setMobileOpen(false)} aria-label="Close menu" /><motion.nav aria-label="Mobile navigation" className="absolute inset-x-4 top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-white/10 bg-dark-800 p-4 shadow-2xl" initial={{ y: -16 }} animate={{ y: 0 }}>
      {links.map((link) => <Link key={link.to} to={link.to} className="flex min-h-12 items-center rounded-xl px-4 text-slate-200 hover:bg-white/5">{link.label}</Link>)}
      <Link to="/download" className="flex min-h-12 items-center rounded-xl px-4 text-slate-200 hover:bg-white/5">{ar ? 'تحميل التجربة' : 'Download trial'}</Link>
      <button onClick={() => { setMobileOpen(false); onOpenSearch(); }} className="flex min-h-12 w-full items-center rounded-xl px-4 text-slate-200 hover:bg-white/5">{ar ? 'التنقل السريع' : 'Quick navigation'}</button>
      <div className="mt-3 border-t border-white/10 pt-3">{auth.loading ? <p className="p-3 text-sm text-slate-400">Restoring account…</p> : auth.user ? <><Link to="/account" className="flex min-h-12 items-center rounded-xl px-4 text-slate-200">{ar ? 'الحساب' : 'Account'}</Link><button onClick={signOut} className="flex min-h-12 w-full items-center rounded-xl px-4 text-slate-200">{ar ? 'تسجيل الخروج' : 'Sign out'}</button></> : <div className="grid gap-2"><Link to="/sign-in" className="flex min-h-12 items-center justify-center rounded-xl border border-white/10 text-slate-200">{ar ? 'تسجيل الدخول' : 'Sign in'}</Link><Link to="/create-account" className="flex min-h-12 items-center justify-center rounded-xl bg-brand-500 font-semibold text-white">{ar ? 'إنشاء حساب' : 'Create account'}</Link></div>}</div>
    </motion.nav></motion.div>}</AnimatePresence>
  </>;
};
