import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const MagneticCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    if (!cursor || !cursorDot) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    };

    const handleMouseOver = () => {
      cursor.style.transform = 'scale(1.5)';
      cursor.style.borderColor = '#00ffff';
    };

    const handleMouseOut = () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.borderColor = '#ffffff';
    };

    document.addEventListener('mousemove', moveCursor);
    
    const interactiveElements = document.querySelectorAll('button, a, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseOver);
      el.addEventListener('mouseleave', handleMouseOut);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseOver);
        el.removeEventListener('mouseleave', handleMouseOut);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 border-2 border-white rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-150 ease-out"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1 h-1 bg-cyber-blue rounded-full pointer-events-none z-50"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
};