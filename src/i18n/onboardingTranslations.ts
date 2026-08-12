export const onboardingTranslations = {
  en: {
    common: { back: 'Back', continue: 'Continue', yes: 'Yes', no: 'No', optional: 'Optional', loading: 'Please wait…', retry: 'Try again', offline: 'You appear to be offline. Reconnect and try again.' },
    steps: ['Your information', 'Account security', 'Email verification', 'Completed'],
    register: {
      title: 'Create your Ashur account', description: 'Tell us about you, then secure and verify your account.',
      personalTitle: 'Your information', personalHelp: 'We use this information to prepare your account and support experience.',
      fullName: 'Full name', phone: 'Phone number', country: 'Country code', phoneHint: 'This number is not verified.',
      ownsBusiness: 'Do you own or manage a store or company?', businessName: 'Store or company name', businessType: 'Business type', branches: 'Number of branches', businessOther: 'Specify the business type',
      heard: 'Have you heard of Ashur Platform before?', source: 'How did you hear about Ashur Platform?',
      securityTitle: 'Account security', securityHelp: 'Use an email address you can access. We will send a six-digit verification code.',
      email: 'Email address', password: 'Password', confirmPassword: 'Confirm password',
      terms: 'I accept the Terms of Service.', privacy: 'I accept the Privacy Policy.', marketing: 'Optional: Send me Ashur product news and offers.',
      create: 'Create account', creating: 'Creating account…', haveAccount: 'Already have an account?', signIn: 'Sign in',
      legalPending: 'Registration will open after the Terms of Service and Privacy Policy are approved.',
      localTestingWarning: 'Local testing mode: your acceptance is used only to test the registration flow. The legal documents remain drafts and are not legally effective.',
    },
    businessTypes: { retail: 'Retail store', restaurant: 'Restaurant or café', grocery: 'Supermarket or grocery', pharmacy: 'Pharmacy', fashion: 'Clothing and fashion', electronics: 'Electronics', beauty: 'Beauty and personal care', services: 'Services', wholesale: 'Distribution or wholesale', other: 'Other' },
    sources: { social: 'Social media', referral: 'Friend or colleague', representative: 'Ashur representative', event: 'Event or advertisement', search: 'Search engine', other: 'Other' },
    validation: {
      required: 'This field is required.', fullName: 'Enter your full name.', phone: 'Enter a valid phone number.', businessName: 'Enter the store or company name.', businessType: 'Choose a business type.', businessOther: 'Specify the business type.', branches: 'Enter a whole number from 1 to 1,000.', email: 'Enter a valid email address.', passwordLength: 'Use at least 10 characters.', passwordComplexity: 'Include uppercase, lowercase, and number characters.', mismatch: 'Passwords do not match.', terms: 'You must accept the Terms of Service.', privacy: 'You must accept the Privacy Policy.'
    },
    strength: { label: 'Password strength', weak: 'Weak', fair: 'Fair', strong: 'Strong' },
    verify: {
      title: 'Verify your email', description: 'Enter the six-digit code sent to', digit: 'Verification code digit', verify: 'Verify email', verifying: 'Verifying…', resend: 'Resend code', resendIn: 'Resend in', sent: 'A new code was requested. Check your inbox and spam folder.', missing: 'The signup email is missing. Return to account creation and try again.', invalid: 'That code is invalid. Check all six digits and try again.', expired: 'That code has expired. Request a new one.', used: 'That code has already been used. Sign in or request a new code.', attempts: 'Too many attempts on this page. Request a new code before trying again.', rateLimit: 'The email service rate limit was reached. Wait before requesting another code.', setup: 'Your email is verified. We are securely preparing your profile…', setupFailed: 'Your email is verified, but account setup is incomplete. Retry setup safely.', retrySetup: 'Finish account setup'
    },
    complete: { title: 'Your account has been created successfully', body: 'Welcome to Ashur Platform. Your email has been verified and your account is ready. You can now explore your account or download the Ashur trial version.', download: 'Download Trial', account: 'Go to My Account', emailPending: 'Your account is ready. The welcome email was not accepted for delivery yet.', retryEmail: 'Retry welcome email', emailSent: 'The welcome email was accepted for delivery.' },
    signIn: { title: 'Welcome back', description: 'Sign in securely to manage your Ashur account.', email: 'Email address', password: 'Password', submit: 'Sign in', submitting: 'Signing in…', forgot: 'Forgot password?', new: 'New to Ashur?', create: 'Create account', unverified: 'Your email is not verified yet.', sendCode: 'Send a new verification code' },
    password: { show: 'Show password', hide: 'Hide password' },
  },
  ar: {
    common: { back: 'رجوع', continue: 'متابعة', yes: 'نعم', no: 'لا', optional: 'اختياري', loading: 'يرجى الانتظار…', retry: 'إعادة المحاولة', offline: 'يبدو أنك غير متصل بالإنترنت. أعد الاتصال وحاول مجددًا.' },
    steps: ['معلوماتك', 'أمان الحساب', 'تأكيد البريد', 'اكتمل'],
    register: {
      title: 'إنشاء حسابك في منصة آشور', description: 'عرّفنا بك، ثم أمّن حسابك وأكّد بريدك الإلكتروني.',
      personalTitle: 'معلوماتك', personalHelp: 'نستخدم هذه المعلومات لإعداد حسابك وتحسين تجربة الدعم.',
      fullName: 'الاسم الكامل', phone: 'رقم الهاتف', country: 'رمز الدولة', phoneHint: 'رقم الهاتف غير مؤكّد.',
      ownsBusiness: 'هل تملك أو تدير متجرًا أو شركة؟', businessName: 'اسم المتجر أو الشركة', businessType: 'نوع النشاط', branches: 'عدد الفروع', businessOther: 'اكتب نوع النشاط',
      heard: 'هل سمعت عن منصة آشور من قبل؟', source: 'كيف تعرفت على منصة آشور؟',
      securityTitle: 'أمان الحساب', securityHelp: 'استخدم بريدًا يمكنك الوصول إليه. سنرسل إليك رمز تحقق من ستة أرقام.',
      email: 'البريد الإلكتروني', password: 'كلمة المرور', confirmPassword: 'تأكيد كلمة المرور',
      terms: 'أوافق على شروط الخدمة.', privacy: 'أوافق على سياسة الخصوصية.', marketing: 'اختياري: أرغب في استلام أخبار وعروض منصة آشور.',
      create: 'إنشاء الحساب', creating: 'جارٍ إنشاء الحساب…', haveAccount: 'لديك حساب بالفعل؟', signIn: 'تسجيل الدخول',
      legalPending: 'سيتاح التسجيل بعد اعتماد شروط الخدمة وسياسة الخصوصية.',
      localTestingWarning: 'وضع اختبار محلي: موافقتك تُستخدم لاختبار تدفق التسجيل فقط. الوثائق القانونية ما زالت مسودات وغير نافذة.',
    },
    businessTypes: { retail: 'متجر بيع بالتجزئة', restaurant: 'مطعم أو مقهى', grocery: 'سوبرماركت أو بقالة', pharmacy: 'صيدلية', fashion: 'ملابس وأزياء', electronics: 'إلكترونيات', beauty: 'تجميل وعناية شخصية', services: 'خدمات', wholesale: 'توزيع أو بيع بالجملة', other: 'أخرى' },
    sources: { social: 'وسائل التواصل الاجتماعي', referral: 'صديق أو زميل', representative: 'ممثل منصة آشور', event: 'فعالية أو إعلان', search: 'محرك بحث', other: 'أخرى' },
    validation: {
      required: 'هذا الحقل مطلوب.', fullName: 'أدخل اسمك الكامل.', phone: 'أدخل رقم هاتف صحيحًا.', businessName: 'أدخل اسم المتجر أو الشركة.', businessType: 'اختر نوع النشاط.', businessOther: 'اكتب نوع النشاط.', branches: 'أدخل عددًا صحيحًا من 1 إلى 1,000.', email: 'أدخل بريدًا إلكترونيًا صحيحًا.', passwordLength: 'استخدم 10 أحرف على الأقل.', passwordComplexity: 'ضمّن حرفًا كبيرًا وحرفًا صغيرًا ورقمًا.', mismatch: 'كلمتا المرور غير متطابقتين.', terms: 'يجب الموافقة على شروط الخدمة.', privacy: 'يجب الموافقة على سياسة الخصوصية.'
    },
    strength: { label: 'قوة كلمة المرور', weak: 'ضعيفة', fair: 'متوسطة', strong: 'قوية' },
    verify: {
      title: 'تأكيد بريدك الإلكتروني', description: 'أدخل الرمز المكوّن من ستة أرقام المرسل إلى', digit: 'رقم التحقق', verify: 'تأكيد البريد', verifying: 'جارٍ التحقق…', resend: 'إعادة إرسال الرمز', resendIn: 'إعادة الإرسال خلال', sent: 'تم طلب رمز جديد. تحقق من صندوق الوارد والرسائل غير المرغوب فيها.', missing: 'بريد التسجيل غير متوفر. ارجع إلى إنشاء الحساب وحاول مجددًا.', invalid: 'الرمز غير صحيح. تحقق من الأرقام الستة وحاول مجددًا.', expired: 'انتهت صلاحية الرمز. اطلب رمزًا جديدًا.', used: 'استُخدم هذا الرمز مسبقًا. سجّل الدخول أو اطلب رمزًا جديدًا.', attempts: 'تجاوزت عدد المحاولات المسموح في هذه الصفحة. اطلب رمزًا جديدًا.', rateLimit: 'تم بلوغ حد طلبات البريد. انتظر قبل طلب رمز آخر.', setup: 'تم تأكيد بريدك، ويجري الآن إعداد ملفك بأمان…', setupFailed: 'تم تأكيد بريدك، لكن إعداد الحساب لم يكتمل. يمكنك إعادة المحاولة بأمان.', retrySetup: 'إكمال إعداد الحساب'
    },
    complete: { title: 'تم إنشاء حسابك بنجاح', body: 'مرحبًا بك في منصة آشور. تم تأكيد بريدك الإلكتروني وأصبح حسابك جاهزًا. يمكنك الآن استعراض حسابك أو تحميل النسخة التجريبية من آشور.', download: 'تحميل النسخة التجريبية', account: 'الانتقال إلى حسابي', emailPending: 'حسابك جاهز، لكن رسالة الترحيب لم تُقبل للإرسال بعد.', retryEmail: 'إعادة إرسال رسالة الترحيب', emailSent: 'تم قبول رسالة الترحيب للإرسال.' },
    signIn: { title: 'مرحبًا بعودتك', description: 'سجّل الدخول بأمان لإدارة حسابك في منصة آشور.', email: 'البريد الإلكتروني', password: 'كلمة المرور', submit: 'تسجيل الدخول', submitting: 'جارٍ تسجيل الدخول…', forgot: 'نسيت كلمة المرور؟', new: 'جديد في منصة آشور؟', create: 'إنشاء حساب', unverified: 'لم يتم تأكيد بريدك الإلكتروني بعد.', sendCode: 'إرسال رمز تحقق جديد' },
    password: { show: 'إظهار كلمة المرور', hide: 'إخفاء كلمة المرور' },
  },
} as const;
