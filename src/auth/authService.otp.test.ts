import { beforeEach, describe, expect, it, vi } from 'vitest';

const api = vi.hoisted(() => ({ signUp: vi.fn(), verifyOtp: vi.fn(), invoke: vi.fn() }));
vi.mock('./supabaseClient', () => ({ isSupabaseConfigured: () => true, getSupabaseClient: async () => ({ auth: { signUp: api.signUp, verifyOtp: api.verifyOtp }, functions: { invoke: api.invoke } }) }));
import { authService } from './authService';
import { profileService } from './profileService';

describe('Supabase onboarding calls', () => {
  beforeEach(() => vi.clearAllMocks());
  it('uses password signup without profile or legal Auth metadata', async () => { api.signUp.mockResolvedValue({ data: { user: { id: 'user' }, session: null }, error: null }); await authService.signUp({ email: ' USER@Example.com ', password: 'StrongPassword1', nextPath: '/download' }); expect(api.signUp).toHaveBeenCalledWith(expect.objectContaining({ email: 'user@example.com', password: 'StrongPassword1', options: expect.not.objectContaining({ data: expect.anything() }) })); });
  it('propagates signup provider failures safely to the page layer', async () => { api.signUp.mockResolvedValue({ data: null, error: new Error('provider failure') }); await expect(authService.signUp({ email: 'a@example.com', password: 'StrongPassword1' })).rejects.toThrow('provider failure'); });
  it('verifies an eight-digit confirm-signup token using the signup OTP type', async () => { api.verifyOtp.mockResolvedValue({ data: { user: { id: 'user' }, session: {} }, error: null }); await authService.verifySignupOtp(' USER@example.com ', '12345678'); expect(api.verifyOtp).toHaveBeenCalledWith({ email: 'user@example.com', token: '12345678', type: 'signup' }); });
  it('sends onboarding only to the authenticated finalization function', async () => { const payload = { fullName: 'User Name', phoneE164: '+9647701234567', ownsOrManagesBusiness: false, businessName: null, businessType: null, businessTypeOther: null, branchCount: null, heardAboutAshur: false, awarenessSource: null, preferredLanguage: 'en' as const, termsSelected: true, privacySelected: true, marketingConsent: false }; api.invoke.mockResolvedValue({ data: { profile: { id: 'user' } }, error: null }); await profileService.completeRegistration(payload); expect(api.invoke).toHaveBeenCalledWith('complete-registration', { method: 'POST', body: payload }); });
});
