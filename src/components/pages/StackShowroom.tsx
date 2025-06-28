import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, User, Heart, Star } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface StackShowroomProps {
  onNavigateToUser: (userId: string) => void;
  onNavigateToPlanet: (planetId: string) => void;
}

export const StackShowroom: React.FC<StackShowroomProps> = ({ onNavigateToUser, onNavigateToPlanet }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [allPlanets, setAllPlanets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedPlanets, setLikedPlanets] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const filters = [
    { id: 'all', label: 'All Planets', color: '#ffffff' },
    { id: 'frontend', label: 'Frontend', color: '#00ffff' },
    { id: 'backend', label: 'Backend', color: '#ff00ff' },
    { id: 'fullstack', label: 'Full Stack', color: '#ffff00' },
    { id: 'mobile', label: 'Mobile', color: '#00ff00' },
    { id: 'ai', label: 'AI/ML', color: '#ff6600' },
  ];

  const sortOptions = [
    { id: 'recent', label: 'Recently Added' },
    { id: 'name', label: 'Planet Name' },
    { id: 'owner', label: 'Owner Name' },
    { id: 'likes', label: 'Most Liked' },
  ];

  // Helper function to get proper category label
  const getCategoryLabel = (categoryId: string) => {
    const filter = filters.find(f => f.id === categoryId);
    return filter ? filter.label : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  };

  // Load planets from database
  const loadPlanets = useCallback(async () => {
    try {
      const { data: planets, error } = await supabase
        .from('dev_planets')
        .select(`
          *,
          users (username)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load planets:', error);
        return;
      }
      
      const planetsWithOwners = planets.map((planet: any) => ({
        ...planet,
        owner: planet.users?.username || 'Unknown',
        ownerId: planet.user_id
      }));
      
      setAllPlanets(planetsWithOwners);
    } catch (error) {
      console.error('Failed to load planets:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlanets();
  }, [loadPlanets]);

  // Load user's liked planets
  useEffect(() => {
    if (user) {
      const liked = JSON.parse(localStorage.getItem(`liked_planets_${user.id}`) || '[]');
      setLikedPlanets(new Set(liked));
    }
  }, [user]);

  // Handle like functionality
  const handleLike = async (planetId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking heart
    
    if (!user) {
      toast.error('Please log in to like planets');
      return;
    }

    try {
      const isLiked = likedPlanets.has(planetId);
      const newLikeCount = isLiked ? -1 : 1;

      // Update in database
      const { error } = await supabase.rpc('update_planet_likes', {
        planet_id: planetId,
        increment_value: newLikeCount
      });

      if (error) {
        console.error('Error updating likes:', error);
        toast.error('Failed to update like');
        return;
      }

      // Update local state
      const newLikedPlanets = new Set(likedPlanets);
      if (isLiked) {
        newLikedPlanets.delete(planetId);
        toast.success('Removed like');
      } else {
        newLikedPlanets.add(planetId);
        toast.success('Planet liked! ❤️');
      }
      
      setLikedPlanets(newLikedPlanets);
      localStorage.setItem(`liked_planets_${user.id}`, JSON.stringify([...newLikedPlanets]));

      // Update planets list
      setAllPlanets(prev => prev.map(planet => 
        planet.id === planetId 
          ? { ...planet, likes: (planet.likes || 0) + newLikeCount }
          : planet
      ));

    } catch (error) {
      console.error('Error handling like:', error);
      toast.error('Failed to update like');
    }
  };

  // Filter and search planets
  const filteredPlanets = allPlanets.filter((planet: any) => {
    const matchesSearch = planet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         planet.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    
    // Check if planet has the selected category
    if (planet.categories && planet.categories.includes(selectedFilter)) {
      return matchesSearch;
    }
    
    // Fallback to old categorization logic for planets without categories
    const hasReact = planet.stack_frameworks.some((f: string) => f.includes('React') || f.includes('Vue') || f.includes('Angular'));
    const hasBackend = planet.stack_frameworks.some((f: string) => f.includes('Express') || f.includes('Django') || f.includes('Spring'));
    const hasMobile = planet.stack_frameworks.some((f: string) => f.includes('React Native') || f.includes('Flutter'));
    const hasAI = planet.stack_languages.some((l: string) => l.includes('Python')) && 
                 planet.stack_frameworks.some((f: string) => f.includes('TensorFlow') || f.includes('PyTorch'));
    
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
      case 'likes': return (b.likes || 0) - (a.likes || 0);
      case 'recent': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default: return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 sm:pt-44 px-4">
        <div className="max-w-7xl mx-auto py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70">Loading planets...</p>
          </div>
        </div>
      </div>
    );
  }

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
                    ? 'border-2'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                style={{
                  backgroundColor: selectedFilter === filter.id ? `${filter.color}20` : undefined,
                  color: selectedFilter === filter.id ? filter.color : undefined,
                  borderColor: selectedFilter === filter.id ? `${filter.color}50` : 'transparent'
                }}
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: `0 5px 15px ${filter.color}30`
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
                  onClick={() => onNavigateToPlanet(planet.id)}
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

                      {/* Categories */}
                      {planet.categories && planet.categories.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {planet.categories.slice(0, 2).map((category: string, catIndex: number) => (
                              <motion.span
                                key={category}
                                className="px-2 py-1 text-xs rounded-full font-semibold"
                                style={{
                                  backgroundColor: `${filters.find(f => f.id === category)?.color || '#ffffff'}20`,
                                  color: filters.find(f => f.id === category)?.color || '#ffffff'
                                }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + catIndex * 0.1, duration: 0.3 }}
                                whileHover={{ 
                                  scale: 1.1,
                                  boxShadow: `0 0 10px ${filters.find(f => f.id === category)?.color || '#ffffff'}50`
                                }}
                              >
                                {getCategoryLabel(category)}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {planet.stack_languages.slice(0, 2).map((lang: string, langIndex: number) => (
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
                          {planet.stack_languages.length > 2 && (
                            <motion.span 
                              className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full"
                              whileHover={{ 
                                scale: 1.1,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)'
                              }}
                            >
                              +{planet.stack_languages.length - 2}
                            </motion.span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-white/60">
                          <motion.button
                            onClick={(e) => handleLike(planet.id, e)}
                            className={`flex items-center space-x-1 transition-colors ${
                              likedPlanets.has(planet.id) 
                                ? 'text-red-400' 
                                : 'text-white/60 hover:text-red-400'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <motion.div
                              animate={likedPlanets.has(planet.id) ? { 
                                scale: [1, 1.3, 1],
                                rotateZ: [0, 10, -10, 0]
                              } : {}}
                              transition={{ duration: 0.5 }}
                            >
                              <Heart 
                                className={`w-3 h-3 ${likedPlanets.has(planet.id) ? 'fill-current' : ''}`} 
                              />
                            </motion.div>
                            <span>{planet.likes || 0}</span>
                          </motion.button>
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