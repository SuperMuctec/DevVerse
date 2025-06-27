import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Heart, 
  Star,
  Code,
  Database,
  PenTool as Tool,
  Layers,
  MapPin,
  Globe,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { supabase } from '../../lib/supabase';
import { dbOps } from '../../lib/database';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface PlanetDetailProps {
  planetId: string;
  onBack: () => void;
  onNavigateToUser: (userId: string) => void;
}

export const PlanetDetail: React.FC<PlanetDetailProps> = ({ planetId, onBack, onNavigateToUser }) => {
  const [planet, setPlanet] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();

  const categoryOptions = [
    { id: 'frontend', label: 'Frontend', color: '#00ffff' },
    { id: 'backend', label: 'Backend', color: '#ff00ff' },
    { id: 'fullstack', label: 'Full Stack', color: '#ffff00' },
    { id: 'mobile', label: 'Mobile', color: '#00ff00' },
    { id: 'ai', label: 'AI/ML', color: '#ff6600' },
  ];

  // Helper function to get proper category label
  const getCategoryLabel = (categoryId: string) => {
    const category = categoryOptions.find(c => c.id === categoryId);
    return category ? category.label : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  };

  // Helper function to get category color
  const getCategoryColor = (categoryId: string) => {
    const category = categoryOptions.find(c => c.id === categoryId);
    return category ? category.color : '#ffffff';
  };

  useEffect(() => {
    const loadPlanetData = async () => {
      try {
        // Get planet data
        const { data: planetData, error: planetError } = await supabase
          .from('dev_planets')
          .select('*')
          .eq('id', planetId)
          .single();

        if (planetError) {
          console.error('Error loading planet:', planetError);
          return;
        }

        // Get owner data
        const ownerData = await dbOps.getUserById(planetData.user_id);
        
        setPlanet(planetData);
        setOwner(ownerData);

        // Check if user has liked this planet
        if (user) {
          const liked = JSON.parse(localStorage.getItem(`liked_planets_${user.id}`) || '[]');
          setIsLiked(liked.includes(planetId));
        }
      } catch (error) {
        console.error('Error loading planet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlanetData();
  }, [planetId, user]);

  // Handle like functionality
  const handleLike = async () => {
    if (!user) {
      toast.error('Please log in to like planets');
      return;
    }

    try {
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
      const liked = JSON.parse(localStorage.getItem(`liked_planets_${user.id}`) || '[]');
      let newLiked;
      
      if (isLiked) {
        newLiked = liked.filter((id: string) => id !== planetId);
        toast.success('Removed like');
      } else {
        newLiked = [...liked, planetId];
        toast.success('Planet liked! ❤️');
      }
      
      localStorage.setItem(`liked_planets_${user.id}`, JSON.stringify(newLiked));
      setIsLiked(!isLiked);

      // Update planet likes count
      setPlanet((prev: any) => ({
        ...prev,
        likes: (prev.likes || 0) + newLikeCount
      }));

    } catch (error) {
      console.error('Error handling like:', error);
      toast.error('Failed to update like');
    }
  };

  const getStackCategoryIcon = (category: string) => {
    switch (category) {
      case 'languages': return <Code className="w-4 h-4" />;
      case 'frameworks': return <Layers className="w-4 h-4" />;
      case 'tools': return <Tool className="w-4 h-4" />;
      case 'databases': return <Database className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const getStackCategoryColor = (category: string) => {
    switch (category) {
      case 'languages': return '#00ffff';
      case 'frameworks': return '#ff00ff';
      case 'tools': return '#ffff00';
      case 'databases': return '#00ff00';
      default: return '#ffffff';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70">Loading planet...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!planet || !owner) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center">
            <h1 className="font-orbitron text-2xl font-bold text-white mb-4">Planet Not Found</h1>
            <motion.button
              onClick={onBack}
              className="text-cyber-blue hover:text-cyber-pink transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              ← Back to Showroom
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto py-8">
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 text-cyber-blue hover:text-cyber-pink transition-colors"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Showroom</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Planet Visualization */}
          <div className="lg:col-span-1">
            <GlassPanel glowColor={planet.color}>
              <div className="text-center">
                {/* Planet Visual */}
                <motion.div 
                  className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center relative overflow-hidden"
                  style={{ 
                    background: `radial-gradient(circle, ${planet.color}40, ${planet.color}10)`,
                    border: `2px solid ${planet.color}60`
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="w-20 h-20 rounded-full relative"
                    style={{ 
                      background: `radial-gradient(circle, ${planet.color}, ${planet.color}80)`,
                      boxShadow: `0 0 30px ${planet.color}60`
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
                    {Array.from({ length: planet.rings }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 border-2 rounded-full"
                        style={{ 
                          borderColor: `${planet.color}40`,
                          transform: `scale(${1.3 + i * 0.3})`
                        }}
                        animate={{ 
                          scale: [1.3 + i * 0.3, 1.5 + i * 0.3, 1.3 + i * 0.3],
                          opacity: [0.6, 0.2, 0.6]
                        }}
                        transition={{ 
                          duration: 3 + i, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      />
                    ))}
                  </motion.div>
                  
                  {/* Floating particles */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full"
                      style={{ backgroundColor: planet.color }}
                      animate={{
                        x: [0, 30, -30, 0],
                        y: [0, -20, 20, 0],
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

                <motion.h1 
                  className="font-orbitron text-2xl font-bold text-white mb-2"
                  animate={{
                    textShadow: [
                      `0 0 10px ${planet.color}`,
                      `0 0 20px ${planet.color}, 0 0 30px ${planet.color}`,
                      `0 0 10px ${planet.color}`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {planet.name}
                </motion.h1>

                {/* Planet Stats */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="text-center">
                    <motion.button
                      onClick={handleLike}
                      className={`flex items-center justify-center space-x-2 mx-auto transition-colors ${
                        isLiked 
                          ? 'text-red-400' 
                          : 'text-white/60 hover:text-red-400'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div
                        animate={isLiked ? { 
                          scale: [1, 1.3, 1],
                          rotateZ: [0, 10, -10, 0]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <Heart 
                          className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} 
                        />
                      </motion.div>
                      <span className="font-bold">{planet.likes || 0}</span>
                    </motion.button>
                    <div className="text-white/60 text-sm mt-1">
                      {isLiked ? 'You liked this' : 'Click to like'}
                    </div>
                  </div>
                </div>

                {/* Planet Categories */}
                {planet.categories && planet.categories.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-white mb-3">Categories</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {planet.categories.map((category: string) => (
                        <motion.span
                          key={category}
                          className="px-3 py-1 rounded-full text-sm font-semibold"
                          style={{ 
                            backgroundColor: `${getCategoryColor(category)}20`,
                            color: getCategoryColor(category),
                            border: `1px solid ${getCategoryColor(category)}50`
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: `0 0 10px ${getCategoryColor(category)}50`
                          }}
                        >
                          {getCategoryLabel(category)}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-white/60 text-sm">
                  Created {new Date(planet.created_at).toLocaleDateString()}
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* Planet Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Owner Info */}
            <GlassPanel glowColor="#00ffff">
              <div className="flex items-center space-x-4 mb-4">
                <motion.img
                  src={owner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${owner.username}`}
                  alt={owner.username}
                  className="w-16 h-16 rounded-full border-2 border-cyber-blue"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                />
                <div className="flex-1">
                  <motion.h2 
                    className="font-orbitron text-xl font-bold text-white mb-1"
                    whileHover={{ scale: 1.02 }}
                  >
                    Planet Owner
                  </motion.h2>
                  <motion.button
                    onClick={() => onNavigateToUser(owner.id)}
                    className="text-cyber-blue hover:text-cyber-pink transition-colors font-semibold"
                    whileHover={{ scale: 1.05 }}
                  >
                    @{owner.username}
                  </motion.button>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-white/60">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(owner.created_at).toLocaleDateString()}</span>
                    </div>
                    {owner.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{owner.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {owner.bio && (
                <p className="text-white/80 text-sm leading-relaxed mb-4">
                  {owner.bio}
                </p>
              )}

              <motion.button
                onClick={() => onNavigateToUser(owner.id)}
                className="w-full bg-gradient-to-r from-cyber-blue to-cyber-green py-2 px-4 rounded-lg font-semibold text-white transition-all duration-300"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 5px 15px rgba(0, 255, 255, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                View Full Profile
              </motion.button>
            </GlassPanel>

            {/* Tech Stack */}
            <GlassPanel glowColor="#ff00ff">
              <motion.h2 
                className="font-orbitron text-xl font-bold text-white mb-6"
                animate={{
                  textShadow: [
                    '0 0 10px #ff00ff',
                    '0 0 20px #ff00ff, 0 0 30px #ff00ff',
                    '0 0 10px #ff00ff'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Tech Stack
              </motion.h2>

              <div className="space-y-6">
                {[
                  { key: 'stack_languages', label: 'Languages', items: planet.stack_languages },
                  { key: 'stack_frameworks', label: 'Frameworks', items: planet.stack_frameworks },
                  { key: 'stack_tools', label: 'Tools', items: planet.stack_tools },
                  { key: 'stack_databases', label: 'Databases', items: planet.stack_databases }
                ].map(({ key, label, items }, index) => (
                  items && items.length > 0 && (
                    <motion.div 
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <motion.div
                          animate={{ 
                            rotateZ: [0, 360],
                            color: [getStackCategoryColor(key.replace('stack_', '')), '#ffffff', getStackCategoryColor(key.replace('stack_', ''))]
                          }}
                          transition={{ 
                            rotateZ: { duration: 4, repeat: Infinity, ease: "linear" },
                            color: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                          }}
                        >
                          {getStackCategoryIcon(key.replace('stack_', ''))}
                        </motion.div>
                        <h3 className="font-semibold text-white">{label} ({items.length})</h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {items.map((item: string, itemIndex: number) => (
                          <motion.span
                            key={item}
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{ 
                              backgroundColor: `${getStackCategoryColor(key.replace('stack_', ''))}20`,
                              color: getStackCategoryColor(key.replace('stack_', '')),
                              border: `1px solid ${getStackCategoryColor(key.replace('stack_', ''))}30`
                            }}
                            initial={{ opacity: 0, scale: 0, rotateZ: -180 }}
                            animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                            transition={{ 
                              delay: itemIndex * 0.05,
                              duration: 0.4,
                              type: "spring"
                            }}
                            whileHover={{ 
                              scale: 1.05,
                              rotateZ: 5,
                              boxShadow: `0 5px 15px ${getStackCategoryColor(key.replace('stack_', ''))}40`
                            }}
                          >
                            {item}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </div>
  );
};