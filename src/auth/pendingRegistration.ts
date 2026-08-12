import type { OnboardingPayload } from './onboardingValidation';

const KEY = 'ashur_pending_registration';
export interface PendingRegistration { email: string; nextPath: string; payload?: OnboardingPayload; }

export function savePendingRegistration(value: PendingRegistration) {
  // Short-lived recovery state contains contact/business data, but never passwords,
  // OTPs, access/refresh tokens, document versions, user IDs, or server timestamps.
  sessionStorage.setItem(KEY, JSON.stringify(value));
}
export function updatePendingRegistrationIdentity(email: string, nextPath: string) {
  const current = readPendingRegistration();
  savePendingRegistration({ email, nextPath, payload: current?.email === email ? current.payload : undefined });
}
export function readPendingRegistration(): PendingRegistration | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(KEY) ?? 'null');
    return value && typeof value.email === 'string' && typeof value.nextPath === 'string' ? value as PendingRegistration : null;
  } catch { return null; }
}
export function clearPendingRegistration() { sessionStorage.removeItem(KEY); }
