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
    notice: 'This document is a working draft for review by qualified Iraqi counsel. It is not published contractual guidance and must not be relied on as final legal advice.',
    contents: 'On this page',
    print: 'Print draft',
    back: 'Return home',
    metadata: 'Version and effective date have not been approved.',
  },
  ar: {
    draft: 'مسودة قانونية — غير معتمدة وغير نافذة',
    notice: 'هذه الوثيقة مسودة عمل لمراجعتها من محامٍ عراقي مؤهل. وهي ليست شروطًا تعاقدية منشورة ولا يجوز الاعتماد عليها بوصفها استشارة قانونية نهائية.',
    contents: 'محتويات الصفحة',
    print: 'طباعة المسودة',
    back: 'العودة إلى الرئيسية',
    metadata: 'لم يُعتمد رقم الإصدار أو تاريخ النفاذ بعد.',
  },
} as const;

export const legalContent: Record<LegalLanguage, Record<LegalDocumentId, LegalCopy>> = {
  en: {
    terms: {
      title: 'Terms of Service', shortTitle: 'Terms',
      summary: 'Draft rules for accessing Ashur Platform accounts, websites, software, and related services.',
      sections: [
        { id: 'scope', title: '1. Scope and operator', paragraphs: ['These draft terms are intended to govern use of Ashur Platform services supplied by the future confirmed legal operator. The operator’s legal identity, registration details, address, and contact channels must be inserted and verified before publication.'] },
        { id: 'eligibility', title: '2. Eligibility and accounts', paragraphs: ['A user must meet the approved minimum age and have authority to act for any represented business. Account details must be accurate and credentials kept confidential. The minimum age and organizational-authority rules require legal approval.'] },
        { id: 'service', title: '3. Service access', paragraphs: ['Available functions, plans, support levels, and service limits are only those expressly confirmed in the product or an executed order. Ashur must not be described as providing unavailable features, uninterrupted operation, or guaranteed business outcomes.'] },
        { id: 'acceptable-use', title: '4. Acceptable use', paragraphs: ['Users must not misuse the service, interfere with security, attempt unauthorized access, upload unlawful material, or use the service to violate another person’s rights. Account restrictions should be proportionate and subject to applicable law.'] },
        { id: 'customer-data', title: '5. Customer data and responsibilities', paragraphs: ['Customers remain responsible for the accuracy and lawful collection of data they submit. Roles, instructions, security responsibilities, export options, and deletion procedures require confirmation in product and commercial documentation.'] },
        { id: 'intellectual-property', title: '6. Intellectual property', paragraphs: ['Ashur branding, software, and documentation remain subject to the rights of their respective owner. No ownership transfer is intended. The final license scope, restrictions, feedback treatment, and third-party notices require review.'] },
        { id: 'fees', title: '7. Fees, suspension, and termination', paragraphs: ['No pricing, taxes, renewal, suspension, cancellation, or termination rule is stated in this draft because the commercial model is not confirmed. Any final terms must match the checkout, invoices, refund policy, and product behavior.'] },
        { id: 'liability', title: '8. Warranties and liability', paragraphs: ['Warranty disclaimers, liability limits, indemnities, governing law, and dispute forum are intentionally omitted pending Iraqi legal review and confirmed business decisions. Mandatory legal rights must not be excluded.'] },
        { id: 'changes-contact', title: '9. Changes and contact', paragraphs: ['Material changes should receive a new version and effective date, with notice and renewed acceptance where legally or operationally required. Dedicated legal contact details must be confirmed before publication.'] },
      ],
    },
    privacy: {
      title: 'Privacy Policy', shortTitle: 'Privacy',
      summary: 'Draft explanation of personal-data handling for the Ashur website, authentication, onboarding, support, and downloads.',
      sections: [
        { id: 'controller', title: '1. Who is responsible', paragraphs: ['The confirmed Ashur legal operator and privacy contact must be identified before publication. This draft does not determine controller, processor, or joint-controller roles for future customer deployments.'] },
        { id: 'collection', title: '2. Information collected', paragraphs: ['Current onboarding may collect name, email, phone number, business details, preferred language, awareness source, marketing choice, legal-acceptance records, authentication status, and limited transactional-email delivery state. Authentication providers also process technical session and security data.'], bullets: ['Passwords and OTP codes are handled by the authentication provider and are not stored in the profile table.', 'Payment, licensing, installer telemetry, and production analytics practices are not yet confirmed and are not represented here.'] },
        { id: 'purposes', title: '3. Why information is used', paragraphs: ['Draft purposes include creating and securing accounts, recording consent, providing requested services, supporting users, protecting the service, and sending essential transactional messages. Marketing messages require a separate optional choice. The final lawful basis for each activity requires Iraqi counsel review.'] },
        { id: 'sharing', title: '4. Service providers and disclosures', paragraphs: ['Supabase is used for authentication and backend services, and Resend is planned for transactional email. Hosting and any other processors, locations, transfer safeguards, retention terms, and contracts must be verified before publication. Information may be disclosed where lawfully required.'] },
        { id: 'retention', title: '5. Retention', paragraphs: ['Retention periods are not yet approved. Final periods must be tied to account administration, legal obligations, security, disputes, and user requests; records should not be kept merely because storage is available. Immutable legal-acceptance records may require a distinct retention rule.'] },
        { id: 'security', title: '6. Security', paragraphs: ['Ashur uses measures designed to protect information, including authenticated access and row-level database controls. No system is completely secure, and the final policy must accurately reflect deployed controls and incident procedures.'] },
        { id: 'rights', title: '7. Choices and requests', paragraphs: ['Users may be able to review or correct profile fields and change marketing consent. Access, correction, deletion, objection, portability, complaint, and appeal processes must be finalized according to applicable law and technical feasibility. A verified privacy-request channel is required.'] },
        { id: 'cookies', title: '8. Cookies, children, and transfers', paragraphs: ['The final policy must inventory cookies and similar technologies, state the approved age threshold, and explain international data transfers. No assumption is made in this draft about children’s use or transfer legality.'] },
        { id: 'changes-contact', title: '9. Changes and contact', paragraphs: ['Privacy changes should be versioned, dated, and communicated proportionately. The legal entity and dedicated privacy contact must be confirmed before publication.'] },
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
      summary: 'مسودة قواعد الوصول إلى حسابات منصة آشور وموقعها وبرامجها والخدمات المرتبطة بها.',
      sections: [
        { id: 'scope', title: '1. النطاق والجهة المشغلة', paragraphs: ['تهدف هذه المسودة إلى تنظيم استخدام خدمات منصة آشور التي ستقدمها الجهة القانونية التي سيجري اعتمادها لاحقًا. يجب إدراج هوية الجهة ورقم تسجيلها وعنوانها وقنوات التواصل معها والتحقق منها قبل النشر.'] },
        { id: 'eligibility', title: '2. الأهلية والحسابات', paragraphs: ['يجب أن يستوفي المستخدم الحد الأدنى المعتمد للعمر وأن تكون لديه صلاحية تمثيل أي منشأة يتصرف باسمها. ويلتزم بتقديم بيانات صحيحة والمحافظة على سرية بيانات الدخول. ما زالت قواعد العمر وصلاحية التمثيل بحاجة إلى اعتماد قانوني.'] },
        { id: 'service', title: '3. الوصول إلى الخدمة', paragraphs: ['تقتصر الوظائف والخطط ومستويات الدعم والحدود على ما يُعتمد صراحة في المنتج أو في اتفاق نافذ. ولا يجوز وصف آشور بأنها توفر مزايا غير متاحة أو تشغيلًا بلا انقطاع أو نتائج تجارية مضمونة.'] },
        { id: 'acceptable-use', title: '4. الاستخدام المقبول', paragraphs: ['لا يجوز إساءة استخدام الخدمة أو تعطيل أمنها أو محاولة الوصول غير المصرح به أو رفع محتوى غير مشروع أو انتهاك حقوق الغير. وينبغي أن تكون قيود الحساب متناسبة ومتوافقة مع القانون الواجب التطبيق.'] },
        { id: 'customer-data', title: '5. بيانات العميل ومسؤولياته', paragraphs: ['يبقى العميل مسؤولًا عن دقة البيانات التي يقدمها ومشروعية جمعها. وتحتاج الأدوار والتعليمات والمسؤوليات الأمنية وخيارات التصدير والحذف إلى تأكيد في وثائق المنتج والتعاقد.'] },
        { id: 'intellectual-property', title: '6. الملكية الفكرية', paragraphs: ['تبقى علامة آشور وبرامجها ووثائقها خاضعة لحقوق أصحابها. ولا يقصد نقل الملكية. ويجب مراجعة نطاق الترخيص والقيود والملاحظات وإشعارات الأطراف الثالثة.'] },
        { id: 'fees', title: '7. الرسوم والتعليق والإنهاء', paragraphs: ['لا تتضمن هذه المسودة أسعارًا أو ضرائب أو قواعد للتجديد أو التعليق أو الإلغاء أو الإنهاء لعدم اعتماد النموذج التجاري. ويجب أن تتطابق الشروط النهائية مع الدفع والفواتير وسياسة الاسترداد وسلوك المنتج.'] },
        { id: 'liability', title: '8. الضمانات والمسؤولية', paragraphs: ['تُركت أحكام إخلاء الضمان وحدود المسؤولية والتعويض والقانون المختص وجهة الفصل عمدًا لحين مراجعة محامٍ عراقي واتخاذ القرارات التجارية. ولا يجوز استبعاد الحقوق الإلزامية.'] },
        { id: 'changes-contact', title: '9. التعديلات والتواصل', paragraphs: ['ينبغي إصدار رقم وتاريخ نفاذ جديدين للتغييرات الجوهرية، مع الإشعار وتجديد القبول عند الحاجة القانونية أو التشغيلية. ويجب اعتماد بيانات تواصل قانونية قبل النشر.'] },
      ],
    },
    privacy: {
      title: 'سياسة الخصوصية', shortTitle: 'الخصوصية',
      summary: 'مسودة توضح التعامل مع البيانات الشخصية في موقع آشور والمصادقة والتسجيل والدعم والتنزيلات.',
      sections: [
        { id: 'controller', title: '1. الجهة المسؤولة', paragraphs: ['يجب تحديد الجهة القانونية المشغلة لآشور وقناة الخصوصية قبل النشر. ولا تحسم هذه المسودة أدوار المتحكم أو المعالج أو المتحكم المشترك في عمليات العملاء المستقبلية.'] },
        { id: 'collection', title: '2. المعلومات التي تُجمع', paragraphs: ['قد يجمع التسجيل الحالي الاسم والبريد ورقم الهاتف وبيانات النشاط واللغة المفضلة ومصدر التعرف على آشور وخيار التسويق وسجلات القبول القانوني وحالة المصادقة وحالة محدودة لتسليم الرسائل التشغيلية. كما يعالج مزود المصادقة بيانات تقنية للجلسة والأمن.'], bullets: ['يتولى مزود المصادقة كلمات المرور ورموز التحقق، ولا تُخزن في جدول الملف الشخصي.', 'لم تُعتمد بعد ممارسات الدفع والترخيص وقياس استخدام المثبت والتحليلات الإنتاجية، ولا تعرض هذه المسودة ادعاءات بشأنها.'] },
        { id: 'purposes', title: '3. أغراض الاستخدام', paragraphs: ['تشمل الأغراض الأولية إنشاء الحساب وتأمينه وتسجيل الموافقات وتقديم الخدمات المطلوبة ودعم المستخدم وحماية الخدمة وإرسال الرسائل التشغيلية الضرورية. وتتطلب الرسائل التسويقية خيارًا منفصلًا واختياريًا. ويحتاج السند القانوني النهائي لكل غرض إلى مراجعة عراقية.'] },
        { id: 'sharing', title: '4. مزودو الخدمة والإفصاح', paragraphs: ['تُستخدم Supabase للمصادقة وخدمات الخلفية، ويُخطط لاستخدام Resend للرسائل التشغيلية. ويجب التحقق من الاستضافة وأي معالجين آخرين ومواقعهم وضمانات النقل ومدد الاحتفاظ والعقود قبل النشر. وقد يجري الإفصاح عندما يوجبه القانون بصورة مشروعة.'] },
        { id: 'retention', title: '5. الاحتفاظ', paragraphs: ['لم تُعتمد مدد الاحتفاظ بعد. يجب ربطها بإدارة الحساب والالتزامات القانونية والأمن والنزاعات وطلبات المستخدم، وألا تُحفظ السجلات لمجرد توفر التخزين. وقد تتطلب سجلات القبول القانوني غير القابلة للتعديل مدة مستقلة.'] },
        { id: 'security', title: '6. الأمن', paragraphs: ['تستخدم آشور تدابير مصممة لحماية المعلومات، ومنها الوصول الموثق وضوابط مستوى الصف في قاعدة البيانات. ولا يوجد نظام آمن بالكامل، ويجب أن تعكس السياسة النهائية الضوابط وإجراءات الحوادث المطبقة فعلًا.'] },
        { id: 'rights', title: '7. الخيارات والطلبات', paragraphs: ['قد يتمكن المستخدم من مراجعة بعض بيانات ملفه وتصحيحها وتغيير موافقته التسويقية. ويجب اعتماد إجراءات الوصول والتصحيح والحذف والاعتراض والنقل والشكوى وفق القانون والإمكانات التقنية، مع توفير قناة موثقة لطلبات الخصوصية.'] },
        { id: 'cookies', title: '8. ملفات الارتباط والقاصرون والنقل', paragraphs: ['يجب أن تحصر السياسة النهائية ملفات الارتباط والتقنيات المشابهة، وأن تذكر حد العمر المعتمد وتوضح نقل البيانات دوليًا. ولا تفترض هذه المسودة مشروعية استخدام القاصرين أو عمليات النقل.'] },
        { id: 'changes-contact', title: '9. التعديلات والتواصل', paragraphs: ['ينبغي ترقيم تغييرات الخصوصية وتأريخها والإشعار بها بصورة متناسبة. ويجب اعتماد الجهة القانونية وقناة الخصوصية قبل النشر.'] },
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
