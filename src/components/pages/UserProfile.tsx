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
  Code,
  Loader
} from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { LanguageChart } from '../ui/PieChart';
import { dbOps } from '../../lib/database';
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
  const [user, setUser] = useState<UserType | null>(null);
  const [projectsWithLanguages, setProjectsWithLanguages] = useState<ProjectWithLanguages[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get user data from database
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        // First load basic user data
        const userData = await dbOps.getUserById(userId);
        if (!userData) {
          setIsLoading(false);
          return;
        }

        // Create basic user object
        const user: UserType = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          avatar: userData.avatar,
          bio: userData.bio,
          location: userData.location,
          website: userData.website,
          xp: userData.xp || 0,
          level: userData.level || 1,
          joinedAt: new Date(userData.created_at),
        };
        
        setUser(user);

        // Load projects separately
        const projects = await dbOps.getProjectsByUserId(userId);
        const formattedProjects = projects.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          language: p.language,
          githubUrl: p.github_url,
          homepage: p.homepage,
          topics: p.topics || [],
          isPrivate: Boolean(p.is_private),
          stars: p.stars || 0,
          forks: p.forks || 0,
          createdAt: new Date(p.created_at),
          updatedAt: new Date(p.updated_at),
          owner: user.username
        }));

        // Update user with projects
        setUser(prev => prev ? { ...prev, projects: formattedProjects } : null);
        
        // Load GitHub language data for projects
        loadProjectLanguages(formattedProjects);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

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
  const loadProjectLanguages = async (projects: Project[]) => {
    if (projects.length > 0) {
      const projectsWithLangs = await Promise.all(
        projects.map(async (project) => {
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
    } else {
      setProjectsWithLanguages([]);
    }
  };

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

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      TypeScript: '#3178c6',
      JavaScript: '#f7df1e',
      Python: '#3776ab',
      Java: '#ed8b00',
      'C++': '#00599c',
      Go: '#00add8',
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
      HTML: '#e34c26',
      CSS: '#1572b6',
      React: '#61dafb',
    };
    return colors[language] || '#ffffff';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-44 px-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70">Loading user profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-44 px-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center">
            <h1 className="font-orbitron text-2xl font-bold text-white mb-4">User Not Found</h1>
            <motion.button
              onClick={onBack}
              className="text-cyber-blue hover:text-cyber-pink transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              ← Back
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  const userXp = user.xp || 0;
  const { level, currentLevelXp, requiredXp } = calculateLevel(userXp);
  const progressPercentage = (currentLevelXp / requiredXp) * 100;

  return (
    <div className="min-h-screen pt-44 px-4">
      <div className="max-w-6xl mx-auto py-8">
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 text-cyber-blue hover:text-cyber-pink transition-colors"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile */}
          <div className="lg:col-span-1">
            <GlassPanel glowColor="#00ffff">
              <div className="text-center mb-6">
                <motion.img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  alt={user.username}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-cyber-blue"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                />
                <h2 className="font-orbitron text-2xl font-bold text-white mb-1">
                  {user.username}
                </h2>
                <p className="text-white/70 text-sm mb-4">{user.email}</p>
                
                {/* XP and Level Display */}
                <div className="p-3 bg-gradient-to-r from-cyber-blue/20 to-cyber-pink/20 rounded-lg border border-cyber-blue/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4 text-cyber-blue" />
                      <span className="text-cyber-blue font-semibold text-sm">Level {level}</span>
                    </div>
                    <span className="text-white/70 text-xs">{userXp} XP</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyber-blue to-cyber-pink transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/60 mt-1">
                    <span>{currentLevelXp}</span>
                    <span>{requiredXp}</span>
                  </div>
                </div>
              </div>

              {user.bio && (
                <div className="mb-6">
                  <h3 className="font-semibold text-white mb-2">Bio</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{user.bio}</p>
                </div>
              )}

              <div className="space-y-3 text-sm">
                {user.location && (
                  <div className="flex items-center space-x-2 text-white/70">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center space-x-2 text-white/70">
                    <Globe className="w-4 h-4" />
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyber-blue transition-colors"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-white/70">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {user.joinedAt.toLocaleDateString()}</span>
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* User Projects */}
          <div className="lg:col-span-2">
            <GlassPanel glowColor="#00ff00">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-orbitron text-2xl font-bold text-white">
                  Projects ({projectsWithLanguages.length})
                </h2>
              </div>

              <div className="space-y-4">
                {projectsWithLanguages.length > 0 ? (
                  projectsWithLanguages.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <motion.h3 
                              className="font-orbitron text-lg font-bold text-white group-hover:text-cyber-green transition-colors cursor-pointer"
                              whileHover={{ scale: 1.02 }}
                              onClick={() => window.open(project.githubUrl, '_blank')}
                            >
                              {project.name}
                            </motion.h3>
                            <motion.button
                              onClick={() => window.open(project.githubUrl, '_blank')}
                              className="p-1 text-white/50 hover:text-cyber-green transition-colors"
                              whileHover={{ scale: 1.2, rotate: 15 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </motion.button>
                            {project.isPrivate && (
                              <span className="px-2 py-1 bg-white/20 text-white/70 text-xs rounded-full">
                                Private
                              </span>
                            )}
                          </div>
                          <p className="text-white/70 text-sm mb-3">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <div className="flex items-center space-x-1">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getLanguageColor(project.language) }}
                            />
                            <span>{project.language}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>{project.stars}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GitFork className="w-4 h-4" />
                            <span>{project.forks}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Updated {project.updatedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* GitHub Language Chart */}
                      {project.languagesLoading ? (
                        <div className="flex items-center space-x-2 text-white/50 p-4 bg-white/5 rounded-lg border border-white/10">
                          <Loader className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Loading language data...</span>
                        </div>
                      ) : project.languages ? (
                        <LanguageChart 
                          data={project.languages}
                          title="Language Distribution"
                          size={80}
                          maxLegendItems={4}
                          className="mb-4"
                        />
                      ) : (
                        <div className="text-sm text-white/50 flex items-center space-x-2 p-4 bg-white/5 rounded-lg border border-white/10 mb-4">
                          <Code className="w-4 h-4" />
                          <span>Language data unavailable</span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {project.topics.map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-1 bg-cyber-blue/20 text-cyber-blue text-xs rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Code className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/70">No projects found for this user.</p>
                  </div>
                )}
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </div>
  );
};