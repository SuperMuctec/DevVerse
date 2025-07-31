import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Star, Code, Users, Trophy, Zap } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { FloatingElements } from '../ui/FloatingElements';
import { AnimatedBackground } from '../ui/AnimatedBackground';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  onEnterApp: () => void;
  isAuthenticated: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onLogin, 
  onRegister, 
  onEnterApp, 
  isAuthenticated 
}) => {
  const features = [
    {
      icon: Code,
      title: 'Build Your Planet',
      description: 'Create a unique 3D planet representing your tech stack and coding journey.',
      color: '#00ffff'
    },
    {
      icon: Users,
      title: 'Connect & Explore',
      description: 'Discover other developers and explore their coding universes.',
      color: '#ff00ff'
    },
    {
      icon: Trophy,
      title: 'Code Challenges',
      description: 'Test your skills in the Arena with AI-powered coding challenges.',
      color: '#ffff00'
    },
    {
      icon: Star,
      title: 'Share Your Journey',
      description: 'Document your development journey with DevLogs and achievements.',
      color: '#00ff00'
    }
  ];

  return (
    <div className="min-h-screen bg-space-dark text-white relative overflow-hidden">
      <FloatingElements />
      <AnimatedBackground />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, type: "spring" }}
              className="mb-8"
            >
              {/* Logo */}
              <motion.div
                className="mb-8"
                initial={{ scale: 0, rotateZ: -180 }}
                animate={{ scale: 1, rotateZ: 0 }}
                transition={{ delay: 0.3, duration: 1, type: "spring" }}
              >
                <motion.img
                  src="/white_circle_360x360.png"
                  alt="DevVerse³ Logo"
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto mb-6 opacity-90"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    filter: [
                      'drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))',
                      'drop-shadow(0 0 40px rgba(255, 0, 255, 0.8))',
                      'drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))'
                    ]
                  }}
                  transition={{ 
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    filter: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              </motion.div>

              <motion.h1 
                className="font-orbitron text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6"
                animate={{
                  textShadow: [
                    '0 0 20px #00ffff, 0 0 40px #00ffff',
                    '0 0 30px #ff00ff, 0 0 60px #ff00ff',
                    '0 0 20px #ffff00, 0 0 40px #ffff00',
                    '0 0 20px #00ffff, 0 0 40px #00ffff'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.span 
                  className="neon-text text-cyber-blue inline-block"
                  animate={{ 
                    color: ['#00ffff', '#0099ff', '#00ffff'],
                    scale: [1, 1.05, 1],
                    rotateY: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  Dev
                </motion.span>
                <motion.span 
                  className="neon-text text-cyber-pink inline-block"
                  animate={{ 
                    color: ['#ff00ff', '#ff0099', '#ff00ff'],
                    scale: [1, 1.05, 1],
                    rotateY: [0, -5, 5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  Verse
                </motion.span>
                <motion.span 
                  className="neon-text text-cyber-yellow inline-block"
                  animate={{ 
                    color: ['#ffff00', '#ffcc00', '#ffff00'],
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    color: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 },
                    rotate: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }
                  }}
                >
                  ³
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="font-sora text-xl sm:text-2xl md:text-3xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                Build. Orbit. Share. Your coding universe awaits.
              </motion.p>

              <motion.p 
                className="font-sora text-lg sm:text-xl text-white/60 mb-12 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                Create your 3D developer planet, showcase your tech stack, connect with other developers, 
                and embark on coding challenges in the ultimate developer galaxy.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                {isAuthenticated ? (
                  <motion.button
                    onClick={onEnterApp}
                    className="px-8 py-4 rounded-xl font-orbitron font-bold text-lg transition-all duration-500 text-white min-h-[56px] min-w-[200px]"
                    style={{
                      background: 'linear-gradient(45deg, #00ffff, #ff00ff)'
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 10,
                      rotateX: 10,
                      boxShadow: '0 0 40px rgba(0, 255, 255, 0.6)'
                    }}
                    whileTap={{ 
                      scale: 0.95,
                      rotateY: -5,
                      rotateX: -5
                    }}
                  >
                    Enter DevVerse³
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      onClick={onRegister}
                      className="px-8 py-4 rounded-xl font-orbitron font-bold text-lg transition-all duration-500 text-white min-h-[56px] min-w-[200px]"
                      style={{
                        background: 'linear-gradient(45deg, #00ffff, #ff00ff)'
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        rotateY: 10,
                        rotateX: 10,
                        boxShadow: '0 0 40px rgba(0, 255, 255, 0.6)'
                      }}
                      whileTap={{ 
                        scale: 0.95,
                        rotateY: -5,
                        rotateX: -5
                      }}
                    >
                      Create Your Planet
                    </motion.button>
                    
                    <motion.button
                      onClick={onLogin}
                      className="px-8 py-4 rounded-xl font-orbitron font-bold text-lg border-2 border-white/30 text-white hover:border-cyber-blue hover:text-cyber-blue transition-all duration-300 min-h-[56px] min-w-[200px]"
                      whileHover={{ 
                        scale: 1.05,
                        rotateY: -10,
                        rotateX: 10,
                        boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)'
                      }}
                      whileTap={{ 
                        scale: 0.95,
                        rotateY: 5,
                        rotateX: -5
                      }}
                    >
                      Launch In
                    </motion.button>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-orbitron text-3xl sm:text-4xl font-bold mb-4">
              <span className="neon-text text-cyber-blue">Explore</span>{' '}
              <span className="neon-text text-cyber-pink">The Galaxy</span>
            </h2>
            <p className="font-sora text-xl text-white/70 max-w-2xl mx-auto">
              Discover what makes DevVerse³ the ultimate destination for developers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  delay: 1.7 + index * 0.2,
                  duration: 0.8,
                  type: "spring"
                }}
              >
                <GlassPanel glowColor={feature.color}>
                  <motion.div 
                    className="text-center"
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                      rotateX: 5
                    }}
                  >
                    <motion.div
                      className="mb-4"
                      animate={{ 
                        rotateZ: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        rotateZ: { duration: 8, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <feature.icon 
                        className="w-12 h-12 mx-auto" 
                        style={{ color: feature.color }} 
                      />
                    </motion.div>
                    <h3 className="font-orbitron text-lg font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        {!isAuthenticated && (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5, duration: 0.8 }}
            >
              <GlassPanel glowColor="#ffffff">
                <h2 className="font-orbitron text-2xl sm:text-3xl font-bold text-white mb-4">
                  Ready to Join the Galaxy?
                </h2>
                <p className="font-sora text-lg text-white/70 mb-8">
                  Start your coding journey in DevVerse³ today. Create your planet, 
                  connect with developers, and showcase your skills to the universe.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    onClick={onRegister}
                    className="px-8 py-4 rounded-xl font-orbitron font-bold text-lg bg-gradient-to-r from-cyber-blue to-cyber-pink text-white transition-all duration-300"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started Free
                  </motion.button>
                  <motion.button
                    onClick={onLogin}
                    className="px-8 py-4 rounded-xl font-orbitron font-bold text-lg border-2 border-white/30 text-white hover:border-cyber-blue hover:text-cyber-blue transition-all duration-300"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    I Have an Account
                  </motion.button>
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};