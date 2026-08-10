export const legalConfiguration = {
  termsApproved: false,
  privacyApproved: false,
  refundPolicyApproved: false,
} as const;

export const registrationLegalReady = legalConfiguration.termsApproved && legalConfiguration.privacyApproved;
