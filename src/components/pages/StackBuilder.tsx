import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Code, Database, PenTool as Tool, Layers, Save, Rocket } from 'lucide-react';
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
      case 'languages': return <Code className="w-5 h-5" />;
      case 'frameworks': return <Layers className="w-5 h-5" />;
      case 'tools': return <Tool className="w-5 h-5" />;
      case 'databases': return <Database className="w-5 h-5" />;
      default: return <Code className="w-5 h-5" />;
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
    <div className="min-h-screen pt-44 px-4">
      <div className="max-w-7xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-orbitron text-5xl font-bold mb-4">
            <span className="neon-text text-cyber-blue">Stack</span>{' '}
            <span className="neon-text text-cyber-pink">Builder</span>
          </h1>
          <p className="font-sora text-xl text-white/70">
            Craft your perfect development constellation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stack Categories */}
          <div className="space-y-6">
            {Object.entries(techOptions).map(([category, options]) => (
              <GlassPanel key={category} glowColor={getCategoryColor(category)}>
                <div className="flex items-center space-x-3 mb-4">
                  {getCategoryIcon(category)}
                  <h3 className="font-orbitron text-xl font-bold capitalize">
                    {category}
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {options.map((tech) => (
                    <motion.button
                      key={tech}
                      onClick={() => addToStack(category as keyof typeof stack, tech)}
                      className={`interactive p-2 rounded-lg text-sm font-sora transition-all duration-300 ${
                        stack[category as keyof typeof stack].includes(tech)
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tech}
                    </motion.button>
                  ))}
                </div>
              </GlassPanel>
            ))}
          </div>

          {/* Current Stack */}
          <div className="space-y-6">
            <GlassPanel glowColor="#ffffff">
              <h3 className="font-orbitron text-2xl font-bold mb-6 text-center">
                Your Planet Configuration
              </h3>
              
              {/* Planet Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Planet Name
                </label>
                <div className="relative">
                  <Rocket className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    value={planetName}
                    onChange={(e) => setPlanetName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300"
                    placeholder="Enter your planet name"
                  />
                </div>
              </div>
              
              {Object.entries(stack).map(([category, items]) => (
                <div key={category} className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    {getCategoryIcon(category)}
                    <h4 className="font-sora font-semibold capitalize text-sm">
                      {category} ({items.length})
                    </h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <motion.span
                        key={item}
                        onClick={() => removeFromStack(category as keyof typeof stack, item)}
                        className="interactive bg-gradient-to-r from-cyber-blue/20 to-cyber-pink/20 px-3 py-1 rounded-full text-xs font-sora cursor-pointer hover:from-cyber-blue/30 hover:to-cyber-pink/30 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item} ×
                      </motion.span>
                    ))}
                  </div>
                </div>
              ))}
              
              <motion.button
                onClick={deployPlanet}
                className="interactive w-full bg-gradient-to-r from-cyber-blue to-cyber-pink py-3 rounded-lg font-orbitron font-bold hover:scale-105 transition-transform duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-5 h-5" />
                <span>Deploy Planet</span>
              </motion.button>
            </GlassPanel>
          </div>
        </div>
      </div>
    </div>
  );
};