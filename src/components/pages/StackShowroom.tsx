import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, User, Eye, Heart, Star } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';

interface StackShowroomProps {
  onNavigateToUser: (userId: string) => void;
}

export const StackShowroom: React.FC<StackShowroomProps> = ({ onNavigateToUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const filters = [
    { id: 'all', label: 'All Planets' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'ai', label: 'AI/ML' },
  ];

  const sortOptions = [
    { id: 'recent', label: 'Recently Added' },
    { id: 'name', label: 'Planet Name' },
    { id: 'owner', label: 'Owner Name' },
  ];

  // Get user-created planets from localStorage
  const getUserPlanets = () => {
    const users = JSON.parse(localStorage.getItem('devverse_users') || '[]');
    return users.map((user: any) => ({
      ...user.planet,
      owner: user.username,
      ownerId: user.id
    })).filter((planet: any) => planet && planet.name);
  };

  const allPlanets = getUserPlanets();

  // Filter and search planets
  const filteredPlanets = allPlanets.filter((planet: any) => {
    const matchesSearch = planet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         planet.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    
    // Simple categorization based on tech stack
    const hasReact = planet.stack.frameworks.some((f: string) => f.includes('React') || f.includes('Vue') || f.includes('Angular'));
    const hasBackend = planet.stack.frameworks.some((f: string) => f.includes('Express') || f.includes('Django') || f.includes('Spring'));
    const hasMobile = planet.stack.frameworks.some((f: string) => f.includes('React Native') || f.includes('Flutter'));
    const hasAI = planet.stack.languages.some((l: string) => l.includes('Python')) && 
                 planet.stack.frameworks.some((f: string) => f.includes('TensorFlow') || f.includes('PyTorch'));
    
    switch (selectedFilter) {
      case 'frontend': return hasReact && matchesSearch;
      case 'backend': return hasBackend && matchesSearch;
      case 'fullstack': return hasReact && hasBackend && matchesSearch;
      case 'mobile': return hasMobile && matchesSearch;
      case 'ai': return hasAI && matchesSearch;
      default: return matchesSearch;
    }
  });

  // Sort planets
  const sortedPlanets = [...filteredPlanets].sort((a: any, b: any) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'owner': return a.owner.localeCompare(b.owner);
      case 'recent': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen pt-20 sm:pt-44 px-4">
      <div className="max-w-7xl mx-auto py-8">
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
              Stack
            </motion.span>{' '}
            <motion.span 
              className="neon-text text-cyber-pink inline-block"
              animate={{ 
                rotateY: [0, -10, 10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              Showroom
            </motion.span>
          </motion.h1>
          <motion.p 
            className="font-sora text-lg sm:text-xl text-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Explore the galaxy's dev planets
          </motion.p>
        </motion.div>

        {/* Search and Filters */}
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
                placeholder="Search planets by name or owner..."
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
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id} className="bg-space-dark">
                    {option.label}
                  </option>
                ))}
              </motion.select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <motion.button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-sora text-sm transition-all duration-300 ${
                  selectedFilter === filter.id
                    ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: '0 5px 15px rgba(0, 255, 255, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ 
                    rotateZ: [0, 360]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "linear"
                  }}
                  className="inline-block mr-2"
                >
                  <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.div>
                {filter.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Planets Grid */}
        <div>
          <motion.h2 
            className="font-orbitron text-xl sm:text-2xl font-bold text-white mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            All Planets ({sortedPlanets.length})
          </motion.h2>
          
          {sortedPlanets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {sortedPlanets.map((planet: any, index: number) => (
                <motion.div
                  key={planet.id}
                  initial={{ opacity: 0, y: 30, rotateX: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.6,
                    type: "spring"
                  }}
                  onClick={() => onNavigateToUser(planet.ownerId)}
                  className="cursor-pointer"
                >
                  <GlassPanel 
                    glowColor={planet.color}
                    className="hover:scale-105 transition-transform duration-300"
                  >
                    <motion.div
                      whileHover={{ 
                        rotateY: 10,
                        rotateX: 5,
                        scale: 1.02
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-4">
                        <motion.div 
                          className="w-full h-20 sm:h-24 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
                          style={{ 
                            background: `radial-gradient(circle, ${planet.color}40, ${planet.color}10)`,
                            border: `1px solid ${planet.color}60`
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <motion.div 
                            className="w-8 sm:w-12 h-8 sm:h-12 rounded-full relative"
                            style={{ 
                              background: `radial-gradient(circle, ${planet.color}, ${planet.color}80)`,
                              boxShadow: `0 0 15px ${planet.color}60`
                            }}
                            animate={{ 
                              rotateZ: [0, 360],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                              rotateZ: { duration: 8, repeat: Infinity, ease: "linear" },
                              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            }}
                          >
                            {/* Planet rings */}
                            <motion.div
                              className="absolute inset-0 border-2 rounded-full"
                              style={{ borderColor: `${planet.color}60` }}
                              animate={{ 
                                scale: [1, 1.5, 1],
                                opacity: [0.6, 0.2, 0.6]
                              }}
                              transition={{ 
                                duration: 3, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                              }}
                            />
                          </motion.div>
                          
                          {/* Floating particles */}
                          {Array.from({ length: 3 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 rounded-full"
                              style={{ backgroundColor: planet.color }}
                              animate={{
                                x: [0, 20, -20, 0],
                                y: [0, -15, 15, 0],
                                opacity: [0.3, 1, 0.3],
                                scale: [0.5, 1.5, 0.5]
                              }}
                              transition={{
                                duration: 4 + i,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.5
                              }}
                            />
                          ))}
                        </motion.div>
                        
                        <motion.h3 
                          className="font-orbitron text-base sm:text-lg font-bold mb-1 neon-text"
                          whileHover={{ scale: 1.05 }}
                        >
                          {planet.name}
                        </motion.h3>
                        <motion.p 
                          className="text-white/70 text-sm mb-2"
                          whileHover={{ color: '#ffffff' }}
                        >
                          by @{planet.owner}
                        </motion.p>
                      </div>

                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {planet.stack.languages.slice(0, 2).map((lang: string, langIndex: number) => (
                            <motion.span
                              key={lang}
                              className="px-2 py-1 bg-cyber-blue/20 text-cyber-blue text-xs rounded-full"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.2 + langIndex * 0.1, duration: 0.3 }}
                              whileHover={{ 
                                scale: 1.1,
                                boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                              }}
                            >
                              {lang}
                            </motion.span>
                          ))}
                          {planet.stack.languages.length > 2 && (
                            <motion.span 
                              className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full"
                              whileHover={{ 
                                scale: 1.1,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)'
                              }}
                            >
                              +{planet.stack.languages.length - 2}
                            </motion.span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-white/60">
                          <motion.div 
                            className="flex items-center space-x-1"
                            whileHover={{ scale: 1.1, color: '#ff0000' }}
                          >
                            <Heart className="w-3 h-3" />
                            <span>{planet.likes || 0}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center space-x-1"
                            whileHover={{ scale: 1.1, color: '#00ff00' }}
                          >
                            <Eye className="w-3 h-3" />
                            <span>{planet.views || 0}</span>
                          </motion.div>
                        </div>
                        <motion.button
                          className="px-3 py-1 bg-gradient-to-r from-cyber-blue to-cyber-pink rounded-full text-xs font-semibold transition-all duration-300"
                          whileHover={{ 
                            scale: 1.1,
                            rotateZ: 5,
                            boxShadow: '0 5px 15px rgba(0, 255, 255, 0.5)'
                          }}
                          whileTap={{ scale: 0.9, rotateZ: -5 }}
                        >
                          Explore
                        </motion.button>
                      </div>
                    </motion.div>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>
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
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-white/30 mx-auto mb-4" />
              </motion.div>
              <p className="text-white/70">No planets found matching your criteria.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};