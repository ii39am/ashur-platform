import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  glow?: boolean;
  glowColor?: string;
  hoverScale?: number;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  tilt = true,
  glow = false,
  glowColor = 'rgba(59, 130, 246, 0.15)',
  hoverScale = 1.02,
  delay = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!tilt) return;
      const el = cardRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(${hoverScale}, ${hoverScale}, 1)`;

      if (glowRef.current) {
        glowRef.current.style.opacity = '1';
        glowRef.current.style.background = `radial-gradient(600px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, ${glowColor}, transparent 40%)`;
      }
    },
    [tilt, hoverScale, glowColor]
  );

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    el.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = 'none';
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card relative rounded-2xl overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {glow && (
        <div
          ref={glowRef}
          className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-0"
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
