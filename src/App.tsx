import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './layout/Navbar';
import { Footer } from './layout/Footer';
import { CommandPalette } from './components/ui/CommandPalette';
import {
  HeroSection,
  ProductPreviewSection,
  FeaturesSection,
  TimelineSection,
  IndustriesSection,
  FAQSection,
} from './components/sections';

/* ═══════════════════════════════════════════════════════════════
   Aurora Background
   ═══════════════════════════════════════════════════════════════ */

function AuroraBackground() {
  return (
    <div className="aurora-bg">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-blob aurora-blob-4" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main App Content Component
   ═══════════════════════════════════════════════════════════════ */

function MainAppContent() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          {/* Global Ambient & Physics Cursor */}
          <AuroraBackground />
          <div className="noise-overlay" />

          {/* Navigation & Command Palette */}
          <Navbar onOpenSearch={() => setSearchOpen(true)} />
          <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

          <main>
            <HeroSection />
            <ProductPreviewSection />
            <FeaturesSection />
            <TimelineSection />
            <IndustriesSection />
            <FAQSection />
          </main>

          <Footer />
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Root App Wrapper with LanguageProvider
   ═══════════════════════════════════════════════════════════════ */

export default function App() {
  return (
    <LanguageProvider>
      <MainAppContent />
    </LanguageProvider>
  );
}
