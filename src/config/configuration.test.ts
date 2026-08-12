import { describe, expect, it } from 'vitest';
import { availableDownloadBuilds, detectRecommendedPlatform } from './downloads';
import { calculateAnnualSavings, confirmedPricingPlans } from './pricing';
import { isLegalDocumentPublishable, legalDocuments, registrationLegalReady } from './legal';

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

describe('legal configuration', () => {
  it('keeps every unapproved draft unpublished', () => {
    expect(Object.values(legalDocuments).every((document) => document.status === 'draft')).toBe(true);
    expect(Object.keys(legalDocuments)).toEqual(['terms', 'privacy', 'trial', 'refunds']);
    expect(Object.values(legalDocuments).every((document) => !document.version && !document.effectiveDate)).toBe(true);
  });

  it('fails registration closed while legal facts or versions are missing', () => {
    expect(isLegalDocumentPublishable('terms')).toBe(false);
    expect(isLegalDocumentPublishable('privacy')).toBe(false);
    expect(registrationLegalReady).toBe(false);
  });
});
