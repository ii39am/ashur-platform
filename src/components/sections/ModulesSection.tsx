import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, Monitor, Package, Factory, Contact, Users, Wallet,
  Clock, FolderKanban, Building, Landmark, PiggyBank, Bot,
  FileBarChart2, Warehouse, ShoppingBag, ShoppingCart, Globe,
  UserCircle, Truck, Settings, Database, Shield, Zap,
} from 'lucide-react';
import { SectionWrapper, SectionHeader } from '../ui';
import { useLanguage } from '../../context/LanguageContext';

const categoryLabels = {
  en: { All: 'All', Core: 'Core', Sales: 'Sales', Operations: 'Operations', People: 'People', Finance: 'Finance', AI: 'AI' },
  ar: { All: 'الكل', Core: 'النواة الأسايسة', Sales: 'المبيعات', Operations: 'العمليات والتصنيع', People: 'الموارد البشرية', Finance: 'المالية والمحاسبة', AI: 'الذكاء الاصطناعي' },
};

const moduleConfig = [
  { icon: Calculator, key: 'generalLedger', catKey: 'Finance', color: '#3b82f6' },
  { icon: Monitor, key: 'pos', catKey: 'Sales', color: '#8b5cf6' },
  { icon: Package, key: 'inventory', catKey: 'Operations', color: '#06b6d4' },
  { icon: Factory, key: 'manufacturing', catKey: 'Operations', color: '#f97316' },
  { icon: Contact, key: 'crm', catKey: 'Sales', color: '#10b981' },
  { icon: Users, key: 'hr', catKey: 'People', color: '#ec4899' },
  { icon: Wallet, key: 'payroll', catKey: 'People', color: '#f59e0b' },
  { icon: Clock, key: 'attendance', catKey: 'People', color: '#64748b' },
  { icon: FolderKanban, key: 'projects', catKey: 'Operations', color: '#a78bfa' },
  { icon: Building, key: 'assets', catKey: 'Finance', color: '#22d3ee' },
  { icon: Landmark, key: 'treasury', catKey: 'Finance', color: '#3b82f6' },
  { icon: PiggyBank, key: 'budgeting', catKey: 'Finance', color: '#10b981' },
  { icon: Bot, key: 'aiAssistant', catKey: 'AI', color: '#8b5cf6' },
  { icon: FileBarChart2, key: 'reports', catKey: 'Core', color: '#f43f5e' },
  { icon: Warehouse, key: 'warehouse', catKey: 'Operations', color: '#f97316' },
  { icon: ShoppingBag, key: 'purchasing', catKey: 'Operations', color: '#06b6d4' },
  { icon: ShoppingCart, key: 'sales', catKey: 'Sales', color: '#10b981' },
  { icon: Globe, key: 'ecommerce', catKey: 'Sales', color: '#3b82f6' },
  { icon: UserCircle, key: 'customerPortal', catKey: 'Sales', color: '#a78bfa' },
  { icon: Truck, key: 'logistics', catKey: 'Operations', color: '#f59e0b' },
  { icon: Settings, key: 'automation', catKey: 'AI', color: '#64748b' },
  { icon: Database, key: 'dataWarehouse', catKey: 'AI', color: '#22d3ee' },
  { icon: Shield, key: 'compliance', catKey: 'Core', color: '#f43f5e' },
  { icon: Zap, key: 'integrations', catKey: 'Core', color: '#f59e0b' },
];

const moduleTranslations = {
  en: {
    generalLedger: { title: 'General Ledger', description: 'Complete double-entry accounting with multi-company support.' },
    pos: { title: 'Point of Sale', description: 'Modern POS for retail, restaurant, and service businesses.' },
    inventory: { title: 'Inventory', description: 'Real-time stock management across all locations.' },
    manufacturing: { title: 'Manufacturing', description: 'BOM, work orders, and production scheduling.' },
    crm: { title: 'CRM', description: 'Manage your entire sales pipeline and customer relationships.' },
    hr: { title: 'HR', description: 'Complete human resource management system.' },
    payroll: { title: 'Payroll', description: 'Automated salary processing and tax compliance.' },
    attendance: { title: 'Attendance', description: 'Time tracking with biometric and geofence support.' },
    projects: { title: 'Projects', description: 'Gantt, kanban, time tracking, and resource planning.' },
    assets: { title: 'Assets', description: 'Fixed asset management with depreciation tracking.' },
    treasury: { title: 'Treasury', description: 'Cash management, bank reconciliation, and forecasting.' },
    budgeting: { title: 'Budgeting', description: 'Department budgets with approval workflows.' },
    aiAssistant: { title: 'AI Assistant', description: 'Natural language business intelligence and automation.' },
    reports: { title: 'Reports', description: 'Custom report builder with drag-and-drop interface.' },
    warehouse: { title: 'Warehouse', description: 'Advanced WMS with bin management and routing.' },
    purchasing: { title: 'Purchasing', description: 'Purchase orders, vendor management, and RFQ.' },
    sales: { title: 'Sales', description: 'Quotations, orders, invoicing, and sales analytics.' },
    ecommerce: { title: 'E-commerce', description: 'Online store with product catalog and checkout.' },
    customerPortal: { title: 'Customer Portal', description: 'Self-service portal for your customers.' },
    logistics: { title: 'Logistics', description: 'Shipping, tracking, and delivery management.' },
    automation: { title: 'Automation', description: 'Workflow automation with conditional triggers.' },
    dataWarehouse: { title: 'Data Warehouse', description: 'Centralized data hub for business intelligence.' },
    compliance: { title: 'Compliance', description: 'Regulatory compliance and audit management.' },
    integrations: { title: 'Integrations', description: 'Connect with 500+ apps and services via API.' },
  },
  ar: {
    generalLedger: { title: 'دفتر الأستاذ العام', description: 'محاسبة قيود مزدوجة متكاملة مع دعم الشركات المتعددة.' },
    pos: { title: 'نقاط البيع (POS)', description: 'نظام نقاط بيع حديث للتجزئة والمطاعم والخدمات.' },
    inventory: { title: 'إدارة المخزون', description: 'إدارة المخزون لحظياً عبر كافة الفروع والمستودعات.' },
    manufacturing: { title: 'إدارة التصنيع', description: 'قوائم المواد، أوامر الشغل وتخطيط الإنتاج.' },
    crm: { title: 'إدارة العلاقات (CRM)', description: 'إدارة مسار المبيعات بالكامل والتواصل مع العملاء.' },
    hr: { title: 'الموارد البشرية', description: 'نظام متكامل لإدارة وشؤون الموظفين والهياكل.' },
    payroll: { title: 'الرواتب والأجور', description: 'حساب الآلي للرواتب والامتثال الضريبي والبنكي.' },
    attendance: { title: 'الدوام والبصمة', description: 'تتبع الوقت ودعم البصمة والتواجد الجغرافي.' },
    projects: { title: 'المشاريع والمهام', description: 'مخططات جانت، كانبان وتتبع ساعات العمل.' },
    assets: { title: 'الأصول الثابتة', description: 'إدارة الأصول وحساب إهلاكها ومتابعة الصيانة.' },
    treasury: { title: 'الخزينة والنقدية', description: 'إدارة التدفقات النقدية التسويات التنبؤات.' },
    budgeting: { title: 'الموازنة التقديرية', description: 'موازنات الأقسام ودورات موافقة المصروفات.' },
    aiAssistant: { title: 'المساعد الذكي', description: 'ذكاء أعمال تفاعلي وأتمتة الأوامر باللغة الطبيعية.' },
    reports: { title: 'التقارير المخصصة', description: 'منشئ تقارير بالسحب الإفلات مع لوحات تفاعلية.' },
    warehouse: { title: 'إدارة المستودعات', description: 'نظام إدارة مخازن متقدم WMS مع ترقيم الأرفف.' },
    purchasing: { title: 'المشتريات الموردين', description: 'أوامر الشراء، عروض الأسعار وتقييم الموردين.' },
    sales: { title: 'عقود المبيعات', description: 'عروض الأسعار، الفواتير وتحليلات أداء المبيعات.' },
    ecommerce: { title: 'المتاجر الرقمية', description: 'ربط المتجر الإلكتروني بكتالوج المنتجات وسلة الشراء.' },
    customerPortal: { title: 'بوابة خدمة العملاء', description: 'بوابة ذاتية لخدمة ومتابعة العملاء لطلباتهم.' },
    logistics: { title: 'الشحن والشحنات', description: 'إدارة وتتبع الشحنات وسيارات التوصيل.' },
    automation: { title: 'أتمتة سير العمل', description: 'أتمتة المهام بقواعد مشروطة ومحفزات ذكية.' },
    dataWarehouse: { title: 'مستودع البيانات', description: 'مركز البيانات الموحد لتقارير الذكاء المؤسسي.' },
    compliance: { title: 'الحوكمة والامتثال', description: 'إدارة الامتثال اللوائح وسجلات التدقيق.' },
    integrations: { title: 'التكامل الربطي', description: 'الربط المباشر مع أكثر من 500 تطبيق عبر API.' },
  },
};

export const ModulesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { t, language } = useLanguage();

  const currentCats = categoryLabels[language as 'en' | 'ar'] || categoryLabels.en;
  const currentTrans = moduleTranslations[language as 'en' | 'ar'] || moduleTranslations.en;

  const categories = ['All', 'Core', 'Sales', 'Operations', 'People', 'Finance', 'AI'];

  const modules = moduleConfig.map((item) => ({
    ...item,
    title: currentTrans[item.key as keyof typeof currentTrans].title,
    description: currentTrans[item.key as keyof typeof currentTrans].description,
    categoryLabel: currentCats[item.catKey as keyof typeof currentCats] || item.catKey,
  }));

  const filtered = activeCategory === 'All' ? modules : modules.filter((m) => m.catKey === activeCategory);

  return (
    <SectionWrapper id="modules">
      <SectionHeader
        badge={t.modules.badge}
        title={t.modules.title}
        titleHighlight={t.modules.titleHighlight}
        description={t.modules.description}
      />

      {/* Category Filter */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-2 mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {categories.map((catKey) => (
          <motion.button
            key={catKey}
            onClick={() => setActiveCategory(catKey)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeCategory === catKey
                ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentCats[catKey as keyof typeof currentCats] || catKey}
          </motion.button>
        ))}
      </motion.div>

      {/* Modules Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((mod) => (
            <motion.div
              key={mod.key}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card rounded-xl p-5 h-full group cursor-default hover:border-white/20 transition-all duration-500">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${mod.color}12`, border: `1px solid ${mod.color}25` }}
                  >
                    <mod.icon className="w-5 h-5" style={{ color: mod.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white mb-1">{mod.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{mod.description}</p>
                    <span
                      className="inline-block mt-2 px-2 py-0.5 rounded-md text-[10px] font-medium"
                      style={{ backgroundColor: `${mod.color}10`, color: mod.color }}
                    >
                      {mod.categoryLabel}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </SectionWrapper>
  );
};
