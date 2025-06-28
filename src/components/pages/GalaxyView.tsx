import React, { Suspense, useEffect, useState, lazy } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '../ui/GlassPanel';
import { FloatingElements } from '../ui/FloatingElements';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { supabase } from '../../lib/supabase';

// Lazy load 3D components only when needed
const Canvas = lazy(() => import('@react-three/fiber').then(module => ({ default: module.Canvas })));
const OrbitControls = lazy(() => import('@react-three/drei').then(module => ({ default: module.OrbitControls })));
const Environment = lazy(() => import('@react-three/drei').then(module => ({ default: module.Environment })));
const DevPlanet3D = lazy(() => import('../ui/DevPlanet3D').then(module => ({ default: module.DevPlanet3D })));

interface GalaxyViewProps {
  onNavigate: (page: string) => void;
}

export const GalaxyView: React.FC<GalaxyViewProps> = ({ onNavigate }) => {
  const [planets, setPlanets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [show3D, setShow3D] = useState(false);

  // Load planets from database
  useEffect(() => {
    const loadPlanets = async () => {
      try {
        const { data, error } = await supabase
          .from('dev_planets')
          .select('*')
          .limit(10); // Limit to 10 planets for performance

        if (error) {
          console.error('Error loading planets:', error);
          return;
        }

        // Format planets for 3D rendering
        const formattedPlanets = data.map((planet, index) => ({
          id: planet.id,
          name: planet.name,
          owner: 'User',
          stack: {
            languages: planet.stack_languages || [],
            frameworks: planet.stack_frameworks || [],
            tools: planet.stack_tools || [],
            databases: planet.stack_databases || [],
          },
          position: [
            Math.cos(index * (Math.PI * 2) / data.length) * 10,
            (Math.random() - 0.5) * 5,
            Math.sin(index * (Math.PI * 2) / data.length) * 10
          ],
          color: planet.color || '#00ffff',
          size: planet.size || 1.0,
          rings: planet.rings || 1,
          likes: planet.likes || 0,
          views: planet.views || 0,
        }));

        setPlanets(formattedPlanets);
      } catch (error) {
        console.error('Error loading planets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlanets();
  }, []);

  // Only show 3D on desktop and after a delay to improve initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      const isDesktop = window.innerWidth >= 768;
      if (isDesktop && !isLoading) {
        setShow3D(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div className="min-h-screen pt-16 sm:pt-20 lg:pt-44 overflow-hidden">
      <FloatingElements />
      <AnimatedBackground />
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* 3D Canvas - Only on desktop and lazy loaded */}
        {show3D && (
          <div className="hidden md:block absolute inset-0">
            <Suspense fallback={null}>
              <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.2} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  
                  {planets.map((planet) => (
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
            </Suspense>
          </div>
        )}

        {/* Overlay Content */}
        <div className="relative z-10 w-full px-4">
          <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.8, rotateX: -30 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ 
                delay: 0.5, 
                duration: 1.2,
                type: "spring",
                stiffness: 100
              }}
              className="max-w-4xl mx-auto"
            >
              {/* Logo Integration */}
              <motion.div
                className="mb-6 sm:mb-8"
                initial={{ scale: 0, rotateZ: -180 }}
                animate={{ scale: 1, rotateZ: 0 }}
                transition={{ delay: 0.3, duration: 1, type: "spring" }}
              >
                <motion.img
                  src="/white_circle_360x360.png"
                  alt="DevVerse³ Logo"
                  className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-4 opacity-90"
                  animate={{ 
                    rotateZ: [0, 360],
                    scale: [1, 1.05, 1],
                    filter: [
                      'drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))',
                      'drop-shadow(0 0 40px rgba(255, 0, 255, 0.8))',
                      'drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))'
                    ]
                  }}
                  transition={{ 
                    rotateZ: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    filter: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              </motion.div>

              <motion.h1 
                className="font-orbitron text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-4 sm:mb-6"
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
                className="font-sora text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20, rotateX: -20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                Build. Orbit. Share. Your coding universe awaits.
              </motion.p>
              
              <motion.button
                onClick={() => onNavigate('builder')}
                className="interactive px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-orbitron font-bold text-sm sm:text-base lg:text-lg transition-all duration-500 text-white min-h-[44px] min-w-[200px]"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
                  className="text-2xl sm:text-3xl lg:text-4xl font-orbitron font-bold text-cyber-blue mb-2"
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
                  {planets.length}
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
                  className="text-2xl sm:text-3xl lg:text-4xl font-orbitron font-bold text-cyber-pink mb-2"
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
                  {planets.reduce((total, planet) => total + planet.stack.languages.length + planet.stack.frameworks.length, 0)}
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
                  className="text-2xl sm:text-3xl lg:text-4xl font-orbitron font-bold text-cyber-yellow mb-2"
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