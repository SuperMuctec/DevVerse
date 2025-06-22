import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, Star, Filter, Search, TrendingUp } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { mockPlanets } from '../../data/mockData';

export const StackShowroom: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const filters = [
    { id: 'all', label: 'All Planets' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'ai', label: 'AI/ML' },
  ];

  const sortOptions = [
    { id: 'popular', label: 'Most Popular' },
    { id: 'recent', label: 'Recently Added' },
    { id: 'trending', label: 'Trending' },
    { id: 'stars', label: 'Most Starred' },
  ];

  const featuredPlanets = mockPlanets.map(planet => ({
    ...planet,
    featured: true,
    likes: Math.floor(Math.random() * 1000) + 100,
    views: Math.floor(Math.random() * 5000) + 500,
  }));

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-orbitron text-5xl font-bold mb-4">
            <span className="neon-text text-cyber-blue">Stack</span>{' '}
            <span className="neon-text text-cyber-pink">Showroom</span>
          </h1>
          <p className="font-sora text-xl text-white/70">
            Explore the galaxy's most impressive dev planets
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Search planets, technologies, or developers..."
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
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id} className="bg-space-dark">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <motion.button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg font-sora text-sm transition-all duration-300 ${
                  selectedFilter === filter.id
                    ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter className="w-4 h-4 inline mr-2" />
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-6 h-6 text-cyber-yellow" />
            <h2 className="font-orbitron text-2xl font-bold text-cyber-yellow">
              Featured Planets
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlanets.slice(0, 3).map((planet, index) => (
              <motion.div
                key={planet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassPanel 
                  glowColor={planet.color}
                  className="hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  <div className="relative">
                    <div className="absolute top-2 right-2 bg-cyber-yellow/20 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-cyber-yellow" />
                    </div>
                    
                    <div className="mb-4">
                      <div 
                        className="w-full h-32 rounded-lg mb-4 flex items-center justify-center"
                        style={{ 
                          background: `radial-gradient(circle, ${planet.color}40, ${planet.color}10)`,
                          border: `1px solid ${planet.color}60`
                        }}
                      >
                        <div 
                          className="w-16 h-16 rounded-full"
                          style={{ 
                            background: `radial-gradient(circle, ${planet.color}, ${planet.color}80)`,
                            boxShadow: `0 0 20px ${planet.color}60`
                          }}
                        />
                      </div>
                      
                      <h3 className="font-orbitron text-xl font-bold mb-2 neon-text">
                        {planet.name}
                      </h3>
                      <p className="text-white/70 text-sm mb-3">
                        by <span className="text-cyber-blue">@{planet.owner}</span>
                      </p>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {planet.stack.languages.slice(0, 3).map(lang => (
                          <span
                            key={lang}
                            className="px-2 py-1 bg-cyber-blue/20 text-cyber-blue text-xs rounded-full"
                          >
                            {lang}
                          </span>
                        ))}
                        {planet.stack.languages.length > 3 && (
                          <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                            +{planet.stack.languages.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-white/60">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{planet.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{planet.views}</span>
                        </div>
                      </div>
                      <motion.button
                        className="px-3 py-1 bg-gradient-to-r from-cyber-blue to-cyber-pink rounded-full text-xs font-semibold hover:scale-105 transition-transform"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Explore
                      </motion.button>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>

        {/* All Planets Grid */}
        <div>
          <h2 className="font-orbitron text-2xl font-bold text-white mb-6">
            All Planets
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredPlanets.map((planet, index) => (
              <motion.div
                key={planet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassPanel 
                  glowColor={planet.color}
                  className="hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  <div className="mb-4">
                    <div 
                      className="w-full h-24 rounded-lg mb-3 flex items-center justify-center"
                      style={{ 
                        background: `radial-gradient(circle, ${planet.color}40, ${planet.color}10)`,
                        border: `1px solid ${planet.color}60`
                      }}
                    >
                      <div 
                        className="w-12 h-12 rounded-full"
                        style={{ 
                          background: `radial-gradient(circle, ${planet.color}, ${planet.color}80)`,
                          boxShadow: `0 0 15px ${planet.color}60`
                        }}
                      />
                    </div>
                    
                    <h3 className="font-orbitron text-lg font-bold mb-1 neon-text">
                      {planet.name}
                    </h3>
                    <p className="text-white/70 text-sm mb-2">
                      @{planet.owner}
                    </p>
                  </div>

                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {planet.stack.languages.slice(0, 2).map(lang => (
                        <span
                          key={lang}
                          className="px-2 py-1 bg-cyber-blue/20 text-cyber-blue text-xs rounded-full"
                        >
                          {lang}
                        </span>
                      ))}
                      {planet.stack.languages.length > 2 && (
                        <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                          +{planet.stack.languages.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-white/60">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{planet.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{planet.views}</span>
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <motion.button
            className="interactive bg-gradient-to-r from-cyber-blue to-cyber-pink px-8 py-4 rounded-xl font-orbitron font-bold text-lg hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load More Planets
          </motion.button>
        </div>
      </div>
    </div>
  );
};