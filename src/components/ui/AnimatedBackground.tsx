import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #00ffff 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ x: '10%', y: '20%' }}
      />
      
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, #ff00ff 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 80, -40, 0],
          scale: [0.8, 1.3, 0.9, 0.8],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ x: '70%', y: '60%' }}
      />
      
      <motion.div
        className="absolute w-64 h-64 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #ffff00 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
        animate={{
          x: [0, 120, -80, 0],
          y: [0, -60, 90, 0],
          scale: [1.1, 0.7, 1.4, 1.1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        initial={{ x: '40%', y: '80%' }}
      />

      {/* Floating geometric shapes */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(i) * 50, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
          style={{
            left: `${10 + i * 10}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
        />
      ))}
    </div>
  );
};