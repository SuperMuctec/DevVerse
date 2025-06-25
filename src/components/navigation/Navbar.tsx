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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-30 p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-4 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => onPageChange('galaxy')}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-cyber-blue to-cyber-pink rounded-lg flex items-center justify-center">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <span className="font-orbitron text-2xl font-bold neon-text text-cyber-blue">
                DevVerse³
              </span>
            </motion.div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`interactive px-6 py-4 rounded-lg flex items-center space-x-3 transition-all duration-300 ${
                    currentPage === item.id
                      ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="hidden md:inline font-sora text-sm">
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Menu - Bottom Right */}
      <div className="fixed bottom-8 right-8 z-40">
        <div className="glass-panel">
          <div className="flex items-center space-x-4 px-4 py-3">
            <div className="flex items-center space-x-3 text-white/70">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                alt="Avatar"
                className="w-12 h-12 rounded-full border border-cyber-blue/50"
              />
              <span className="font-sora text-sm font-medium">
                {user?.username}
              </span>
            </div>
            
            <motion.button
              onClick={logout}
              className="interactive p-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};