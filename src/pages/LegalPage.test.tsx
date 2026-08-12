import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { LanguageProvider } from '../context/LanguageContext';
import { LegalPage } from './LegalPage';

function renderPage(type: 'terms' | 'privacy' | 'trial' | 'refunds') {
  return render(<LanguageProvider><BrowserRouter><LegalPage type={type} /></BrowserRouter></LanguageProvider>);
}

describe('LegalPage', () => {
  beforeEach(() => localStorage.clear());

  it('renders a draft warning, one h1, and navigable sections', () => {
    renderPage('terms');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByText('Legal draft — not approved or effective').length).toBeGreaterThan(0);
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '1. Scope and operator' })).toHaveAttribute('href', '#scope');
  });

  it('renders the Arabic draft with RTL semantics', () => {
    localStorage.setItem('ashur_lang', 'ar');
    const { container } = renderPage('privacy');
    expect(screen.getByRole('heading', { level: 1, name: 'سياسة الخصوصية' })).toBeInTheDocument();
    expect(container.querySelector('main')).toHaveAttribute('dir', 'rtl');
  });
});
