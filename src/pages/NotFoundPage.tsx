import React from 'react';
import { Link } from 'react-router-dom';
export function NotFoundPage() { return <main className="flex min-h-screen items-center justify-center bg-dark-950 px-4"><div className="text-center"><p className="text-brand-400">404</p><h1 className="mt-3 text-4xl font-bold text-white">Page not found</h1><Link to="/" className="mt-6 inline-flex min-h-11 items-center text-brand-400">Return home</Link></div></main>; }
