export const MIN_PASSWORD_LENGTH = 10;

export function validateEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? '' : 'Enter a valid email address.';
}

export function validatePassword(password: string) {
  if (password.length < MIN_PASSWORD_LENGTH) return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return 'Include uppercase, lowercase, and number characters.';
  }
  return '';
}

export function validateRegistration(input: { fullName: string; email: string; password: string; confirmPassword: string; acceptedLegal: boolean }) {
  const errors: Record<string, string> = {};
  if (input.fullName.trim().length < 2) errors.fullName = 'Enter your full name.';
  const emailError = validateEmail(input.email);
  if (emailError) errors.email = emailError;
  const passwordError = validatePassword(input.password);
  if (passwordError) errors.password = passwordError;
  if (input.password !== input.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  if (!input.acceptedLegal) errors.acceptedLegal = 'You must accept the Terms and Privacy Policy.';
  return errors;
}
