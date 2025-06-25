import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-64 sm:w-96 h-64 sm:h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #00ffff 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.8, 1],
          rotateZ: [0, 180, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ x: '10%', y: '20%' }}
      />
      
      <motion.div
        className="absolute w-48 sm:w-80 h-48 sm:h-80 rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, #ff00ff 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 80, -40, 0],
          scale: [0.8, 1.3, 0.9, 0.8],
          rotateZ: [0, -180, -360]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ x: '70%', y: '60%' }}
      />
      
      <motion.div
        className="absolute w-40 sm:w-64 h-40 sm:h-64 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #ffff00 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
        animate={{
          x: [0, 120, -80, 0],
          y: [0, -60, 90, 0],
          scale: [1.1, 0.7, 1.4, 1.1],
          rotateZ: [0, 360, 720]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ x: '40%', y: '80%' }}
      />

      {/* Additional smaller orbs for mobile */}
      <motion.div
        className="absolute w-32 h-32 rounded-full opacity-8 sm:hidden"
        style={{
          background: 'radial-gradient(circle, #00ff00 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 20, 0],
          scale: [0.8, 1.2, 0.8],
          rotateZ: [0, 180, 360]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ x: '80%', y: '30%' }}
      />

      {/* Floating geometric shapes */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white/20 rounded-full"
          animate={{
            y: [0, -50 - i * 10, 0],
            x: [0, Math.sin(i) * 30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
            rotateZ: [0, 360]
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
          style={{
            left: `${5 + i * 8}%`,
            top: `${10 + (i % 4) * 25}%`,
          }}
        />
      ))}

      {/* Pulsing rings */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute border border-white/10 rounded-full"
          style={{
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
            rotateZ: [0, 360]
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1,
          }}
        />
      ))}
    </div>
  );
};