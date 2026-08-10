import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { LanguageProvider } from '../context/LanguageContext';

const mocks = vi.hoisted(() => ({ requestPasswordReset: vi.fn().mockRejectedValue(new Error('account not found')) }));
vi.mock('../auth/authService', () => ({ authService: { configured: () => true, requestPasswordReset: mocks.requestPasswordReset } }));

describe('password reset request', () => {
  it('returns the same generic response for provider errors', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><LanguageProvider><ForgotPasswordPage /></LanguageProvider></MemoryRouter>);
    await user.type(screen.getByLabelText(/email address/i), 'person@example.com');
    await user.click(screen.getByRole('button', { name: /request reset/i }));
    expect(await screen.findByText(/if an account can receive/i)).toBeInTheDocument();
  });
});
