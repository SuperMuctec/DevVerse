import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationToast } from './NotificationToast';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  // Only show the most recent 5 notifications
  const visibleNotifications = notifications.slice(0, 5);

  return (
    <div className="fixed bottom-4 left-4 z-[9999] space-y-2 max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {visibleNotifications.map((notification, index) => (
          <div key={notification.id} className="pointer-events-auto">
            <NotificationToast
              notification={notification}
              onDismiss={removeNotification}
              index={index}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};