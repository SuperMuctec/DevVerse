import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, User } from 'lucide-react';
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
    <div className="min-h-screen pt-44 px-4">
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
            Explore the galaxy's dev planets
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Search planets by name or owner..."
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

        {/* Planets Grid */}
        <div>
          <h2 className="font-orbitron text-2xl font-bold text-white mb-6">
            All Planets ({sortedPlanets.length})
          </h2>
          
          {sortedPlanets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedPlanets.map((planet: any, index: number) => (
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
                        by @{planet.owner}
                      </p>
                    </div>

                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {planet.stack.languages.slice(0, 2).map((lang: string) => (
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

                    <div className="flex items-center justify-end">
                      <motion.button
                        onClick={() => onNavigateToUser(planet.ownerId)}
                        className="px-3 py-1 bg-gradient-to-r from-cyber-blue to-cyber-pink rounded-full text-xs font-semibold hover:scale-105 transition-transform"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Explore
                      </motion.button>
                    </div>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">No planets found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};