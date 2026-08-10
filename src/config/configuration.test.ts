import { describe, expect, it } from 'vitest';
import { availableDownloadBuilds, detectRecommendedPlatform } from './downloads';
import { calculateAnnualSavings, confirmedPricingPlans } from './pricing';

describe('download configuration', () => {
  it('detects platforms without forcing a download', () => {
    expect(detectRecommendedPlatform('Mozilla Windows NT 10.0')).toBe('windows');
    expect(detectRecommendedPlatform('Mozilla Macintosh Intel Mac OS X')).toBe('macos');
    expect(detectRecommendedPlatform('Unknown Device')).toBeNull();
  });
  it('hides missing download configuration', () => expect(availableDownloadBuilds).toEqual([]));
});

describe('pricing configuration', () => {
  it('calculates only mathematically valid annual savings', () => {
    expect(calculateAnnualSavings(100, 960)).toBe(20);
    expect(calculateAnnualSavings(100, 1300)).toBe(0);
  });
  it('hides unconfirmed pricing', () => expect(confirmedPricingPlans).toEqual([]));
});
