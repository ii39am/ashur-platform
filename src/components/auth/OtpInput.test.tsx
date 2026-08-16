import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { isValidSignupEmailOtp, OtpInput } from './OtpInput';

describe('OTP input', () => {
  it('validates exactly eight numeric digits', () => { expect(isValidSignupEmailOtp('12345678')).toBe(true); expect(isValidSignupEmailOtp('1234567')).toBe(false); expect(isValidSignupEmailOtp('123456789')).toBe(false); expect(isValidSignupEmailOtp('1234567a')).toBe(false); });
  it('accepts and distributes a complete eight-digit paste', async () => { const change = vi.fn(); const user = userEvent.setup(); render(<OtpInput value="" onChange={change} digitLabel="Digit" />); await user.click(screen.getByLabelText('Digit 1')); await user.paste('12-34 56-78'); expect(change).toHaveBeenCalledWith('12345678'); expect(screen.getByLabelText('Digit 8')).toHaveFocus(); });
  it('rejects pasted codes that are shorter or longer than eight digits', async () => { const change = vi.fn(); const user = userEvent.setup(); render(<OtpInput value="" onChange={change} digitLabel="Digit" />); await user.click(screen.getByLabelText('Digit 1')); await user.paste('1234567'); await user.paste('123456789'); expect(change).not.toHaveBeenCalled(); });
  it('provides eight accessible numeric controls', () => { render(<OtpInput value="123" onChange={() => undefined} digitLabel="Digit" />); expect(screen.getAllByLabelText(/Digit/)).toHaveLength(8); expect(screen.getByLabelText('Digit 1')).toHaveAttribute('inputmode', 'numeric'); expect(screen.getByLabelText('Digit 1')).toHaveAttribute('maxlength', '1'); });
  it('supports automatic focus, Backspace, and arrow navigation', async () => { const change = vi.fn(); const user = userEvent.setup(); render(<OtpInput value="" onChange={change} digitLabel="Digit" />); const first = screen.getByLabelText('Digit 1'); const second = screen.getByLabelText('Digit 2'); await user.click(first); await user.type(first, 'a2'); expect(change).toHaveBeenCalledWith('2'); expect(second).toHaveFocus(); await user.keyboard('{Backspace}'); expect(first).toHaveFocus(); await user.keyboard('{ArrowRight}'); expect(second).toHaveFocus(); });
});
