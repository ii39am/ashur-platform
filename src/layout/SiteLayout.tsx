import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CommandPalette } from '../components/ui/CommandPalette';

export function SiteLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  React.useEffect(() => {
    if (location.hash) requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
    else window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);
  return <>
    <Navbar onOpenSearch={() => setSearchOpen(true)} />
    <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    <Outlet />
    <Footer />
  </>;
}
