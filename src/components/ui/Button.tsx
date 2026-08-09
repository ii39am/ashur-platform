import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   Button — Magnetic + Ripple + Glow
   ═══════════════════════════════════════════════════════════════ */

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  'data-cursor'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
  icon,
}) => {
  const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
    el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }, []);

  const handleMouseEnter = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    el.style.transition = 'none';
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const ripple = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        id: Date.now(),
      };
      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)), 800);
      onClick?.();
    },
    [onClick]
  );

  const baseStyles =
    'relative overflow-hidden inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 cursor-pointer select-none';

  const variants: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-brand-500 to-cyan-500 text-white hover:shadow-[0_10px_28px_rgba(8,184,194,0.2)] active:scale-[0.97]',
    secondary:
      'bg-dark-700 text-white border border-white/10 hover:border-brand-500/50 hover:bg-dark-600 active:scale-[0.97]',
    ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/5 active:scale-[0.97]',
    outline:
      'bg-transparent text-brand-400 border border-brand-500/30 hover:border-brand-500 hover:bg-brand-500/10 active:scale-[0.97]',
  };

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const combinedClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {icon && <span className="text-lg">{icon}</span>}
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/20 animate-[ping_0.8s_ease-out_forwards] pointer-events-none"
          style={{
            left: ripple.x - 5,
            top: ripple.y - 5,
            width: 10,
            height: 10,
          }}
        />
      ))}
    </>
  );

  if (href) {
    return (
      <motion.a
        ref={btnRef as React.RefObject<HTMLAnchorElement | null>}
        href={href}
        className={combinedClass}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        whileTap={{ scale: 0.97 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      ref={btnRef as React.RefObject<HTMLButtonElement | null>}
      className={combinedClass}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
    >
      {content}
    </motion.button>
  );
};
