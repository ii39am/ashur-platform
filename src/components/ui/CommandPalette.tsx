import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight, Zap, Bot, Calculator, Package, Users, Contact, Landmark, FileText, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const { t, language, toggleLanguage } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    returnFocusRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const controls = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button, input, [href], [tabindex]:not([tabindex="-1"])'));
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', trapFocus);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', trapFocus);
      returnFocusRef.current?.focus();
    };
  }, [isOpen]);

  const items = [
    { id: 'sec-features', label: t.nav.features, icon: Zap, action: () => scrollTo('#features') },
    { id: 'sec-product', label: language === 'ar' ? 'نظرة عامة' : 'Platform overview', icon: Package, action: () => scrollTo('#product-preview') },
    { id: 'sec-workflow', label: language === 'ar' ? 'آلية العمل' : 'How it works', icon: FileText, action: () => scrollTo('#timeline') },
    { id: 'sec-industries', label: t.nav.industries, icon: Landmark, action: () => scrollTo('#industries') },
    { id: 'lang-toggle', label: `Switch to ${language === 'en' ? 'العربية (Arabic)' : 'English'}`, icon: Globe, action: () => { toggleLanguage(); onClose(); } },
  ];

  const scrollTo = (selector: string) => {
    onClose();
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[max(5rem,env(safe-area-inset-top))] px-4 pb-[env(safe-area-inset-bottom)]" role="dialog" aria-modal="true" aria-label="Quick navigation">
          <motion.div
            ref={dialogRef}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-xl glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/15 z-10"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.command.placeholder}
                className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-base font-medium"
              />
              <kbd className="hidden sm:inline-block px-2 py-1 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded-md">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-sm text-slate-300 hover:text-white hover:bg-brand-500/15 hover:border-brand-500/30 border border-transparent transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  {t.command.noResults}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-dark-900/80 border-t border-white/5 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Command className="w-3 h-3" /> Navigation Shortcut
              </span>
              <span>Ashur OS v2.5</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
