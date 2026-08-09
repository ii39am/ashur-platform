export type Language = 'en' | 'ar';

export const translations = {
  en: {
    // Meta & Navbar
    brandName: 'Ashur',
    brandSuffix: ' Platform',
    trustedBadge: 'Trusted by 10,000+ businesses worldwide',
    nav: {
      features: 'Features',
      modules: 'Modules',
      industries: 'Industries',
      analytics: 'Analytics',
      pricing: 'Pricing',
      faq: 'FAQ',
      signIn: 'Sign In',
      startTrial: 'Start Free Trial',
      searchPlaceholder: 'Search or Ctrl+K...',
    },

    // Hero Section
    hero: {
      headlinePart1: 'Run Your',
      headlineHighlight1: 'Entire',
      headlinePart2: 'Business With',
      headlineHighlight2: 'One',
      headlinePart3: 'Platform',
      subtitle:
        'Ashur Platform unifies accounting, inventory, CRM, HR, manufacturing, and 20+ modules into one AI-powered platform. Automate everything. Scale anywhere.',
      ctaPrimary: 'Start Free Trial',
      ctaSecondary: 'Watch Demo',
      stats: {
        businesses: 'Businesses',
        countries: 'Countries',
        uptime: 'Uptime',
        support: 'Support',
      },
      trustedBy: 'TRUSTED BY LEADING ENTERPRISES',
    },

    // Live Dashboard Section
    dashboard: {
      badge: 'Live Dashboard',
      title: 'Your Business,',
      titleHighlight: 'At a Glance',
      description:
        'Experience the power of real-time insights with our intelligent dashboard. Every metric, every chart, updated instantly.',
      kpi: {
        totalRevenue: 'Total Revenue',
        activeOrders: 'Active Orders',
        newCustomers: 'New Customers',
        conversionRate: 'Conversion',
      },
      tabs: {
        sales: 'Sales',
        inventory: 'Inventory',
        invoices: 'Invoices',
        accounting: 'Accounting',
        hr: 'HR',
        projects: 'Projects',
        crm: 'CRM',
        analytics: 'Analytics',
      },
      revenueOverview: 'Revenue Overview',
      recentOrders: 'Recent Orders',
      stockLevels: 'Stock Levels',
      stockDistribution: 'Stock Distribution',
      trends: 'Performance Trends',
      distribution: 'Distribution',
      statuses: {
        completed: 'Completed',
        processing: 'Processing',
        shipped: 'Shipped',
        pending: 'Pending',
      },
      categories: {
        electronics: 'Electronics',
        clothing: 'Clothing',
        food: 'Food',
        furniture: 'Furniture',
        other: 'Other',
      },
      months: {
        jan: 'Jan',
        feb: 'Feb',
        mar: 'Mar',
        apr: 'Apr',
        may: 'May',
        jun: 'Jun',
        jul: 'Jul',
        aug: 'Aug',
      },
    },

    // Features Section
    features: {
      badge: '20+ Modules',
      title: 'Everything You Need to',
      titleHighlight: 'Run Your Business',
      description:
        'From accounting to AI, every tool your business needs in one unified platform. No more juggling multiple apps.',
      items: {
        accounting: { title: 'Accounting', description: 'Double-entry bookkeeping, automated reconciliation, and real-time financial reporting.' },
        pos: { title: 'Point of Sale', description: 'Lightning-fast POS with offline mode, multi-store support, and instant sync.' },
        inventory: { title: 'Inventory', description: 'Real-time stock tracking, automated reordering, and multi-warehouse management.' },
        manufacturing: { title: 'Manufacturing', description: 'Bill of materials, work orders, production planning, and quality control.' },
        crm: { title: 'CRM', description: 'Full pipeline management, lead scoring, email automation, and activity tracking.' },
        hr: { title: 'HR Management', description: 'Employee lifecycle, recruitment, onboarding, performance reviews, and org charts.' },
        payroll: { title: 'Payroll', description: 'Automated salary calculation, tax compliance, bank transfers, and pay slips.' },
        attendance: { title: 'Attendance', description: 'Biometric integration, geofencing, shift management, and overtime tracking.' },
        projects: { title: 'Projects', description: 'Gantt charts, kanban boards, time tracking, milestones, and resource allocation.' },
        assets: { title: 'Assets', description: 'Asset lifecycle management, depreciation tracking, and maintenance scheduling.' },
        finance: { title: 'Finance', description: 'Multi-currency, budgeting, cost centers, and consolidated financial statements.' },
        budget: { title: 'Budget', description: 'Department budgets, expense approval workflows, and variance analysis.' },
        ai: { title: 'AI Assistant', description: 'Natural language queries, predictive analytics, smart suggestions, and automation.' },
        reports: { title: 'Reports', description: 'Custom report builder, scheduled reports, dashboards, and data visualization.' },
        warehouse: { title: 'Warehouse', description: 'Bin locations, pick/pack/ship, barcode scanning, and route optimization.' },
        purchasing: { title: 'Purchasing', description: 'Purchase orders, vendor management, RFQ, and automated procurement.' },
        sales: { title: 'Sales', description: 'Quotations, sales orders, commissions, territory management, and forecasting.' },
        ecommerce: { title: 'E-commerce', description: 'Online storefront, product catalog, payment gateway, and order fulfillment.' },
        customerPortal: { title: 'Customer Portal', description: 'Self-service portal for customers to track orders, invoices, and support tickets.' },
        vendorPortal: { title: 'Vendor Portal', description: 'Supplier collaboration, PO acknowledgment, invoice submission, and grading.' },
      },
    },

    // AI Assistant Section
    ai: {
      badge: 'AI-Powered',
      title: 'Meet Your AI',
      titleHighlight: 'Business Assistant',
      description:
        'Ask anything about your business. Generate reports, forecast trends, detect anomalies — all with natural language.',
      online: 'Online & Ready',
      inputPlaceholder: 'Ask Ashur AI anything (e.g. "Forecast Q4 revenue")...',
      prompts: {
        revenue: 'Show Q3 revenue breakdown by region.',
        inventory: 'Which products should we restock this week?',
        forecast: 'Forecast Q4 sales based on current velocity.',
        po: 'Generate purchase order draft for top vendors.',
      },
    },

    // Timeline Section
    timeline: {
      badge: 'Workflow',
      title: 'From Lead to',
      titleHighlight: 'Revenue',
      description:
        'Watch how Ashur ERP automates your entire business workflow — from the first lead to financial reporting.',
    },

    // Industries Section
    industries: {
      badge: 'Industries',
      title: 'Built for Every',
      titleHighlight: 'Industry',
      description:
        'From healthcare to hospitality, Ashur ERP adapts to your industry with pre-configured workflows and compliance modules.',
    },

    // Modules Section
    modules: {
      badge: 'Modular Architecture',
      title: '24+ Powerful',
      titleHighlight: 'Modules',
      description:
        'Pick and choose the modules you need. Scale as you grow. Every module integrates seamlessly with the rest.',
    },

    // Analytics Section
    analytics: {
      badge: 'Analytics',
      title: 'Data-Driven',
      titleHighlight: 'Decisions',
      description:
        'Beautiful real-time analytics that turn raw data into actionable insights. Every chart tells a story.',
      revenueVsExpense: 'Revenue vs Expenses vs Profit',
      budgetAllocation: 'Budget Allocation',
      departmentPerformance: 'Department Performance',
      heatmap: 'Transaction Heatmap',
      globalRevenue: 'Global HQ & Revenue Network',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      departments: {
        sales: 'Sales',
        marketing: 'Marketing',
        engineering: 'Engineering',
        support: 'Support',
        operations: 'Operations',
        finance: 'Finance',
        product: 'Product',
        hr: 'HR',
      },
      regions: {
        northAmerica: 'North America',
        europe: 'Europe',
        asiaPacific: 'Asia Pacific',
        middleEast: 'Middle East',
        africa: 'Africa',
        southAmerica: 'South America',
      },
    },

    // Integrations Section
    integrations: {
      badge: 'Integrations',
      title: 'Connect With',
      titleHighlight: '500+ Apps',
      description:
        'Seamlessly integrate with the tools your team already uses. Ashur ERP plays well with everyone.',
    },

    // Testimonials Section
    testimonials: {
      badge: 'Testimonials',
      title: 'Loved by',
      titleHighlight: '10,000+ Teams',
      description:
        "Don't just take our word for it. Here's what our customers have to say about Ashur ERP.",
    },

    // Pricing Section
    pricing: {
      badge: 'Pricing',
      title: 'Simple, Transparent',
      titleHighlight: 'Pricing',
      description:
        'No hidden fees. No surprises. Choose the plan that fits your business.',
      monthly: 'Monthly',
      annual: 'Annual',
      save: 'Save 20%',
      perUser: '/user/mo',
      mostPopular: 'Most Popular',
      featureComparison: 'Feature Comparison',
    },

    // FAQ Section
    faq: {
      badge: 'FAQ',
      title: 'Frequently Asked',
      titleHighlight: 'Questions',
      description:
        "Everything you need to know about Ashur ERP. Can't find what you're looking for? Contact our support team.",
    },

    // Footer
    footer: {
      ctaTitle: 'Ready to Transform Your Business?',
      ctaSubtitle:
        'Join 10,000+ businesses that trust Ashur ERP. Start your free trial today.',
      ctaButton: 'Start Free Trial',
      ctaDemo: 'Schedule Demo',
      tagline:
        'The most powerful AI-driven ERP platform for modern businesses. Unify, automate, and scale.',
      newsletterTitle: 'Stay Updated',
      newsletterDesc:
        'Get product updates, tips, and news delivered to your inbox.',
      newsletterPlaceholder: 'Enter your email',
      subscribe: 'Subscribe',
      subscribed: '✓ Subscribed!',
      rights: 'Ashur ERP. All rights reserved.',
    },

    // Command Palette
    command: {
      placeholder: 'Type a command or search...',
      quickActions: 'Quick Actions',
      modules: 'Platform Modules',
      aiPrompts: 'AI Actions',
      noResults: 'No matching results found.',
    },
  },

  ar: {
    // Meta & Navbar
    brandName: 'منصة ',
    brandSuffix: 'آشور',
    trustedBadge: 'موثوق به من أكثر من 10,000 شركة حول العالم',
    nav: {
      features: 'المميزات',
      modules: 'الوحدات',
      industries: 'القطاعات',
      analytics: 'التحليلات',
      pricing: 'الأسعار',
      faq: 'الأسئلة الشائعة',
      signIn: 'تسجيل الدخول',
      startTrial: 'ابدأ التجربة المجانية',
      searchPlaceholder: 'بحث أو Ctrl+K...',
    },

    // Hero Section
    hero: {
      headlinePart1: 'إدارة أعمالك',
      headlineHighlight1: 'بالكامل',
      headlinePart2: 'من خلال منصة',
      headlineHighlight2: 'واحدة',
      headlinePart3: 'مبتكرة',
      subtitle:
        'منصة آشور تجمع المحاسبة، المخزون، إدارة العملاء، الموارد البشرية، والتصنيع وأكثر من 20 وحدة في نظام واحد مدعوم بالذكاء الاصطناعي.',
      ctaPrimary: 'ابدأ التجربة المجانية',
      ctaSecondary: 'شاهد العرض التوضيحي',
      stats: {
        businesses: 'شركة معتمدة',
        countries: 'دولة حول العالم',
        uptime: 'نسبة الجاهزية',
        support: 'دعم على مدار الساعة',
      },
      trustedBy: 'موثوق به من قبل كبرى الشركات العالمية',
    },

    // Live Dashboard Section
    dashboard: {
      badge: 'لوحة تحكم مباشرة',
      title: 'أعمالك التجارية،',
      titleHighlight: 'بنظرة واحدة',
      description:
        'استمتع بقوة التحليلات الفورية عبر لوحة تحكم ذكية تحدّث المؤشرات والرسوم البيانية لحظياً.',
      kpi: {
        totalRevenue: 'إجمالي الإيرادات',
        activeOrders: 'الطلبات النشطة',
        newCustomers: 'عملاء جدد',
        conversionRate: 'معدل التحويل',
      },
      tabs: {
        sales: 'المبيعات',
        inventory: 'المخزون',
        invoices: 'الفواتير',
        accounting: 'المحاسبة',
        hr: 'الموارد البشرية',
        projects: 'المشاريع',
        crm: 'إدارة العملاء',
        analytics: 'التحليلات',
      },
      revenueOverview: 'نظرة عامة على الإيرادات',
      recentOrders: 'أحدث الطلبات',
      stockLevels: 'مستويات المخزون',
      stockDistribution: 'توزيع المخزون',
      trends: 'اتجاهات الأداء',
      distribution: 'التوزيع',
      statuses: {
        completed: 'مكتمل',
        processing: 'قيد المعالجة',
        shipped: 'تم الشحن',
        pending: 'معلق',
      },
      categories: {
        electronics: 'إلكترونيات',
        clothing: 'ملابس',
        food: 'أغذية',
        furniture: 'أثاث',
        other: 'أخرى',
      },
      months: {
        jan: 'يناير',
        feb: 'فبراير',
        mar: 'مارس',
        apr: 'أبريل',
        may: 'مايو',
        jun: 'يونيو',
        jul: 'يوليو',
        aug: 'أغسطس',
      },
    },

    // Features Section
    features: {
      badge: '+20 وحدة متكاملة',
      title: 'كل ما تحتاجه لـ',
      titleHighlight: 'إدارة وتنمية أعمالك',
      description:
        'من المحاسبة المتقدمة إلى الذكاء الاصطناعي، جميع الأدوات التي تحتاجها مؤسستك في منصة موحدة بدلاً من التطبيقات المشتتة.',
      items: {
        accounting: { title: 'المحاسبة المالية', description: 'قيود مزدوجة، تسوية بنكية آلية، وتقارير مالية فورية بدقة عالية.' },
        pos: { title: 'نقاط البيع (POS)', description: 'نظام نقاط بيع فائق السرعة يعمل بدون إنترنت مع دعم الفروع الممتدة.' },
        inventory: { title: 'إدارة المخزون', description: 'تتبع حركة المخزون لحظياً، أتمتة جرد المخازن والتنبيه بالنواقص.' },
        manufacturing: { title: 'إدارة التصنيع', description: 'قوائم المواد، أوامر الإنتاج، تخطيط الاحتياجات، ومراقبة الجودة.' },
        crm: { title: 'إدارة العملاء (CRM)', description: 'متابعة مسار المبيعات، تقييم الفرص البيعية، وأتمتة التواصل والرسائل.' },
        hr: { title: 'الموارد البشرية', description: 'إدارة دورة حياة الموظف، التوظيف، التقييم السنوي والهياكل التنظيمية.' },
        payroll: { title: 'مسير الرواتب', description: 'حساب الآلي للرواتب والبدلات، الاستقطاعات والتحويلات البنكية المباشرة.' },
        attendance: { title: 'الحضور والانصراف', description: 'ربط أجهزة البصمة، التتبع الجغرافي، إدارة الورديات والساعات الإضافية.' },
        projects: { title: 'إدارة المشاريع', description: 'مخططات جانت، لوحات كانبان، تتبع ساعات العمل وإدارة الموارد.' },
        assets: { title: 'الأصول الثابتة', description: 'إدارة دورة حياة الأصول، حساب الهلاك الآلي، وجداول الصيانة الدورية.' },
        finance: { title: 'الإدارة المالية', description: 'تعدد العملات، الميزانيات التقديرية، مراكز التكلفة والتقارير المجمعة.' },
        budget: { title: 'الموازنات التقديرية', description: 'موازنات الأقسام، موافقات المصروفات، وتتبع الانحرافات المالية.' },
        ai: { title: 'مساعد الذكاء الاصطناعي', description: 'استعلامات باللغة الطبيعية، تحليلات تنبؤية وأتمتة للمهام الروتينية.' },
        reports: { title: 'منشئ التقارير', description: 'بناء تقارير مخصصة، تقارير دورية مجدولة، ولوحات قياس تفاعلية.' },
        warehouse: { title: 'إدارة المستودعات', description: 'ترقيم الأرفف، التجهيز والتعبئة، الباركود، وتحسين مسارات التخزين.' },
        purchasing: { title: 'المشتريات والموردين', description: 'أوامر الشراء، طلبات عروض الأسعار، وتقييم أداء الموردين.' },
        sales: { title: 'المبيعات والعقود', description: 'عروض الأسعار، أوامر البيع، عمولات المبيعات والتوقعات البيعية.' },
        ecommerce: { title: 'المتجر الإلكتروني', description: 'ربط المتجر الرقمي، كتالوج المنتجات، بوابات الدفع وشحن الطلبات.' },
        customerPortal: { title: 'بوابة العملاء', description: 'بوابة خدمة ذاتية للعملاء لمتابعة الطلبات، الفواتير وتذاكر الدعم.' },
        vendorPortal: { title: 'بوابة الموردين', description: 'منصة تواصل الموردين، تأكيد أوامر الشراء، ورفع الفواتير الإلكترونية.' },
      },
    },

    // AI Assistant Section
    ai: {
      badge: 'مساعد الذكاء الاصطناعي',
      title: 'تعرف على مساعد',
      titleHighlight: 'آشور الذكي',
      description:
        'اطرح أي سؤال حول أداء عملك، أنشئ التقارير الفورية، وتوقع المبيعات بدقة عالية عبر الأوامر النصية الطبيعية.',
      online: 'متصل ومستعد',
      inputPlaceholder: 'اسأل مساعد آشور الذكي (مثال: "توقع إيرادات الربع الرابع")...',
      prompts: {
        revenue: 'اعرض توزيع إيرادات الربع الثالث حسب المنطقة.',
        inventory: 'ما هي المنتجات التي تتطلب إعادة طلب هذا الأسبوع؟',
        forecast: 'توقع مبيعات الربع الرابع بناءً على الأداء الحالي.',
        po: 'أنشئ مسودة أمر شراء لأبرز الموردين.',
      },
    },

    // Timeline Section
    timeline: {
      badge: 'دورة العمل المتكاملة',
      title: 'من الفرصة البيعية إلى',
      titleHighlight: 'التحصيل والأرباح',
      description:
        'شاهد كيف يقوم نظام آشور مؤتمت بتنفيذ جميع مراحل أعمالك بدءاً من العميل المحتمل وحتى التقرير المالي النهائي.',
    },

    // Industries Section
    industries: {
      badge: 'القطاعات',
      title: 'مصمم خصيصاً لكل',
      titleHighlight: 'قطاع تجاري',
      description:
        'من الرعاية الصحية إلى التجزئة والمقاولات، تتكيف منصة آشور مع متطلبات قطاعك بفضل نماذج العمل المجهزة مسبقاً.',
    },

    // Modules Section
    modules: {
      badge: 'بنية معيارية',
      title: '+24 وحدة',
      titleHighlight: 'قوية ومتكاملة',
      description:
        'اختر الوحدات التي تحتاجها الآن وتوسع بسهولة مع نمو مؤسستك. تتكامل جميع الوحدات تلقائياً ودون مجهود.',
    },

    // Analytics Section
    analytics: {
      badge: 'التحليلات الذكية',
      title: 'قرارات قائمة على',
      titleHighlight: 'البيانات الدقيقة',
      description:
        'تحليلات بيانية تفاعلية فورية تحول البيانات الخام إلى رؤى استراتيجية قابلة للتنفيذ.',
      revenueVsExpense: 'الإيرادات مقابل المصروفات والأرباح',
      budgetAllocation: 'توزيع الميزانية',
      departmentPerformance: 'أداء الأقسام',
      heatmap: 'خريطة المعاملات الحرارية',
      globalRevenue: 'شبكة المقرات العالمية والإيرادات',
      days: ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
      departments: {
        sales: 'المبيعات',
        marketing: 'التسويق',
        engineering: 'الهندسة',
        support: 'الدعم الفني',
        operations: 'العمليات',
        finance: 'المالية',
        product: 'المنتجات',
        hr: 'الموارد البشرية',
      },
      regions: {
        northAmerica: 'أمريكا الشمالية',
        europe: 'أوروبا',
        asiaPacific: 'آسيا والمحيط الهادئ',
        middleEast: 'الشرق الأوسط',
        africa: 'أفريقيا',
        southAmerica: 'أمريكا الجنوبية',
      },
    },

    // Integrations Section
    integrations: {
      badge: 'التكامل الربطي',
      title: 'ربط مباشر مع',
      titleHighlight: '+500 تطبيق',
      description:
        'تتكامل منصة آشور بسلاسة مع كافة الأنظمة والتطبيقات التي تستخدمها فرق عملك يومياً.',
    },

    // Testimonials Section
    testimonials: {
      badge: 'آراء العملاء',
      title: 'يحظى بثقة',
      titleHighlight: '+10,000 فريق عمل',
      description:
        'استمع إلى تجارب قادة الأعمال وكبار التنفيذيين الذين غيّرت منصة آشور طريقة إدارتهم لمؤسساتهم.',
    },

    // Pricing Section
    pricing: {
      badge: 'خطط الأسعار',
      title: 'أسعار واضحة و',
      titleHighlight: 'شفافة',
      description:
        'بدون أي رسوم خفية. اختر الخطة المناسبة لحجم ونشاط مؤسستك.',
      monthly: 'شهري',
      annual: 'سنوي',
      save: 'خصم 20%',
      perUser: '/مستخدم/شهرياً',
      mostPopular: 'الأكثر شعبية',
      featureComparison: 'مقارنة الميزات',
    },

    // FAQ Section
    faq: {
      badge: 'الأسئلة الشائعة',
      title: 'كل ما تريد معرفته عن',
      titleHighlight: 'منصة آشور',
      description:
        'إجابات شاملة لجميع استفساراتك حول المنصة والتركيب والأمان والدعم الفني.',
    },

    // Footer
    footer: {
      ctaTitle: 'هل أنت جاهز لتطوير أعمالك؟',
      ctaSubtitle:
        'انضم إلى أكثر من 10,000 شركة تعتمد على منصة آشور يومياً. ابدأ تجربتك المجانية الآن.',
      ctaButton: 'ابدأ التجربة المجانية',
      ctaDemo: 'احجز عرضاً توضيحياً',
      tagline:
        'منصة آشور الأكثر تطوراً بالذكاء الاصطناعي للمؤسسات الحديثة. أتمتة كاملة، توحيد للعمليات، وتوسع بلا حدود.',
      newsletterTitle: 'ابقَ على اطلاع',
      newsletterDesc:
        'احصل على أحدث التحديثات والمقالات التقنية مباشرة في بريدك الإلكتروني.',
      newsletterPlaceholder: 'أدخل بريدك الإلكتروني',
      subscribe: 'اشترك الآن',
      subscribed: '✓ تم الاشتراك بنجاح!',
      rights: 'منصة آشور. جميع الحقوق محفوظة.',
    },

    // Command Palette
    command: {
      placeholder: 'اكتب أمراً أو ابحث عن وحدة...',
      quickActions: 'الإجراءات السريعة',
      modules: 'وحدات النظام',
      aiPrompts: 'أوامر الذكاء الاصطناعي',
      noResults: 'لم يتم العثور على نتائج مطابقة.',
    },
  },
};
