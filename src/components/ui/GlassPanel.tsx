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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`glass-panel p-6 ${className}`}
      style={{
        boxShadow: `0 0 20px ${glowColor}40, inset 0 0 20px ${glowColor}10`,
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 30px ${glowColor}60, inset 0 0 30px ${glowColor}20`,
      }}
    >
      {children}
    </motion.div>
  );
};