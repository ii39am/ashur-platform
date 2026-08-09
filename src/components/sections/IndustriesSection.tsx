import React from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Store, UtensilsCrossed, Hospital, Stethoscope, HardHat, Factory,
  Truck, GraduationCap, Home, Car, Building, Heart,
} from 'lucide-react';
import { SectionWrapper, SectionHeader, GlassCard } from '../ui';
import { useLanguage } from '../../context/LanguageContext';

const industryConfig = [
  { icon: Store, key: 'retail', color: '#3b82f6' },
  { icon: UtensilsCrossed, key: 'restaurant', color: '#f59e0b' },
  { icon: Hospital, key: 'hospital', color: '#f43f5e' },
  { icon: Stethoscope, key: 'clinic', color: '#10b981' },
  { icon: HardHat, key: 'construction', color: '#f97316' },
  { icon: Factory, key: 'factory', color: '#8b5cf6' },
  { icon: Truck, key: 'logistics', color: '#06b6d4' },
];

const industryTranslations = {
  en: {
    retail: { title: 'Retail', description: 'Multi-store management, POS, loyalty programs, and omnichannel sales.' },
    restaurant: { title: 'Restaurant', description: 'Table management, kitchen display, online ordering, and recipe costing.' },
    hospital: { title: 'Hospital', description: 'Patient records, bed management, pharmacy, billing, and compliance.' },
    clinic: { title: 'Clinic', description: 'Appointment scheduling, EMR, prescriptions, and insurance claims.' },
    construction: { title: 'Construction', description: 'Project costing, subcontractor management, equipment tracking.' },
    factory: { title: 'Factory', description: 'Production planning, quality control, OEE tracking, and MRP.' },
    logistics: { title: 'Logistics', description: 'Fleet management, route optimization, warehouse ops, and tracking.' },
    education: { title: 'Education', description: 'Student information system, fee management, LMS, and admissions.' },
    realEstate: { title: 'Real Estate', description: 'Property management, tenant portal, lease tracking, and maintenance.' },
    automotive: { title: 'Automotive', description: 'Dealer management, service scheduling, parts inventory, and warranty.' },
    government: { title: 'Government', description: 'Procurement, budget management, compliance, and citizen services.' },
    ngo: { title: 'NGO', description: 'Donor management, grant tracking, volunteer coordination, and reporting.' },
  },
  ar: {
    retail: { title: 'تجارة التجزئة', description: 'إدارة الفروع المتعددة، نقاط البيع، برامج الولاء والبيع المتعدد القنوات.' },
    restaurant: { title: 'المطاعم والمقاهي', description: 'إدارة الطاولات، شاشات المطبخ، الطلبات الإلكترونية وحساب تكاليف الوجبات.' },
    hospital: { title: 'المستشفيات', description: 'سجلات المرضى، إدارة الأسرة، الصيدلية، الفواتير والامتثال الصحي.' },
    clinic: { title: 'المراكز الطبية', description: 'حجز المواعيد، السجلات الطبية الإلكترونية، الوصفات والمطالبات التأمينية.' },
    construction: { title: 'المقاولات والبناء', description: 'حساب تكاليف المشاريع، إدارة مقاولي الباطن، وتتبع المعدات.' },
    factory: { title: 'المصانع والإنتاج', description: 'تخطيط الإنتاج، ضبط الجودة، تتبع الكفاءة والتخطيط الصناعي.' },
    logistics: { title: 'الخدمات اللوجستية', description: 'إدارة أسطول النقل، تحسين المسارات، عمليات التخزين والتتبع.' },
    education: { title: 'التعليم والجامعات', description: 'نظام إدارة الطلاب، التحصيل المالي، المنصات التعليمية والقبول.' },
    realEstate: { title: 'العقارات والتطوير', description: 'إدارة الأملاك، بوابة المستأجرين، عقود الإيجار والتأجير والصيانة.' },
    automotive: { title: 'السيارات والمركبات', description: 'إدارة الوكالات، مراكز الخدمة، قطع الغيار وإدارة الضمان.' },
    government: { title: 'القطاع الحكومي', description: 'إدارة المشتريات، الميزانيات، الامتثال والتكامل مع الخدمات الذكية.' },
    ngo: { title: 'الجمعيات غير الربحية', description: 'إدارة التبرعات، المنح والمشاريع الخيرية، والمتطوعين والتقارير.' },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

export const IndustriesSection: React.FC = () => {
  const { t, language } = useLanguage();
  const currentTrans = industryTranslations[language as 'en' | 'ar'] || industryTranslations.en;

  const industries = industryConfig.map((item) => ({
    ...item,
    title: currentTrans[item.key as keyof typeof currentTrans].title,
    description: currentTrans[item.key as keyof typeof currentTrans].description,
  }));

  return (
    <SectionWrapper id="industries">
      <SectionHeader
        badge={language === 'ar' ? 'القطاعات' : 'Industries'}
        title={language === 'ar' ? 'مرونة تناسب' : 'Flexible for different'}
        titleHighlight={language === 'ar' ? 'بيئات العمل' : 'operating environments'}
        description={language === 'ar' ? 'قطاعات تختلف في سير عملها وتستفيد من تنظيم العمليات في نظام موحد.' : 'Different industries can benefit from organizing their core operations in one system.'}
      />

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {industries.map((industry) => (
          <motion.div key={industry.key} variants={cardVariants}>
            <GlassCard className="p-6 h-full group cursor-default text-center" tilt glow delay={0}>
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-500 group-hover:scale-110"
                style={{
                  backgroundColor: `${industry.color}12`,
                  border: `1px solid ${industry.color}25`,
                }}
              >
                <industry.icon
                  className="w-7 h-7 transition-colors duration-300"
                  style={{ color: industry.color }}
                />
              </motion.div>
              <h3 className="text-base font-semibold text-white mb-2">{industry.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{industry.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
};
