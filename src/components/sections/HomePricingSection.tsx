import React from 'react';
import { Link } from 'react-router-dom';
import { SectionWrapper, SectionHeader } from '../ui';
import { confirmedPricingPlans } from '../../config/pricing';
import { useLanguage } from '../../context/LanguageContext';

export function HomePricingSection() {
  const { language } = useLanguage();
  const ar = language === 'ar';
  return <SectionWrapper id="pricing">
    <SectionHeader badge={ar ? 'الأسعار' : 'Pricing'} title={ar ? 'خطة مناسبة' : 'A plan that fits'} titleHighlight={ar ? 'احتياجات مؤسستك' : 'your organization'} description={ar ? 'لم يتم اعتماد الأسعار العامة بعد. تواصل معنا للحصول على عرض واضح دون رسوم مخفية.' : 'Public pricing has not been confirmed. Contact us for a clear proposal without presenting unapproved rates.'} />
    {confirmedPricingPlans.length === 0 ? <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-dark-800 p-8 text-center">
      <h3 className="text-xl font-bold text-white">{ar ? 'الأسعار قيد الإعداد' : 'Pricing is being finalized'}</h3>
      <p className="mt-3 text-slate-300">{ar ? 'لن نعرض أسعاراً أو خصومات قبل اعتمادها.' : 'We will not display prices or discounts until they are approved.'}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3"><a href="mailto:ashurplatform95@gmail.com?subject=Ashur%20ERP%20Pricing" className="auth-submit max-w-xs">{ar ? 'اطلب عرضاً' : 'Request a proposal'}</a><Link to="/pricing" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-6 text-slate-200">{ar ? 'تفاصيل الأسعار' : 'Pricing details'}</Link></div>
    </div> : null}
  </SectionWrapper>;
}
