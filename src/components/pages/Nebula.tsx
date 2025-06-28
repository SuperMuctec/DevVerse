import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Award, Crown, Zap, FileText, User, Code, Edit, ArrowLeft, Sparkles, Target } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface AchievementDetailProps {
  achievement: any;
  onBack: () => void;
  isUnlocked: boolean;
  unlockedDate?: string;
}

const AchievementDetail: React.FC<AchievementDetailProps> = ({ achievement, onBack, isUnlocked, unlockedDate }) => {
  const getHowToObtain = (id: string) => {
    switch (id) {
      case 'beginning':
        return "Create an account on DevVerse³ and successfully log in for the first time. This achievement marks the start of your coding journey in our galaxy!";
      case 'warrior':
        return "Complete your first coding challenge in the Arena. Navigate to the Arena page, create or select a challenge, and successfully solve it within the time limit.";
      case 'god':
        return "Create your first development planet in the Builder page. Choose your tech stack, name your planet, and deploy it to the galaxy for others to discover.";
      case 'journalist':
        return "Write and publish your first DevLog entry. Share your development journey, insights, or project updates with the community.";
      case 'biography':
        return "Add a personal bio to your profile page. Go to Control Deck > Profile Settings and write something about yourself in the bio section.";
      case 'creator':
        return "Create your first project from your user profile page. Add a project with GitHub repository link and project details to showcase your work.";
      default:
        return "Complete the required action to unlock this achievement.";
    }
  };

  const getAchievementStory = (id: string) => {
    switch (id) {
      case 'beginning':
        return "Every great journey starts with a single step. By joining DevVerse³, you've taken your first step into a larger universe of coding possibilities. Welcome to the galaxy, developer!";
      case 'warrior':
        return "You've proven yourself in the coding arena! Like a true warrior, you faced the challenge head-on and emerged victorious. Your problem-solving skills are now recognized across the galaxy.";
      case 'god':
        return "You have created your own world! Like a digital deity, you've crafted a unique planet that represents your coding identity. Your creation now orbits in the DevVerse³ galaxy for all to see.";
      case 'journalist':
        return "Your voice has been heard across the galaxy! By sharing your development journey, you've become a chronicler of code, inspiring others with your experiences and insights.";
      case 'biography':
        return "You've opened a window into your soul! By writing your biography, you've allowed the galaxy to know the person behind the code. Your story is now part of the DevVerse³ narrative.";
      case 'creator':
        return "You've showcased your craft to the universe! By adding your first project, you've demonstrated your ability to build and create. Your work now stands as a testament to your skills.";
      default:
        return "This achievement represents a milestone in your DevVerse³ journey.";
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto py-8">
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
          <span>Back to Nebula</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="space-y-8"
        >
          <GlassPanel glowColor={isUnlocked ? achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff' : '#666666'}>
            <motion.div 
              className="text-center mb-8"
              whileHover={{ scale: 1.02, rotateY: 5 }}
            >
              <div className="relative inline-block mb-6">
                <motion.img
                  src={achievement.image}
                  alt={achievement.name}
                  className={`w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border-4 ${
                    !isUnlocked ? 'grayscale' : ''
                  }`}
                  style={{
                    borderColor: isUnlocked ? achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff' : '#666666'
                  }}
                  animate={isUnlocked ? {
                    rotateZ: [0, 360],
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      `0 0 20px ${achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff'}40`,
                      `0 0 40px ${achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff'}60`,
                      `0 0 20px ${achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff'}40`
                    ]
                  } : {}}
                  transition={{ 
                    rotateZ: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
                {!isUnlocked && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"
                    animate={{ 
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="text-white/70 text-2xl sm:text-4xl">🔒</div>
                  </motion.div>
                )}
              </div>
              
              <motion.h1 
                className="font-orbitron text-2xl sm:text-4xl font-bold text-white mb-2"
                animate={isUnlocked ? {
                  textShadow: [
                    `0 0 10px ${achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff'}`,
                    `0 0 20px ${achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff'}, 0 0 30px ${achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff'}`,
                    `0 0 10px ${achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff'}`
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {achievement.name}
              </motion.h1>
              
              <div className="flex items-center justify-center space-x-4 mb-4">
                <motion.span 
                  className="px-4 py-2 rounded-full text-sm font-semibold uppercase"
                  style={{ 
                    backgroundColor: `${achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff'}20`,
                    color: achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff'
                  }}
                  animate={{ 
                    boxShadow: [
                      `0 0 10px ${achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff'}40`,
                      `0 0 20px ${achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff'}60`,
                      `0 0 10px ${achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff'}40`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {achievement.rarity}
                </motion.span>
                
                {isUnlocked && unlockedDate && (
                  <motion.div 
                    className="flex items-center space-x-2 text-sm text-white/70"
                    whileHover={{ scale: 1.05, color: '#ffffff' }}
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Unlocked on {unlockedDate}</span>
                  </motion.div>
                )}
              </div>
              
              <p className="text-white/80 text-base sm:text-lg">
                {achievement.description}
              </p>
            </motion.div>
          </GlassPanel>

          <motion.div
            initial={{ opacity: 0, x: -30, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <GlassPanel glowColor="#ffff00">
              <motion.h2 
                className="font-orbitron text-xl sm:text-2xl font-bold text-cyber-yellow mb-4"
                animate={{
                  textShadow: [
                    '0 0 10px #ffff00',
                    '0 0 20px #ffff00, 0 0 30px #ffff00',
                    '0 0 10px #ffff00'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Achievement Story
              </motion.h2>
              <motion.p 
                className="text-white/80 leading-relaxed text-base sm:text-lg"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                {getAchievementStory(achievement.id)}
              </motion.p>
            </GlassPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <GlassPanel glowColor="#00ff00">
              <motion.h2 
                className="font-orbitron text-xl sm:text-2xl font-bold text-cyber-green mb-4"
                animate={{
                  textShadow: [
                    '0 0 10px #00ff00',
                    '0 0 20px #00ff00, 0 0 30px #00ff00',
                    '0 0 10px #00ff00'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                How to Obtain
              </motion.h2>
              <motion.p 
                className="text-white/80 leading-relaxed"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                {getHowToObtain(achievement.id)}
              </motion.p>
              
              {!isUnlocked && (
                <motion.div 
                  className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  whileHover={{ scale: 1.02, rotateX: 5 }}
                >
                  <div className="flex items-center space-x-2 text-yellow-400">
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
                      <Star className="w-5 h-5" />
                    </motion.div>
                    <span className="font-semibold">Achievement Locked</span>
                  </div>
                  <p className="text-yellow-300/80 text-sm mt-1">
                    Complete the action above to unlock this achievement and add it to your collection!
                  </p>
                </motion.div>
              )}
            </GlassPanel>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export const Nebula: React.FC = () => {
  const { user, loadUserAchievements } = useAuth();
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load achievements from database
  useEffect(() => {
    const loadAchievements = async () => {
      if (user) {
        setIsLoading(true);
        try {
          // Load user achievements if not already loaded
          if (!user.achievements) {
            await loadUserAchievements();
          }
          
          // Get achievements from database
          const { data, error } = await supabase
            .from('achievements')
            .select('*')
            .eq('user_id', user.id);
            
          if (error) {
            console.error('Error loading achievements:', error);
            return;
          }
          
          setAchievements(data || []);
        } catch (error) {
          console.error('Error loading achievements:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadAchievements();
  }, [user, loadUserAchievements]);

  const allAchievements = [
    {
      id: 'beginning',
      name: 'The Beginning',
      description: 'User makes an account and Logs in',
      icon: User,
      rarity: 'common',
      image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'warrior',
      name: 'A Warrior',
      description: 'User completes their first code arena',
      icon: Zap,
      rarity: 'rare',
      image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400'
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
    return achievements.some((a: any) => a.achievement_id === achievementId);
  };

  const getUnlockedDate = (achievementId: string) => {
    const achievement = achievements.find((a: any) => a.achievement_id === achievementId);
    return achievement ? new Date(achievement.unlocked_at).toLocaleDateString() : null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70">Loading achievements...</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedAchievement) {
    return (
      <AchievementDetail
        achievement={selectedAchievement}
        onBack={() => setSelectedAchievement(null)}
        isUnlocked={isUnlocked(selectedAchievement.id)}
        unlockedDate={getUnlockedDate(selectedAchievement.id)}
      />
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.h1 
            className="font-orbitron text-3xl sm:text-5xl font-bold mb-4"
            animate={{
              textShadow: [
                '0 0 20px #00ffff',
                '0 0 30px #ff00ff, 0 0 40px #ff00ff',
                '0 0 20px #00ffff'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.span 
              className="neon-text text-cyber-blue inline-block"
              animate={{ 
                rotateY: [0, 10, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              The
            </motion.span>{' '}
            <motion.span 
              className="neon-text text-cyber-pink inline-block"
              animate={{ 
                rotateY: [0, -10, 10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              Nebula
            </motion.span>
          </motion.h1>
          <motion.p 
            className="font-sora text-lg sm:text-xl text-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Achievement Constellation
          </motion.p>
        </motion.div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {[
            { icon: Trophy, value: achievements.length, label: 'Achievements Unlocked', color: '#00ffff' },
            { icon: Star, value: Math.round((achievements.length / allAchievements.length) * 100), label: 'Completion Rate', color: '#ff00ff', suffix: '%' },
            { icon: Award, value: allAchievements.length - achievements.length, label: 'Remaining', color: '#ffff00' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, rotateX: -20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <GlassPanel glowColor={stat.color}>
                <motion.div 
                  className="text-center"
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: 5
                  }}
                >
                  <motion.div
                    animate={{ 
                      rotateZ: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotateZ: { duration: 8, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" style={{ color: stat.color }} />
                  </motion.div>
                  <motion.div 
                    className="text-xl sm:text-2xl font-orbitron font-bold"
                    style={{ color: stat.color }}
                    animate={{
                      textShadow: [
                        `0 0 10px ${stat.color}`,
                        `0 0 20px ${stat.color}, 0 0 30px ${stat.color}`,
                        `0 0 10px ${stat.color}`
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {stat.value}{stat.suffix || ''}
                  </motion.div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </motion.div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {allAchievements.map((achievement, index) => {
            const unlocked = isUnlocked(achievement.id);
            const unlockedDate = getUnlockedDate(achievement.id);
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 30, rotateX: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.6,
                  type: "spring"
                }}
                onClick={() => setSelectedAchievement(achievement)}
                className="cursor-pointer"
              >
                <GlassPanel 
                  glowColor={unlocked ? getRarityColor(achievement.rarity) : '#333333'}
                  className={`hover:scale-105 transition-transform duration-300 ${
                    !unlocked ? 'opacity-50' : ''
                  }`}
                >
                  <motion.div 
                    className="relative"
                    whileHover={{ 
                      rotateY: 10,
                      rotateX: 5
                    }}
                  >
                    {/* Achievement Image */}
                    <div className="relative mb-4">
                      <motion.img
                        src={achievement.image}
                        alt={achievement.name}
                        className={`w-full h-24 sm:h-32 object-cover rounded-lg ${
                          !unlocked ? 'grayscale' : ''
                        }`}
                        animate={unlocked ? {
                          scale: [1, 1.05, 1]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div 
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: unlocked 
                            ? `linear-gradient(45deg, ${getRarityGlow(achievement.rarity)}, transparent)`
                            : 'linear-gradient(45deg, rgba(0,0,0,0.5), transparent)'
                        }}
                        animate={unlocked ? {
                          opacity: [0.3, 0.6, 0.3]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      
                      {/* Achievement Icon */}
                      <div className="absolute top-2 right-2">
                        <motion.div 
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: unlocked ? getRarityColor(achievement.rarity) : '#666666',
                            boxShadow: unlocked ? `0 0 15px ${getRarityGlow(achievement.rarity)}` : 'none'
                          }}
                          animate={unlocked ? {
                            rotateZ: [0, 360],
                            scale: [1, 1.2, 1]
                          } : {}}
                          transition={{ 
                            rotateZ: { duration: 4, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                          }}
                        >
                          <achievement.icon className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                        </motion.div>
                      </div>

                      {/* Locked Overlay */}
                      {!unlocked && (
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg"
                          animate={{ 
                            opacity: [0.5, 0.8, 0.5]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <div className="text-white/70 text-2xl sm:text-4xl">🔒</div>
                        </motion.div>
                      )}
                    </div>

                    {/* Achievement Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <motion.h3 
                          className="font-orbitron text-base sm:text-lg font-bold text-white"
                          whileHover={{ scale: 1.02 }}
                        >
                          {achievement.name}
                        </motion.h3>
                        <motion.span 
                          className="px-2 py-1 rounded-full text-xs font-semibold uppercase"
                          style={{ 
                            backgroundColor: `${getRarityColor(achievement.rarity)}20`,
                            color: getRarityColor(achievement.rarity)
                          }}
                          animate={{ 
                            boxShadow: [
                              `0 0 5px ${getRarityColor(achievement.rarity)}40`,
                              `0 0 15px ${getRarityColor(achievement.rarity)}60`,
                              `0 0 5px ${getRarityColor(achievement.rarity)}40`
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {achievement.rarity}
                        </motion.span>
                      </div>
                      
                      <p className="text-white/70 text-sm">
                        {achievement.description}
                      </p>

                      {unlocked && unlockedDate && (
                        <motion.div 
                          className="flex items-center space-x-2 text-xs text-white/50"
                          whileHover={{ scale: 1.05, color: '#ffffff' }}
                        >
                          <Trophy className="w-3 h-3" />
                          <span>Unlocked on {unlockedDate}</span>
                        </motion.div>
                      )}

                      {!unlocked && (
                        <div className="text-xs text-white/50">
                          🔒 Click to learn how to unlock
                        </div>
                      )}
                    </div>
                  </motion.div>
                </GlassPanel>
              </motion.div>
            );
          })}
        </div>

        {achievements.length === 0 && (
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
              <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-white/30 mx-auto mb-4" />
            </motion.div>
            <p className="text-white/70 mb-4">No achievements unlocked yet.</p>
            <p className="text-white/50 text-sm">
              Start your journey by creating your first planet or completing a challenge!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};