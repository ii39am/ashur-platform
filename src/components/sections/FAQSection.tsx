import React from 'react';
import { motion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { SectionWrapper, SectionHeader } from '../ui';
import { useLanguage } from '../../context/LanguageContext';

const content = {
  en: [
    { question: 'What is Ashur Platform?', answer: 'Ashur is an ERP platform that brings core business operations such as accounting, inventory, sales, HR, and manufacturing into one system.' },
    { question: 'Which modules are available?', answer: 'The website currently presents accounting, point of sale, inventory, manufacturing, customer management, and human resources as core capabilities. Contact the Ashur team to confirm the exact scope for your organization.' },
    { question: 'Can Ashur fit our industry?', answer: 'Ashur is presented for retail, restaurants, healthcare, construction, manufacturing, and logistics. Requirements vary, so the team should review your workflow before recommending a setup.' },
    { question: 'How do we get started?', answer: 'Contact the Ashur team with a short description of your organization and operational needs. They can then discuss suitability and next steps with you.' },
    { question: 'Where can I request technical details?', answer: 'Use the contact action on this page or email ashurplatform95@gmail.com for current implementation, hosting, security, and support information.' },
  ],
  ar: [
    { question: 'ما هي منصة آشور؟', answer: 'آشور هي منصة لإدارة موارد المؤسسات تجمع العمليات الأساسية مثل المحاسبة والمخزون والمبيعات والموارد البشرية والتصنيع في نظام واحد.' },
    { question: 'ما الوحدات المتوفرة؟', answer: 'يعرض الموقع حالياً المحاسبة ونقاط البيع والمخزون والتصنيع وإدارة العملاء والموارد البشرية كقدرات أساسية. تواصل مع فريق آشور لتأكيد النطاق المناسب لمؤسستك.' },
    { question: 'هل تناسب آشور قطاعنا؟', answer: 'تُعرض آشور لقطاعات التجزئة والمطاعم والرعاية الصحية والمقاولات والتصنيع والخدمات اللوجستية. تختلف المتطلبات، لذلك يراجع الفريق سير عملك قبل اقتراح الإعداد.' },
    { question: 'كيف نبدأ؟', answer: 'تواصل مع فريق آشور وأرسل وصفاً مختصراً لمؤسستك واحتياجاتها التشغيلية، ليتم مناقشة مدى الملاءمة والخطوات التالية.' },
    { question: 'أين يمكن طلب التفاصيل التقنية؟', answer: 'استخدم زر التواصل في هذه الصفحة أو البريد ashurplatform95@gmail.com للحصول على المعلومات الحالية حول التنفيذ والاستضافة والأمان والدعم.' },
  ],
};

export const FAQSection: React.FC = () => {
  const { language } = useLanguage();
  const faqs = content[language];
  return (
    <SectionWrapper id="faq">
      <SectionHeader badge={language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'} title={language === 'ar' ? 'إجابات واضحة' : 'Clear answers'} titleHighlight={language === 'ar' ? 'قبل التواصل' : 'before you contact us'} />
      <div className="mx-auto max-w-3xl">
        <Accordion.Root type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div key={faq.question} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .04 }}>
              <Accordion.Item value={`item-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-dark-800">
                <Accordion.Header>
                  <Accordion.Trigger className="group flex min-h-14 w-full items-center justify-between gap-4 p-5 text-start font-semibold text-white hover:bg-white/[0.03]">
                    {faq.question}<ChevronDown className="h-5 w-5 shrink-0 text-brand-400 transition-transform group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <p className="px-5 pb-5 leading-7 text-slate-300">{faq.answer}</p>
                </Accordion.Content>
              </Accordion.Item>
            </motion.div>
          ))}
        </Accordion.Root>
      </div>
    </SectionWrapper>
  );
};
