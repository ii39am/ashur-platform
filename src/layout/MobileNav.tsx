import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Package, BarChart3, CreditCard, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const MobileNav: React.FC<{ onOpenSearch: () => void }> = ({ onOpenSearch }) => {
  const { t } = useLanguage();

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { label: t.nav.features, icon: Zap, action: () => scrollTo('#features') },
    { label: t.nav.modules, icon: Package, action: () => scrollTo('#modules') },
    { label: t.nav.analytics, icon: BarChart3, action: () => scrollTo('#analytics') },
    { label: t.nav.pricing, icon: CreditCard, action: () => scrollTo('#pricing') },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <motion.div
        className="glass-navbar rounded-2xl p-2 flex items-center justify-around shadow-2xl border border-white/10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-brand-400 transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}

        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center gap-1 p-2 text-brand-400 bg-brand-500/15 rounded-xl border border-brand-500/30"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Search</span>
        </button>
      </motion.div>
    </div>
  );
};
