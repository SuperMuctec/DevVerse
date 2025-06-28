import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
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
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
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
      className={`relative backdrop-blur-md border rounded-lg p-3 shadow-lg max-w-xs ${getColors()}`}
    >
      <div className="flex items-start space-x-2">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="flex-shrink-0 mt-0.5"
        >
          {getIcon()}
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm">
            {notification.title}
          </h4>
          <p className="text-white/80 text-xs mt-1 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-white/50 text-xs mt-1">
            {notification.timestamp.toLocaleTimeString()}
          </p>
        </div>

        <motion.button
          onClick={() => onDismiss(notification.id)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-3 h-3 text-white/70" />
        </motion.button>
      </div>

      {/* Progress bar for auto-hide */}
      {autoHide && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-white/30 rounded-b-lg"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: hideDelay / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
};