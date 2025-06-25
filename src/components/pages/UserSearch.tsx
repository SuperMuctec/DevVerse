import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, User, MapPin, Globe, Calendar, Star, GitFork, ExternalLink, Zap } from 'lucide-react';
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

  return (
    <div className="min-h-screen pt-44 px-4">
      <div className="max-w-4xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-orbitron text-5xl font-bold mb-4">
            <span className="neon-text text-cyber-blue">User</span>{' '}
            <span className="neon-text text-cyber-pink">Search</span>
          </h1>
          <p className="font-sora text-xl text-white/70">
            Discover developers across the galaxy
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-8">
          <GlassPanel glowColor="#00ffff">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/50" />
              <input
                type="text"
                placeholder="Search developers by username, email, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-white/50 focus:outline-none text-lg"
              />
            </div>
          </GlassPanel>
        </div>

        {/* Search Results */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70">Searching the galaxy...</p>
          </div>
        )}

        {!isLoading && searchTerm && searchResults.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">No developers found matching your search.</p>
          </div>
        )}

        {!isLoading && searchResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-orbitron text-2xl font-bold text-white mb-6">
              Search Results ({searchResults.length})
            </h2>
            
            {searchResults.map((user, index) => {
              const userXp = user.xp || 0;
              const { level, currentLevelXp, requiredXp } = calculateLevel(userXp);
              const progressPercentage = (currentLevelXp / requiredXp) * 100;

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassPanel 
                    glowColor="#ff00ff"
                    className="hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                    onClick={() => onNavigateToUser(user.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <motion.img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                        alt={user.username}
                        className="w-16 h-16 rounded-full border-2 border-cyber-pink"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-orbitron text-xl font-bold text-white">
                            {user.username}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 bg-gradient-to-r from-cyber-blue/20 to-cyber-pink/20 px-2 py-1 rounded-full border border-cyber-blue/30">
                              <Zap className="w-3 h-3 text-cyber-blue" />
                              <span className="text-cyber-blue font-semibold text-xs">Level {level}</span>
                            </div>
                            <span className="text-white/60 text-xs">{userXp} XP</span>
                          </div>
                        </div>
                        
                        <p className="text-white/70 text-sm mb-3">{user.email}</p>
                        
                        {/* XP Progress Bar */}
                        <div className="mb-3">
                          <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyber-blue to-cyber-pink transition-all duration-500"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-white/60 mt-1">
                            <span>{currentLevelXp}</span>
                            <span>{requiredXp}</span>
                          </div>
                        </div>
                        
                        {user.bio && (
                          <p className="text-white/80 text-sm mb-3 line-clamp-2">
                            {user.bio}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-6 text-sm text-white/60">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>{user.projects?.length || 0} projects</span>
                          </div>
                          {user.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{user.location}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              );
            })}
          </div>
        )}

        {!searchTerm && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">Start typing to search for developers...</p>
          </div>
        )}
      </div>
    </div>
  );
};