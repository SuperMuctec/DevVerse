import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Award, Crown, Zap, FileText, User, Code, Edit, ArrowLeft } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { useAuth } from '../../contexts/AuthContext';

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
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Nebula</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <GlassPanel glowColor={isUnlocked ? achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff' : '#666666'}>
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <img
                  src={achievement.image}
                  alt={achievement.name}
                  className={`w-32 h-32 object-cover rounded-full border-4 ${
                    !isUnlocked ? 'grayscale' : ''
                  }`}
                  style={{
                    borderColor: isUnlocked ? achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff' : '#666666'
                  }}
                />
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <div className="text-white/70 text-4xl">🔒</div>
                  </div>
                )}
              </div>
              
              <h1 className="font-orbitron text-4xl font-bold text-white mb-2">
                {achievement.name}
              </h1>
              
              <div className="flex items-center justify-center space-x-4 mb-4">
                <span 
                  className="px-4 py-2 rounded-full text-sm font-semibold uppercase"
                  style={{ 
                    backgroundColor: `${achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff'}20`,
                    color: achievement.rarity === 'epic' ? '#ff00ff' : '#00ffff'
                  }}
                >
                  {achievement.rarity}
                </span>
                
                {isUnlocked && unlockedDate && (
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <Trophy className="w-4 h-4" />
                    <span>Unlocked on {unlockedDate}</span>
                  </div>
                )}
              </div>
              
              <p className="text-white/80 text-lg">
                {achievement.description}
              </p>
            </div>
          </GlassPanel>

          <GlassPanel glowColor="#ffff00">
            <h2 className="font-orbitron text-2xl font-bold text-cyber-yellow mb-4">
              Achievement Story
            </h2>
            <p className="text-white/80 leading-relaxed text-lg">
              {getAchievementStory(achievement.id)}
            </p>
          </GlassPanel>

          <GlassPanel glowColor="#00ff00">
            <h2 className="font-orbitron text-2xl font-bold text-cyber-green mb-4">
              How to Obtain
            </h2>
            <p className="text-white/80 leading-relaxed">
              {getHowToObtain(achievement.id)}
            </p>
            
            {!isUnlocked && (
              <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-400">
                  <Star className="w-5 h-5" />
                  <span className="font-semibold">Achievement Locked</span>
                </div>
                <p className="text-yellow-300/80 text-sm mt-1">
                  Complete the action above to unlock this achievement and add it to your collection!
                </p>
              </div>
            )}
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
};

export const Nebula: React.FC = () => {
  const { user } = useAuth();
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);

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
    return userAchievements.some((a: any) => a.id === achievementId);
  };

  const getUnlockedDate = (achievementId: string) => {
    const achievement = userAchievements.find((a: any) => a.id === achievementId);
    return achievement ? new Date(achievement.unlockedAt).toLocaleDateString() : null;
  };

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
                onClick={() => setSelectedAchievement(achievement)}
                className="cursor-pointer"
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
                          🔒 Click to learn how to unlock
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