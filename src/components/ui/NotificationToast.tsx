import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Notification } from '../../contexts/NotificationContext';

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  autoHide?: boolean;
  hideDelay?: number;
  index: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ 
  notification, 
  onDismiss, 
  autoHide = true, 
  hideDelay = 4000,
  index 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss(notification.id), 300);
      }, hideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, hideDelay, notification.id, onDismiss]);

  const getIcon = (type: string) => {
    switch (type) {
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

  const getColorClasses = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'info':
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            duration: 0.5,
            delay: index * 0.1 
          }}
          className={`
            relative p-4 rounded-lg border backdrop-blur-md shadow-lg
            ${getColorClasses(notification.type)}
            max-w-sm w-full
          `}
          style={{
            boxShadow: `0 0 20px ${
              notification.type === 'success' ? '#10b981' :
              notification.type === 'error' ? '#ef4444' :
              notification.type === 'warning' ? '#f59e0b' :
              '#3b82f6'
            }40`
          }}
        >
          <div className="flex items-start space-x-3">
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
              {getIcon(notification.type)}
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white text-sm leading-tight font-jetbrains">
                {notification.title}
              </h4>
              <p className="text-white/80 text-sm mt-1 leading-tight font-jetbrains">
                {notification.message}
              </p>
            </div>

            <motion.button
              onClick={handleDismiss}
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
              className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: hideDelay / 1000, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};