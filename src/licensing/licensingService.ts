export interface LicenseSnapshot {
  trialStatus: 'active' | 'expired' | 'unavailable';
  trialStartedAt: string | null;
  trialExpiresAt: string | null;
  licenseStatus: 'active' | 'revoked' | 'unavailable';
  planEntitlement: string | null;
  deviceActivationLimit: number | null;
  subscriptionStatus: 'active' | 'past_due' | 'cancelled' | 'unavailable';
}

export interface LicensingService {
  getSnapshot(): Promise<LicenseSnapshot>;
}

// No licensing backend is configured. This adapter is intentionally honest and
// must be replaced with a server-validated implementation before enforcement.
export const licensingService: LicensingService = {
  async getSnapshot() {
    return {
      trialStatus: 'unavailable',
      trialStartedAt: null,
      trialExpiresAt: null,
      licenseStatus: 'unavailable',
      planEntitlement: null,
      deviceActivationLimit: null,
      subscriptionStatus: 'unavailable',
    };
  },
};
