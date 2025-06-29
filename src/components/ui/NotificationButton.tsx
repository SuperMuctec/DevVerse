import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

export const NotificationButton: React.FC = () => {
  const { notifications, clearAll } = useNotifications();

  // Only show the button if there are notifications
  if (notifications.length === 0) {
    return null;
  }

  return (
    <motion.button
      onClick={clearAll}
      className="fixed bottom-20 right-6 z-50 lg:hidden w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg"
      whileHover={{ 
        scale: 1.1,
        boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)'
      }}
      whileTap={{ scale: 0.9 }}
      animate={{
        boxShadow: [
          '0 0 20px rgba(239, 68, 68, 0.4)',
          '0 0 30px rgba(239, 68, 68, 0.6)',
          '0 0 20px rgba(239, 68, 68, 0.4)'
        ]
      }}
      transition={{
        boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
      title="Clear all notifications"
    >
      <motion.div
        animate={{ 
          rotateZ: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotateZ: { duration: 4, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Trash2 className="w-5 h-5 text-white" />
      </motion.div>
      
      {/* Notification count badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          boxShadow: [
            '0 0 10px rgba(255, 255, 255, 0.5)',
            '0 0 20px rgba(255, 255, 255, 0.8)',
            '0 0 10px rgba(255, 255, 255, 0.5)'
          ]
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center"
      >
        <motion.span 
          className="text-red-600 text-xs font-bold"
          animate={{ 
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 1, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          {notifications.length > 9 ? '9+' : notifications.length}
        </motion.span>
      </motion.div>
    </motion.button>
  );
};