import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationToast } from './NotificationToast';
import { NotificationPanel } from './NotificationPanel';
import { Notification } from '../../contexts/NotificationContext';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();
  const [expandedNotification, setExpandedNotification] = useState<Notification | null>(null);

  // Only show the latest 3 notifications as toasts (desktop only)
  const toastNotifications = notifications.slice(0, 3);

  const handleExpand = (notification: Notification) => {
    setExpandedNotification(notification);
  };

  return (
    <>
      {/* Desktop notification toasts - hidden on mobile */}
      <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none hidden lg:block">
        <AnimatePresence>
          {toastNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              className="pointer-events-auto"
              layout
            >
              <NotificationToast
                notification={notification}
                onDismiss={removeNotification}
                onExpand={handleExpand}
                autoHide={true}
                hideDelay={4000}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Expanded notification modal */}
      <AnimatePresence>
        {expandedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setExpandedNotification(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
            >
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0">
                  {expandedNotification.type === 'success' && <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}><CheckCircle className="w-6 h-6 text-green-400" /></motion.div>}
                  {expandedNotification.type === 'error' && <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}><AlertCircle className="w-6 h-6 text-red-400" /></motion.div>}
                  {expandedNotification.type === 'warning' && <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}><AlertTriangle className="w-6 h-6 text-yellow-400" /></motion.div>}
                  {expandedNotification.type === 'info' && <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}><Info className="w-6 h-6 text-blue-400" /></motion.div>}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-orbitron text-lg font-bold text-white mb-2">
                    {expandedNotification.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {expandedNotification.message}
                  </p>
                  <p className="text-white/50 text-sm mt-3">
                    {expandedNotification.timestamp.toLocaleString()}
                  </p>
                </div>

                <motion.button
                  onClick={() => setExpandedNotification(null)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-white/70" />
                </motion.button>
              </div>

              <motion.button
                onClick={() => setExpandedNotification(null)}
                className="w-full bg-gradient-to-r from-cyber-blue to-cyber-pink py-2 px-4 rounded-lg font-semibold text-white transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};