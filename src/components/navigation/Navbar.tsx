import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, User, Settings, FileText, Trophy, Zap, Star, LogOut, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'galaxy', icon: Rocket, label: 'Galaxy' },
    { id: 'builder', icon: Zap, label: 'Builder' },
    { id: 'showroom', icon: Star, label: 'Showroom' },
    { id: 'devlogs', icon: FileText, label: 'DevLogs' },
    { id: 'arena', icon: Trophy, label: 'Arena' },
    { id: 'nebula', icon: Trophy, label: 'Nebula' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'settings', icon: Settings, label: 'Control Deck' },
  ];

  // Calculate user level based on XP
  const calculateLevel = (xp: number) => {
    let level = 1;
    let requiredXp = 20; // 10 * 2^1
    let totalXp = 0;
    
    while (totalXp + requiredXp <= xp) {
      totalXp += requiredXp;
      level++;
      requiredXp = 10 * Math.pow(2, level);
    }
    
    return { level, currentLevelXp: xp - totalXp, requiredXp };
  };

  const userXp = user?.xp || 0;
  const { level, currentLevelXp, requiredXp } = calculateLevel(userXp);
  const progressPercentage = (currentLevelXp / requiredXp) * 100;

  const handleNavClick = (pageId: string) => {
    onPageChange(pageId);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Left Sidebar */}
      <motion.nav
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ 
          duration: 0.8,
          type: "spring",
          stiffness: 100
        }}
        className="hidden lg:flex fixed left-0 top-0 h-full w-16 z-30 flex-col"
      >
        <motion.div 
          className="glass-panel h-full flex flex-col"
          initial={{ scale: 0.8, rotateY: -20 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ margin: '4px', borderRadius: '12px' }}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center p-2 cursor-pointer"
            whileHover={{ 
              scale: 1.1,
              rotateY: 10,
              rotateX: 5
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavClick('galaxy')}
          >
            <motion.div 
              className="w-8 h-8 bg-gradient-to-r from-cyber-blue to-cyber-pink rounded-lg flex items-center justify-center"
              animate={{ 
                rotateZ: [0, 360],
                boxShadow: [
                  '0 0 10px rgba(0, 255, 255, 0.5)',
                  '0 0 20px rgba(255, 0, 255, 0.8)',
                  '0 0 10px rgba(0, 255, 255, 0.5)'
                ]
              }}
              transition={{ 
                rotateZ: { duration: 8, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Rocket className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex-1 flex flex-col space-y-1 px-1 py-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`interactive p-2 rounded-lg flex items-center justify-center transition-all duration-300 group relative ${
                  currentPage === item.id
                    ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                initial={{ opacity: 0, x: -20, rotateX: -30 }}
                animate={{ opacity: 1, x: 0, rotateX: 0 }}
                transition={{ 
                  delay: 0.1 * index,
                  duration: 0.5,
                  type: "spring"
                }}
                whileHover={{ 
                  scale: 1.1,
                  rotateY: 5,
                  rotateX: 5,
                  boxShadow: '0 5px 15px rgba(0, 255, 255, 0.3)'
                }}
                whileTap={{ 
                  scale: 0.95,
                  rotateY: -2,
                  rotateX: -2
                }}
                title={item.label}
              >
                <motion.div
                  animate={currentPage === item.id ? {
                    rotateZ: [0, 360],
                    scale: [1, 1.2, 1]
                  } : {}}
                  transition={{ 
                    duration: 2, 
                    repeat: currentPage === item.id ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                
                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, x: -10, scale: 0.8 }}
                  whileHover={{ opacity: 1, x: 0, scale: 1 }}
                  className="absolute left-full ml-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap pointer-events-none z-50"
                >
                  {item.label}
                </motion.div>
              </motion.button>
            ))}
          </div>

          {/* User Info */}
          <div className="p-2 border-t border-white/10">
            <div className="flex flex-col items-center space-y-2">
              <motion.img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                alt="Avatar"
                className="w-8 h-8 rounded-full border-2 border-cyber-blue/50"
                whileHover={{ 
                  scale: 1.2,
                  rotateZ: 360,
                  borderColor: '#00ffff'
                }}
                transition={{ duration: 0.6 }}
              />
              
              {/* XP Progress */}
              <div className="w-full">
                <div className="flex items-center justify-center mb-1">
                  <motion.span 
                    className="text-xs text-cyber-blue font-semibold"
                    animate={{ 
                      textShadow: [
                        '0 0 5px #00ffff',
                        '0 0 10px #00ffff, 0 0 15px #00ffff',
                        '0 0 5px #00ffff'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {level}
                  </motion.span>
                </div>
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-cyber-blue to-cyber-pink"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Logout Button */}
              <motion.button
                onClick={logout}
                className="interactive p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                whileHover={{ 
                  scale: 1.2,
                  rotateZ: 360,
                  boxShadow: '0 0 15px rgba(255, 0, 0, 0.5)'
                }}
                whileTap={{ scale: 0.9 }}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Top Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.8,
          type: "spring",
          stiffness: 100
        }}
        className="lg:hidden fixed top-0 left-0 right-0 z-30 p-2"
      >
        <motion.div 
          className="glass-panel"
          initial={{ scale: 0.8, rotateX: -20 }}
          animate={{ scale: 1, rotateX: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-between px-3 py-2">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ 
                scale: 1.05,
                rotateY: 10,
                rotateX: 5
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavClick('galaxy')}
            >
              <motion.div 
                className="w-6 h-6 bg-gradient-to-r from-cyber-blue to-cyber-pink rounded-lg flex items-center justify-center"
                animate={{ 
                  rotateZ: [0, 360],
                  boxShadow: [
                    '0 0 10px rgba(0, 255, 255, 0.5)',
                    '0 0 20px rgba(255, 0, 255, 0.8)',
                    '0 0 10px rgba(0, 255, 255, 0.5)'
                  ]
                }}
                transition={{ 
                  rotateZ: { duration: 8, repeat: Infinity, ease: "linear" },
                  boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Rocket className="w-3 h-3 text-white" />
              </motion.div>
              <span className="font-orbitron text-sm font-bold neon-text text-cyber-blue">
                DevVerse³
              </span>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              whileHover={{ 
                scale: 1.1,
                rotateZ: 180
              }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotateZ: -180, opacity: 0 }}
                    animate={{ rotateZ: 0, opacity: 1 }}
                    exit={{ rotateZ: 180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotateZ: 180, opacity: 0 }}
                    animate={{ rotateZ: 0, opacity: 1 }}
                    exit={{ rotateZ: -180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mt-2"
            >
              <div className="glass-panel">
                <div className="grid grid-cols-2 gap-2 p-2 mb-4">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`interactive px-3 py-3 rounded-lg flex flex-col items-center space-y-1 transition-all duration-300 ${
                        currentPage === item.id
                          ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                      initial={{ opacity: 0, y: 20, rotateX: -30 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ 
                        delay: 0.1 * index,
                        duration: 0.4
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        rotateY: 5,
                        boxShadow: '0 5px 15px rgba(0, 255, 255, 0.3)'
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        animate={currentPage === item.id ? {
                          rotateZ: [0, 360],
                          scale: [1, 1.2, 1]
                        } : {}}
                        transition={{ 
                          duration: 2, 
                          repeat: currentPage === item.id ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                      >
                        <item.icon className="w-5 h-5" />
                      </motion.div>
                      <span className="font-sora text-xs text-center">
                        {item.label}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* User Info and Logout in Mobile Menu */}
                <div className="border-t border-white/10 pt-4 pb-2">
                  <div className="flex items-center space-x-3 px-3 py-2 mb-3">
                    <motion.img
                      src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full border-2 border-cyber-blue/50"
                      whileHover={{ 
                        scale: 1.1,
                        rotateZ: 360,
                        borderColor: '#00ffff'
                      }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="flex-1 min-w-0">
                      <motion.span 
                        className="font-sora text-sm font-medium text-white block truncate"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      >
                        {user?.username}
                      </motion.span>
                      <div className="flex items-center space-x-2">
                        <motion.span 
                          className="text-xs text-cyber-blue font-semibold"
                          animate={{ 
                            textShadow: [
                              '0 0 5px #00ffff',
                              '0 0 10px #00ffff, 0 0 15px #00ffff',
                              '0 0 5px #00ffff'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          Level {level}
                        </motion.span>
                        <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-cyber-blue to-cyber-pink"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                          />
                        </div>
                        <span className="text-xs text-white/60">
                          {currentLevelXp}/{requiredXp}
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 0 15px rgba(255, 0, 0, 0.3)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-semibold">Logout</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};