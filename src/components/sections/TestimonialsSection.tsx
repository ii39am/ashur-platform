import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquareQuote } from 'lucide-react';
import { SectionWrapper, SectionHeader } from '../ui';
import { useLanguage } from '../../context/LanguageContext';

const testimonialsData = {
  en: [
    { name: 'Sarah Chen', role: 'CFO', company: 'TechFlow Inc', text: 'Ashur Platform transformed our financial operations. We reduced month-end close from 10 days to 2. The AI assistant alone saves our team 20+ hours weekly.', rating: 5 },
    { name: 'Marcus Rodriguez', role: 'Operations Director', company: 'GlobalMfg', text: 'The manufacturing module is world-class. Production planning, quality control, and supply chain management — all seamlessly integrated. Game changer.', rating: 5 },
    { name: 'Aisha Patel', role: 'CEO', company: 'RetailPro', text: 'We went from 5 different software systems to just Ashur Platform. Our team loves it, our customers notice the difference, and our bottom line proves it.', rating: 5 },
    { name: 'James Wilson', role: 'IT Director', company: 'HealthFirst', text: 'HIPAA compliance was our biggest concern. Ashur Platform not only meets every requirement but makes compliance effortless. The best decision we made.', rating: 5 },
    { name: 'Elena Kowalski', role: 'HR Manager', company: 'BuildCorp', text: 'Payroll processing that used to take our team 3 days now takes 2 hours. The employee self-service portal reduced HR tickets by 60%.', rating: 5 },
    { name: 'David Kim', role: 'Supply Chain VP', company: 'LogiTech', text: 'Real-time inventory tracking across 12 warehouses with 99.8% accuracy. The warehouse module with barcode scanning is incredibly powerful.', rating: 5 },
  ],
  ar: [
    { name: 'سارة تشين', role: 'المدير المالي', company: 'شركة تك فلو', text: 'منصة آشور أحدثت نقلة نوعية في عملياتنا المالية. قلصنا إغلاق نهاية الشهر من 10 أيام إلى يومين فقط، ومساعد الذكاء الاصطناعي يوفر أكثر من 20 ساعة أسبوعياً.', rating: 5 },
    { name: 'ماركوس رودريغيز', role: 'مدير العمليات', company: 'جلوبال للتصنيع', text: 'وحدة التصنيع عالمية المستوى. تخطيط الإنتاج، مراقبة الجودة وإدارة سلاسل الإمداد متكاملة بسلاسة تامة. أداء مذهل.', rating: 5 },
    { name: 'عائشة باتيل', role: 'الرئيس التنفيذي', company: 'ريتيل برو', text: 'انتقلنا من 5 أنظمة برمجية مشتتة إلى منصة آشور الموحدة. فريقنا يفضله بشدة، وعملاؤنا يلاحظون الفارق الكبير.', rating: 5 },
    { name: 'جيمس ويلسون', role: 'مدير تكنولوجيا المعلومات', company: 'هيلث فيرست', text: 'كان الامتثال للمعايير الطبية أكبر تخوف لدينا. منصة آشور لم تلبِ فقط كافة المتطلبات بل جعلت الامتثال والرقابة أمراً سلسًا للغاية.', rating: 5 },
    { name: 'إيلينا كوالسكي', role: 'مديرة الموارد البشرية', company: 'بيلد كورب', text: 'معالجة الرواتب التي كانت تستغرق 3 أيام باتت تنجز في ساعتين. وبوابة خدمة الموظفين الذاتية قللت تذاكر HR بنسبة 60%.', rating: 5 },
    { name: 'ديفيد كيم', role: 'نائب رئيس سلاسل الإمداد', company: 'لوجي تك', text: 'تتبع المخزون لحظياً عبر 12 مستودعاً بدقة 99.8%. وحدة المستودعات المزودة بمسح الباركود فائقة القوة والاعتمادية.', rating: 5 },
  ],
};

function TestimonialCard({
  testimonial,
}: {
  testimonial: typeof testimonialsData['en'][0];
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg)';
    el.style.transition = 'transform 0.5s ease';
  };

  const handleMouseEnter = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = 'none';
  };

  return (
    <div
      ref={cardRef}
      className="glass-card rounded-2xl p-6 min-w-[320px] max-w-[380px] flex-shrink-0 cursor-default"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <MessageSquareQuote className="w-8 h-8 text-brand-500/30 mb-4" />
      <p className="text-sm text-slate-300 leading-relaxed mb-6">"{testimonial.text}"</p>
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{testimonial.name}</div>
          <div className="text-xs text-slate-500">{testimonial.role} - {testimonial.company}</div>
        </div>
      </div>
    </div>
  );
}

export const TestimonialsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { t, language } = useLanguage();

  const testimonials = testimonialsData[language as 'en' | 'ar'] || testimonialsData.en;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrame: number;
    let scrollPos = 0;

    const animate = () => {
      if (!isHovered) {
        scrollPos += 0.5;
        if (scrollPos >= el.scrollWidth / 2) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isHovered]);

  return (
    <SectionWrapper id="testimonials" noPadding>
      <div className="section-padding">
        <SectionHeader
          badge={t.testimonials.badge}
          title={t.testimonials.title}
          titleHighlight={t.testimonials.titleHighlight}
          description={t.testimonials.description}
        />
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-hidden px-8 pb-16"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {[...testimonials, ...testimonials].map((testimonial, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 6) * 0.1 }}
          >
            <TestimonialCard testimonial={testimonial} />
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};
