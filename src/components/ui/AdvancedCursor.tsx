import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const AdvancedCursor: React.FC = () => {
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target as HTMLElement;
      const hoverAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      if (hoverAttr) {
        setCursorText(hoverAttr);
        setIsHovered(true);
      } else if (target.closest('button, a, input, select')) {
        setCursorText('');
        setIsHovered(true);
      } else {
        setCursorText('');
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden hidden md:block">
      {/* Outer Spring Ring */}
      <motion.div
        className={`absolute rounded-full border border-brand-400/40 mix-blend-screen transition-all duration-300 flex items-center justify-center ${
          isHovered ? 'w-16 h-16 -ml-8 -mt-8 bg-brand-500/10 border-brand-400' : 'w-8 h-8 -ml-4 -mt-4 bg-transparent'
        }`}
        style={{
          x: cursorX,
          y: cursorY,
          scale: isClicking ? 0.8 : 1,
        }}
      >
        {cursorText && (
          <span className="text-[10px] font-bold tracking-wider uppercase text-white bg-brand-600/80 px-2 py-0.5 rounded-full shadow-lg">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        className="absolute w-2 h-2 -ml-1 -mt-1 bg-brand-400 rounded-full shadow-[0_0_10px_#3b82f6]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />
    </div>
  );
};
