import React from 'react';
import { Notification } from '../../contexts/NotificationContext';

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  autoHide?: boolean;
  hideDelay?: number;
}

// Remove toast notifications - they now go directly to the panel
export const NotificationToast: React.FC<NotificationToastProps> = () => {
  return null;
};