import React from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus, FileText, ClipboardList, Receipt, CreditCard,
  Calculator, BarChart3, TrendingUp,
} from 'lucide-react';
import { SectionWrapper, SectionHeader } from '../ui';
import { useLanguage } from '../../context/LanguageContext';

const stepConfig = [
  { icon: UserPlus, key: 'lead', color: '#3b82f6' },
  { icon: FileText, key: 'quotation', color: '#8b5cf6' },
  { icon: ClipboardList, key: 'salesOrder', color: '#06b6d4' },
  { icon: Receipt, key: 'invoice', color: '#10b981' },
];

const stepTranslations = {
  en: {
    lead: { title: 'Lead Capture', description: 'Capture leads from web forms, emails, and social media automatically.' },
    quotation: { title: 'Quotation', description: 'Generate professional quotations with custom templates and pricing.' },
    salesOrder: { title: 'Sales Order', description: 'Convert quotes to orders with one click. Auto-sync inventory.' },
    invoice: { title: 'Invoice', description: 'Automated invoicing with payment terms, taxes, and multi-currency.' },
    payment: { title: 'Payment', description: 'Accept online payments. Auto-reconcile with bank statements.' },
    accounting: { title: 'Accounting', description: 'Entries posted automatically. Real-time P&L and balance sheet.' },
    reports: { title: 'Reports', description: 'Custom reports, audit trails, and compliance documentation.' },
    analytics: { title: 'Analytics', description: 'AI-driven insights, trends, and actionable recommendations.' },
  },
  ar: {
    lead: { title: 'جلب العملاء المحتملين', description: 'التقاط بيانات العملاء تلقائياً من النماذج والبريد وشبكات التواصل.' },
    quotation: { title: 'عروض الأسعار', description: 'إنشاء عروض أسعار احترافية بقوالب مخصصة وقواعد تسعير مرنة.' },
    salesOrder: { title: 'أوامر البيع', description: 'تحويل العروض إلى أوامر بضغطة واحدة مع تحديث الآلي للمخزون.' },
    invoice: { title: 'الفواتير الإلكترونية', description: 'أتمتة الفواتير مع شروط الدفع، الضرائب وتعدد العملات.' },
    payment: { title: 'سداد المدفوعات', description: 'قبول الدفع الإلكتروني والتسوية الآلية مع كشوفات الحسابات البنكية.' },
    accounting: { title: 'المحاسبة المباشرة', description: 'ترحيل القيود تلقائياً وقائمة الأرباح والخسائر والميزانية لحظياً.' },
    reports: { title: 'التقارير الرقابية', description: 'تقارير مخصصة، سجلات المراجعة، وتوثيق الامتثال الضريبي.' },
    analytics: { title: 'التحليلات الذكية', description: 'رؤى مدعومة بالذكاء الاصطناعي لتوقع الاتجاهات والتوصيات.' },
  },
};

export const TimelineSection: React.FC = () => {
  const { t, language } = useLanguage();
  const currentTrans = stepTranslations[language as 'en' | 'ar'] || stepTranslations.en;

  const steps = stepConfig.map((item) => ({
    ...item,
    title: currentTrans[item.key as keyof typeof currentTrans].title,
    description: currentTrans[item.key as keyof typeof currentTrans].description,
  }));

  return (
    <SectionWrapper id="timeline">
      <SectionHeader
        badge={language === 'ar' ? 'آلية العمل' : 'How it works'}
        title={language === 'ar' ? 'مسار واضح من العميل' : 'A clear path from customer'}
        titleHighlight={language === 'ar' ? 'إلى الفاتورة' : 'to invoice'}
        description={language === 'ar' ? 'تسلسل مبسط يوضح ارتباط خطوات البيع الأساسية داخل المنصة.' : 'A simple sequence showing how the core sales steps connect inside the platform.'}
      />

      {/* Desktop Timeline */}
      <div className="hidden lg:block relative">
        {/* Connecting Line */}
        <motion.div
          className="absolute top-[60px] left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 via-purple-500 via-cyan-500 to-emerald-500"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ transformOrigin: language === 'ar' ? 'right' : 'left' }}
        />

        <div className="grid grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.key}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              {/* Node */}
              <motion.div
                className="relative w-[120px] h-[120px] rounded-2xl glass-card flex flex-col items-center justify-center mb-4 group cursor-default"
                whileHover={{ scale: 1.08, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}30` }}
                >
                  <step.icon className="w-6 h-6" style={{ color: step.color }} />
                </div>
                <span className="text-xs font-semibold text-white">{step.title}</span>

                {/* Glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                  style={{ backgroundColor: `${step.color}20` }}
                />
              </motion.div>

              <p className="text-xs text-slate-500 leading-relaxed px-1">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="lg:hidden relative pl-8 rtl:pr-8 rtl:pl-0">
        {/* Vertical line */}
        <motion.div
          className="absolute left-[15px] rtl:left-auto rtl:right-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-500 via-purple-500 to-emerald-500"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          style={{ transformOrigin: 'top' }}
        />

        <div className="space-y-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.key}
              className="relative flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Dot */}
              <div
                className="absolute -left-8 rtl:-right-8 rtl:left-auto top-1 w-4 h-4 rounded-full border-2"
                style={{ borderColor: step.color, backgroundColor: `${step.color}30` }}
              />

              <div className="glass-card rounded-xl p-4 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <step.icon className="w-5 h-5" style={{ color: step.color }} />
                  <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                </div>
                <p className="text-xs text-slate-500">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
