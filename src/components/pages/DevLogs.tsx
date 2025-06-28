import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, Hash, Plus, Search, Filter, BookOpen, Sparkles } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { CreateDevLogModal } from '../modals/CreateDevLogModal';
import { CreateDevLogData, DevLog } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

export const DevLogs: React.FC = () => {
  const [showCreateDevLog, setShowCreateDevLog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [devLogs, setDevLogs] = useState<DevLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load devlogs from database on component mount
  useEffect(() => {
    const loadDevLogs = async () => {
      try {
        const { data: dbDevLogs, error } = await supabase
          .from('devlogs')
          .select(`
            *,
            users (username)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to load devlogs:', error);
          toast.error('Failed to load devlogs');
          return;
        }

        const formattedDevLogs = dbDevLogs.map((devlog: any) => ({
          id: devlog.id,
          title: devlog.title,
          content: devlog.content,
          author: devlog.users?.username || 'Unknown',
          tags: devlog.tags,
          createdAt: new Date(devlog.created_at),
          likes: devlog.likes,
        }));
        
        setDevLogs(formattedDevLogs);
      } catch (error) {
        console.error('Failed to load devlogs:', error);
        toast.error('Failed to load devlogs');
      } finally {
        setIsLoading(false);
      }
    };

    loadDevLogs();
  }, []);

  const handleCreateDevLog = async (data: CreateDevLogData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('devlogs')
        .insert({
          user_id: user.id,
          title: data.title,
          content: data.content,
          tags: data.tags,
          likes: 0,
        });

      if (error) {
        console.error('Failed to create devlog:', error);
        toast.error('Failed to create devlog');
        return;
      }

      // Reload devlogs
      const { data: dbDevLogs } = await supabase
        .from('devlogs')
        .select(`
          *,
          users (username)
        `)
        .order('created_at', { ascending: false });

      if (dbDevLogs) {
        const formattedDevLogs = dbDevLogs.map((devlog: any) => ({
          id: devlog.id,
          title: devlog.title,
          content: devlog.content,
          author: devlog.users?.username || 'Unknown',
          tags: devlog.tags,
          createdAt: new Date(devlog.created_at),
          likes: devlog.likes,
        }));
        setDevLogs(formattedDevLogs);
      }

      // Award achievement for first devlog
      await supabase
        .from('achievements')
        .upsert({
          user_id: user.id,
          achievement_id: 'journalist',
          name: 'Journalist',
          description: 'User writes their first devlog',
          icon: 'file-text',
        }, { onConflict: 'user_id,achievement_id' });

      toast.success('DevLog published successfully!');
      toast.success('Achievement unlocked: Journalist! 📝');
    } catch (error) {
      console.error('Failed to create devlog:', error);
      toast.error('Failed to create devlog');
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 sm:pt-44 px-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70">Loading DevLogs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-44 px-4">
      <div className="max-w-4xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.h1 
            className="font-orbitron text-3xl sm:text-5xl font-bold mb-4"
            animate={{
              textShadow: [
                '0 0 20px #00ffff',
                '0 0 30px #ff00ff, 0 0 40px #ff00ff',
                '0 0 20px #00ffff'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.span 
              className="neon-text text-cyber-blue inline-block"
              animate={{ 
                rotateY: [0, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Dev
            </motion.span>
            <motion.span 
              className="neon-text text-cyber-pink inline-block"
              animate={{ 
                rotateY: [0, -10, 10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              Logs
            </motion.span>
          </motion.h1>
          <motion.p 
            className="font-sora text-lg sm:text-xl text-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Holographic chronicles from the coding frontier
          </motion.p>
        </motion.div>

        {/* Search and Controls */}
        <motion.div 
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <motion.div 
              className="flex-1 relative"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                animate={{ 
                  rotateZ: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotateZ: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              </motion.div>
              <input
                type="text"
                placeholder="Search devlogs by title, content, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300"
              />
            </motion.div>
            <div className="flex gap-2">
              <motion.select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300"
                whileHover={{ scale: 1.02, rotateY: 5 }}
              >
                <option value="recent" className="bg-space-dark">Most Recent</option>
                <option value="oldest" className="bg-space-dark">Oldest First</option>
                <option value="popular" className="bg-space-dark">Most Popular</option>
                <option value="title" className="bg-space-dark">Title A-Z</option>
              </motion.select>
              <motion.button
                onClick={() => setShowCreateDevLog(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyber-blue to-cyber-pink px-4 sm:px-6 py-3 rounded-lg font-orbitron font-bold text-white transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 10,
                  boxShadow: '0 10px 30px rgba(0, 255, 255, 0.5)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ 
                    rotateZ: [0, 360]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear"
                  }}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
                <span className="hidden sm:inline">Create</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6 sm:space-y-8">
          {sortedDevLogs.length > 0 ? (
            sortedDevLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, rotateY: index % 2 === 0 ? -10 : 10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.8,
                  type: "spring"
                }}
              >
                <GlassPanel 
                  glowColor={index % 2 === 0 ? '#00ffff' : '#ff00ff'}
                  className="hover:scale-[1.02] transition-transform duration-300"
                >
                  <motion.div
                    whileHover={{ 
                      rotateX: 5,
                      rotateY: index % 2 === 0 ? 5 : -5
                    }}
                  >
                    <div className="mb-4">
                      <motion.h2 
                        className="font-orbitron text-xl sm:text-2xl font-bold mb-2 neon-text"
                        whileHover={{ scale: 1.02 }}
                      >
                        {log.title}
                      </motion.h2>
                      
                      <div className="flex items-center space-x-4 sm:space-x-6 text-sm text-white/60 mb-4">
                        <motion.div 
                          className="flex items-center space-x-2"
                          whileHover={{ scale: 1.1, color: '#00ffff' }}
                        >
                          <motion.div
                            animate={{ 
                              rotateZ: [0, 360]
                            }}
                            transition={{ 
                              duration: 8, 
                              repeat: Infinity, 
                              ease: "linear"
                            }}
                          >
                            <Calendar className="w-4 h-4" />
                          </motion.div>
                          <span>{log.createdAt.toLocaleDateString()}</span>
                        </motion.div>
                        <motion.button
                          onClick={() => handleLike(log.id)}
                          className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                          whileHover={{ 
                            scale: 1.1,
                            rotateZ: 10
                          }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1]
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              ease: "easeInOut"
                            }}
                          >
                            <Heart className="w-4 h-4" />
                          </motion.div>
                          <span>{log.likes}</span>
                        </motion.button>
                        <motion.span 
                          className="font-semibold text-cyber-blue"
                          whileHover={{ 
                            scale: 1.05,
                            textShadow: '0 0 10px #00ffff'
                          }}
                        >
                          @{log.author}
                        </motion.span>
                      </div>
                    </div>

                    <motion.p 
                      className="font-sora text-white/80 leading-relaxed mb-4"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {log.content}
                    </motion.p>

                    <div className="flex flex-wrap gap-2">
                      {log.tags.map((tag, tagIndex) => (
                        <motion.span
                          key={tag}
                          className="inline-flex items-center space-x-1 bg-cyber-blue/20 px-2 py-1 rounded-full text-xs font-sora text-cyber-blue"
                          initial={{ opacity: 0, scale: 0, rotateZ: -180 }}
                          animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                          transition={{ 
                            delay: 0.2 + tagIndex * 0.1,
                            duration: 0.5,
                            type: "spring"
                          }}
                          whileHover={{ 
                            scale: 1.1,
                            rotateZ: 5,
                            boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                          }}
                        >
                          <motion.div
                            animate={{ 
                              rotateZ: [0, 360]
                            }}
                            transition={{ 
                              duration: 4, 
                              repeat: Infinity, 
                              ease: "linear"
                            }}
                          >
                            <Hash className="w-3 h-3" />
                          </motion.div>
                          <span>{tag}</span>
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </GlassPanel>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="text-center py-12"
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
                <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-white/30 mx-auto mb-4" />
              </motion.div>
              <p className="text-white/70 mb-4">
                {searchTerm ? 'No devlogs found matching your search.' : 'No devlogs yet. Be the first to share your journey!'}
              </p>
              <motion.button
                onClick={() => setShowCreateDevLog(true)}
                className="bg-gradient-to-r from-cyber-blue to-cyber-pink px-6 py-3 rounded-lg font-orbitron font-bold text-white transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 10,
                  boxShadow: '0 10px 30px rgba(0, 255, 255, 0.5)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                Create Your First DevLog
              </motion.button>
            </motion.div>
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