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
      
      // Melt phase duration
      const meltTimer = setTimeout(() => {
        setPhase('reform');
        onTransitionComplete();
      }, 800);

      // Reform phase duration
      const reformTimer = setTimeout(() => {
        setPhase('complete');
      }, 1600);

      return () => {
        clearTimeout(meltTimer);
        clearTimeout(reformTimer);
      };
    }
  }, [isTransitioning, onTransitionComplete]);

  if (!isTransitioning && phase === 'complete') return null;

  const liquidDrops = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 40 + 20,
    delay: Math.random() * 0.5,
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
        >
          {/* Liquid drops melting down */}
          {phase === 'melt' && liquidDrops.map((drop) => (
            <motion.div
              key={`melt-${drop.id}`}
              className="absolute rounded-full"
              style={{
                left: `${drop.x}%`,
                top: `${drop.y}%`,
                width: drop.size,
                height: drop.size,
                background: `radial-gradient(circle, ${drop.color}80, ${drop.color}40)`,
                filter: 'blur(2px)',
              }}
              initial={{
                scale: 0,
                y: 0,
                opacity: 0,
              }}
              animate={{
                scale: [0, 1.5, 0.8],
                y: [0, window.innerHeight + 100],
                opacity: [0, 1, 0.8, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 0.8,
                delay: drop.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          ))}

          {/* Liquid drops reforming up */}
          {phase === 'reform' && liquidDrops.map((drop) => (
            <motion.div
              key={`reform-${drop.id}`}
              className="absolute rounded-full"
              style={{
                left: `${drop.x}%`,
                top: `${drop.y}%`,
                width: drop.size,
                height: drop.size,
                background: `radial-gradient(circle, ${drop.color}80, ${drop.color}40)`,
                filter: 'blur(2px)',
              }}
              initial={{
                scale: 0,
                y: window.innerHeight + 100,
                opacity: 0,
              }}
              animate={{
                scale: [0, 1.2, 1],
                y: [window.innerHeight + 100, 0],
                opacity: [0, 0.8, 1, 0],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 0.8,
                delay: drop.delay,
                ease: [0.55, 0.06, 0.68, 0.19],
              }}
            />
          ))}

          {/* Flowing liquid overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(45deg, 
                rgba(0, 255, 255, 0.1) 0%, 
                rgba(255, 0, 255, 0.1) 25%, 
                rgba(255, 255, 0, 0.1) 50%, 
                rgba(0, 255, 0, 0.1) 75%, 
                rgba(0, 255, 255, 0.1) 100%)`,
              backgroundSize: '400% 400%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 1.6,
              ease: "easeInOut",
            }}
          />

          {/* Page transition text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <motion.h2
                className="font-orbitron text-2xl sm:text-4xl font-bold mb-2"
                animate={{
                  color: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#00ffff'],
                  textShadow: [
                    '0 0 20px #00ffff',
                    '0 0 30px #ff00ff',
                    '0 0 25px #ffff00',
                    '0 0 35px #00ff00',
                    '0 0 20px #00ffff'
                  ]
                }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              >
                {phase === 'melt' ? 'Dissolving Reality...' : 'Reconstructing Universe...'}
              </motion.h2>
              <motion.p
                className="text-white/70 font-sora"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {fromPage} → {toPage}
              </motion.p>
            </motion.div>
          </div>

          {/* Particle effects */}
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-white/60 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: phase === 'melt' ? [0, window.innerHeight] : [window.innerHeight, 0],
                x: [0, Math.sin(i) * 50],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: phase === 'melt' ? 0.8 : 0.8,
                delay: Math.random() * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};