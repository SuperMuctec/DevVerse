import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationToast } from './NotificationToast';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  // Only show the latest 3 notifications as toasts (desktop only)
  const toastNotifications = notifications.slice(0, 3);

  return (
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
              autoHide={true}
              hideDelay={4000}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};