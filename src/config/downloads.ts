export type SupportedPlatform = 'windows' | 'macos' | 'linux';
export type Architecture = 'x64' | 'arm64' | 'universal';

export interface DownloadBuild {
  id: string;
  productName: string;
  version: string;
  releaseDate: string;
  platform: SupportedPlatform;
  architecture: Architecture;
  fileSize: string;
  minimumRequirements: string[];
  trialDuration: string;
  trialLimitations: string[];
  installationInstructions: string[];
  releaseNotesUrl?: string;
  supportUrl: string;
  sha256?: string;
  publicDownloadUrl?: string;
  available: boolean;
}

// Add only verified release metadata and real URLs. Private builds must be
// resolved through a serverless endpoint that returns a short-lived signed URL.
export const downloadBuilds: DownloadBuild[] = [];

export function detectRecommendedPlatform(userAgent: string): SupportedPlatform | null {
  const value = userAgent.toLowerCase();
  if (value.includes('windows')) return 'windows';
  if (value.includes('macintosh') || value.includes('mac os')) return 'macos';
  if (value.includes('linux')) return 'linux';
  return null;
}

export const availableDownloadBuilds = downloadBuilds.filter(
  (build) => build.available && Boolean(build.publicDownloadUrl)
);
