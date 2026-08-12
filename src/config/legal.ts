export type LegalDocumentId = 'terms' | 'privacy' | 'trial' | 'refunds';
export type LegalDocumentStatus = 'draft' | 'approved';

export interface LegalDocumentConfiguration {
  id: LegalDocumentId;
  route: string;
  status: LegalDocumentStatus;
  version: string | null;
  effectiveDate: string | null;
  lastUpdatedDate: string | null;
  requiresQualifiedIraqiCounselApproval: true;
}

export interface LegalBusinessConfiguration {
  legalEntityName: string | null;
  legalEntityType: string | null;
  commercialRegistrationNumber: string | null;
  registeredAddress: string | null;
  businessAddress: string | null;
  supportEmail: string | null;
  legalEmail: string | null;
  privacyEmail: string | null;
  phone: string | null;
  governingLaw: string | null;
  disputeForum: string | null;
  minimumAccountAge: number | null;
}

const draftDocument = (id: LegalDocumentId, route: string): LegalDocumentConfiguration => ({
  id,
  route,
  status: 'draft',
  version: null,
  effectiveDate: null,
  lastUpdatedDate: null,
  requiresQualifiedIraqiCounselApproval: true,
});

export const legalDocuments = {
  terms: draftDocument('terms', '/terms'),
  privacy: draftDocument('privacy', '/privacy'),
  trial: draftDocument('trial', '/trial-download-policy'),
  refunds: draftDocument('refunds', '/refund-policy'),
} satisfies Record<LegalDocumentId, LegalDocumentConfiguration>;

export const legalBusinessConfiguration: LegalBusinessConfiguration = {
  legalEntityName: null,
  legalEntityType: null,
  commercialRegistrationNumber: null,
  registeredAddress: null,
  businessAddress: null,
  supportEmail: null,
  legalEmail: null,
  privacyEmail: null,
  phone: null,
  governingLaw: null,
  disputeForum: null,
  minimumAccountAge: null,
};

const publishable = (document: LegalDocumentConfiguration) =>
  document.status === 'approved' &&
  Boolean(document.version && document.effectiveDate && document.lastUpdatedDate);

export const isLegalDocumentPublishable = (id: LegalDocumentId) => publishable(legalDocuments[id]);

export const registrationLegalReady =
  isLegalDocumentPublishable('terms') &&
  isLegalDocumentPublishable('privacy') &&
  Boolean(
    legalBusinessConfiguration.legalEntityName &&
    legalBusinessConfiguration.legalEmail &&
    legalBusinessConfiguration.privacyEmail &&
    legalBusinessConfiguration.minimumAccountAge,
  );

export const downloadLegalReady = isLegalDocumentPublishable('trial');
export const paymentLegalReady = isLegalDocumentPublishable('refunds');
