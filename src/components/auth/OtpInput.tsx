import React, { useRef } from 'react';
export const SIGNUP_EMAIL_OTP_LENGTH = 8;
export const isValidSignupEmailOtp = (value: string) => /^\d{8}$/.test(value);

export function OtpInput({ value, onChange, disabled, digitLabel }: { value: string; onChange: (value: string) => void; disabled?: boolean; digitLabel: string }) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: SIGNUP_EMAIL_OTP_LENGTH }, (_, index) => value[index] ?? '');
  const setDigit = (index: number, raw: string) => {
    const number = raw.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = number;
    onChange(next.join(''));
    if (number && index < SIGNUP_EMAIL_OTP_LENGTH - 1) refs.current[index + 1]?.focus();
  };
  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '');
    event.preventDefault();
    if (pasted.length !== SIGNUP_EMAIL_OTP_LENGTH) return;
    onChange(pasted);
    refs.current[SIGNUP_EMAIL_OTP_LENGTH - 1]?.focus();
  };

  return <div className="grid grid-cols-8 gap-1.5 sm:gap-2" dir="ltr" onPaste={handlePaste}>{digits.map((digit, index) => <input key={index} ref={(element) => { refs.current[index] = element; }} value={digit} disabled={disabled} inputMode="numeric" pattern="[0-9]*" maxLength={1} autoComplete={index === 0 ? 'one-time-code' : 'off'} aria-label={`${digitLabel} ${index + 1}`} className="h-14 min-w-0 rounded-xl border border-white/15 bg-dark-950 text-center text-xl font-bold text-white focus:border-brand-400 focus:outline-none sm:text-2xl" onChange={(event) => setDigit(index, event.target.value)} onKeyDown={(event) => {
    if (event.key === 'Backspace') {
      if (digit) setDigit(index, '');
      else if (index > 0) refs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < SIGNUP_EMAIL_OTP_LENGTH - 1) refs.current[index + 1]?.focus();
  }} />)}</div>;
}
