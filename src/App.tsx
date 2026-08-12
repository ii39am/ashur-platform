import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './auth/AuthContext';
import { GuestOnly, RequireAuth, RequireCompletedProfile } from './auth/RouteGuards';
import { SiteLayout } from './layout/SiteLayout';
import { HomePage } from './pages/HomePage';
const SignInPage = lazy(() => import('./pages/SignInPage').then((module) => ({ default: module.SignInPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((module) => ({ default: module.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then((module) => ({ default: module.ResetPasswordPage })));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage').then((module) => ({ default: module.AuthCallbackPage })));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage').then((module) => ({ default: module.VerifyEmailPage })));
const AccountCreatedPage = lazy(() => import('./pages/AccountCreatedPage').then((module) => ({ default: module.AccountCreatedPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then((module) => ({ default: module.AccountPage })));
const DownloadPage = lazy(() => import('./pages/DownloadPage').then((module) => ({ default: module.DownloadPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then((module) => ({ default: module.PricingPage })));
const LegalPage = lazy(() => import('./pages/LegalPage').then((module) => ({ default: module.LegalPage })));
const SupportPage = lazy(() => import('./pages/SupportPage').then((module) => ({ default: module.SupportPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

function RouteLoading() {
  return <main className="flex min-h-screen items-center justify-center bg-dark-950" aria-busy="true"><p className="text-slate-300">Loading page…</p></main>;
}

export default function App() {
  return <LanguageProvider><BrowserRouter><AuthProvider><Suspense fallback={<RouteLoading />}><Routes>
    <Route element={<SiteLayout />}>
      <Route index element={<HomePage />} />
      <Route path="pricing" element={<PricingPage />} />
      <Route path="support" element={<SupportPage />} />
      <Route path="privacy" element={<LegalPage type="privacy" />} />
      <Route path="terms" element={<LegalPage type="terms" />} />
      <Route path="refund-policy" element={<LegalPage type="refunds" />} />
      <Route path="trial-download-policy" element={<LegalPage type="trial" />} />
      <Route element={<RequireAuth />}><Route path="account" element={<AccountPage />} /></Route>
      <Route path="verify-email" element={<VerifyEmailPage />} />
      <Route element={<RequireCompletedProfile />}><Route path="download" element={<DownloadPage />} /><Route path="account-created" element={<AccountCreatedPage />} /></Route>
    </Route>
    <Route path="create-account" element={<RegisterPage />} />
    <Route element={<GuestOnly />}><Route path="sign-in" element={<SignInPage />} /><Route path="forgot-password" element={<ForgotPasswordPage />} /></Route>
    <Route path="auth/callback" element={<AuthCallbackPage />} />
    <Route path="auth/reset-password" element={<ResetPasswordPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></Suspense></AuthProvider></BrowserRouter></LanguageProvider>;
}
