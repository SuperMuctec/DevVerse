import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, Hash, Plus, Search, Filter } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { CreateDevLogModal } from '../modals/CreateDevLogModal';
import { CreateDevLogData, DevLog } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const DevLogs: React.FC = () => {
  const [showCreateDevLog, setShowCreateDevLog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const { user } = useAuth();

  // Get user-created devlogs from localStorage
  const getUserDevLogs = (): DevLog[] => {
    const users = JSON.parse(localStorage.getItem('devverse_users') || '[]');
    const allDevLogs: DevLog[] = [];
    
    users.forEach((userData: any) => {
      const userDevLogs = JSON.parse(localStorage.getItem(`devlogs_${userData.id}`) || '[]');
      userDevLogs.forEach((devlog: any) => {
        allDevLogs.push({
          ...devlog,
          author: userData.username,
          createdAt: new Date(devlog.createdAt)
        });
      });
    });
    
    return allDevLogs;
  };

  const [devLogs, setDevLogs] = useState<DevLog[]>(getUserDevLogs());

  const handleCreateDevLog = (data: CreateDevLogData) => {
    if (!user) return;

    const newDevLog: DevLog = {
      id: Date.now().toString(),
      ...data,
      author: user.username,
      createdAt: new Date(),
      likes: 0,
    };

    // Save to user's devlogs
    const userDevLogs = JSON.parse(localStorage.getItem(`devlogs_${user.id}`) || '[]');
    userDevLogs.push(newDevLog);
    localStorage.setItem(`devlogs_${user.id}`, JSON.stringify(userDevLogs));

    // Update state
    setDevLogs(getUserDevLogs());

    // Award achievement for first devlog
    const achievements = JSON.parse(localStorage.getItem(`achievements_${user.id}`) || '[]');
    if (!achievements.some((a: any) => a.id === 'journalist')) {
      const newAchievement = {
        id: 'journalist',
        name: 'Journalist',
        description: 'User writes their first devlog',
        icon: 'file-text',
        unlockedAt: new Date()
      };
      achievements.push(newAchievement);
      localStorage.setItem(`achievements_${user.id}`, JSON.stringify(achievements));
      toast.success('Achievement unlocked: Journalist! 📝');
    }

    toast.success('DevLog published successfully!');
  };

  const handleLike = (logId: string) => {
    setDevLogs(prev => prev.map(log => 
      log.id === logId 
        ? { ...log, likes: log.likes + 1 }
        : log
    ));
  };

  // Filter and sort devlogs
  const filteredDevLogs = devLogs.filter(log => 
    log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDevLogs = [...filteredDevLogs].sort((a, b) => {
    switch (sortBy) {
      case 'recent': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'popular': return b.likes - a.likes;
      case 'title': return a.title.localeCompare(b.title);
      default: return 0;
    }
  });

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

        {/* Search and Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Search devlogs by title, content, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300"
              >
                <option value="recent" className="bg-space-dark">Most Recent</option>
                <option value="oldest" className="bg-space-dark">Oldest First</option>
                <option value="popular" className="bg-space-dark">Most Popular</option>
                <option value="title" className="bg-space-dark">Title A-Z</option>
              </select>
              <motion.button
                onClick={() => setShowCreateDevLog(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyber-blue to-cyber-pink px-6 py-3 rounded-lg font-orbitron font-bold text-white hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>Create</span>
              </motion.button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {sortedDevLogs.length > 0 ? (
            sortedDevLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
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
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-center">
                <Hash className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70 mb-4">
                  {searchTerm ? 'No devlogs found matching your search.' : 'No devlogs yet. Be the first to share your journey!'}
                </p>
                <motion.button
                  onClick={() => setShowCreateDevLog(true)}
                  className="bg-gradient-to-r from-cyber-blue to-cyber-pink px-6 py-3 rounded-lg font-orbitron font-bold text-white hover:scale-105 transition-transform"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Your First DevLog
                </motion.button>
              </div>
            </div>
          )}
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