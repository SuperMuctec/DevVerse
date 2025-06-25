import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Calendar, 
  Star, 
  GitFork, 
  ExternalLink,
  ArrowLeft,
  Zap,
  Sparkles
} from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { User as UserType } from '../../types';

interface UserProfileProps {
  userId: string;
  onBack: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, onBack }) => {
  // Get user data from localStorage
  const getUserData = (): UserType | null => {
    const users = JSON.parse(localStorage.getItem('devverse_users') || '[]');
    return users.find((user: any) => user.id === userId) || null;
  };

  const user = getUserData();

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

  if (!user) {
    return (
      <div className="min-h-screen pt-20 sm:pt-44 px-4">
        <div className="max-w-4xl mx-auto py-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="font-orbitron text-xl sm:text-2xl font-bold text-white mb-4"
              animate={{
                textShadow: [
                  '0 0 10px #ff0000',
                  '0 0 20px #ff0000, 0 0 30px #ff0000',
                  '0 0 10px #ff0000'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              User Not Found
            </motion.h1>
            <motion.button
              onClick={onBack}
              className="text-cyber-blue hover:text-cyber-pink transition-colors"
              whileHover={{ 
                scale: 1.05,
                rotateY: 10
              }}
            >
              ← Back
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  const userXp = user.xp || 0;
  const { level, currentLevelXp, requiredXp } = calculateLevel(userXp);
  const progressPercentage = (currentLevelXp / requiredXp) * 100;

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      TypeScript: '#3178c6',
      JavaScript: '#f7df1e',
      Python: '#3776ab',
      Java: '#ed8b00',
      'C++': '#00599c',
      Go: '#00add8',
    };
    return colors[language] || '#ffffff';
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-44 px-4">
      <div className="max-w-6xl mx-auto py-8">
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 text-cyber-blue hover:text-cyber-pink transition-colors"
          whileHover={{ 
            scale: 1.05, 
            x: -5,
            rotateY: 10
          }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* User Profile */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <GlassPanel glowColor="#00ffff">
              <motion.div 
                className="text-center mb-6"
                whileHover={{ scale: 1.02, rotateY: 5 }}
              >
                <motion.img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  alt={user.username}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 border-2 border-cyber-blue"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 360,
                    borderColor: '#ff00ff'
                  }}
                  transition={{ duration: 0.6 }}
                />
                <motion.h2 
                  className="font-orbitron text-xl sm:text-2xl font-bold text-white mb-1"
                  animate={{
                    textShadow: [
                      '0 0 10px #00ffff',
                      '0 0 20px #00ffff, 0 0 30px #00ffff',
                      '0 0 10px #00ffff'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {user.username}
                </motion.h2>
                <p className="text-white/70 text-sm mb-4">{user.email}</p>
                
                {/* XP and Level Display */}
                <motion.div 
                  className="p-3 bg-gradient-to-r from-cyber-blue/20 to-cyber-pink/20 rounded-lg border border-cyber-blue/30"
                  whileHover={{ scale: 1.02, rotateX: 5 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      <motion.div
                        animate={{ 
                          rotateZ: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          rotateZ: { duration: 4, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                        <Zap className="w-4 h-4 text-cyber-blue" />
                      </motion.div>
                      <span className="text-cyber-blue font-semibold text-sm">Level {level}</span>
                    </div>
                    <span className="text-white/70 text-xs">{userXp} XP</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-cyber-blue to-cyber-pink"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/60 mt-1">
                    <span>{currentLevelXp}</span>
                    <span>{requiredXp}</span>
                  </div>
                </motion.div>
              </motion.div>

              {user.bio && (
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <h3 className="font-semibold text-white mb-2">Bio</h3>
                  <motion.p 
                    className="text-white/80 text-sm leading-relaxed"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {user.bio}
                  </motion.p>
                </motion.div>
              )}

              <motion.div 
                className="space-y-3 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {user.location && (
                  <motion.div 
                    className="flex items-center space-x-2 text-white/70"
                    whileHover={{ scale: 1.05, color: '#00ff00' }}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </motion.div>
                )}
                {user.website && (
                  <motion.div 
                    className="flex items-center space-x-2 text-white/70"
                    whileHover={{ scale: 1.05, color: '#00ffff' }}
                  >
                    <Globe className="w-4 h-4" />
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyber-blue transition-colors"
                    >
                      {user.website}
                    </a>
                  </motion.div>
                )}
                <motion.div 
                  className="flex items-center space-x-2 text-white/70"
                  whileHover={{ scale: 1.05, color: '#ff00ff' }}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                </motion.div>
              </motion.div>
            </GlassPanel>
          </motion.div>

          {/* User Projects */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 50, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
          >
            <GlassPanel glowColor="#ff00ff">
              <div className="flex items-center justify-between mb-6">
                <motion.h2 
                  className="font-orbitron text-xl sm:text-2xl font-bold text-white"
                  animate={{
                    textShadow: [
                      '0 0 10px #ff00ff',
                      '0 0 20px #ff00ff, 0 0 30px #ff00ff',
                      '0 0 10px #ff00ff'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  Projects ({user.projects?.length || 0})
                </motion.h2>
                <motion.div
                  animate={{ 
                    rotateZ: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotateZ: { duration: 6, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Sparkles className="w-5 h-5 text-cyber-pink" />
                </motion.div>
              </div>

              <div className="space-y-4">
                {user.projects && user.projects.length > 0 ? (
                  user.projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30, rotateX: -15 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.6,
                        type: "spring"
                      }}
                      className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6 hover:bg-white/10 transition-colors group cursor-pointer"
                      onClick={() => window.open(project.githubUrl, '_blank')}
                      whileHover={{ 
                        scale: 1.02,
                        rotateY: 5,
                        rotateX: 3
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <motion.h3 
                              className="font-orbitron text-base sm:text-lg font-bold text-white group-hover:text-cyber-blue transition-colors"
                              whileHover={{ scale: 1.02 }}
                            >
                              {project.name}
                            </motion.h3>
                            <motion.div
                              className="p-1 text-white/50 hover:text-cyber-blue transition-colors"
                              whileHover={{ 
                                scale: 1.2, 
                                rotate: 15,
                                color: '#00ffff'
                              }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </motion.div>
                            {project.isPrivate && (
                              <motion.span 
                                className="px-2 py-1 bg-white/20 text-white/70 text-xs rounded-full"
                                animate={{ 
                                  boxShadow: [
                                    '0 0 5px rgba(255, 255, 255, 0.3)',
                                    '0 0 15px rgba(255, 255, 255, 0.5)',
                                    '0 0 5px rgba(255, 255, 255, 0.3)'
                                  ]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              >
                                Private
                              </motion.span>
                            )}
                          </div>
                          <motion.p 
                            className="text-white/70 text-sm mb-3"
                            initial={{ opacity: 0.7 }}
                            whileHover={{ opacity: 1 }}
                          >
                            {project.description}
                          </motion.p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <motion.div 
                            className="flex items-center space-x-1"
                            whileHover={{ scale: 1.1, color: getLanguageColor(project.language) }}
                          >
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getLanguageColor(project.language) }}
                            />
                            <span>{project.language}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center space-x-1"
                            whileHover={{ scale: 1.1, color: '#ffff00' }}
                          >
                            <Star className="w-4 h-4" />
                            <span>{project.stars}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center space-x-1"
                            whileHover={{ scale: 1.1, color: '#00ff00' }}
                          >
                            <GitFork className="w-4 h-4" />
                            <span>{project.forks}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center space-x-1"
                            whileHover={{ scale: 1.1, color: '#ff00ff' }}
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.topics.map((topic, topicIndex) => (
                          <motion.span
                            key={topic}
                            className="px-2 py-1 bg-cyber-blue/20 text-cyber-blue text-xs rounded-full"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                              delay: 0.2 + topicIndex * 0.05,
                              duration: 0.3
                            }}
                            whileHover={{ 
                              scale: 1.1,
                              boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                            }}
                          >
                            {topic}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div
                      animate={{ 
                        rotateY: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-white/30 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-white/70">No projects found for this user.</p>
                  </motion.div>
                )}
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </div>
  );
};