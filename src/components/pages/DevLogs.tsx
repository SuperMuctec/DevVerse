import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, Hash, Plus } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { CreateDevLogModal } from '../modals/CreateDevLogModal';
import { mockDevLogs } from '../../data/mockData';
import { CreateDevLogData, DevLog } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const DevLogs: React.FC = () => {
  const [showCreateDevLog, setShowCreateDevLog] = useState(false);
  const [devLogs, setDevLogs] = useState(mockDevLogs);
  const { user } = useAuth();

  const handleCreateDevLog = (data: CreateDevLogData) => {
    const newDevLog: DevLog = {
      id: Date.now().toString(),
      ...data,
      author: user?.username || 'Anonymous',
      createdAt: new Date(),
      likes: 0,
    };

    setDevLogs(prev => [newDevLog, ...prev]);
    toast.success('DevLog published successfully!');
  };

  const handleLike = (logId: string) => {
    setDevLogs(prev => prev.map(log => 
      log.id === logId 
        ? { ...log, likes: log.likes + 1 }
        : log
    ));
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-orbitron text-5xl font-bold mb-4">
            <span className="neon-text text-cyber-blue">Dev</span>
            <span className="neon-text text-cyber-pink">Logs</span>
          </h1>
          <p className="font-sora text-xl text-white/70">
            Holographic chronicles from the coding frontier
          </p>
        </motion.div>

        <div className="mb-8 text-center">
          <motion.button
            onClick={() => setShowCreateDevLog(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyber-blue to-cyber-pink px-6 py-3 rounded-lg font-orbitron font-bold text-white hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Create New DevLog</span>
          </motion.button>
        </div>

        <div className="space-y-8">
          {devLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <GlassPanel 
                glowColor={index % 2 === 0 ? '#00ffff' : '#ff00ff'}
                className="hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="mb-4">
                  <h2 className="font-orbitron text-2xl font-bold mb-2 neon-text">
                    {log.title}
                  </h2>
                  
                  <div className="flex items-center space-x-6 text-sm text-white/60 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{log.createdAt.toLocaleDateString()}</span>
                    </div>
                    <motion.button
                      onClick={() => handleLike(log.id)}
                      className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className="w-4 h-4" />
                      <span>{log.likes}</span>
                    </motion.button>
                    <span className="font-semibold text-cyber-blue">
                      @{log.author}
                    </span>
                  </div>
                </div>

                <p className="font-sora text-white/80 leading-relaxed mb-4">
                  {log.content}
                </p>

                <div className="flex flex-wrap gap-2">
                  {log.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 bg-cyber-blue/20 px-2 py-1 rounded-full text-xs font-sora text-cyber-blue"
                    >
                      <Hash className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>

        <CreateDevLogModal
          isOpen={showCreateDevLog}
          onClose={() => setShowCreateDevLog(false)}
          onSubmit={handleCreateDevLog}
        />
      </div>
    </div>
  );
};