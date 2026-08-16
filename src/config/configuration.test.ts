import { describe, expect, it } from 'vitest';
import { availableDownloadBuilds, detectRecommendedPlatform } from './downloads';
import { calculateAnnualSavings, confirmedPricingPlans } from './pricing';
import { isLegalDocumentPublishable, legalDocuments, registrationDocumentsReady, registrationLegalReady } from './legal';

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
  it('publishes only the internally approved registration documents', () => {
    expect(Object.keys(legalDocuments)).toEqual(['terms', 'privacy', 'trial', 'refunds']);
    for (const id of ['terms', 'privacy'] as const) {
      expect(legalDocuments[id]).toMatchObject({ status: 'internally_approved', publicationStatus: 'published', version: '1.0.0', effectiveDate: '2026-08-16', lastUpdatedDate: '2026-08-16', lawyerReviewed: false, registrationAcceptanceRequired: true });
    }
    for (const id of ['trial', 'refunds'] as const) {
      expect(legalDocuments[id]).toMatchObject({ status: 'draft', publicationStatus: 'inactive', version: null, registrationAcceptanceRequired: false });
    }
  });

  it('enables the local publication candidate only for versioned Terms and Privacy', () => {
    expect(isLegalDocumentPublishable('terms')).toBe(true);
    expect(isLegalDocumentPublishable('privacy')).toBe(true);
    expect(isLegalDocumentPublishable('trial')).toBe(false);
    expect(isLegalDocumentPublishable('refunds')).toBe(false);
    expect(registrationLegalReady).toBe(true);
  });

  it('fails closed for draft, missing, or mismatched registration-policy versions', () => {
    expect(registrationDocumentsReady({ ...legalDocuments, terms: { ...legalDocuments.terms, status: 'draft' } })).toBe(false);
    expect(registrationDocumentsReady({ ...legalDocuments, privacy: { ...legalDocuments.privacy, version: null } })).toBe(false);
    expect(registrationDocumentsReady({ ...legalDocuments, privacy: { ...legalDocuments.privacy, version: '1.0.1' } })).toBe(false);
  });
});
