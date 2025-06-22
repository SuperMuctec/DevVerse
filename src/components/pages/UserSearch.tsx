import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, User, MapPin, Globe, Calendar, Star, GitFork, ExternalLink } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { User as UserType, Project } from '../../types';

export const UserSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock users data
  const mockUsers: UserType[] = [
    {
      id: '1',
      username: 'CodeMaster',
      email: 'codemaster@devverse.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMaster',
      level: 15,
      xp: 2500,
      followers: 1337,
      following: 256,
      bio: 'Full-stack developer passionate about 3D web experiences and modern JavaScript frameworks. Building the future of web development.',
      location: 'San Francisco, CA',
      website: 'https://codemaster.dev',
      joinedAt: new Date('2023-01-15'),
      projects: [
        {
          id: '1',
          name: 'DevVerse³',
          description: 'A futuristic 3D developer platform for showcasing tech stacks',
          language: 'TypeScript',
          stars: 1337,
          forks: 42,
          isPrivate: false,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
          owner: 'CodeMaster',
          topics: ['react', '3d', 'typescript', 'three.js'],
          githubUrl: 'https://github.com/codemaster/devverse3',
          homepage: 'https://devverse3.com',
        },
        {
          id: '2',
          name: 'React-3D-Engine',
          description: 'Lightweight 3D engine built on top of React Three Fiber',
          language: 'TypeScript',
          stars: 892,
          forks: 156,
          isPrivate: false,
          createdAt: new Date('2023-12-10'),
          updatedAt: new Date('2024-01-18'),
          owner: 'CodeMaster',
          topics: ['react', 'three.js', 'webgl', 'engine'],
          githubUrl: 'https://github.com/codemaster/react-3d-engine',
        },
      ],
      planet: {
        id: '1',
        name: 'ReactSphere',
        owner: 'CodeMaster',
        stack: {
          languages: ['TypeScript', 'JavaScript', 'Python'],
          frameworks: ['React', 'Next.js', 'FastAPI'],
          tools: ['Vite', 'Docker', 'GitHub Actions'],
          databases: ['PostgreSQL', 'Redis']
        },
        position: [0, 0, 0],
        color: '#00ffff',
        size: 1.2,
        rings: 3,
        achievements: [],
        featured: true,
        likes: 1337,
        views: 5420,
        createdAt: new Date('2024-01-15')
      }
    },
    {
      id: '2',
      username: 'DevNinja',
      email: 'devninja@devverse.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevNinja',
      level: 12,
      xp: 1800,
      followers: 892,
      following: 134,
      bio: 'Vue.js enthusiast and performance optimization expert. Love creating smooth user experiences.',
      location: 'Tokyo, Japan',
      website: 'https://devninja.tech',
      joinedAt: new Date('2023-03-20'),
      projects: [
        {
          id: '3',
          name: 'Vue-Performance-Kit',
          description: 'Collection of Vue.js performance optimization tools and techniques',
          language: 'JavaScript',
          stars: 654,
          forks: 89,
          isPrivate: false,
          createdAt: new Date('2023-11-05'),
          updatedAt: new Date('2024-01-12'),
          owner: 'DevNinja',
          topics: ['vue', 'performance', 'optimization'],
          githubUrl: 'https://github.com/devninja/vue-performance-kit',
        },
      ],
      planet: {
        id: '2',
        name: 'VueNebula',
        owner: 'DevNinja',
        stack: {
          languages: ['JavaScript', 'TypeScript', 'Go'],
          frameworks: ['Vue.js', 'Nuxt.js', 'Gin'],
          tools: ['Webpack', 'Kubernetes', 'GitLab CI'],
          databases: ['MongoDB', 'InfluxDB']
        },
        position: [5, 2, -3],
        color: '#00ff00',
        size: 1.0,
        rings: 2,
        achievements: [],
        featured: false,
        likes: 892,
        views: 3210,
        createdAt: new Date('2024-01-10')
      }
    },
    {
      id: '3',
      username: 'TechWizard',
      email: 'techwizard@devverse.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechWizard',
      level: 18,
      xp: 3200,
      followers: 2156,
      following: 89,
      bio: 'Angular architect and mobile development specialist. Building enterprise-grade applications.',
      location: 'London, UK',
      joinedAt: new Date('2022-11-08'),
      projects: [
        {
          id: '4',
          name: 'Angular-Enterprise-Starter',
          description: 'Production-ready Angular starter with best practices',
          language: 'TypeScript',
          stars: 1024,
          forks: 234,
          isPrivate: false,
          createdAt: new Date('2023-08-15'),
          updatedAt: new Date('2024-01-10'),
          owner: 'TechWizard',
          topics: ['angular', 'enterprise', 'typescript'],
          githubUrl: 'https://github.com/techwizard/angular-enterprise-starter',
        },
      ],
      planet: {
        id: '3',
        name: 'AngularOrb',
        owner: 'TechWizard',
        stack: {
          languages: ['TypeScript', 'Java', 'Kotlin'],
          frameworks: ['Angular', 'Spring Boot', 'Android'],
          tools: ['Gradle', 'Jenkins', 'AWS'],
          databases: ['MySQL', 'DynamoDB']
        },
        position: [-4, -1, 2],
        color: '#ff00ff',
        size: 1.1,
        rings: 4,
        achievements: [],
        featured: true,
        likes: 654,
        views: 2890,
        createdAt: new Date('2024-01-08')
      }
    },
  ];

  useEffect(() => {
    if (searchTerm.trim()) {
      setIsLoading(true);
      // Simulate API call delay
      const timer = setTimeout(() => {
        const results = mockUsers.filter(user =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.bio?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [searchTerm]);

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

  if (selectedUser) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-6xl mx-auto py-8">
          <motion.button
            onClick={() => setSelectedUser(null)}
            className="mb-6 flex items-center space-x-2 text-cyber-blue hover:text-cyber-pink transition-colors"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>← Back to Search</span>
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Profile */}
            <div className="lg:col-span-1">
              <GlassPanel glowColor="#00ffff">
                <div className="text-center mb-6">
                  <motion.img
                    src={selectedUser.avatar}
                    alt={selectedUser.username}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-cyber-blue"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  />
                  <h2 className="font-orbitron text-2xl font-bold text-white mb-1">
                    {selectedUser.username}
                  </h2>
                  <p className="text-white/70 text-sm mb-4">{selectedUser.email}</p>
                  
                  <div className="flex items-center justify-center space-x-4 mb-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-cyber-blue">{selectedUser.followers}</div>
                      <div className="text-white/60">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-cyber-pink">{selectedUser.following}</div>
                      <div className="text-white/60">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-cyber-yellow">Level {selectedUser.level}</div>
                      <div className="text-white/60">{selectedUser.xp} XP</div>
                    </div>
                  </div>
                </div>

                {selectedUser.bio && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-white mb-2">Bio</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{selectedUser.bio}</p>
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  {selectedUser.location && (
                    <div className="flex items-center space-x-2 text-white/70">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedUser.location}</span>
                    </div>
                  )}
                  {selectedUser.website && (
                    <div className="flex items-center space-x-2 text-white/70">
                      <Globe className="w-4 h-4" />
                      <a
                        href={selectedUser.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyber-blue transition-colors"
                      >
                        {selectedUser.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-white/70">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {selectedUser.joinedAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </GlassPanel>
            </div>

            {/* User Projects */}
            <div className="lg:col-span-2">
              <GlassPanel glowColor="#ff00ff">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-orbitron text-2xl font-bold text-white">
                    Projects ({selectedUser.projects.length})
                  </h2>
                </div>

                <div className="space-y-4">
                  {selectedUser.projects.map((project, index) => (
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
                              className="font-orbitron text-lg font-bold text-white group-hover:text-cyber-blue transition-colors cursor-pointer"
                              whileHover={{ scale: 1.02 }}
                              onClick={() => window.open(project.githubUrl, '_blank')}
                            >
                              {project.name}
                            </motion.h3>
                            <motion.button
                              onClick={() => window.open(project.githubUrl, '_blank')}
                              className="p-1 text-white/50 hover:text-cyber-blue transition-colors"
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

                      <div className="flex items-center justify-between">
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

                      <div className="flex flex-wrap gap-2 mt-3">
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
                  ))}
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-orbitron text-5xl font-bold mb-4">
            <span className="neon-text text-cyber-blue">User</span>{' '}
            <span className="neon-text text-cyber-pink">Search</span>
          </h1>
          <p className="font-sora text-xl text-white/70">
            Discover developers across the galaxy
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-8">
          <GlassPanel glowColor="#00ffff">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/50" />
              <input
                type="text"
                placeholder="Search developers by username, email, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-white/50 focus:outline-none text-lg"
              />
            </div>
          </GlassPanel>
        </div>

        {/* Search Results */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70">Searching the galaxy...</p>
          </div>
        )}

        {!isLoading && searchTerm && searchResults.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">No developers found matching your search.</p>
          </div>
        )}

        {!isLoading && searchResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-orbitron text-2xl font-bold text-white mb-6">
              Search Results ({searchResults.length})
            </h2>
            
            {searchResults.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassPanel 
                  glowColor="#ff00ff"
                  className="hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-start space-x-4">
                    <motion.img
                      src={user.avatar}
                      alt={user.username}
                      className="w-16 h-16 rounded-full border-2 border-cyber-pink"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-orbitron text-xl font-bold text-white">
                          {user.username}
                        </h3>
                        <span className="px-2 py-1 bg-cyber-blue/20 text-cyber-blue text-xs rounded-full">
                          Level {user.level}
                        </span>
                      </div>
                      
                      <p className="text-white/70 text-sm mb-3">{user.email}</p>
                      
                      {user.bio && (
                        <p className="text-white/80 text-sm mb-3 line-clamp-2">
                          {user.bio}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-6 text-sm text-white/60">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{user.followers} followers</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{user.projects.length} projects</span>
                        </div>
                        {user.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{user.location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {user.joinedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        )}

        {!searchTerm && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">Start typing to search for developers...</p>
          </div>
        )}
      </div>
    </div>
  );
};