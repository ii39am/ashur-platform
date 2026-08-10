import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection, ProductPreviewSection, FeaturesSection, TimelineSection, IndustriesSection, FAQSection } from '../components/sections';
import { HomePricingSection } from '../components/sections/HomePricingSection';

export function HomePage() {
  return <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .25 }}>
    <HeroSection />
    <ProductPreviewSection />
    <FeaturesSection />
    <TimelineSection />
    <IndustriesSection />
    <HomePricingSection />
    <FAQSection />
  </motion.main>;
}
