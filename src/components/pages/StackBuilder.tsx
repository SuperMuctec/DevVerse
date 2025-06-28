import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Code, Database, PenTool as Tool, Layers, Save, Rocket, Sparkles, Tag } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

export const StackBuilder: React.FC = () => {
  const { user, updateUser, loadUserPlanet } = useAuth();
  const [planetName, setPlanetName] = useState('');
  const [stack, setStack] = useState({
    languages: [],
    frameworks: [],
    tools: [],
    databases: []
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load planet data when component mounts
  useEffect(() => {
    const loadPlanetData = async () => {
      if (user && !user.planet) {
        await loadUserPlanet();
      }
      setIsLoading(false);
    };

    loadPlanetData();
  }, [user, loadUserPlanet]);

  // Update form when planet data is loaded
  useEffect(() => {
    if (user?.planet) {
      setPlanetName(user.planet.name || '');
      setStack({
        languages: user.planet.stack?.languages || [],
        frameworks: user.planet.stack?.frameworks || [],
        tools: user.planet.stack?.tools || [],
        databases: user.planet.stack?.databases || []
      });
      setSelectedCategories(user.planet.categories || []);
    }
  }, [user?.planet]);

  const techOptions = {
    languages: ['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin'],
    frameworks: ['React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Express', 'FastAPI', 'Django', 'Spring Boot', 'Laravel'],
    tools: ['Docker', 'Kubernetes', 'AWS', 'GitHub Actions', 'Webpack', 'Vite', 'Jenkins', 'Terraform', 'Ansible'],
    databases: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'DynamoDB', 'InfluxDB', 'SQLite', 'Cassandra']
  };

  const categoryOptions = [
    { id: 'frontend', label: 'Frontend', color: '#00ffff', description: 'UI/UX focused development' },
    { id: 'backend', label: 'Backend', color: '#ff00ff', description: 'Server-side development' },
    { id: 'fullstack', label: 'Full Stack', color: '#ffff00', description: 'End-to-end development' },
    { id: 'mobile', label: 'Mobile', color: '#00ff00', description: 'Mobile app development' },
    { id: 'ai', label: 'AI/ML', color: '#ff6600', description: 'Artificial Intelligence & Machine Learning' },
  ];

  const addToStack = (category: keyof typeof stack, tech: string) => {
    if (stack[category].includes(tech)) {
      // Remove if already selected (toggle off)
      setStack(prev => ({
        ...prev,
        [category]: prev[category].filter(item => item !== tech)
      }));
    } else {
      // Add if not selected (toggle on)
      setStack(prev => ({
        ...prev,
        [category]: [...prev[category], tech]
      }));
    }
  };

  const removeFromStack = (category: keyof typeof stack, tech: string) => {
    setStack(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item !== tech)
    }));
  };

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      // Remove if already selected (toggle off)
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    } else if (selectedCategories.length < 2) {
      // Add if not selected and under limit (toggle on)
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      toast.error('You can select maximum 2 categories');
    }
  };

  const deployPlanet = async () => {
    if (!planetName.trim()) {
      toast.error('Please enter a planet name');
      return;
    }

    if (!user) return;

    try {
      const planetData = {
        name: planetName,
        stack: {
          languages: stack.languages,
          frameworks: stack.frameworks,
          tools: stack.tools,
          databases: stack.databases,
        },
        categories: selectedCategories,
        color: user.planet?.color || '#00ffff',
        size: user.planet?.size || 1.0,
        rings: user.planet?.rings || 1,
      };

      // Update planet in database
      await supabase
        .from('dev_planets')
        .upsert({
          user_id: user.id,
          name: planetName,
          stack_languages: stack.languages,
          stack_frameworks: stack.frameworks,
          stack_tools: stack.tools,
          stack_databases: stack.databases,
          categories: selectedCategories,
          color: user.planet?.color || '#00ffff',
          size: user.planet?.size || 1.0,
          rings: user.planet?.rings || 1,
        }, { onConflict: 'user_id' });

      // Update user context
      updateUser({ planet: { ...user.planet, ...planetData } });

      // Award achievement for creating first planet
      await supabase
        .from('achievements')
        .upsert({
          user_id: user.id,
          achievement_id: 'god',
          name: 'A God',
          description: 'User Creates their first planet',
          icon: 'planet',
        }, { onConflict: 'user_id,achievement_id' });

      toast.success('Planet deployed successfully! 🚀');
      toast.success('Achievement unlocked: A God! 🌍');
    } catch (error) {
      console.error('Error deploying planet:', error);
      toast.error('Failed to deploy planet');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'languages': return <Code className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'frameworks': return <Layers className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'tools': return <Tool className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'databases': return <Database className="w-4 h-4 sm:w-5 sm:h-5" />;
      default: return <Code className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
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
      <div className="min-h-screen pt-20 sm:pt-44 px-4">
        <div className="max-w-7xl mx-auto py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70">Loading Stack Builder...</p>
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
              Builder
            </motion.span>
          </motion.h1>
          <motion.p 
            className="font-sora text-lg sm:text-xl text-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Craft your perfect development constellation
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Stack Categories */}
          <div className="space-y-4 sm:space-y-6">
            {/* Planet Categories Selection */}
            <motion.div
              initial={{ opacity: 0, x: -50, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <GlassPanel glowColor="#ffffff">
                <motion.div 
                  className="flex items-center space-x-3 mb-4"
                  whileHover={{ scale: 1.02, rotateX: 5 }}
                >
                  <motion.div
                    animate={{ 
                      rotateZ: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotateZ: { duration: 8, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                  <h3 className="font-orbitron text-lg sm:text-xl font-bold">
                    Planet Categories
                  </h3>
                  <motion.div
                    animate={{ 
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-4 h-4 text-white/50" />
                  </motion.div>
                </motion.div>
                
                <p className="text-white/70 text-sm mb-4">
                  Select up to 2 categories that best describe your planet (helps with discovery). Click again to deselect.
                </p>
                
                <div className="grid grid-cols-1 gap-2">
                  {categoryOptions.map((category, index) => (
                    <motion.button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`p-3 rounded-lg text-left transition-all duration-300 border-2 ${
                        selectedCategories.includes(category.id)
                          ? 'border-2'
                          : 'bg-white/5 hover:bg-white/10 border-transparent'
                      }`}
                      style={{
                        borderColor: selectedCategories.includes(category.id) ? category.color : 'transparent',
                        backgroundColor: selectedCategories.includes(category.id) ? `${category.color}20` : undefined,
                      }}
                      initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
                      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.4
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        rotateY: 5,
                        boxShadow: `0 5px 15px ${category.color}40`
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <div className="flex-1">
                          <div 
                            className="font-semibold text-sm"
                            style={{ color: selectedCategories.includes(category.id) ? category.color : '#ffffff' }}
                          >
                            {category.label}
                          </div>
                          <div className="text-xs text-white/60">
                            {category.description}
                          </div>
                        </div>
                        {selectedCategories.includes(category.id) && (
                          <motion.div
                            initial={{ scale: 0, rotateZ: -180 }}
                            animate={{ scale: 1, rotateZ: 0 }}
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: category.color }}
                          >
                            <span className="text-black text-xs font-bold">✓</span>
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                <div className="mt-3 text-xs text-white/50 text-center">
                  {selectedCategories.length}/2 categories selected
                </div>
              </GlassPanel>
            </motion.div>

            {Object.entries(techOptions).map(([category, options], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -50, rotateY: -15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ 
                  delay: (categoryIndex + 1) * 0.2,
                  duration: 0.8,
                  type: "spring"
                }}
              >
                <GlassPanel glowColor={getCategoryColor(category)}>
                  <motion.div 
                    className="flex items-center space-x-3 mb-4"
                    whileHover={{ scale: 1.02, rotateX: 5 }}
                  >
                    <motion.div
                      animate={{ 
                        rotateZ: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        rotateZ: { duration: 8, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      {getCategoryIcon(category)}
                    </motion.div>
                    <h3 className="font-orbitron text-lg sm:text-xl font-bold capitalize">
                      {category}
                    </h3>
                    <motion.div
                      animate={{ 
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.3, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="w-4 h-4 text-white/50" />
                    </motion.div>
                  </motion.div>
                  
                  <p className="text-white/70 text-sm mb-4">
                    Click to add/remove technologies. Selected items will be highlighted.
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {options.map((tech, techIndex) => (
                      <motion.button
                        key={tech}
                        onClick={() => addToStack(category as keyof typeof stack, tech)}
                        className={`interactive p-3 sm:p-3 rounded-lg text-sm font-sora transition-all duration-300 min-h-[44px] ${
                          stack[category as keyof typeof stack].includes(tech)
                            ? 'bg-white/20 text-white border border-white/30'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                        initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        transition={{ 
                          delay: (categoryIndex + 1) * 0.2 + techIndex * 0.05,
                          duration: 0.4
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          rotateY: 5,
                          rotateX: 5,
                          boxShadow: `0 5px 15px ${getCategoryColor(category)}40`
                        }}
                        whileTap={{ 
                          scale: 0.95,
                          rotateY: -2,
                          rotateX: -2
                        }}
                      >
                        <motion.span
                          animate={stack[category as keyof typeof stack].includes(tech) ? {
                            color: [getCategoryColor(category), '#ffffff', getCategoryColor(category)]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="block text-center"
                        >
                          {tech}
                        </motion.span>
                      </motion.button>
                    ))}
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>

          {/* Current Stack */}
          <div className="space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
            >
              <GlassPanel glowColor="#ffffff">
                <motion.h3 
                  className="font-orbitron text-xl sm:text-2xl font-bold mb-6 text-center"
                  animate={{
                    textShadow: [
                      '0 0 10px #ffffff',
                      '0 0 20px #ffffff, 0 0 30px #ffffff',
                      '0 0 10px #ffffff'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  Your Planet Configuration
                </motion.h3>
                
                {/* Planet Name Input */}
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Planet Name
                  </label>
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        rotateZ: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotateZ: { duration: 6, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <Rocket className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
                    </motion.div>
                    <motion.input
                      type="text"
                      value={planetName}
                      onChange={(e) => setPlanetName(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300"
                      placeholder="Enter your planet name"
                      whileFocus={{ 
                        scale: 1.02,
                        boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
                      }}
                    />
                  </div>
                </motion.div>

                {/* Selected Categories Display */}
                {selectedCategories.length > 0 && (
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <h4 className="font-sora font-semibold text-sm mb-3 flex items-center space-x-2">
                      <Tag className="w-4 h-4" />
                      <span>Categories ({selectedCategories.length})</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((categoryId, index) => {
                        const category = categoryOptions.find(c => c.id === categoryId);
                        return category ? (
                          <motion.span
                            key={categoryId}
                            onClick={() => toggleCategory(categoryId)}
                            className="px-3 py-2 rounded-full text-sm font-semibold cursor-pointer min-h-[36px] flex items-center"
                            style={{ 
                              backgroundColor: `${category.color}20`,
                              color: category.color,
                              border: `1px solid ${category.color}50`
                            }}
                            initial={{ opacity: 0, scale: 0, rotateZ: -180 }}
                            animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                            transition={{ 
                              delay: index * 0.1,
                              duration: 0.5,
                              type: "spring"
                            }}
                            whileHover={{ 
                              scale: 1.1,
                              rotateZ: 5,
                              boxShadow: `0 5px 15px ${category.color}40`
                            }}
                            whileTap={{ scale: 0.9 }}
                            title="Click to remove"
                          >
                            {category.label} ×
                          </motion.span>
                        ) : null;
                      })}
                    </div>
                  </motion.div>
                )}
                
                {Object.entries(stack).map(([category, items], index) => (
                  <motion.div 
                    key={category} 
                    className="mb-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  >
                    <motion.div 
                      className="flex items-center space-x-2 mb-3"
                      whileHover={{ scale: 1.02, rotateX: 5 }}
                    >
                      <motion.div
                        animate={{ 
                          rotateZ: [0, 360],
                          color: [getCategoryColor(category), '#ffffff', getCategoryColor(category)]
                        }}
                        transition={{ 
                          rotateZ: { duration: 4, repeat: Infinity, ease: "linear" },
                          color: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                        {getCategoryIcon(category)}
                      </motion.div>
                      <h4 className="font-sora font-semibold capitalize text-sm">
                        {category} ({items.length})
                      </h4>
                    </motion.div>
                    
                    <div className="flex flex-wrap gap-2">
                      {items.map((item, itemIndex) => (
                        <motion.span
                          key={item}
                          onClick={() => removeFromStack(category as keyof typeof stack, item)}
                          className="interactive bg-gradient-to-r from-cyber-blue/20 to-cyber-pink/20 px-3 py-2 rounded-full text-sm font-sora cursor-pointer hover:from-cyber-blue/30 hover:to-cyber-pink/30 transition-all duration-300 min-h-[36px] flex items-center"
                          initial={{ opacity: 0, scale: 0, rotateZ: -180 }}
                          animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                          transition={{ 
                            delay: itemIndex * 0.1,
                            duration: 0.5,
                            type: "spring"
                          }}
                          whileHover={{ 
                            scale: 1.1,
                            rotateZ: 10,
                            boxShadow: '0 5px 15px rgba(0, 255, 255, 0.3)'
                          }}
                          whileTap={{ 
                            scale: 0.9,
                            rotateZ: -10
                          }}
                          exit={{ 
                            opacity: 0, 
                            scale: 0, 
                            rotateZ: 180,
                            transition: { duration: 0.3 }
                          }}
                          title="Click to remove"
                        >
                          {item} ×
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
                
                <motion.button
                  onClick={deployPlanet}
                  className="interactive w-full bg-gradient-to-r from-cyber-blue to-cyber-pink py-3 rounded-lg font-orbitron font-bold transition-all duration-300 flex items-center justify-center space-x-2"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateX: 10,
                    rotateY: 5,
                    boxShadow: '0 10px 30px rgba(0, 255, 255, 0.5)',
                    background: [
                      'linear-gradient(45deg, #00ffff, #ff00ff)',
                      'linear-gradient(45deg, #ff00ff, #ffff00)',
                      'linear-gradient(45deg, #ffff00, #00ffff)',
                      'linear-gradient(45deg, #00ffff, #ff00ff)'
                    ]
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    rotateX: -5,
                    rotateY: -2
                  }}
                >
                  <motion.div
                    animate={{ 
                      rotateZ: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotateZ: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                  <span>Deploy Planet</span>
                </motion.button>
              </GlassPanel>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};