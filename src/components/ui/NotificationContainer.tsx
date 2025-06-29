import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationToast } from './NotificationToast';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed bottom-4 left-4 z-[9999] space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.slice(0, 5).map((notification, index) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={removeNotification}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};