import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { dbOps } from '../lib/database';
import { toast } from 'react-hot-toast';
import bcrypt from 'bcryptjs';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addXP: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const currentUserId = localStorage.getItem('devverse_current_user');
        if (currentUserId) {
          const userData = await dbOps.getUserById(currentUserId);
          if (userData) {
            // Get user's projects, planet, and achievements
            const [projects, planet, achievements] = await Promise.all([
              dbOps.getProjectsByUserId(currentUserId),
              dbOps.getPlanetByUserId(currentUserId),
              dbOps.getAchievementsByUserId(currentUserId)
            ]);

            const user: User = {
              id: userData.id,
              username: userData.username,
              email: userData.email,
              avatar: userData.avatar,
              bio: userData.bio,
              location: userData.location,
              website: userData.website,
              xp: userData.xp,
              level: userData.level,
              projects: projects.map(p => ({
                id: p.id,
                name: p.name,
                description: p.description,
                language: p.language,
                githubUrl: p.github_url,
                homepage: p.homepage,
                topics: p.topics,
                isPrivate: Boolean(p.is_private),
                stars: p.stars,
                forks: p.forks,
                createdAt: new Date(p.created_at),
                updatedAt: new Date(p.updated_at),
                owner: userData.username
              })),
              followers: 0,
              following: 0,
              joinedAt: new Date(userData.created_at),
              planet: planet ? {
                id: planet.id,
                name: planet.name,
                owner: userData.username,
                stack: {
                  languages: planet.stack_languages,
                  frameworks: planet.stack_frameworks,
                  tools: planet.stack_tools,
                  databases: planet.stack_databases,
                },
                position: [0, 0, 0],
                color: planet.color,
                size: planet.size,
                rings: planet.rings,
                achievements: achievements,
                likes: planet.likes,
                views: planet.views,
                createdAt: new Date(planet.created_at),
              } : {
                id: '',
                name: `${userData.username}'s Planet`,
                owner: userData.username,
                stack: { languages: [], frameworks: [], tools: [], databases: [] },
                position: [0, 0, 0],
                color: '#00ffff',
                size: 1.0,
                rings: 1,
                achievements: [],
                likes: 0,
                views: 0,
                createdAt: new Date(),
              }
            };

            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            localStorage.removeItem('devverse_current_user');
            setAuthState(prev => ({ ...prev, isLoading: false }));
          }
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Session check error:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkSession();
  }, []);

  const calculateLevel = (xp: number) => {
    let level = 1;
    let requiredXp = 20;
    let totalXp = 0;
    
    while (totalXp + requiredXp <= xp) {
      totalXp += requiredXp;
      level++;
      requiredXp = 10 * Math.pow(2, level);
    }
    
    return level;
  };

  const addXP = async (amount: number) => {
    if (authState.user) {
      const oldLevel = calculateLevel(authState.user.xp);
      const newXp = authState.user.xp + amount;
      const newLevel = calculateLevel(newXp);
      
      try {
        await dbOps.updateUser(authState.user.id, { xp: newXp, level: newLevel });

        const updatedUser = { ...authState.user, xp: newXp, level: newLevel };
        setAuthState(prev => ({ ...prev, user: updatedUser }));
        
        toast.success(`+${amount} XP earned! 🌟`);
        
        if (newLevel > oldLevel) {
          toast.success(`🎉 Level up! You're now level ${newLevel}!`, { duration: 6000 });
        }
      } catch (error) {
        console.error('Error adding XP:', error);
        toast.error('Failed to update XP');
      }
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userData = await dbOps.getUserByEmail(email);
      
      if (!userData) {
        toast.error('User not found');
        return false;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, userData.password_hash);
      if (!isValidPassword) {
        toast.error('Invalid password');
        return false;
      }

      // Set current user
      localStorage.setItem('devverse_current_user', userData.id);

      // Award achievement for logging in
      await dbOps.createAchievement({
        user_id: userData.id,
        achievement_id: 'beginning',
        name: 'The Beginning',
        description: 'User makes an account and Logs in',
        icon: 'user',
      });
      
      // Reload user data
      window.location.reload();
      
      toast.success('Welcome back to DevVerse³!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // Check if email or username already exists
      const [existingEmail, existingUsername] = await Promise.all([
        dbOps.getUserByEmail(email),
        dbOps.getUserByUsername(username)
      ]);

      if (existingEmail) {
        toast.error('Email already exists');
        return false;
      }

      if (existingUsername) {
        toast.error('Username already exists');
        return false;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const userId = await dbOps.createUser({
        username,
        email,
        password_hash: passwordHash,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      });

      // Create default planet
      await dbOps.createOrUpdatePlanet({
        user_id: userId,
        name: `${username}'s Planet`,
        stack_languages: [],
        stack_frameworks: [],
        stack_tools: [],
        stack_databases: [],
        color: '#00ffff',
        size: 1.0,
        rings: 1
      });

      // Award achievement for registering
      await dbOps.createAchievement({
        user_id: userId,
        achievement_id: 'beginning',
        name: 'The Beginning',
        description: 'User makes an account and Logs in',
        icon: 'user',
      });

      // Set current user
      localStorage.setItem('devverse_current_user', userId);
      
      // Reload to show logged in state
      window.location.reload();
      
      toast.success('Welcome to DevVerse³! Your planet has been created!');
      toast.success('Achievement unlocked: The Beginning! 🎉');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('devverse_current_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast.success('Logged out successfully');
  };

  const updateUser = async (updates: Partial<User>) => {
    if (authState.user) {
      try {
        // Update user in database
        const userUpdates: any = {};
        if (updates.username) userUpdates.username = updates.username;
        if (updates.email) userUpdates.email = updates.email;
        if (updates.avatar) userUpdates.avatar = updates.avatar;
        if (updates.bio !== undefined) userUpdates.bio = updates.bio;
        if (updates.location !== undefined) userUpdates.location = updates.location;
        if (updates.website !== undefined) userUpdates.website = updates.website;

        if (Object.keys(userUpdates).length > 0) {
          await dbOps.updateUser(authState.user.id, userUpdates);
        }

        // Update planet if provided
        if (updates.planet) {
          await dbOps.createOrUpdatePlanet({
            user_id: authState.user.id,
            name: updates.planet.name,
            stack_languages: updates.planet.stack.languages,
            stack_frameworks: updates.planet.stack.frameworks,
            stack_tools: updates.planet.stack.tools,
            stack_databases: updates.planet.stack.databases,
            color: updates.planet.color,
            size: updates.planet.size,
            rings: updates.planet.rings,
          });
        }

        // Update projects if provided
        if (updates.projects) {
          for (const project of updates.projects) {
            if (!project.id.includes('temp')) {
              await dbOps.createProject({
                id: project.id,
                user_id: authState.user.id,
                name: project.name,
                description: project.description,
                language: project.language,
                github_url: project.githubUrl,
                homepage: project.homepage,
                topics: project.topics,
                is_private: project.isPrivate,
                stars: project.stars,
                forks: project.forks,
              });
            }
          }
        }

        const updatedUser = { ...authState.user, ...updates };
        setAuthState(prev => ({ ...prev, user: updatedUser }));
      } catch (error) {
        console.error('Error updating user:', error);
        toast.error('Failed to update profile');
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateUser,
        addXP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};