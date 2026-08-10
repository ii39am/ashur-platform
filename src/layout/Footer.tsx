import React from 'react';
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const links = [
    { label: ar ? 'المميزات' : 'Features', href: '/#features' },
    { label: ar ? 'آلية العمل' : 'How it works', href: '/#timeline' },
    { label: ar ? 'القطاعات' : 'Industries', href: '/#industries' },
    { label: ar ? 'الأسئلة الشائعة' : 'FAQ', href: '/#faq' },
    { label: ar ? 'الأسعار' : 'Pricing', href: '/pricing' },
    { label: ar ? 'التحميل' : 'Download', href: '/download' },
    { label: ar ? 'الخصوصية' : 'Privacy', href: '/privacy' },
    { label: ar ? 'الشروط' : 'Terms', href: '/terms' },
    { label: ar ? 'سياسة الاسترداد' : 'Refund policy', href: '/refund-policy' },
    { label: ar ? 'الدعم' : 'Support', href: '/support' },
  ];

  return (
    <footer id="contact" className="relative border-t border-white/10 bg-dark-900">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="final-cta-title">
        <div className="rounded-3xl border border-brand-500/20 bg-brand-500/8 px-6 py-12 text-center sm:px-10">
          <h2 id="final-cta-title" className="text-3xl font-bold text-white sm:text-4xl">
            {ar ? 'هل تريد معرفة ما إذا كانت آشور مناسبة لعملك؟' : 'See if Ashur fits your business'}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300">
            {ar ? 'تواصل معنا لمناقشة احتياجات مؤسستك والوحدات المناسبة لفريقك.' : 'Tell us about your operations and we will discuss the modules that fit your team.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/download" size="lg" icon={<ArrowRight className={`h-5 w-5 ${ar ? 'rotate-180' : ''}`} />}>{ar ? 'تحميل التجربة' : 'Download trial'}</Button>
            <Button href="mailto:ashurplatform95@gmail.com?subject=Ashur%20ERP%20Consultation" variant="secondary" size="lg">{ar ? 'راسل فريق آشور' : 'Contact Ashur'}</Button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 border-t border-white/10 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_.8fr_.9fr] lg:px-8">
        <div>
          <img src="/brand/ashur-lockup.jpg" alt="Ashur ERP System" width="1080" height="1080" loading="lazy" className="h-24 w-24 rounded-xl object-contain" />
          <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">
            {ar ? 'نظام موحد لتنظيم العمليات الأساسية للمؤسسات.' : 'A unified system for organizing essential business operations.'}
          </p>
        </div>
        <nav aria-label={ar ? 'روابط التذييل' : 'Footer navigation'}>
          <h3 className="mb-4 font-semibold text-white">{ar ? 'استكشف' : 'Explore'}</h3>
          <ul className="space-y-2">
            {links.map((link) => <li key={link.href}><a className="inline-flex min-h-11 items-center text-sm text-slate-400 hover:text-brand-400" href={link.href}>{link.label}</a></li>)}
          </ul>
        </nav>
        <address className="not-italic">
          <h3 className="mb-4 font-semibold text-white">{ar ? 'تواصل معنا' : 'Contact'}</h3>
          <div className="space-y-3 text-sm text-slate-400">
            <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-brand-400" />{ar ? 'بغداد، العراق' : 'Baghdad, Iraq'}</p>
            <a className="flex min-h-11 items-center gap-3 hover:text-brand-400" href="tel:07870011886"><Phone className="h-4 w-4 text-brand-400" />07870011886</a>
            <a className="flex min-h-11 items-center gap-3 break-all hover:text-brand-400" href="mailto:ashurplatform95@gmail.com"><Mail className="h-4 w-4 shrink-0 text-brand-400" />ashurplatform95@gmail.com</a>
          </div>
        </address>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {ar ? 'منصة آشور. جميع الحقوق محفوظة.' : 'Ashur Platform. All rights reserved.'}
      </div>
    </footer>
  );
};
