import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { DevPlanet3D } from '../ui/DevPlanet3D';
import { GlassPanel } from '../ui/GlassPanel';
import { FloatingElements } from '../ui/FloatingElements';
import { AnimatedBackground } from '../ui/AnimatedBackground';

interface GalaxyViewProps {
  onNavigate: (page: string) => void;
}

export const GalaxyView: React.FC<GalaxyViewProps> = ({ onNavigate }) => {
  // Get user-created planets from localStorage
  const getUserPlanets = () => {
    const users = JSON.parse(localStorage.getItem('devverse_users') || '[]');
    return users.map((user: any) => user.planet).filter(Boolean);
  };

  const userPlanets = getUserPlanets();

  return (
    <div className="min-h-screen pt-20 sm:pt-44">
      <FloatingElements />
      <AnimatedBackground />
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen"
      >
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            
            {userPlanets.map((planet) => (
              <DevPlanet3D
                key={planet.id}
                planet={planet}
                onClick={() => console.log(`Clicked on ${planet.name}`)}
              />
            ))}
            
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              zoomSpeed={0.6}
              panSpeed={0.5}
              rotateSpeed={0.4}
            />
            <Environment preset="night" />
          </Suspense>
        </Canvas>

        {/* Overlay Content */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.8, rotateX: -30 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ 
                delay: 0.5, 
                duration: 1.2,
                type: "spring",
                stiffness: 100
              }}
              className="pointer-events-auto"
            >
              <motion.h1 
                className="font-orbitron text-4xl sm:text-6xl md:text-8xl font-black mb-4"
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
                    rotate: [0, 10, -10, 0],
                    rotateZ: [0, 360]
                  }}
                  transition={{ 
                    color: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 },
                    rotate: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 },
                    rotateZ: { duration: 8, repeat: Infinity, ease: "linear" }
                  }}
                >
                  ³
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="font-sora text-lg sm:text-xl md:text-2xl text-white/80 mb-8 max-w-2xl"
                initial={{ opacity: 0, y: 20, rotateX: -20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                Build. Orbit. Share. Your coding universe awaits.
              </motion.p>
              
              <motion.button
                onClick={() => onNavigate('builder')}
                className="interactive px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-orbitron font-bold text-base sm:text-lg transition-all duration-500 text-white"
                style={{
                  background: 'linear-gradient(45deg, #00ffff, #ff00ff)'
                }}
                initial={{ opacity: 0, y: 20, scale: 0.9, rotateX: -20 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
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
                Launch Your Planet
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Galaxy Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50, rotateY: -15, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <GlassPanel glowColor="#00ffff">
              <motion.div 
                className="text-center"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="text-3xl sm:text-4xl font-orbitron font-bold text-cyber-blue mb-2"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotateZ: [0, 5, -5, 0],
                    textShadow: [
                      '0 0 10px #00ffff',
                      '0 0 20px #00ffff, 0 0 30px #00ffff',
                      '0 0 10px #00ffff'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {userPlanets.length}
                </motion.div>
                <div className="text-white/70 font-sora text-sm sm:text-base">Active Planets</div>
              </motion.div>
            </GlassPanel>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50, rotateY: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <GlassPanel glowColor="#ff00ff">
              <motion.div 
                className="text-center"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: -5,
                  rotateX: 5
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="text-3xl sm:text-4xl font-orbitron font-bold text-cyber-pink mb-2"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotateZ: [0, -5, 5, 0],
                    textShadow: [
                      '0 0 10px #ff00ff',
                      '0 0 20px #ff00ff, 0 0 30px #ff00ff',
                      '0 0 10px #ff00ff'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  {userPlanets.reduce((total, planet) => total + planet.stack.languages.length + planet.stack.frameworks.length, 0)}
                </motion.div>
                <div className="text-white/70 font-sora text-sm sm:text-base">Tech Stacks</div>
              </motion.div>
            </GlassPanel>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50, rotateY: -15, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <GlassPanel glowColor="#ffff00">
              <motion.div 
                className="text-center"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: -5
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="text-3xl sm:text-4xl font-orbitron font-bold text-cyber-yellow mb-2"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                    rotateZ: [0, 360],
                    textShadow: [
                      '0 0 10px #ffff00',
                      '0 0 20px #ffff00, 0 0 30px #ffff00',
                      '0 0 10px #ffff00'
                    ]
                  }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 },
                    rotate: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 },
                    rotateZ: { duration: 8, repeat: Infinity, ease: "linear" },
                    textShadow: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }
                  }}
                >
                  ∞
                </motion.div>
                <div className="text-white/70 font-sora text-sm sm:text-base">Possibilities</div>
              </motion.div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </div>
  );
};