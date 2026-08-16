import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export function SupportPage() {
  const { language, dir } = useLanguage();
  const ar = language === 'ar';
  return <main className="min-h-screen bg-dark-950 px-4 pb-20 pt-32" dir={dir}><div className="mx-auto max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-brand-400">{ar ? 'الدعم' : 'Support'}</p><h1 className="mt-4 text-4xl font-bold text-white">{ar ? 'دعم منصة آشور' : 'Ashur support'}</h1><p className="mt-5 text-lg leading-8 text-slate-300">{ar ? 'لم تُنشر بعد قناة دعم عامة موثقة. سنعرض بيانات التواصل هنا فقط بعد التحقق من الملكية وإمكانية التسليم.' : 'A verified public support channel has not yet been published. We will display contact details here only after ownership and delivery are confirmed.'}</p><div className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-400/5 p-7 text-amber-100" role="status">{ar ? 'قناة الدعم غير متاحة مؤقتًا' : 'Support contact temporarily unavailable'}</div></div></main>;
}
