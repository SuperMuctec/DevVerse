import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Crown, Zap, FileText, User, Code, Edit } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { useAuth } from '../../contexts/AuthContext';

export const Nebula: React.FC = () => {
  const { user } = useAuth();

  // Get user achievements
  const getUserAchievements = () => {
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`achievements_${user.id}`) || '[]');
  };

  const userAchievements = getUserAchievements();

  const allAchievements = [
    {
      id: 'beginning',
      name: 'The Beginning',
      description: 'User makes an account and Logs in',
      icon: User,
      rarity: 'common',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'warrior',
      name: 'A Warrior',
      description: 'User completes their first code arena',
      icon: Zap,
      rarity: 'rare',
      image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'god',
      name: 'A God',
      description: 'User Creates their first planet',
      icon: Crown,
      rarity: 'epic',
      image: 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'journalist',
      name: 'Journalist',
      description: 'User writes their first devlog',
      icon: FileText,
      rarity: 'rare',
      image: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'biography',
      name: 'Biography',
      description: 'User writes their Bio in their profile page',
      icon: Edit,
      rarity: 'common',
      image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'creator',
      name: 'Creator',
      description: 'User makes their first project from their user page',
      icon: Code,
      rarity: 'rare',
      image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#ffffff';
      case 'rare': return '#00ffff';
      case 'epic': return '#ff00ff';
      case 'legendary': return '#ffff00';
      default: return '#ffffff';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#ffffff40';
      case 'rare': return '#00ffff60';
      case 'epic': return '#ff00ff60';
      case 'legendary': return '#ffff0060';
      default: return '#ffffff40';
    }
  };

  const isUnlocked = (achievementId: string) => {
    return userAchievements.some((a: any) => a.id === achievementId);
  };

  const getUnlockedDate = (achievementId: string) => {
    const achievement = userAchievements.find((a: any) => a.id === achievementId);
    return achievement ? new Date(achievement.unlockedAt).toLocaleDateString() : null;
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-orbitron text-5xl font-bold mb-4">
            <span className="neon-text text-cyber-blue">The</span>{' '}
            <span className="neon-text text-cyber-pink">Nebula</span>
          </h1>
          <p className="font-sora text-xl text-white/70">
            Achievement Constellation
          </p>
        </motion.div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassPanel glowColor="#00ffff">
            <div className="text-center">
              <Trophy className="w-8 h-8 text-cyber-blue mx-auto mb-2" />
              <div className="text-2xl font-orbitron font-bold text-cyber-blue">
                {userAchievements.length}
              </div>
              <div className="text-white/70 text-sm">Achievements Unlocked</div>
            </div>
          </GlassPanel>
          
          <GlassPanel glowColor="#ff00ff">
            <div className="text-center">
              <Star className="w-8 h-8 text-cyber-pink mx-auto mb-2" />
              <div className="text-2xl font-orbitron font-bold text-cyber-pink">
                {Math.round((userAchievements.length / allAchievements.length) * 100)}%
              </div>
              <div className="text-white/70 text-sm">Completion Rate</div>
            </div>
          </GlassPanel>
          
          <GlassPanel glowColor="#ffff00">
            <div className="text-center">
              <Award className="w-8 h-8 text-cyber-yellow mx-auto mb-2" />
              <div className="text-2xl font-orbitron font-bold text-cyber-yellow">
                {allAchievements.length - userAchievements.length}
              </div>
              <div className="text-white/70 text-sm">Remaining</div>
            </div>
          </GlassPanel>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allAchievements.map((achievement, index) => {
            const unlocked = isUnlocked(achievement.id);
            const unlockedDate = getUnlockedDate(achievement.id);
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassPanel 
                  glowColor={unlocked ? getRarityColor(achievement.rarity) : '#333333'}
                  className={`hover:scale-105 transition-transform duration-300 ${
                    !unlocked ? 'opacity-50' : ''
                  }`}
                >
                  <div className="relative">
                    {/* Achievement Image */}
                    <div className="relative mb-4">
                      <img
                        src={achievement.image}
                        alt={achievement.name}
                        className={`w-full h-32 object-cover rounded-lg ${
                          !unlocked ? 'grayscale' : ''
                        }`}
                      />
                      <div 
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: unlocked 
                            ? `linear-gradient(45deg, ${getRarityGlow(achievement.rarity)}, transparent)`
                            : 'linear-gradient(45deg, rgba(0,0,0,0.5), transparent)'
                        }}
                      />
                      
                      {/* Achievement Icon */}
                      <div className="absolute top-2 right-2">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: unlocked ? getRarityColor(achievement.rarity) : '#666666',
                            boxShadow: unlocked ? `0 0 15px ${getRarityGlow(achievement.rarity)}` : 'none'
                          }}
                        >
                          <achievement.icon className="w-5 h-5 text-black" />
                        </div>
                      </div>

                      {/* Locked Overlay */}
                      {!unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                          <div className="text-white/70 text-4xl">🔒</div>
                        </div>
                      )}
                    </div>

                    {/* Achievement Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-orbitron text-lg font-bold text-white">
                          {achievement.name}
                        </h3>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-semibold uppercase"
                          style={{ 
                            backgroundColor: `${getRarityColor(achievement.rarity)}20`,
                            color: getRarityColor(achievement.rarity)
                          }}
                        >
                          {achievement.rarity}
                        </span>
                      </div>
                      
                      <p className="text-white/70 text-sm">
                        {achievement.description}
                      </p>

                      {unlocked && unlockedDate && (
                        <div className="flex items-center space-x-2 text-xs text-white/50">
                          <Trophy className="w-3 h-3" />
                          <span>Unlocked on {unlockedDate}</span>
                        </div>
                      )}

                      {!unlocked && (
                        <div className="text-xs text-white/50">
                          🔒 Locked - Complete the required action to unlock
                        </div>
                      )}
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            );
          })}
        </div>

        {userAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/70 mb-4">No achievements unlocked yet.</p>
            <p className="text-white/50 text-sm">
              Start your journey by creating your first planet or completing a challenge!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};