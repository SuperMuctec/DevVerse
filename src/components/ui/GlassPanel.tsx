import React from 'react';
import { motion } from 'framer-motion';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  className = '', 
  glowColor = '#00ffff' 
}) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 30, 
        rotateX: -15,
        scale: 0.9
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        scale: 1
      }}
      transition={{ 
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className={`glass-panel p-4 sm:p-6 ${className}`}
      style={{
        boxShadow: `0 0 20px ${glowColor}40, inset 0 0 20px ${glowColor}10`,
        perspective: '1000px'
      }}
      whileHover={{
        scale: 1.02,
        rotateY: 2,
        rotateX: 2,
        boxShadow: `0 0 40px ${glowColor}60, inset 0 0 30px ${glowColor}20`,
        transition: { duration: 0.3 }
      }}
      whileTap={{
        scale: 0.98,
        rotateY: -1,
        rotateX: -1
      }}
    >
      <motion.div
        initial={{ opacity: 0, z: -50 }}
        animate={{ opacity: 1, z: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};