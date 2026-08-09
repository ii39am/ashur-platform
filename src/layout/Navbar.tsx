import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, language, toggleLanguage } = useLanguage();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileOpen]);

  const scrollTo = useCallback((href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const navLinks = [
    { label: t.nav.features, href: '#features' },
    { label: language === 'ar' ? 'آلية العمل' : 'How it works', href: '#timeline' },
    { label: t.nav.industries, href: '#industries' },
    { label: t.nav.faq, href: '#faq' },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-navbar py-3' : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-2.5 group"
            whileHover={{ scale: 1.02 }}
          >
            <img src="/brand/ashur-mark.jpg" alt="" className="w-10 h-10 rounded-lg object-contain" />
            <span className="text-xl font-bold text-white tracking-tight">
              {t.brandName}<span className="text-brand-400">{t.brandSuffix}</span>
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer"
                whileHover={{ y: -1 }}
              >
                {link.label}
              </motion.button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search Trigger */}
            <motion.button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-light border border-white/10 text-slate-400 hover:text-white text-xs font-medium cursor-pointer transition-colors"
              whileHover={{ scale: 1.03 }}
              aria-label={t.nav.searchPlaceholder}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t.nav.searchPlaceholder}</span>
            </motion.button>

            {/* Language Switcher */}
            <motion.button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 hover:bg-brand-500/20 text-xs font-semibold cursor-pointer transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Switch Language / تغيير اللغة"
              aria-label="Switch language / تغيير اللغة"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'العربية' : 'EN'}</span>
            </motion.button>

            <Button variant="primary" size="sm" href="mailto:ashurplatform95@gmail.com?subject=Ashur%20ERP%20Consultation">
              {language === 'ar' ? 'تواصل معنا' : 'Contact us'}
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <motion.button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold"
              aria-label="Switch language / تغيير اللغة"
            >
              {language === 'en' ? 'عربي' : 'EN'}
            </motion.button>
            <motion.button
              className="text-white p-2 cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute top-20 left-4 right-4 glass rounded-2xl p-6"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.label}
                    onClick={() => scrollTo(link.href)}
                    className="px-4 py-3 text-left text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {link.label}
                  </motion.button>
                ))}
                <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-2">
                  <button onClick={() => { setMobileOpen(false); onOpenSearch(); }} className="min-h-11 rounded-xl border border-white/10 text-sm text-slate-300">
                    {t.nav.searchPlaceholder}
                  </button>
                  <Button variant="primary" size="md" className="w-full justify-center" href="mailto:ashurplatform95@gmail.com?subject=Ashur%20ERP%20Consultation">
                    {language === 'ar' ? 'تواصل معنا' : 'Contact us'}
                  </Button>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
