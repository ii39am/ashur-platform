import React from 'react';
import { passwordScore } from '../../auth/onboardingValidation';
export function PasswordStrength({ password, labels }: { password: string; labels: { label: string; weak: string; fair: string; strong: string } }) {
  const score = passwordScore(password); const level = score >= 4 ? 3 : score >= 3 ? 2 : 1; const label = level === 3 ? labels.strong : level === 2 ? labels.fair : labels.weak;
  return <div className="mt-2" aria-live="polite"><div className="flex gap-1">{[1,2,3].map((item) => <span key={item} className={`h-1 flex-1 rounded ${item <= level ? (level === 3 ? 'bg-emerald-400' : level === 2 ? 'bg-amber-400' : 'bg-rose-400') : 'bg-white/10'}`} />)}</div><p className="mt-1 text-xs text-slate-400">{labels.label}: {label}</p></div>;
}
