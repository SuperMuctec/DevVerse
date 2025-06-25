import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Code,
  Loader,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { User as UserType, Project } from '../../types';

interface UserProfileProps {
  userId: string;
  onBack: () => void;
}

interface GitHubLanguages {
  [key: string]: number;
}

interface ProjectWithLanguages extends Project {
  languages?: GitHubLanguages;
  languagesLoading?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, onBack }) => {
  const [projectsWithLanguages, setProjectsWithLanguages] = useState<ProjectWithLanguages[]>([]);
  const [expandedLanguages, setExpandedLanguages] = useState<{[key: string]: boolean}>({});
  const [animationKey, setAnimationKey] = useState(0);

  // Get user data from localStorage
  const getUserData = (): UserType | null => {
    const users = JSON.parse(localStorage.getItem('devverse_users') || '[]');
    return users.find((user: any) => user.id === userId) || null;
  };

  const user = getUserData();

  // Fetch GitHub languages for a repository
  const fetchGitHubLanguages = async (githubUrl: string): Promise<GitHubLanguages | null> => {
    try {
      // Extract owner and repo from GitHub URL
      const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) return null;

      const [, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, ''); // Remove .git suffix if present

      const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/languages`);
      
      if (!response.ok) {
        console.warn(`Failed to fetch languages for ${owner}/${cleanRepo}:`, response.status);
        return null;
      }

      const languages = await response.json();
      return languages;
    } catch (error) {
      console.error('Error fetching GitHub languages:', error);
      return null;
    }
  };

  // Load projects with language data
  useEffect(() => {
    if (user?.projects) {
      const loadProjectLanguages = async () => {
        const projectsWithLangs = await Promise.all(
          user.projects.map(async (project) => {
            const projectWithLang: ProjectWithLanguages = { 
              ...project, 
              languagesLoading: true 
            };
            
            try {
              const languages = await fetchGitHubLanguages(project.githubUrl);
              projectWithLang.languages = languages || undefined;
            } catch (error) {
              console.error(`Error loading languages for ${project.name}:`, error);
            } finally {
              projectWithLang.languagesLoading = false;
            }
            
            return projectWithLang;
          })
        );
        
        setProjectsWithLanguages(projectsWithLangs);
        // Force re-animation when data loads
        setAnimationKey(prev => prev + 1);
      };

      loadProjectLanguages();
    } else {
      setProjectsWithLanguages([]);
    }
  }, [user?.projects]);

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
      HTML: '#e34c26',
      CSS: '#1572b6',
      Rust: '#dea584',
      PHP: '#777bb4',
      Ruby: '#cc342d',
      Swift: '#fa7343',
      Kotlin: '#7f52ff',
      Dart: '#0175c2',
      Shell: '#89e051',
      C: '#555555',
      'C#': '#239120',
      Jupyter: '#da5b0b',
      Vue: '#4fc08d',
      Svelte: '#ff3e00',
    };
    return colors[language] || '#ffffff';
  };

  // Toggle expanded languages for a project
  const toggleExpandedLanguages = (projectId: string, event: React.MouseEvent) => {
    // Prevent the click from bubbling up to the project card
    event.stopPropagation();
    
    setExpandedLanguages(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // Animated Pie Chart Component with improved animation
  const AnimatedPieChart: React.FC<{ 
    segments: Array<{
      language: string;
      percentage: number;
      color: string;
    }>;
    size?: number;
    projectId: string;
  }> = ({ segments, size = 48, projectId }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    
    let cumulativePercentage = 0;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
          />
          
          {/* Animated segments */}
          {segments.map((segment, index) => {
            const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
            
            cumulativePercentage += segment.percentage;

            return (
              <motion.circle
                key={`${projectId}-${segment.language}-${animationKey}`}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="4"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                initial={{ 
                  strokeDasharray: `0 ${circumference}`,
                  opacity: 0,
                  scale: 0.8
                }}
                animate={{ 
                  strokeDasharray: strokeDasharray,
                  opacity: 1,
                  scale: 1
                }}
                transition={{ 
                  duration: 2,
                  delay: index * 0.4,
                  ease: "easeInOut",
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  strokeWidth: 6,
                  filter: `drop-shadow(0 0 8px ${segment.color})`
                }}
              />
            );
          })}
        </svg>
        
        {/* Center indicator */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.div
            className="w-2 h-2 bg-white/60 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    );
  };

  // Create pie chart for languages
  const createLanguageChart = (languages: GitHubLanguages, projectId: string) => {
    const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    if (total === 0) return null;

    const sortedLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a);

    const segments = sortedLanguages.map(([lang, bytes]) => {
      const percentage = (bytes / total) * 100;
      return {
        language: lang,
        percentage: percentage,
        color: getLanguageColor(lang)
      };
    });

    const isExpanded = expandedLanguages[projectId];
    const displayedLanguages = isExpanded ? segments : segments.slice(0, 3);
    const hasMore = segments.length > 3;

    return (
      <motion.div 
        className="flex items-start space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        // Prevent clicks in this area from bubbling up to the project card
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Pie Chart */}
        <AnimatedPieChart segments={segments} projectId={projectId} />

        {/* Language Legend */}
        <div className="flex-1">
          <div className="space-y-1">
            {displayedLanguages.map((segment, index) => (
              <motion.div 
                key={`${projectId}-${segment.language}`}
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.8 + index * 0.1
                }}
                whileHover={{ 
                  scale: 1.05,
                  x: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)'
                }}
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: segment.color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: 1 + index * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{
                      scale: 1.3,
                      boxShadow: `0 0 10px ${segment.color}`
                    }}
                  />
                  <span className="text-sm text-white/80 font-medium">
                    {segment.language}
                  </span>
                </div>
                <motion.span 
                  className="text-sm text-white/60 font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  {segment.percentage.toFixed(1)}%
                </motion.span>
              </motion.div>
            ))}
          </div>
          
          {hasMore && (
            <motion.button
              onClick={(e) => toggleExpandedLanguages(projectId, e)}
              className="flex items-center space-x-1 mt-2 text-xs text-cyber-blue hover:text-cyber-pink transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              whileHover={{ 
                scale: 1.05,
                x: 3
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotateZ: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </motion.div>
              <span>
                {isExpanded ? 'Show less' : `+${segments.length - 3} more`}
              </span>
            </motion.button>
          )}
        </div>
      </motion.div>
    );
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
                  Projects ({projectsWithLanguages.length})
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
                {projectsWithLanguages.length > 0 ? (
                  projectsWithLanguages.map((project, index) => (
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

                      <div className="flex items-center justify-between mb-4">
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

                      {/* GitHub Language Chart */}
                      <motion.div 
                        className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      >
                        {project.languagesLoading ? (
                          <div className="flex items-center space-x-2 text-white/50">
                            <Loader className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Loading language data...</span>
                          </div>
                        ) : project.languages ? (
                          <div>
                            <motion.h4 
                              className="text-sm font-semibold text-white/80 mb-3 flex items-center space-x-2"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                            >
                              <Code className="w-4 h-4" />
                              <span>Language Distribution</span>
                            </motion.h4>
                            {createLanguageChart(project.languages, project.id)}
                          </div>
                        ) : (
                          <div className="text-sm text-white/50 flex items-center space-x-2">
                            <Code className="w-4 h-4" />
                            <span>Language data unavailable</span>
                          </div>
                        )}
                      </motion.div>

                      <div className="flex flex-wrap gap-2">
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