import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RequireAuth, RequireCompletedProfile, RequireVerifiedEmail } from './RouteGuards';

const authState = vi.hoisted(() => ({ user: null as object | null, loading: false, verified: false, profile: null as object | null, profileLoading: false }));
vi.mock('./AuthContext', () => ({ useAuth: () => ({ ...authState }) }));

function renderGuard(guard: React.ReactElement, path = '/download') {
  return render(<MemoryRouter initialEntries={[path]}><Routes><Route element={guard}><Route path="/download" element={<p>Protected download</p>} /></Route><Route path="/sign-in" element={<p>Sign in page</p>} /><Route path="/verify-email" element={<p>Verify page</p>} /></Routes></MemoryRouter>);
}

describe('route guards', () => {
  beforeEach(() => { authState.user = null; authState.loading = false; authState.verified = false; authState.profile = null; authState.profileLoading = false; });
  it('redirects unauthenticated users', () => { renderGuard(<RequireAuth />); expect(screen.getByText('Sign in page')).toBeInTheDocument(); });
  it('does not flash protected content while loading', () => { authState.loading = true; renderGuard(<RequireAuth />); expect(screen.queryByText('Protected download')).not.toBeInTheDocument(); expect(screen.getByText(/restoring/i)).toBeInTheDocument(); });
  it('redirects unverified users away from downloads', () => { authState.user = {}; renderGuard(<RequireVerifiedEmail />); expect(screen.getByText('Verify page')).toBeInTheDocument(); });
  it('allows verified users to reach downloads', () => { authState.user = {}; authState.verified = true; renderGuard(<RequireVerifiedEmail />); expect(screen.getByText('Protected download')).toBeInTheDocument(); });
  it('requires a completed profile for trial downloads', () => { authState.user = {}; authState.verified = true; renderGuard(<RequireCompletedProfile />); expect(screen.getByText('Verify page')).toBeInTheDocument(); authState.profile = {}; renderGuard(<RequireCompletedProfile />); expect(screen.getByText('Protected download')).toBeInTheDocument(); });
});
