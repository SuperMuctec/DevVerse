import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, User, MapPin, Globe, Calendar, Star, GitFork, ExternalLink } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { User as UserType, Project } from '../../types';

export const UserSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      TypeScript: '#3178c6',
      JavaScript: '#f7df1e',
      Python: '#3776ab',
      Java: '#ed8b00',
      'C++': '#00599c',
      Go: '#00add8',
    };
    return colors[language] || '#ffffff';
  };

  if (selectedUser) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-6xl mx-auto py-8">
          <motion.button
            onClick={() => setSelectedUser(null)}
            className="mb-6 flex items-center space-x-2 text-cyber-blue hover:text-cyber-pink transition-colors"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>← Back to Search</span>
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Profile */}
            <div className="lg:col-span-1">
              <GlassPanel glowColor="#00ffff">
                <div className="text-center mb-6">
                  <motion.img
                    src={selectedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.username}`}
                    alt={selectedUser.username}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-cyber-blue"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  />
                  <h2 className="font-orbitron text-2xl font-bold text-white mb-1">
                    {selectedUser.username}
                  </h2>
                  <p className="text-white/70 text-sm mb-4">{selectedUser.email}</p>
                  
                  <div className="flex items-center justify-center space-x-4 mb-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-cyber-blue">{selectedUser.followers || 0}</div>
                      <div className="text-white/60">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-cyber-pink">{selectedUser.following || 0}</div>
                      <div className="text-white/60">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-cyber-yellow">Level {selectedUser.level}</div>
                      <div className="text-white/60">{selectedUser.xp} XP</div>
                    </div>
                  </div>
                </div>

                {selectedUser.bio && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-white mb-2">Bio</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{selectedUser.bio}</p>
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  {selectedUser.location && (
                    <div className="flex items-center space-x-2 text-white/70">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedUser.location}</span>
                    </div>
                  )}
                  {selectedUser.website && (
                    <div className="flex items-center space-x-2 text-white/70">
                      <Globe className="w-4 h-4" />
                      <a
                        href={selectedUser.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyber-blue transition-colors"
                      >
                        {selectedUser.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-white/70">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(selectedUser.joinedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </GlassPanel>
            </div>

            {/* User Projects */}
            <div className="lg:col-span-2">
              <GlassPanel glowColor="#ff00ff">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-orbitron text-2xl font-bold text-white">
                    Projects ({selectedUser.projects?.length || 0})
                  </h2>
                </div>

                <div className="space-y-4">
                  {selectedUser.projects && selectedUser.projects.length > 0 ? (
                    selectedUser.projects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors group cursor-pointer"
                        onClick={() => window.open(project.githubUrl, '_blank')}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <motion.h3 
                                className="font-orbitron text-lg font-bold text-white group-hover:text-cyber-blue transition-colors"
                                whileHover={{ scale: 1.02 }}
                              >
                                {project.name}
                              </motion.h3>
                              <motion.div
                                className="p-1 text-white/50 hover:text-cyber-blue transition-colors"
                                whileHover={{ scale: 1.2, rotate: 15 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </motion.div>
                              {project.isPrivate && (
                                <span className="px-2 py-1 bg-white/20 text-white/70 text-xs rounded-full">
                                  Private
                                </span>
                              )}
                            </div>
                            <p className="text-white/70 text-sm mb-3">
                              {project.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-white/60">
                            <div className="flex items-center space-x-1">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getLanguageColor(project.language) }}
                              />
                              <span>{project.language}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4" />
                              <span>{project.stars}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <GitFork className="w-4 h-4" />
                              <span>{project.forks}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.topics.map((topic) => (
                            <span
                              key={topic}
                              className="px-2 py-1 bg-cyber-blue/20 text-cyber-blue text-xs rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <User className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <p className="text-white/70">No projects found for this user.</p>
                    </div>
                  )}
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
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
            
            {searchResults.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassPanel 
                  glowColor="#ff00ff"
                  className="hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                  onClick={() => setSelectedUser(user)}
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
                        <span className="px-2 py-1 bg-cyber-blue/20 text-cyber-blue text-xs rounded-full">
                          Level {user.level}
                        </span>
                      </div>
                      
                      <p className="text-white/70 text-sm mb-3">{user.email}</p>
                      
                      {user.bio && (
                        <p className="text-white/80 text-sm mb-3 line-clamp-2">
                          {user.bio}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-6 text-sm text-white/60">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{user.followers || 0} followers</span>
                        </div>
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
            ))}
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