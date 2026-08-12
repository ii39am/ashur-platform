import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
interface Props extends React.InputHTMLAttributes<HTMLInputElement> { label: string; error?: string; showLabel?: string; hideLabel?: string; }
export function PasswordInput({ label, error, id, showLabel = 'Show password', hideLabel = 'Hide password', ...props }: Props) {
  const [visible, setVisible] = useState(false); const inputId = id ?? props.name;
  return <div><label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-slate-200">{label}</label><div className="relative"><input {...props} id={inputId} type={visible ? 'text' : 'password'} aria-invalid={Boolean(error)} aria-describedby={error ? `${inputId}-error` : undefined} className="auth-input pe-12" /><button type="button" onClick={() => setVisible((value) => !value)} className="absolute inset-y-0 end-1 flex w-11 items-center justify-center text-slate-400 hover:text-white" aria-label={visible ? hideLabel : showLabel}>{visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div>{error && <p id={`${inputId}-error`} className="mt-2 text-sm text-rose-400">{error}</p>}</div>;
}
