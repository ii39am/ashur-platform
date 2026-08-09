import React from 'react';
import { Calculator, Package, Contact, Users, Factory, FileBarChart2 } from 'lucide-react';
import { SectionWrapper, SectionHeader } from '../ui';
import { useLanguage } from '../../context/LanguageContext';

const capabilities = [
  { icon: Calculator, en: 'Accounting', ar: 'المحاسبة' },
  { icon: Package, en: 'Inventory', ar: 'المخزون' },
  { icon: Contact, en: 'Sales & CRM', ar: 'المبيعات والعملاء' },
  { icon: Users, en: 'Human resources', ar: 'الموارد البشرية' },
  { icon: Factory, en: 'Manufacturing', ar: 'التصنيع' },
  { icon: FileBarChart2, en: 'Reports', ar: 'التقارير' },
];

export const ProductPreviewSection: React.FC = () => {
  const { language } = useLanguage();
  return (
    <SectionWrapper id="product-preview">
      <SectionHeader
        badge={language === 'ar' ? 'نظرة عامة' : 'Platform overview'}
        title={language === 'ar' ? 'عملياتك الأساسية' : 'Your core operations'}
        titleHighlight={language === 'ar' ? 'في مساحة واحدة' : 'in one workspace'}
        description={language === 'ar' ? 'تنقل بين وحدات العمل الرئيسية دون تشتيت أو أنظمة منفصلة.' : 'Move between essential business modules without juggling disconnected systems.'}
      />
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-dark-900 shadow-xl shadow-black/15">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
          <img src="/brand/ashur-mark.jpg" alt="" className="h-9 w-9 rounded-lg object-contain" />
          <span className="font-semibold text-white">Ashur ERP</span>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 lg:p-8">
          {capabilities.map(({ icon: Icon, en, ar }) => (
            <div key={en} className="flex min-h-24 items-center gap-4 rounded-2xl border border-white/8 bg-dark-800 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400"><Icon className="h-5 w-5" /></span>
              <span className="font-semibold text-slate-100">{language === 'ar' ? ar : en}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
