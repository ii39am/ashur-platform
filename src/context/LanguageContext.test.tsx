import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LanguageProvider, useLanguage } from './LanguageContext';

function Harness() { const { language, toggleLanguage, dir } = useLanguage(); const [value, setValue] = useState('Ashur'); return <><input aria-label="name" value={value} onChange={(event) => setValue(event.target.value)} /><span>{language}:{dir}</span><button onClick={toggleLanguage}>switch</button></>; }
describe('bilingual onboarding state', () => { it('switches RTL/LTR without clearing entered form data', async () => { const user = userEvent.setup(); render(<LanguageProvider><Harness /></LanguageProvider>); const input = screen.getByLabelText('name'); await user.clear(input); await user.type(input, 'Esam'); await user.click(screen.getByRole('button', { name: 'switch' })); expect(input).toHaveValue('Esam'); expect(screen.getByText('ar:rtl')).toBeInTheDocument(); expect(document.documentElement).toHaveAttribute('dir', 'rtl'); }); });
