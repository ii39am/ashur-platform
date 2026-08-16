export type LegalDocumentId = 'terms' | 'privacy' | 'trial' | 'refunds';
export type LegalDocumentStatus = 'draft' | 'internally_approved';
export type LegalPublicationStatus = 'inactive' | 'published';

export interface LegalDocumentConfiguration {
  id: LegalDocumentId;
  route: string;
  status: LegalDocumentStatus;
  publicationStatus: LegalPublicationStatus;
  version: string | null;
  effectiveDate: string | null;
  lastUpdatedDate: string | null;
  lawyerReviewed: boolean;
  registrationAcceptanceRequired: boolean;
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
  publicationStatus: 'inactive',
  version: null,
  effectiveDate: null,
  lastUpdatedDate: null,
  lawyerReviewed: false,
  registrationAcceptanceRequired: false,
});

const publishedRegistrationDocument = (id: 'terms' | 'privacy', route: string): LegalDocumentConfiguration => ({
  id,
  route,
  status: 'internally_approved',
  publicationStatus: 'published',
  version: '1.0.0',
  effectiveDate: '2026-08-16',
  lastUpdatedDate: '2026-08-16',
  lawyerReviewed: false,
  registrationAcceptanceRequired: true,
});

export const legalDocuments = {
  terms: publishedRegistrationDocument('terms', '/terms'),
  privacy: publishedRegistrationDocument('privacy', '/privacy'),
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
  document.status === 'internally_approved' &&
  document.publicationStatus === 'published' &&
  Boolean(document.version && document.effectiveDate && document.lastUpdatedDate);

export const isLegalDocumentPublishable = (id: LegalDocumentId) => publishable(legalDocuments[id]);

export const registrationDocumentsReady = (documents: Pick<typeof legalDocuments, 'terms' | 'privacy'>) =>
  publishable(documents.terms) &&
  publishable(documents.privacy) &&
  documents.terms.registrationAcceptanceRequired &&
  documents.privacy.registrationAcceptanceRequired &&
  documents.terms.version === documents.privacy.version;

export const registrationLegalReady = registrationDocumentsReady(legalDocuments);

export const downloadLegalReady = isLegalDocumentPublishable('trial');
export const paymentLegalReady = isLegalDocumentPublishable('refunds');
