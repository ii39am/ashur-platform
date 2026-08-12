import React,{createContext,useContext,useEffect,useState} from 'react';
export type Language='en'|'ar';
const copy={
 en:{brand:'Ashur Admin',overview:'Overview',users:'Users',trials:'Trial Requests',downloads:'Downloads',support:'Support',reports:'Reports',email:'Transactional Email',security:'Security',audit:'Audit Log',settings:'Settings',notConfigured:'Not configured',signOut:'Sign out',loading:'Loading secure administration data…',denied:'Access denied',retry:'Try again',environment:'Environment',menu:'Open navigation',close:'Close navigation'},
 ar:{brand:'إدارة آشور',overview:'نظرة عامة',users:'المستخدمون',trials:'طلبات التجربة',downloads:'التنزيلات',support:'الدعم',reports:'التقارير',email:'البريد التشغيلي',security:'الأمن',audit:'سجل التدقيق',settings:'الإعدادات',notConfigured:'غير مهيأ',signOut:'تسجيل الخروج',loading:'جارٍ تحميل بيانات الإدارة الآمنة…',denied:'الوصول مرفوض',retry:'إعادة المحاولة',environment:'البيئة',menu:'فتح التنقل',close:'إغلاق التنقل'}
} as const;
const Context=createContext<{language:Language;setLanguage:(x:Language)=>void;t:typeof copy.en}|null>(null);
export function LanguageProvider({children}:{children:React.ReactNode}){const[language,setLanguage]=useState<Language>(()=>localStorage.getItem('ashur_admin_lang')==='ar'?'ar':'en');useEffect(()=>{localStorage.setItem('ashur_admin_lang',language);document.documentElement.lang=language;document.documentElement.dir=language==='ar'?'rtl':'ltr'},[language]);return <Context.Provider value={{language,setLanguage,t:copy[language] as typeof copy.en}}>{children}</Context.Provider>}
export const useLanguage=()=>{const x=useContext(Context);if(!x)throw new Error('LanguageProvider required');return x};
