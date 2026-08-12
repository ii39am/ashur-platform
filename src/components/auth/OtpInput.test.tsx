import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OtpInput } from './OtpInput';

describe('OTP input', () => {
  it('accepts and sanitizes a six-digit paste', async () => { const change = vi.fn(); const user = userEvent.setup(); render(<OtpInput value="" onChange={change} digitLabel="Digit" />); await user.click(screen.getByLabelText('Digit 1')); await user.paste('12-34 56'); expect(change).toHaveBeenCalledWith('123456'); });
  it('provides six accessible numeric controls', () => { render(<OtpInput value="123" onChange={() => undefined} digitLabel="Digit" />); expect(screen.getAllByLabelText(/Digit/)).toHaveLength(6); expect(screen.getByLabelText('Digit 1')).toHaveAttribute('inputmode', 'numeric'); });
});
