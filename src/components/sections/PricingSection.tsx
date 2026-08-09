import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Building2, Rocket } from 'lucide-react';
import { SectionWrapper, SectionHeader, GlassCard } from '../ui';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

const planConfigs = [
  { key: 'starter', icon: Sparkles, price: { monthly: 49, annual: 39 }, popular: false },
  { key: 'business', icon: Building2, price: { monthly: 99, annual: 79 }, popular: true },
  { key: 'enterprise', icon: Rocket, price: { monthly: 0, annual: 0 }, popular: false },
];

const pricingTranslations = {
  en: {
    monthlyToggle: 'Monthly',
    annualToggle: 'Annual',
    saveText: 'Save 20%',
    perUser: '/user/mo',
    customPrice: 'Custom',
    mostPopular: 'Most Popular',
    featureComparisonTitle: 'Feature Comparison',
    plans: {
      starter: {
        name: 'Starter',
        description: 'Perfect for small businesses getting started with Ashur Platform.',
        cta: 'Start Free Trial',
        features: [
          '5 Users',
          'Core Modules (Accounting, Sales, Inventory)',
          '10 GB Storage',
          'Email Support',
          'Basic Reports',
          'Mobile App',
          'Single Currency',
          'Standard Integrations',
        ],
      },
      business: {
        name: 'Business',
        description: 'For growing companies that need advanced features.',
        cta: 'Start Free Trial',
        features: [
          '25 Users',
          'All Modules',
          '100 GB Storage',
          'Priority Support',
          'Advanced Analytics',
          'AI Assistant',
          'Multi-Currency',
          'API Access',
          'Custom Reports',
          'Workflow Automation',
        ],
      },
      enterprise: {
        name: 'Enterprise',
        description: 'For large organizations with custom requirements.',
        cta: 'Contact Sales',
        features: [
          'Unlimited Users',
          'All Modules + Custom',
          'Unlimited Storage',
          '24/7 Dedicated Support',
          'Full AI Suite',
          'White Labeling',
          'On-Premise Option',
          'Custom Integrations',
          'SLA Guarantee',
          'Dedicated Account Manager',
          'Training & Onboarding',
          'Source Code Access',
        ],
      },
    },
    table: {
      featureCol: 'Feature',
      unlimited: 'Unlimited',
      core: 'Core',
      all: 'All',
      allCustom: 'All + Custom',
      rows: [
        { name: 'Users', starter: '5', business: '25', enterprise: 'Unlimited' },
        { name: 'Storage', starter: '10 GB', business: '100 GB', enterprise: 'Unlimited' },
        { name: 'Modules', starter: 'Core', business: 'All', enterprise: 'All + Custom' },
        { name: 'AI Assistant', starter: false, business: true, enterprise: true },
        { name: 'API Access', starter: false, business: true, enterprise: true },
        { name: 'Custom Reports', starter: false, business: true, enterprise: true },
        { name: 'White Labeling', starter: false, business: false, enterprise: true },
        { name: 'On-Premise', starter: false, business: false, enterprise: true },
        { name: 'Dedicated Support', starter: false, business: false, enterprise: true },
      ],
    },
  },
  ar: {
    monthlyToggle: 'شهري',
    annualToggle: 'سنوي',
    saveText: 'خصم 20%',
    perUser: '/مستخدم/شهرياً',
    customPrice: 'حسب الطلب',
    mostPopular: 'الأكثر شعبية',
    featureComparisonTitle: 'مقارنة الميزات',
    plans: {
      starter: {
        name: 'المبتدئة (Starter)',
        description: 'مثالية للشركات الناشئة والصغيرة للبدء في تنظيم أعمالها.',
        cta: 'ابدأ التجربة المجانية',
        features: [
          '5 مستخدمين',
          'الوحدات الأساسية (المحاسبة، المبيعات، المخزون)',
          'سعة تخزين 10 جيجابايت',
          'دعم عبر البريد الإلكتروني',
          'تقارير أساسية',
          'تطبيق الهاتف المحمول',
          'عملة واحدة',
          'تكامل مع الأنظمة القياسية',
        ],
      },
      business: {
        name: 'الأعمال (Business)',
        description: 'للشركات المتنامية التي تحتاج ميزات متقدمة وأتمتة ذكية.',
        cta: 'ابدأ التجربة المجانية',
        features: [
          '25 مستخدماً',
          'جميع الوحدات',
          'سعة تخزين 100 جيجابايت',
          'دعم فني بأولوية عالية',
          'تحليلات بيانية متقدمة',
          'مساعد الذكاء الاصطناعي',
          'تعدد العملات',
          'وصول كامل للملفات الربط API',
          'منشئ التقارير المخصصة',
          'أتمتة دورات العمل',
        ],
      },
      enterprise: {
        name: 'المؤسسات (Enterprise)',
        description: 'للمؤسسات الكبرى والشركات القابضة ذات المتطلبات الخاصة.',
        cta: 'تواصل مع المبيعات',
        features: [
          'عدد غير محدود من المستخدمين',
          'جميع الوحدات + وحدات مخصصة',
          'سعة تخزين غير محدودة',
          'دعم متفرغ 24/7',
          'حزمة الذكاء الاصطناعي الكاملة',
          'علامة تجارية مخصصة (White Labeling)',
          'خيار الاستضافة المحلية (On-Premise)',
          'تكامل مخصص مع الأنظمة الحالية',
          'ضمان اتفاقية مستوى الخدمة SLA',
          'مدير حساب خاص',
          'تدريب وتأهيل للفرق',
          'إمكانية الوصول للشفرة المصدرية',
        ],
      },
    },
    table: {
      featureCol: 'الميزة',
      unlimited: 'غير محدود',
      core: 'الأساسية',
      all: 'الجميع',
      allCustom: 'الجميع + مخصص',
      rows: [
        { name: 'عدد المستخدمين', starter: '5', business: '25', enterprise: 'غير محدود' },
        { name: 'سعة التخزين', starter: '10 GB', business: '100 GB', enterprise: 'غير محدود' },
        { name: 'الوحدات المتاحة', starter: 'الأساسية', business: 'جميع الوحدات', enterprise: 'الجميع + مخصص' },
        { name: 'مساعد الذكاء الاصطناعي', starter: false, business: true, enterprise: true },
        { name: 'وصول الـ API', starter: false, business: true, enterprise: true },
        { name: 'تقارير مخصصة', starter: false, business: true, enterprise: true },
        { name: 'علامة تجارية مخصصة', starter: false, business: false, enterprise: true },
        { name: 'استضافة محلية On-Premise', starter: false, business: false, enterprise: true },
        { name: 'دعم متفرغ مخصص', starter: false, business: false, enterprise: true },
      ],
    },
  },
};

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const { t, language } = useLanguage();

  const currentTrans = pricingTranslations[language as 'en' | 'ar'] || pricingTranslations.en;

  const plans = planConfigs.map((config) => ({
    ...config,
    ...currentTrans.plans[config.key as keyof typeof currentTrans.plans],
  }));

  return (
    <SectionWrapper id="pricing">
      <SectionHeader
        badge={t.pricing.badge}
        title={t.pricing.title}
        titleHighlight={t.pricing.titleHighlight}
        description={t.pricing.description}
      />

      {/* Toggle */}
      <motion.div
        className="flex items-center justify-center gap-4 mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-slate-500'}`}>
          {currentTrans.monthlyToggle}
        </span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className={`relative w-16 h-11 rounded-full transition-colors duration-300 cursor-pointer ${
            isAnnual ? 'bg-brand-500' : 'bg-dark-600'
          }`}
        >
          <motion.div
            className="absolute top-1 w-9 h-9 rounded-full bg-white shadow-sm"
            animate={{ left: isAnnual ? '24px' : '4px' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
          <span className="sr-only">{isAnnual ? currentTrans.annualToggle : currentTrans.monthlyToggle}</span>
        </button>
        <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-slate-500'}`}>
          {currentTrans.annualToggle} <span className="text-emerald-400 text-xs">{currentTrans.saveText}</span>
        </span>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <GlassCard
              className={`p-8 h-full relative ${plan.popular ? 'border-brand-500/30' : ''}`}
              glow={plan.popular}
              tilt
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-brand-500 to-purple-500 text-white shadow-lg shadow-brand-500/30">
                    {currentTrans.mostPopular}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? 'bg-brand-500/20 border border-brand-500/30' : 'bg-white/5 border border-white/10'}`}>
                  <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-brand-400' : 'text-slate-400'}`} />
                </div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              </div>

              <p className="text-sm text-slate-500 mb-6">{plan.description}</p>

              <div className="mb-8">
                {plan.price.monthly === 0 ? (
                  <div className="text-3xl font-bold text-white">{currentTrans.customPrice}</div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-sm text-slate-500">{currentTrans.perUser}</span>
                  </div>
                )}
              </div>

              <Button
                variant={plan.popular ? 'primary' : 'secondary'}
                size="md"
                className="w-full justify-center mb-8"
              >
                {plan.cta}
              </Button>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-sm text-slate-400">{feature}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Comparison Table */}
      <motion.div
        className="glass-card rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-white">{currentTrans.featureComparisonTitle}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left rtl:text-right text-sm font-medium text-slate-400 px-6 py-4">{currentTrans.table.featureCol}</th>
                <th className="text-center text-sm font-medium text-slate-400 px-6 py-4">{plans[0].name}</th>
                <th className="text-center text-sm font-medium text-brand-400 px-6 py-4">{plans[1].name}</th>
                <th className="text-center text-sm font-medium text-slate-400 px-6 py-4">{plans[2].name}</th>
              </tr>
            </thead>
            <tbody>
              {currentTrans.table.rows.map((feature, i) => (
                <tr key={feature.name} className={i % 2 === 0 ? 'bg-white/[0.01]' : ''}>
                  <td className="text-sm text-slate-300 px-6 py-3">{feature.name}</td>
                  {(['starter', 'business', 'enterprise'] as const).map((planKey) => {
                    const val = feature[planKey];
                    return (
                      <td key={planKey} className="text-center px-6 py-3">
                        {typeof val === 'boolean' ? (
                          val ? (
                            <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <span className="text-slate-700">—</span>
                          )
                        ) : (
                          <span className="text-sm text-slate-400">{val}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </SectionWrapper>
  );
};
