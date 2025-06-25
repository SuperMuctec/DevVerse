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
      className="fixed top-0 left-0 right-0 z-30 p-12"
    >
      <div className="max-w-8xl mx-auto">
        <div className="glass-panel">
          <div className="flex items-center justify-between px-8 py-6">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-6 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => onPageChange('galaxy')}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-cyber-blue to-cyber-pink rounded-lg flex items-center justify-center">
                <Rocket className="w-9 h-9 text-white" />
              </div>
              <span className="font-orbitron text-3xl font-bold neon-text text-cyber-blue">
                DevVerse³
              </span>
            </motion.div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-6">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`interactive px-8 py-5 rounded-lg flex items-center space-x-4 transition-all duration-300 ${
                    currentPage === item.id
                      ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="hidden md:inline font-sora text-base font-medium">
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
          <div className="flex items-center space-x-4 px-6 py-4">
            <div className="flex items-center space-x-4 text-white/70">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                alt="Avatar"
                className="w-14 h-14 rounded-full border-2 border-cyber-blue/50"
              />
              <span className="font-sora text-base font-medium">
                {user?.username}
              </span>
            </div>
            
            <motion.button
              onClick={logout}
              className="interactive p-4 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Logout"
            >
              <LogOut className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};