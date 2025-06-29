import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { Notification } from '../../contexts/NotificationContext';

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  autoHide?: boolean;
  hideDelay?: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onDismiss,
  autoHide = true,
  hideDelay = 4000
}) => {
  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        onDismiss(notification.id);
      }, hideDelay);

      return () => clearTimeout(timer);
    }
  }, [notification.id, onDismiss, autoHide, hideDelay]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'error':
        return <X className="w-6 h-6 text-red-400" />;
      case 'warning':
        return <X className="w-6 h-6 text-yellow-400" />;
      case 'info':
      default:
        return <CheckCircle className="w-6 h-6 text-blue-400" />;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-500/50 bg-green-500/10';
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'info':
      default:
        return 'border-blue-500/50 bg-blue-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", duration: 0.5 }}
      onClick={() => onDismiss(notification.id)}
      className={`relative backdrop-blur-md border rounded-full p-3 shadow-lg cursor-pointer ${getColors()}`}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: notification.type === 'success' ? [0, 360] : [0, 10, -10, 0]
        }}
        transition={{ 
          duration: notification.type === 'success' ? 2 : 1, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        {getIcon()}
      </motion.div>

      {/* Progress bar for auto-hide */}
      {autoHide && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-white/30 rounded-b-full"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: hideDelay / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
};