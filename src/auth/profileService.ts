import type { OnboardingPayload } from './onboardingValidation';
import { getSupabaseClient } from './supabaseClient';

export interface ProfileSummary { id: string; full_name: string; preferred_language: 'en' | 'ar'; }

export const profileService = {
  async getOwnProfile(): Promise<ProfileSummary | null> {
    const { data, error } = await (await getSupabaseClient()).from('profiles').select('id,full_name,preferred_language').maybeSingle();
    if (error) throw error;
    return data as ProfileSummary | null;
  },
  async completeRegistration(payload: OnboardingPayload): Promise<ProfileSummary> {
    const { data, error } = await (await getSupabaseClient()).functions.invoke('complete-registration', { method: 'POST', body: payload });
    if (error) throw error;
    if (!data?.profile?.id) throw new Error('PROFILE_SETUP_FAILED');
    return data.profile as ProfileSummary;
  },
  async requestWelcomeEmail(): Promise<{ accepted: boolean; alreadySent?: boolean; retryLater?: boolean }> {
    const { data, error } = await (await getSupabaseClient()).functions.invoke('send-welcome-email', { method: 'POST' });
    if (error) throw error;
    return data as { accepted: boolean; alreadySent?: boolean; retryLater?: boolean };
  },
};
