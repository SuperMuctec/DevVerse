import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationPanel } from './NotificationPanel';

export const NotificationButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <>
      {/* Mobile Notification Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 lg:hidden w-12 h-12 bg-gradient-to-r from-cyber-blue to-cyber-pink rounded-full flex items-center justify-center shadow-lg"
        whileHover={{ 
          scale: 1.1,
          boxShadow: '0 0 30px rgba(0, 255, 255, 0.6)'
        }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(0, 255, 255, 0.4)',
            '0 0 30px rgba(255, 0, 255, 0.6)',
            '0 0 20px rgba(0, 255, 255, 0.4)'
          ]
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <motion.div
          animate={{ 
            rotateZ: [0, 15, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Bell className="w-5 h-5 text-white" />
        </motion.div>
        
        {/* Unread count badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              boxShadow: [
                '0 0 10px rgba(255, 0, 0, 0.5)',
                '0 0 20px rgba(255, 0, 0, 0.8)',
                '0 0 10px rgba(255, 0, 0, 0.5)'
              ]
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
          >
            <motion.span 
              className="text-white text-xs font-bold"
              animate={{ 
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          </motion.div>
        )}
      </motion.button>

      {/* Notification Panel */}
      <NotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};