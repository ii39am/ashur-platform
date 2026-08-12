export type RetryableProviderError = 'provider_rejected' | 'provider_rate_limited' | 'provider_unavailable';
export function providerErrorCategory(status: number): RetryableProviderError {
  if (status === 429) return 'provider_rate_limited';
  if (status >= 500) return 'provider_unavailable';
  return 'provider_rejected';
}
export function providerMessageId(input: unknown) {
  if (!input || typeof input !== 'object') return null;
  const id = (input as { id?: unknown }).id;
  return typeof id === 'string' && id.length > 0 && id.length <= 256 ? id : null;
}
