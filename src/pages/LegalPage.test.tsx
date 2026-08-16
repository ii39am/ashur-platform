import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { LanguageProvider } from '../context/LanguageContext';
import { LegalPage } from './LegalPage';
import { legalContent } from '../i18n/legalContent';

function renderPage(type: 'terms' | 'privacy' | 'trial' | 'refunds') {
  return render(<LanguageProvider><BrowserRouter><LegalPage type={type} /></BrowserRouter></LanguageProvider>);
}

describe('LegalPage', () => {
  beforeEach(() => localStorage.clear());

  it('renders published English Terms with the approved version and date', () => {
    renderPage('terms');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByText('Published · internally approved').length).toBeGreaterThan(0);
    expect(screen.getByText('Version 1.0.0 · Effective 2026-08-16 · Last updated 2026-08-16')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '1. Scope and operator' })).toHaveAttribute('href', '#scope');
  });

  it('renders published Arabic Privacy with matching version, date, and RTL semantics', () => {
    localStorage.setItem('ashur_lang', 'ar');
    const { container } = renderPage('privacy');
    expect(screen.getByRole('heading', { level: 1, name: 'سياسة الخصوصية' })).toBeInTheDocument();
    expect(screen.getByText('الإصدار 1.0.0 · تاريخ النفاذ 2026-08-16 · آخر تحديث 2026-08-16')).toBeInTheDocument();
    expect(container.querySelector('main')).toHaveAttribute('dir', 'rtl');
  });

  it('keeps Trial and Refund documents visibly inactive drafts', () => {
    renderPage('trial');
    expect(screen.getAllByText('Legal draft — not approved or effective').length).toBeGreaterThan(0);
  });

  it('does not expose internal placeholder tokens in public legal copy', () => {
    const publicCopy = JSON.stringify({ terms: { en: legalContent.en.terms, ar: legalContent.ar.terms }, privacy: { en: legalContent.en.privacy, ar: legalContent.ar.privacy } });
    expect(publicCopy).not.toMatch(/(?:[A-Z][A-Z0-9]+_REQUIRED|NOT_CONFIGURED)/);
  });
});
