import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '../context/LanguageContext';
import { Navbar } from './Navbar';

const auth = vi.hoisted(() => ({ user: null as object | null, loading: false, signOut: vi.fn() }));
vi.mock('../auth/AuthContext', () => ({ useAuth: () => auth }));

function view() { return render(<MemoryRouter><LanguageProvider><Navbar onOpenSearch={() => undefined} /></LanguageProvider></MemoryRouter>); }

describe('authenticated navigation', () => {
  beforeEach(() => { auth.user = null; auth.loading = false; auth.signOut.mockReset(); });
  it('shows sign in and create account when logged out', () => { view(); expect(screen.getAllByText('Sign in').length).toBeGreaterThan(0); expect(screen.getAllByText('Create account').length).toBeGreaterThan(0); });
  it('shows account controls when logged in', () => { auth.user = {}; view(); expect(screen.getAllByText('Account').length).toBeGreaterThan(0); expect(screen.queryByText('Create account')).not.toBeInTheDocument(); });
});
