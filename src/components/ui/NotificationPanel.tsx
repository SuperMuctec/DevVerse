import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Trash2, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { GlassPanel } from './GlassPanel';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, removeNotification, markAsRead, clearAll } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-yellow-400" />;
      case 'info':
      default:
        return <Info className="w-3 h-3 text-blue-400" />;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with higher z-index */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            onClick={onClose}
            style={{ cursor: 'default' }}
          />

          {/* Panel positioned below navbar */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-20 sm:top-24 right-0 bottom-0 w-full max-w-sm z-[10000] p-4"
            style={{ cursor: 'default' }}
          >
            <GlassPanel glowColor="#00ffff" className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
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
                    <Bell className="w-4 h-4 text-cyber-blue" />
                  </motion.div>
                  <h2 className="font-jetbrains text-base font-bold text-white">
                    Notifications
                  </h2>
                  {notifications.length > 0 && (
                    <span className="bg-cyber-blue/20 text-cyber-blue px-2 py-1 rounded-full text-xs font-jetbrains">
                      {notifications.length}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  {notifications.length > 0 && (
                    <motion.button
                      onClick={clearAll}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Clear all"
                    >
                      <Trash2 className="w-3 h-3 text-white/70" />
                    </motion.button>
                  )}
                  
                  <motion.button
                    onClick={onClose}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-3 h-3 text-white/70" />
                  </motion.button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto space-y-2">
                {notifications.length > 0 ? (
                  <AnimatePresence>
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.9 }}
                        transition={{ 
                          delay: index * 0.05,
                          duration: 0.3,
                          type: "spring"
                        }}
                        className={`relative p-2.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                          notification.read 
                            ? 'bg-white/5 border-white/10' 
                            : 'bg-cyber-blue/10 border-cyber-blue/30'
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-2">
                          <motion.div
                            animate={!notification.read ? { 
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, -10, 0]
                            } : {}}
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
                            <h4 className="font-semibold text-white text-xs leading-tight font-jetbrains">
                              {notification.title}
                            </h4>
                            <p className="text-white/80 text-xs mt-1 line-clamp-2 leading-tight font-jetbrains">
                              {notification.message}
                            </p>
                            <p className="text-white/50 text-xs mt-1.5 font-jetbrains">
                              {getTimeAgo(notification.timestamp)}
                            </p>
                          </div>

                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-2.5 h-2.5 text-white/70" />
                          </motion.button>
                        </div>

                        {/* Unread indicator */}
                        {!notification.read && (
                          <motion.div
                            className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-cyber-blue rounded-full"
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [1, 0.5, 1]
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              ease: "easeInOut" 
                            }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div
                      animate={{ 
                        rotateY: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <Bell className="w-8 h-8 text-white/30 mx-auto mb-3" />
                    </motion.div>
                    <p className="text-white/70 text-sm font-jetbrains">No notifications yet</p>
                    <p className="text-white/50 text-xs mt-1 font-jetbrains">
                      You'll see updates about your DevVerse³ activity here
                    </p>
                  </motion.div>
                )}
              </div>
            </GlassPanel>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};