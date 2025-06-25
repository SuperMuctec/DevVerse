import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Code, Database, PenTool as Tool, Layers, Save, Rocket, Sparkles } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const StackBuilder: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [planetName, setPlanetName] = useState(user?.planet?.name || '');
  const [stack, setStack] = useState({
    languages: user?.planet?.stack?.languages || [],
    frameworks: user?.planet?.stack?.frameworks || [],
    tools: user?.planet?.stack?.tools || [],
    databases: user?.planet?.stack?.databases || []
  });

  const techOptions = {
    languages: ['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin'],
    frameworks: ['React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Express', 'FastAPI', 'Django', 'Spring Boot', 'Laravel'],
    tools: ['Docker', 'Kubernetes', 'AWS', 'GitHub Actions', 'Webpack', 'Vite', 'Jenkins', 'Terraform', 'Ansible'],
    databases: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'DynamoDB', 'InfluxDB', 'SQLite', 'Cassandra']
  };

  const addToStack = (category: keyof typeof stack, tech: string) => {
    if (!stack[category].includes(tech)) {
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

  const deployPlanet = () => {
    if (!planetName.trim()) {
      toast.error('Please enter a planet name');
      return;
    }

    if (user?.planet) {
      const updatedPlanet = {
        ...user.planet,
        name: planetName,
        stack: stack
      };
      updateUser({ planet: updatedPlanet });
      
      // Update the planet in the users database
      const users = JSON.parse(localStorage.getItem('devverse_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].planet = updatedPlanet;
        localStorage.setItem('devverse_users', JSON.stringify(users));
      }

      // Award achievement for creating first planet
      const achievements = JSON.parse(localStorage.getItem(`achievements_${user.id}`) || '[]');
      if (!achievements.some((a: any) => a.id === 'god')) {
        const newAchievement = {
          id: 'god',
          name: 'A God',
          description: 'User Creates their first planet',
          icon: 'planet',
          unlockedAt: new Date()
        };
        achievements.push(newAchievement);
        localStorage.setItem(`achievements_${user.id}`, JSON.stringify(achievements));
        toast.success('Achievement unlocked: A God! 🌍');
      }

      toast.success('Planet deployed successfully! 🚀');
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
            {Object.entries(techOptions).map(([category, options], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -50, rotateY: -15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ 
                  delay: categoryIndex * 0.2,
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
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {options.map((tech, techIndex) => (
                      <motion.button
                        key={tech}
                        onClick={() => addToStack(category as keyof typeof stack, tech)}
                        className={`interactive p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-sora transition-all duration-300 ${
                          stack[category as keyof typeof stack].includes(tech)
                            ? 'bg-white/20 text-white border border-white/30'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                        initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        transition={{ 
                          delay: categoryIndex * 0.2 + techIndex * 0.05,
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
                          className="interactive bg-gradient-to-r from-cyber-blue/20 to-cyber-pink/20 px-2 sm:px-3 py-1 rounded-full text-xs font-sora cursor-pointer hover:from-cyber-blue/30 hover:to-cyber-pink/30 transition-all duration-300"
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