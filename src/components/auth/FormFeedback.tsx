import React from 'react';

export function FormFeedback({ type, children }: { type: 'error' | 'success' | 'info'; children: React.ReactNode }) {
  const styles = type === 'error' ? 'border-rose-500/30 bg-rose-500/10 text-rose-200' : type === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-brand-500/30 bg-brand-500/10 text-slate-200';
  return <div role={type === 'error' ? 'alert' : 'status'} className={`rounded-xl border p-4 text-sm leading-6 ${styles}`}>{children}</div>;
}
