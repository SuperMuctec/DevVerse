import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiquidTransitionProps {
  isTransitioning: boolean;
  onTransitionComplete: () => void;
  fromPage: string;
  toPage: string;
}

export const LiquidTransition: React.FC<LiquidTransitionProps> = ({
  isTransitioning,
  onTransitionComplete,
  fromPage,
  toPage
}) => {
  const [phase, setPhase] = useState<'melt' | 'reform' | 'complete'>('melt');

  useEffect(() => {
    if (isTransitioning) {
      setPhase('melt');
      
      // Ultra-fast melt phase - 300ms
      const meltTimer = setTimeout(() => {
        setPhase('reform');
        onTransitionComplete();
      }, 300);

      // Ultra-fast reform phase - 600ms total
      const reformTimer = setTimeout(() => {
        setPhase('complete');
      }, 600);

      return () => {
        clearTimeout(meltTimer);
        clearTimeout(reformTimer);
      };
    }
  }, [isTransitioning, onTransitionComplete]);

  if (!isTransitioning && phase === 'complete') return null;

  // Reduced number of drops for better performance
  const liquidDrops = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 30 + 15,
    delay: Math.random() * 0.1, // Much shorter delays
    color: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'][Math.floor(Math.random() * 4)]
  }));

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-[200] pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {/* Liquid drops melting down - FAST */}
          {phase === 'melt' && liquidDrops.map((drop) => (
            <motion.div
              key={`melt-${drop.id}`}
              className="absolute rounded-full"
              style={{
                left: `${drop.x}%`,
                top: `${drop.y}%`,
                width: drop.size,
                height: drop.size,
                background: `radial-gradient(circle, ${drop.color}60, ${drop.color}20)`,
                filter: 'blur(1px)',
              }}
              initial={{
                scale: 0,
                y: 0,
                opacity: 0,
              }}
              animate={{
                scale: [0, 1.2, 0.6],
                y: [0, window.innerHeight + 50],
                opacity: [0, 0.8, 0],
                rotate: [0, 180],
              }}
              transition={{
                duration: 0.3, // Super fast
                delay: drop.delay,
                ease: [0.4, 0, 0.6, 1], // Fast ease
              }}
            />
          ))}

          {/* Liquid drops reforming up - FAST */}
          {phase === 'reform' && liquidDrops.map((drop) => (
            <motion.div
              key={`reform-${drop.id}`}
              className="absolute rounded-full"
              style={{
                left: `${drop.x}%`,
                top: `${drop.y}%`,
                width: drop.size,
                height: drop.size,
                background: `radial-gradient(circle, ${drop.color}60, ${drop.color}20)`,
                filter: 'blur(1px)',
              }}
              initial={{
                scale: 0,
                y: window.innerHeight + 50,
                opacity: 0,
              }}
              animate={{
                scale: [0, 1, 0.8],
                y: [window.innerHeight + 50, 0],
                opacity: [0, 0.8, 0],
                rotate: [180, 0],
              }}
              transition={{
                duration: 0.3, // Super fast
                delay: drop.delay,
                ease: [0.4, 0, 0.6, 1], // Fast ease
              }}
            />
          ))}

          {/* Fast flowing liquid overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(45deg, 
                rgba(0, 255, 255, 0.05) 0%, 
                rgba(255, 0, 255, 0.05) 50%, 
                rgba(0, 255, 255, 0.05) 100%)`,
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%'],
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
          />

          {/* Minimal page transition text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <motion.h2
                className="font-orbitron text-xl sm:text-2xl font-bold"
                animate={{
                  color: ['#00ffff', '#ff00ff', '#00ffff'],
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {phase === 'melt' ? 'Transitioning...' : toPage}
              </motion.h2>
            </motion.div>
          </div>

          {/* Reduced particle effects for performance */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-0.5 h-0.5 bg-white/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: phase === 'melt' ? [0, window.innerHeight] : [window.innerHeight, 0],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 0.3,
                delay: Math.random() * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};