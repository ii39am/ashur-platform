export function getSafeAuthError(error: unknown): string {
  if (error instanceof Error && error.message === 'AUTH_NOT_CONFIGURED') {
    return 'Authentication is not configured yet. Please contact support.';
  }
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes('invalid login')) return 'Unable to sign in with those credentials.';
    if (message.includes('email not confirmed')) return 'Please verify your email before signing in.';
    if (message.includes('expired') || message.includes('invalid token') || message.includes('otp')) {
      return 'This authentication link is invalid or has expired. Please request a new one.';
    }
    if (message.includes('rate') || message.includes('too many')) return 'Too many attempts. Please wait and try again.';
    if (message.includes('network') || message.includes('fetch')) return 'We could not reach the authentication service. Check your connection and try again.';
  }
  return 'We could not complete that request. Please try again.';
}
