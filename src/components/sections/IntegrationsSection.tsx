import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionWrapper, SectionHeader } from '../ui';
import { useLanguage } from '../../context/LanguageContext';

const integrations = [
  { name: 'Stripe', color: '#635bff' },
  { name: 'PayPal', color: '#003087' },
  { name: 'WhatsApp', color: '#25d366' },
  { name: 'Google', color: '#4285f4' },
  { name: 'Microsoft', color: '#00a4ef' },
  { name: 'Amazon', color: '#ff9900' },
  { name: 'AWS', color: '#ff9900' },
  { name: 'Shopify', color: '#96bf48' },
  { name: 'WooCommerce', color: '#96588a' },
  { name: 'QuickBooks', color: '#2ca01c' },
  { name: 'Slack', color: '#4a154b' },
  { name: 'Zoom', color: '#2d8cff' },
  { name: 'Meta', color: '#0668e1' },
  { name: 'TikTok', color: '#ff0050' },
  { name: 'OpenAI', color: '#10a37f' },
];

export const IntegrationsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const { t } = useLanguage();

  return (
    <SectionWrapper id="integrations">
      <SectionHeader
        badge={t.integrations.badge}
        title={t.integrations.title}
        titleHighlight={t.integrations.titleHighlight}
        description={t.integrations.description}
      />

      {/* Orbit Layout */}
      <div ref={containerRef} className="relative flex items-center justify-center min-h-[500px]">
        {/* Center Logo */}
        <motion.div
          className="relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-brand-500/30"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <span className="text-2xl font-bold text-white">A</span>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 blur-2xl opacity-40" />
        </motion.div>

        {/* Orbit Rings */}
        {[160, 230].map((radius, ringIndex) => (
          <div
            key={ringIndex}
            className="absolute rounded-full border border-white/5"
            style={{ width: radius * 2, height: radius * 2 }}
          />
        ))}

        {/* Integration Nodes */}
        {integrations.map((item, i) => {
          const totalItems = integrations.length;
          const ring = i < 8 ? 0 : 1;
          const ringRadius = ring === 0 ? 160 : 230;
          const itemsInRing = ring === 0 ? 8 : totalItems - 8;
          const indexInRing = ring === 0 ? i : i - 8;
          const angle = (indexInRing / itemsInRing) * Math.PI * 2 - Math.PI / 2;

          const x = Math.cos(angle) * ringRadius;
          const y = Math.sin(angle) * ringRadius;

          return (
            <motion.div
              key={item.name}
              className="absolute z-10 group cursor-default"
              style={{
                left: `calc(50% + ${x}px - 24px)`,
                top: `calc(50% + ${y}px - 24px)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                delay: 0.3 + i * 0.08,
                duration: 0.5,
                type: 'spring',
                stiffness: 200,
              }}
            >
              <motion.div
                className="w-12 h-12 rounded-xl glass-card flex items-center justify-center hover:scale-125 transition-transform duration-300"
                whileHover={{ y: -5 }}
              >
                <span
                  className="text-sm font-bold"
                  style={{ color: item.color }}
                >
                  {item.name.substring(0, 2)}
                </span>

                {/* Tooltip */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <span className="text-xs text-white bg-dark-700 px-2 py-1 rounded-md whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
              </motion.div>

              {/* Connector line */}
              <svg
                className="absolute pointer-events-none opacity-20"
                style={{
                  left: x > 0 ? '-100%' : '100%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: Math.abs(x) < 50 ? 0 : '20px',
                  height: '1px',
                }}
              >
                <line x1="0" y1="0" x2="20" y2="0" stroke={item.color} strokeWidth="1" />
              </svg>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};
