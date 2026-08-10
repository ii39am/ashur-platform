export type BillingInterval = 'monthly' | 'yearly' | 'enterprise';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number | 'PRICE_TO_CONFIRM';
  currency: string | 'CURRENCY_TO_CONFIRM';
  interval: BillingInterval;
  features: string[];
  seatLimit: number | 'LIMIT_TO_CONFIRM';
  trialAvailable: boolean | 'TRIAL_TO_CONFIRM';
  recommended: boolean;
  annualSavingsText?: string;
  confirmed: boolean;
}

// Plans remain absent from the public UI until commercial terms are approved.
export const pricingPlans: PricingPlan[] = [];

export const pricingPolicy = {
  taxes: 'TAX_POLICY_TO_CONFIRM',
  refunds: 'REFUND_POLICY_TO_CONFIRM',
  paymentMethods: 'PAYMENT_METHODS_TO_CONFIRM',
  renewal: 'RENEWAL_POLICY_TO_CONFIRM',
} as const;

export const confirmedPricingPlans = pricingPlans.filter((plan) => plan.confirmed);

export function calculateAnnualSavings(monthlyPrice: number, yearlyPrice: number) {
  const annualizedMonthly = monthlyPrice * 12;
  if (annualizedMonthly <= 0 || yearlyPrice < 0 || yearlyPrice > annualizedMonthly) return 0;
  return Math.round(((annualizedMonthly - yearlyPrice) / annualizedMonthly) * 100);
}
