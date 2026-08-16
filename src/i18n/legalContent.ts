import type { LegalDocumentId } from '../config/legal';

export type LegalLanguage = 'en' | 'ar';
export interface LegalSection { id: string; title: string; paragraphs: string[]; bullets?: string[] }
export interface LegalCopy {
  title: string;
  shortTitle: string;
  summary: string;
  sections: LegalSection[];
}

export const legalUi = {
  en: {
    draft: 'Legal draft — not approved or effective',
    published: 'Published · internally approved',
    notice: 'This document is a working draft for review by qualified Iraqi counsel. It is not published contractual guidance and must not be relied on as final legal advice.',
    publishedNotice: 'Internally approved by the Ashur Platform owner for initial publication. This document is not represented as reviewed or approved by qualified Iraqi legal counsel.',
    contents: 'On this page',
    print: 'Print draft',
    printPublished: 'Print policy',
    back: 'Return home',
    draftMetadata: 'Version and effective date have not been approved.',
    publishedMetadata: (version: string, effective: string, updated: string) => `Version ${version} · Effective ${effective} · Last updated ${updated}`,
  },
  ar: {
    draft: 'مسودة قانونية — غير معتمدة وغير نافذة',
    published: 'منشورة · معتمدة داخليًا',
    notice: 'هذه الوثيقة مسودة عمل لمراجعتها من محامٍ عراقي مؤهل. وهي ليست شروطًا تعاقدية منشورة ولا يجوز الاعتماد عليها بوصفها استشارة قانونية نهائية.',
    publishedNotice: 'اعتمد مالك منصة آشور هذه الوثيقة داخليًا للنشر الأولي. ولا يُدّعى أنها خضعت لمراجعة أو اعتماد مستشار قانوني عراقي مؤهل.',
    contents: 'محتويات الصفحة',
    print: 'طباعة المسودة',
    printPublished: 'طباعة الوثيقة',
    back: 'العودة إلى الرئيسية',
    draftMetadata: 'لم يُعتمد رقم الإصدار أو تاريخ النفاذ بعد.',
    publishedMetadata: (version: string, effective: string, updated: string) => `الإصدار ${version} · تاريخ النفاذ ${effective} · آخر تحديث ${updated}`,
  },
} as const;

export const legalContent: Record<LegalLanguage, Record<LegalDocumentId, LegalCopy>> = {
  en: {
    terms: {
      title: 'Terms of Service', shortTitle: 'Terms',
      summary: 'Rules for accessing Ashur Platform accounts, websites, software, and related services.',
      sections: [
        { id: 'scope', title: '1. Scope and operator', paragraphs: ['These Terms govern use of accounts, websites, software, and related services offered under the public trading name Ashur Platform. No unconfirmed legal-entity identity, registration number, address, or contact channel is stated in this version.'] },
        { id: 'eligibility', title: '2. Eligibility and accounts', paragraphs: ['Users must have legal capacity to create an account and authority to act for any represented business. Account details must be accurate and credentials kept confidential.'] },
        { id: 'service', title: '3. Service access', paragraphs: ['Available functions, plans, support levels, and service limits are only those expressly confirmed in the product or an executed order. Ashur must not be described as providing unavailable features, uninterrupted operation, or guaranteed business outcomes.'] },
        { id: 'acceptable-use', title: '4. Acceptable use', paragraphs: ['Users must not misuse the service, interfere with security, attempt unauthorized access, upload unlawful material, or use the service to violate another person’s rights. Account restrictions should be proportionate and subject to applicable law.'] },
        { id: 'customer-data', title: '5. Customer data and responsibilities', paragraphs: ['Customers remain responsible for the accuracy and lawful collection of data they submit. Roles, instructions, security responsibilities, export options, and deletion procedures require confirmation in product and commercial documentation.'] },
        { id: 'intellectual-property', title: '6. Intellectual property', paragraphs: ['Ashur branding, software, and documentation remain subject to the rights of their respective owner. Creating an account or using the service does not transfer ownership or grant rights beyond the access expressly provided.'] },
        { id: 'fees', title: '7. Fees, suspension, and termination', paragraphs: ['No payment, subscription, renewal, or paid-plan terms apply through the current website because checkout is not enabled. Any future commercial terms must be presented and accepted separately before a charge.'] },
        { id: 'liability', title: '8. Warranties and liability', paragraphs: ['This version does not state unconfirmed warranty exclusions, liability caps, governing law, or dispute forum. Rights that cannot lawfully be excluded remain unaffected.'] },
        { id: 'changes-contact', title: '9. Changes and contact', paragraphs: ['Material changes will receive a new version and effective date, with notice and renewed acceptance where legally or operationally required. A contact address will be displayed only after it has been verified.'] },
      ],
    },
    privacy: {
      title: 'Privacy Policy', shortTitle: 'Privacy',
      summary: 'How Ashur Platform handles personal data for the website, authentication, onboarding, support, and related services.',
      sections: [
        { id: 'controller', title: '1. Who is responsible', paragraphs: ['Ashur Platform is the public trading name used for the service described by this policy. No unconfirmed legal-entity identity or privacy email address is published in this version. Future customer deployments may require separate controller and processor terms.'] },
        { id: 'collection', title: '2. Information collected', paragraphs: ['Current onboarding may collect name, email, phone number, business details, preferred language, awareness source, marketing choice, legal-acceptance records, authentication status, and limited transactional-email delivery state. Authentication providers also process technical session and security data.'], bullets: ['Passwords and OTP codes are handled by the authentication provider and are not stored in the profile table.', 'Payment, licensing, installer telemetry, and production analytics practices are not yet confirmed and are not represented here.'] },
        { id: 'purposes', title: '3. Why information is used', paragraphs: ['Information is used to create and secure accounts, record consent, provide requested services, support users, protect the service, and send essential transactional messages. Marketing messages require a separate optional choice that can be changed later.'] },
        { id: 'sharing', title: '4. Service providers and disclosures', paragraphs: ['Supabase is used for authentication and backend services, and Resend is used for transactional email when configured. Hosting and service providers process only the information needed for their functions. Information may also be disclosed where lawfully required.'] },
        { id: 'retention', title: '5. Retention', paragraphs: ['Information is retained only while reasonably needed for account administration, security, legal obligations, disputes, and user requests. Immutable legal-acceptance records may be retained separately as evidence of the version accepted.'] },
        { id: 'security', title: '6. Security', paragraphs: ['Ashur uses measures designed to protect information, including authenticated access and row-level database controls. No system is completely secure.'] },
        { id: 'rights', title: '7. Choices and requests', paragraphs: ['Users can request review or correction of profile information and can change marketing consent. Other access, deletion, objection, portability, or complaint rights apply where required by applicable law and subject to identity verification.'] },
        { id: 'cookies', title: '8. Cookies, children, and transfers', paragraphs: ['The current service uses storage required for authentication and language preference. This policy does not make unconfirmed claims about advertising cookies, use by children, or specific international-transfer mechanisms.'] },
        { id: 'changes-contact', title: '9. Changes and contact', paragraphs: ['Privacy changes will be versioned, dated, and communicated proportionately. A privacy contact address will be displayed only after it has been verified.'] },
      ],
    },
    trial: {
      title: 'Trial and Download Policy', shortTitle: 'Trial & downloads',
      summary: 'Draft conditions for accessing installers and evaluating Ashur software when real builds and trial terms are configured.',
      sections: [
        { id: 'availability', title: '1. Availability', paragraphs: ['No installer, trial duration, supported platform, file metadata, or licensing entitlement is currently confirmed. This draft does not grant a trial or promise availability. Download controls must remain disabled until real builds and approved terms exist.'] },
        { id: 'access', title: '2. Account requirements', paragraphs: ['A future protected download may require an authenticated, email-verified account with a completed profile and acceptance of the applicable trial policy. Website gating alone is not license enforcement.'] },
        { id: 'installation', title: '3. Downloads and installation', paragraphs: ['Users should select a build manually, verify published system requirements and checksums, and follow approved installation guidance. Downloads must never begin automatically. Private installers require server-authorized short-lived links.'] },
        { id: 'evaluation', title: '4. Evaluation use', paragraphs: ['The permitted evaluation purpose, users, devices, duration, feature limits, data handling, and conversion path must be confirmed before launch. Repeated-trial prevention must not be claimed without a real server-side licensing system.'] },
        { id: 'security', title: '5. Security and updates', paragraphs: ['Installers should come only from an authorized Ashur channel. Release notes, signatures, checksums, update support, vulnerability reporting, and end-of-support handling must match the released software.'] },
        { id: 'expiry', title: '6. Expiry and removal', paragraphs: ['The behavior after a trial ends—including access, export, deletion, uninstalling, and purchase options—remains undecided. The final policy must explain this behavior before a trial begins.'] },
        { id: 'liability-contact', title: '7. Support and legal terms', paragraphs: ['Support scope, warranties, liability, governing law, and contact details require approval and must align with the Terms of Service. Mandatory rights remain unaffected.'] },
      ],
    },
    refunds: {
      title: 'Refund Policy', shortTitle: 'Refunds',
      summary: 'Draft framework for cancellations and refunds if Ashur later enables paid plans or purchases.',
      sections: [
        { id: 'status', title: '1. Current status', paragraphs: ['Ashur does not currently expose a configured checkout in this website. No payment method, currency, tax treatment, billing interval, renewal rule, or refund entitlement is represented by this draft.'] },
        { id: 'scope', title: '2. Scope', paragraphs: ['The final policy must identify covered products, purchasers, channels, territories, and the contracting seller. Purchases made through a third-party marketplace may be governed by that marketplace’s process where legally permitted.'] },
        { id: 'eligibility', title: '3. Refund eligibility', paragraphs: ['Eligibility periods, exclusions, partial refunds, service defects, duplicate charges, non-refundable items, and evidence requirements are business and legal decisions still awaiting approval. Mandatory consumer rights must not be restricted.'] },
        { id: 'requests', title: '4. Requests and processing', paragraphs: ['The final policy must provide a verified support channel, required request details, acknowledgement time, decision process, original-payment-method treatment, and realistic processing timelines. Sensitive payment credentials must never be requested by email.'] },
        { id: 'cancellation', title: '5. Cancellation and renewal', paragraphs: ['Cancellation timing, renewal behavior, access through a paid period, downgrade consequences, and data export must match the payment provider and Terms of Service. No automatic-renewal claim should appear until implemented and approved.'] },
        { id: 'disputes', title: '6. Disputes and contact', paragraphs: ['Chargeback handling, complaints, governing law, and dispute resolution require Iraqi counsel review. The legal seller and dedicated billing contact must be confirmed before publication.'] },
      ],
    },
  },
  ar: {
    terms: {
      title: 'شروط الاستخدام', shortTitle: 'الشروط',
      summary: 'قواعد الوصول إلى حسابات منصة آشور وموقعها وبرامجها والخدمات المرتبطة بها.',
      sections: [
        { id: 'scope', title: '1. النطاق والجهة المشغلة', paragraphs: ['تنظم هذه الشروط استخدام الحسابات والموقع والبرامج والخدمات المرتبطة المقدمة بالاسم التجاري العام «منصة آشور». ولا يتضمن هذا الإصدار هوية كيان قانوني أو رقم تسجيل أو عنوانًا أو قناة تواصل غير مؤكدة.'] },
        { id: 'eligibility', title: '2. الأهلية والحسابات', paragraphs: ['يجب أن يتمتع المستخدم بالأهلية القانونية لإنشاء الحساب وأن تكون لديه صلاحية تمثيل أي منشأة يتصرف باسمها. ويلتزم بتقديم بيانات صحيحة والمحافظة على سرية بيانات الدخول.'] },
        { id: 'service', title: '3. الوصول إلى الخدمة', paragraphs: ['تقتصر الوظائف والخطط ومستويات الدعم والحدود على ما يُعتمد صراحة في المنتج أو في اتفاق نافذ. ولا يجوز وصف آشور بأنها توفر مزايا غير متاحة أو تشغيلًا بلا انقطاع أو نتائج تجارية مضمونة.'] },
        { id: 'acceptable-use', title: '4. الاستخدام المقبول', paragraphs: ['لا يجوز إساءة استخدام الخدمة أو تعطيل أمنها أو محاولة الوصول غير المصرح به أو رفع محتوى غير مشروع أو انتهاك حقوق الغير. وينبغي أن تكون قيود الحساب متناسبة ومتوافقة مع القانون الواجب التطبيق.'] },
        { id: 'customer-data', title: '5. بيانات العميل ومسؤولياته', paragraphs: ['يبقى العميل مسؤولًا عن دقة البيانات التي يقدمها ومشروعية جمعها. وتحتاج الأدوار والتعليمات والمسؤوليات الأمنية وخيارات التصدير والحذف إلى تأكيد في وثائق المنتج والتعاقد.'] },
        { id: 'intellectual-property', title: '6. الملكية الفكرية', paragraphs: ['تبقى علامة آشور وبرامجها ووثائقها خاضعة لحقوق أصحابها. ولا يؤدي إنشاء الحساب أو استخدام الخدمة إلى نقل الملكية أو منح حقوق تتجاوز الوصول المقدم صراحة.'] },
        { id: 'fees', title: '7. الرسوم والتعليق والإنهاء', paragraphs: ['لا تسري عبر الموقع الحالي شروط دفع أو اشتراك أو تجديد أو خطط مدفوعة لأن الدفع غير مفعّل. ويجب عرض أي شروط تجارية مستقبلية وقبولها بصورة منفصلة قبل تحصيل أي مبلغ.'] },
        { id: 'liability', title: '8. الضمانات والمسؤولية', paragraphs: ['لا يتضمن هذا الإصدار استثناءات ضمان أو حدود مسؤولية أو قانونًا مختصًا أو جهة فصل غير مؤكدة. وتبقى الحقوق التي لا يجوز استبعادها قانونًا نافذة.'] },
        { id: 'changes-contact', title: '9. التعديلات والتواصل', paragraphs: ['سيُخصص إصدار وتاريخ نفاذ جديدان للتغييرات الجوهرية، مع الإشعار وتجديد القبول عند الحاجة القانونية أو التشغيلية. ولن تُعرض قناة تواصل إلا بعد التحقق منها.'] },
      ],
    },
    privacy: {
      title: 'سياسة الخصوصية', shortTitle: 'الخصوصية',
      summary: 'توضح كيفية تعامل منصة آشور مع البيانات الشخصية في الموقع والمصادقة والتسجيل والدعم والخدمات المرتبطة.',
      sections: [
        { id: 'controller', title: '1. الجهة المسؤولة', paragraphs: ['منصة آشور هي الاسم التجاري العام المستخدم للخدمة التي تصفها هذه السياسة. ولا يُنشر في هذا الإصدار اسم كيان قانوني أو عنوان بريد للخصوصية غير مؤكد. وقد تتطلب عمليات العملاء المستقبلية شروطًا منفصلة لأدوار المتحكم والمعالج.'] },
        { id: 'collection', title: '2. المعلومات التي تُجمع', paragraphs: ['قد يجمع التسجيل الحالي الاسم والبريد ورقم الهاتف وبيانات النشاط واللغة المفضلة ومصدر التعرف على آشور وخيار التسويق وسجلات القبول القانوني وحالة المصادقة وحالة محدودة لتسليم الرسائل التشغيلية. كما يعالج مزود المصادقة بيانات تقنية للجلسة والأمن.'], bullets: ['يتولى مزود المصادقة كلمات المرور ورموز التحقق، ولا تُخزن في جدول الملف الشخصي.', 'لم تُعتمد بعد ممارسات الدفع والترخيص وقياس استخدام المثبت والتحليلات الإنتاجية، ولا تقدم هذه السياسة ادعاءات بشأنها.'] },
        { id: 'purposes', title: '3. أغراض الاستخدام', paragraphs: ['تُستخدم المعلومات لإنشاء الحساب وتأمينه وتسجيل الموافقات وتقديم الخدمات المطلوبة ودعم المستخدم وحماية الخدمة وإرسال الرسائل التشغيلية الضرورية. وتتطلب الرسائل التسويقية خيارًا منفصلًا واختياريًا يمكن تغييره لاحقًا.'] },
        { id: 'sharing', title: '4. مزودو الخدمة والإفصاح', paragraphs: ['تُستخدم Supabase للمصادقة وخدمات الخلفية، وتُستخدم Resend للرسائل التشغيلية عند تهيئتها. ولا يعالج مزودو الخدمة إلا المعلومات اللازمة لأداء وظائفهم. وقد يجري الإفصاح أيضًا عندما يوجبه القانون بصورة مشروعة.'] },
        { id: 'retention', title: '5. الاحتفاظ', paragraphs: ['تُحتفظ بالمعلومات فقط للمدة اللازمة بصورة معقولة لإدارة الحساب والأمن والالتزامات القانونية والنزاعات وطلبات المستخدم. وقد يُحتفظ بسجلات القبول القانوني غير القابلة للتعديل بصورة مستقلة لإثبات الإصدار المقبول.'] },
        { id: 'security', title: '6. الأمن', paragraphs: ['تستخدم آشور تدابير مصممة لحماية المعلومات، ومنها الوصول الموثق وضوابط مستوى الصف في قاعدة البيانات. ولا يوجد نظام آمن بالكامل.'] },
        { id: 'rights', title: '7. الخيارات والطلبات', paragraphs: ['يمكن للمستخدم طلب مراجعة معلومات ملفه أو تصحيحها وتغيير موافقته التسويقية. وتسري حقوق الوصول أو الحذف أو الاعتراض أو النقل أو الشكوى الأخرى عندما يوجبها القانون الواجب التطبيق وبعد التحقق من الهوية.'] },
        { id: 'cookies', title: '8. ملفات الارتباط والقاصرون والنقل', paragraphs: ['تستخدم الخدمة الحالية التخزين اللازم للمصادقة وتفضيل اللغة. ولا تقدم هذه السياسة ادعاءات غير مؤكدة بشأن ملفات الإعلان أو استخدام القاصرين أو آليات محددة لنقل البيانات دوليًا.'] },
        { id: 'changes-contact', title: '9. التعديلات والتواصل', paragraphs: ['ستُرقّم تغييرات الخصوصية وتؤرّخ ويُخطر بها بصورة متناسبة. ولن يُعرض عنوان تواصل للخصوصية إلا بعد التحقق منه.'] },
      ],
    },
    trial: {
      title: 'سياسة التجربة والتنزيل', shortTitle: 'التجربة والتنزيل',
      summary: 'مسودة شروط الوصول إلى ملفات التثبيت وتقييم برنامج آشور عند اعتماد الإصدارات وشروط التجربة.',
      sections: [
        { id: 'availability', title: '1. التوفر', paragraphs: ['لا يوجد حاليًا ملف تثبيت أو مدة تجربة أو منصة مدعومة أو بيانات ملف أو استحقاق ترخيص معتمد. ولا تمنح هذه المسودة تجربة ولا تعد بتوفرها. ويجب إبقاء التنزيل معطلًا حتى اعتماد الملفات والشروط الحقيقية.'] },
        { id: 'access', title: '2. متطلبات الحساب', paragraphs: ['قد يتطلب التنزيل المحمي مستقبلًا حسابًا موثقًا وبريدًا مؤكدًا وملفًا مكتملًا وقبول سياسة التجربة السارية. ولا تمثل حماية صفحة الويب وحدها نظام ترخيص.'] },
        { id: 'installation', title: '3. التنزيل والتثبيت', paragraphs: ['ينبغي للمستخدم اختيار الإصدار يدويًا والتحقق من متطلبات النظام وقيم التحقق المنشورة واتباع تعليمات التثبيت المعتمدة. ولا يبدأ التنزيل تلقائيًا. وتتطلب الملفات الخاصة روابط قصيرة العمر مصرحًا بها من الخادم.'] },
        { id: 'evaluation', title: '4. استخدام التقييم', paragraphs: ['يجب اعتماد غرض التقييم والمستخدمين والأجهزة والمدة وحدود المزايا ومعالجة البيانات ومسار التحويل قبل الإطلاق. ولا يجوز الادعاء بمنع تكرار التجربة دون نظام ترخيص حقيقي من جهة الخادم.'] },
        { id: 'security', title: '5. الأمن والتحديثات', paragraphs: ['يجب الحصول على ملفات التثبيت من قناة آشور معتمدة فقط. وينبغي أن تتطابق ملاحظات الإصدار والتواقيع وقيم التحقق ودعم التحديثات والإبلاغ عن الثغرات ونهاية الدعم مع البرنامج المنشور.'] },
        { id: 'expiry', title: '6. انتهاء التجربة والإزالة', paragraphs: ['لم يُحسم سلوك انتهاء التجربة، بما فيه الوصول والتصدير والحذف وإلغاء التثبيت وخيارات الشراء. ويجب أن تشرح السياسة النهائية ذلك قبل بدء التجربة.'] },
        { id: 'liability-contact', title: '7. الدعم والشروط القانونية', paragraphs: ['يتطلب نطاق الدعم والضمانات والمسؤولية والقانون المختص وبيانات التواصل اعتمادًا، ويجب أن ينسجم مع شروط الاستخدام. ولا تتأثر الحقوق الإلزامية.'] },
      ],
    },
    refunds: {
      title: 'سياسة الاسترداد', shortTitle: 'الاسترداد',
      summary: 'إطار أولي للإلغاء والاسترداد إذا أتاحت آشور لاحقًا خططًا أو مشتريات مدفوعة.',
      sections: [
        { id: 'status', title: '1. الحالة الحالية', paragraphs: ['لا يعرض موقع آشور حاليًا عملية دفع مهيأة. ولا تمثل هذه المسودة طريقة دفع أو عملة أو معالجة ضريبية أو دورة فوترة أو تجديدًا أو حقًا في الاسترداد.'] },
        { id: 'scope', title: '2. النطاق', paragraphs: ['يجب أن تحدد السياسة النهائية المنتجات والمشترين والقنوات والأقاليم والبائع المتعاقد. وقد تخضع المشتريات عبر سوق خارجي لإجراءاته حيث يسمح القانون.'] },
        { id: 'eligibility', title: '3. أهلية الاسترداد', paragraphs: ['ما زالت مدد الأهلية والاستثناءات والاسترداد الجزئي وعيوب الخدمة والخصم المكرر والعناصر غير القابلة للاسترداد ومتطلبات الإثبات قرارات تجارية وقانونية غير معتمدة. ولا يجوز تقييد حقوق المستهلك الإلزامية.'] },
        { id: 'requests', title: '4. الطلبات والمعالجة', paragraphs: ['يجب أن توفر السياسة النهائية قناة دعم موثقة ومتطلبات الطلب ووقت الإقرار وآلية القرار وطريقة إعادة المبلغ ومددًا واقعية للمعالجة. ولا تُطلب بيانات الدفع الحساسة عبر البريد الإلكتروني.'] },
        { id: 'cancellation', title: '5. الإلغاء والتجديد', paragraphs: ['يجب أن تتطابق مواعيد الإلغاء وسلوك التجديد والوصول حتى نهاية المدة وآثار خفض الخطة وتصدير البيانات مع مزود الدفع وشروط الاستخدام. ولا يجوز وصف التجديد التلقائي قبل تنفيذه واعتماده.'] },
        { id: 'disputes', title: '6. النزاعات والتواصل', paragraphs: ['تحتاج معالجة الاعتراضات والشكاوى والقانون المختص وتسوية النزاع إلى مراجعة محامٍ عراقي. ويجب اعتماد هوية البائع وقناة الفوترة قبل النشر.'] },
      ],
    },
  },
};
