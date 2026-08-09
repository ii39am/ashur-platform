import React from 'react';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

export const HeroSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section id="hero" className="relative flex min-h-[760px] items-center overflow-hidden pt-24 pb-16">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 mx-auto h-[420px] max-w-4xl rounded-full bg-brand-500/5 blur-[100px]" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
        <div className="text-center lg:text-start">
          <span className="mb-6 inline-flex rounded-full border border-brand-500/25 bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-400">
            {language === 'ar' ? 'نظام موحد لإدارة أعمالك' : 'One system for your business operations'}
          </span>
          <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {language === 'ar' ? 'إدارة أعمال أوضح من مكان واحد' : 'Manage your business clearly, from one place'}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg lg:mx-0">
            {language === 'ar'
              ? 'تجمع منصة آشور المحاسبة والمخزون والمبيعات والموارد البشرية والتصنيع في نظام واحد منظم وسهل الاستخدام.'
              : 'Ashur brings accounting, inventory, sales, HR, and manufacturing into one organized, easy-to-use system.'}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button href="mailto:ashurplatform95@gmail.com?subject=Ashur%20ERP%20Consultation" size="lg" icon={<ArrowRight className={`h-5 w-5 ${language === 'ar' ? 'rotate-180' : ''}`} />}>
              {language === 'ar' ? 'تواصل معنا' : 'Talk to our team'}
            </Button>
            <Button href="#product-preview" variant="secondary" size="lg" icon={<LayoutDashboard className="h-5 w-5" />}>
              {language === 'ar' ? 'استعرض المنصة' : 'Explore the platform'}
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg" aria-label={language === 'ar' ? 'هوية منصة آشور' : 'Ashur platform identity'}>
          <div className="aspect-square overflow-hidden rounded-3xl border border-white/10 bg-dark-900 shadow-2xl shadow-black/20">
            <img src="/brand/ashur-lockup.jpg" alt="Ashur ERP System" width="1080" height="1080" className="h-full w-full object-contain" fetchPriority="high" />
          </div>
        </div>
      </div>
    </section>
  );
};
