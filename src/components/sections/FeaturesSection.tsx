import React from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Calculator, Monitor, Package, Factory, Contact, Users, Wallet,
  Clock, FolderKanban, Building, Landmark, PiggyBank, Bot, FileBarChart2,
  Warehouse, ShoppingBag, ShoppingCart, Globe, UserCircle, Truck,
} from 'lucide-react';
import { SectionWrapper, SectionHeader, GlassCard } from '../ui';
import { useLanguage } from '../../context/LanguageContext';

const featureIcons = [
  { key: 'accounting', icon: Calculator },
  { key: 'pos', icon: Monitor },
  { key: 'inventory', icon: Package },
  { key: 'manufacturing', icon: Factory },
  { key: 'crm', icon: Contact },
  { key: 'hr', icon: Users },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const FeaturesSection: React.FC = () => {
  const { t, language } = useLanguage();
  const descriptions: Record<string, { en: string; ar: string }> = {
    accounting: { en: 'Keep financial records and accounting work organized.', ar: 'تنظيم السجلات المالية وأعمال المحاسبة.' },
    pos: { en: 'Support day-to-day sales from a focused workspace.', ar: 'دعم عمليات البيع اليومية من مساحة عمل واضحة.' },
    inventory: { en: 'Organize products, stock, and warehouse activity.', ar: 'تنظيم المنتجات والمخزون وحركة المستودعات.' },
    manufacturing: { en: 'Coordinate core production and manufacturing work.', ar: 'تنسيق أعمال الإنتاج والتصنيع الأساسية.' },
    crm: { en: 'Keep customer and sales information in one place.', ar: 'جمع معلومات العملاء والمبيعات في مكان واحد.' },
    hr: { en: 'Organize employee information and HR processes.', ar: 'تنظيم معلومات الموظفين وعمليات الموارد البشرية.' },
  };

  return (
    <SectionWrapper id="features">
      <SectionHeader
        badge={language === 'ar' ? 'القدرات الأساسية' : 'Core capabilities'}
        title={language === 'ar' ? 'الأدوات المهمة' : 'The essentials your team needs'}
        titleHighlight={language === 'ar' ? 'دون تعقيد' : 'without the clutter'}
        description={language === 'ar' ? 'ست وحدات أساسية توضح نطاق المنصة دون إغراقك بالتفاصيل.' : 'Six core areas show the platform’s scope without overwhelming you with details.'}
      />

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {featureIcons.map((item) => {
          const itemTranslation = t.features.items[item.key as keyof typeof t.features.items];
          return (
            <motion.div key={item.key} variants={cardVariants}>
              <GlassCard className="p-6 h-full group cursor-default" glow tilt delay={0}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-brand-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-brand-500/40 transition-all duration-500">
                  <item.icon className="w-6 h-6 text-brand-400 group-hover:text-brand-300 transition-colors" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
                  {itemTranslation?.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">
                  {descriptions[item.key]?.[language]}
                </p>
                <motion.div
                  className="mt-4 h-0.5 bg-gradient-to-r from-brand-500 to-purple-500 rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionWrapper>
  );
};
