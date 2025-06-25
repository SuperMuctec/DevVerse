import React from 'react';
import { motion } from 'framer-motion';

export const FloatingElements: React.FC = () => {
  const elements = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 8 + 8,
    delay: Math.random() * 4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute rounded-full bg-gradient-to-r from-cyber-blue/20 to-cyber-pink/20 backdrop-blur-sm"
          style={{
            width: element.size,
            height: element.size,
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, -10, 0],
            scale: [1, 1.3, 0.7, 1],
            opacity: [0.3, 0.8, 0.3],
            rotateZ: [0, 180, 360],
            rotateY: [0, 180, 360]
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Additional 3D floating cubes */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`cube-${i}`}
          className="absolute w-2 h-2 bg-gradient-to-br from-cyber-yellow/30 to-cyber-green/30 backdrop-blur-sm"
          style={{
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 3) * 30}%`,
            transformStyle: 'preserve-3d'
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            rotateX: [0, 360],
            rotateY: [0, 360],
            rotateZ: [0, 180, 360],
            scale: [1, 1.5, 0.8, 1],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 10 + i * 2,
            delay: i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Orbiting particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`orbit-${i}`}
          className="absolute w-1 h-1 bg-white/40 rounded-full"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.div
            className="w-1 h-1 bg-cyber-blue/60 rounded-full"
            style={{
              position: 'absolute',
              left: `${50 + i * 20}px`,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};