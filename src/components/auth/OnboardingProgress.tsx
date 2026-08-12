import React from 'react';
import { Check } from 'lucide-react';
export function OnboardingProgress({ labels, current }: { labels: readonly string[]; current: number }) {
  return <ol className="mb-8 grid grid-cols-4 gap-2" aria-label="Registration progress">{labels.map((label, index) => <li key={label} aria-current={index === current ? 'step' : undefined} className="min-w-0 text-center"><div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold ${index <= current ? 'border-brand-400 bg-brand-500/15 text-brand-300' : 'border-white/10 text-slate-500'}`}>{index < current ? <Check className="h-4 w-4" /> : index + 1}</div><span className={`mt-2 hidden text-xs sm:block ${index === current ? 'text-white' : 'text-slate-500'}`}>{label}</span></li>)}</ol>;
}
