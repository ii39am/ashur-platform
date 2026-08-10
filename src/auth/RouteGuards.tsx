import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

function AuthLoading() {
  return <main className="flex min-h-screen items-center justify-center bg-dark-950" aria-busy="true"><p className="text-slate-300">Restoring your secure session…</p></main>;
}

export function RequireAuth() {
  const auth = useAuth();
  const location = useLocation();
  if (auth.loading) return <AuthLoading />;
  if (!auth.user) return <Navigate to="/sign-in" replace state={{ from: `${location.pathname}${location.search}` }} />;
  return <Outlet />;
}

export function RequireVerifiedEmail() {
  const auth = useAuth();
  const location = useLocation();
  if (auth.loading) return <AuthLoading />;
  if (!auth.user) return <Navigate to="/sign-in" replace state={{ from: `${location.pathname}${location.search}` }} />;
  if (!auth.verified) return <Navigate to="/verify-email" replace state={{ from: `${location.pathname}${location.search}` }} />;
  return <Outlet />;
}

export function GuestOnly() {
  const auth = useAuth();
  if (auth.loading) return <AuthLoading />;
  if (auth.user) return <Navigate to="/account" replace />;
  return <Outlet />;
}
