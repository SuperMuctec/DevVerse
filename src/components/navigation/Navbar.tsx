import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, User, Settings, FileText, Trophy, Zap, Star, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const { user, logout } = useAuth();

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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-30 p-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel">
          <div className="flex items-center justify-between px-4 py-2">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => onPageChange('galaxy')}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-cyber-blue to-cyber-pink rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="font-orbitron text-lg font-bold neon-text text-cyber-blue">
                DevVerse³
              </span>
            </motion.div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-2">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`interactive px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                    currentPage === item.id
                      ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden md:inline font-sora text-xs">
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Menu - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="glass-panel">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="flex items-center space-x-3 text-white/70">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-cyber-blue/50"
              />
              <div className="flex flex-col">
                <span className="font-sora text-sm font-medium text-white">
                  {user?.username}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-cyber-blue font-semibold">
                    Level {level}
                  </span>
                  <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyber-blue to-cyber-pink transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/60">
                    {currentLevelXp}/{requiredXp}
                  </span>
                </div>
              </div>
            </div>
            
            <motion.button
              onClick={logout}
              className="interactive p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};