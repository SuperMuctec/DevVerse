import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, User, MapPin, Globe, Calendar, Star, GitFork, ExternalLink, Zap, Sparkles } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { User as UserType, Project } from '../../types';

interface UserSearchProps {
  onNavigateToUser: (userId: string) => void;
}

export const UserSearch: React.FC<UserSearchProps> = ({ onNavigateToUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate user level based on XP
  const calculateLevel = (xp: number) => {
    let level = 1;
    let requiredXp = 20; // 10 * 2^1
    let totalXp = 0;
    
    while (totalXp + requiredXp <= xp) {
      totalXp += requiredXp;
      level++;
      requiredXp = 10 * Math.pow(2, level);
    }
    
    return { level, currentLevelXp: xp - totalXp, requiredXp };
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      setIsLoading(true);
      // Simulate API call delay
      const timer = setTimeout(() => {
        // Get actual users from localStorage
        const users = JSON.parse(localStorage.getItem('devverse_users') || '[]');
        const results = users.filter((user: any) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.bio?.toLowerCase().includes(searchTerm.toLowerCase())
        ).map((user: any) => {
          // Remove password from user object
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
        setSearchResults(results);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [searchTerm]);

  const handleUserClick = (userId: string) => {
    console.log('Clicking user with ID:', userId); // Debug log
    onNavigateToUser(userId);
  };

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
              User
            </motion.span>{' '}
            <motion.span 
              className="neon-text text-cyber-pink inline-block"
              animate={{ 
                rotateY: [0, -10, 10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              Search
            </motion.span>
          </motion.h1>
          <motion.p 
            className="font-sora text-lg sm:text-xl text-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Discover developers across the galaxy
          </motion.p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <GlassPanel glowColor="#00ffff">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.01 }}
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
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-white/50" />
              </motion.div>
              <input
                type="text"
                placeholder="Search developers by username, email, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 sm:pl-14 pr-4 py-3 sm:py-4 bg-transparent text-white placeholder-white/50 focus:outline-none text-base sm:text-lg"
              />
              <motion.div
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyber-blue" />
              </motion.div>
            </motion.div>
          </GlassPanel>
        </motion.div>

        {/* Search Results */}
        {isLoading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-cyber-blue border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotateZ: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-white/70">Searching the galaxy...</p>
          </motion.div>
        )}

        {!isLoading && searchTerm && searchResults.length === 0 && (
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
              <User className="w-12 h-12 sm:w-16 sm:h-16 text-white/30 mx-auto mb-4" />
            </motion.div>
            <p className="text-white/70">No developers found matching your search.</p>
          </motion.div>
        )}

        {!isLoading && searchResults.length > 0 && (
          <div className="space-y-6">
            <motion.h2 
              className="font-orbitron text-xl sm:text-2xl font-bold text-white mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Search Results ({searchResults.length})
            </motion.h2>
            
            {searchResults.map((user, index) => {
              const userXp = user.xp || 0;
              const { level, currentLevelXp, requiredXp } = calculateLevel(userXp);
              const progressPercentage = (currentLevelXp / requiredXp) * 100;

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -30, rotateY: -10 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.6,
                    type: "spring"
                  }}
                  onClick={() => handleUserClick(user.id)}
                  className="cursor-pointer"
                >
                  <GlassPanel 
                    glowColor="#ff00ff"
                    className="hover:scale-[1.02] transition-transform duration-300"
                  >
                    <motion.div
                      whileHover={{ 
                        rotateY: 5,
                        rotateX: 3
                      }}
                      className="flex items-start space-x-3 sm:space-x-4"
                    >
                      <motion.img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                        alt={user.username}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-cyber-pink"
                        whileHover={{ 
                          scale: 1.1,
                          rotateZ: 360,
                          borderColor: '#00ffff'
                        }}
                        transition={{ duration: 0.6 }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <motion.h3 
                            className="font-orbitron text-lg sm:text-xl font-bold text-white"
                            whileHover={{ scale: 1.02 }}
                          >
                            {user.username}
                          </motion.h3>
                          <div className="flex items-center space-x-2">
                            <motion.div 
                              className="flex items-center space-x-1 bg-gradient-to-r from-cyber-blue/20 to-cyber-pink/20 px-2 py-1 rounded-full border border-cyber-blue/30"
                              animate={{ 
                                boxShadow: [
                                  '0 0 10px rgba(0, 255, 255, 0.3)',
                                  '0 0 20px rgba(255, 0, 255, 0.5)',
                                  '0 0 10px rgba(0, 255, 255, 0.3)'
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <motion.div
                                animate={{ 
                                  rotateZ: [0, 360],
                                  scale: [1, 1.2, 1]
                                }}
                                transition={{ 
                                  rotateZ: { duration: 4, repeat: Infinity, ease: "linear" },
                                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                }}
                              >
                                <Zap className="w-3 h-3 text-cyber-blue" />
                              </motion.div>
                              <span className="text-cyber-blue font-semibold text-xs">Level {level}</span>
                            </motion.div>
                            <span className="text-white/60 text-xs">{userXp} XP</span>
                          </div>
                        </div>
                        
                        <p className="text-white/70 text-sm mb-3">{user.email}</p>
                        
                        {/* XP Progress Bar */}
                        <motion.div 
                          className="mb-3"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                        >
                          <div className="w-24 sm:w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-cyber-blue to-cyber-pink"
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercentage}%` }}
                              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-white/60 mt-1">
                            <span>{currentLevelXp}</span>
                            <span>{requiredXp}</span>
                          </div>
                        </motion.div>
                        
                        {user.bio && (
                          <motion.p 
                            className="text-white/80 text-sm mb-3 line-clamp-2"
                            initial={{ opacity: 0.8 }}
                            whileHover={{ opacity: 1 }}
                          >
                            {user.bio}
                          </motion.p>
                        )}
                        
                        <div className="flex items-center space-x-4 sm:space-x-6 text-sm text-white/60">
                          <motion.div 
                            className="flex items-center space-x-1"
                            whileHover={{ scale: 1.1, color: '#ffff00' }}
                          >
                            <Star className="w-4 h-4" />
                            <span>{user.projects?.length || 0} projects</span>
                          </motion.div>
                          {user.location && (
                            <motion.div 
                              className="flex items-center space-x-1"
                              whileHover={{ scale: 1.1, color: '#00ff00' }}
                            >
                              <MapPin className="w-4 h-4" />
                              <span>{user.location}</span>
                            </motion.div>
                          )}
                          <motion.div 
                            className="flex items-center space-x-1"
                            whileHover={{ scale: 1.1, color: '#ff00ff' }}
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </GlassPanel>
                </motion.div>
              );
            })}
          </div>
        )}

        {!searchTerm && (
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
              <Search className="w-12 h-12 sm:w-16 sm:h-16 text-white/30 mx-auto mb-4" />
            </motion.div>
            <p className="text-white/70">Start typing to search for developers...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};