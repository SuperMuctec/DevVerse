import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { dbOps } from '../lib/database';
import { toast } from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addXP: (amount: number) => void;
  // New methods for on-demand loading
  loadUserProjects: () => Promise<void>;
  loadUserPlanet: () => Promise<void>;
  loadUserAchievements: () => Promise<void>;
  // Notification helper
  addNotification: (notification: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Simple password hashing function (for demonstration only)
// In production, use bcrypt, argon2, or scrypt
const hashPassword = async (password: string): Promise<string> => {
  // Create a simple hash using Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'devverse_salt_2024'); // Add salt
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Simple password verification function
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Get notifications context if available
  let notificationContext: any = null;
  try {
    const { useNotifications } = require('./NotificationContext');
    notificationContext = useNotifications();
  } catch {
    // Notifications context not available yet
  }

  const addNotification = (notification: any) => {
    if (notificationContext?.addNotification) {
      notificationContext.addNotification(notification);
    }
  };

  // Load only essential user data for fast initialization
  const loadUserData = async (userId: string) => {
    console.log('🔵 [AUTH] Loading user data for ID:', userId);
    
    try {
      // Use the logged database operation
      const userData = await dbOps.getUserById(userId);

      if (userData) {
        // Create minimal user object with only essential data
        const user: User = {
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
          // These will be loaded on-demand
          projects: undefined,
          planet: undefined,
          achievements: undefined,
          followers: 0,
          following: 0,
        };

        console.log('✅ [AUTH] User data loaded successfully:', user);
        return user;
      }
    } catch (error) {
      console.error('❌ [AUTH] Error loading user data:', error);
    }
    return null;
  };

  // Load user projects on-demand
  const loadUserProjects = async () => {
    if (!authState.user || authState.user.projects) return;

    console.log('🔵 [AUTH] Loading projects for user:', authState.user.id);

    try {
      const projects = await dbOps.getProjectsByUserId(authState.user.id);

      const formattedProjects = projects?.map((project: any) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        language: project.language,
        githubUrl: project.github_url,
        homepage: project.homepage,
        topics: project.topics || [],
        isPrivate: Boolean(project.is_private),
        stars: project.stars || 0,
        forks: project.forks || 0,
        createdAt: new Date(project.created_at),
        updatedAt: new Date(project.updated_at),
        owner: authState.user.username,
      })) || [];

      console.log('✅ [AUTH] Projects loaded successfully, count:', formattedProjects.length);

      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, projects: formattedProjects } : null
      }));

      // Add notification for projects loaded
      addNotification({
        title: 'Projects Loaded',
        message: `${formattedProjects.length} projects loaded successfully! 📁`,
        type: 'info'
      });
    } catch (error) {
      console.error('❌ [AUTH] Error loading projects:', error);
      addNotification({
        title: 'Projects Load Failed',
        message: 'Failed to load your projects. Please try again.',
        type: 'error'
      });
    }
  };

  // Load user planet on-demand
  const loadUserPlanet = async () => {
    if (!authState.user || authState.user.planet) return;

    console.log('🔵 [AUTH] Loading planet for user:', authState.user.id);

    try {
      const planetData = await dbOps.getPlanetByUserId(authState.user.id);

      let planet;
      if (planetData) {
        planet = {
          id: planetData.id,
          name: planetData.name,
          owner: authState.user.username,
          stack: {
            languages: planetData.stack_languages || [],
            frameworks: planetData.stack_frameworks || [],
            tools: planetData.stack_tools || [],
            databases: planetData.stack_databases || [],
          },
          position: [0, 0, 0] as [number, number, number],
          color: planetData.color || '#00ffff',
          size: planetData.size || 1.0,
          rings: planetData.rings || 1,
          achievements: [],
          likes: planetData.likes || 0,
          views: planetData.views || 0,
          createdAt: new Date(planetData.created_at),
          categories: planetData.categories || [],
        };
        console.log('✅ [AUTH] Planet loaded successfully:', planet);
        
        addNotification({
          title: 'Planet Loaded',
          message: `Your planet "${planet.name}" is ready! 🌍`,
          type: 'info'
        });
      } else {
        // Create default planet if none exists
        planet = {
          id: '',
          name: `${authState.user.username}'s Planet`,
          owner: authState.user.username,
          stack: { languages: [], frameworks: [], tools: [], databases: [] },
          position: [0, 0, 0] as [number, number, number],
          color: '#00ffff',
          size: 1.0,
          rings: 1,
          achievements: [],
          likes: 0,
          views: 0,
          createdAt: new Date(),
          categories: [],
        };
        console.log('✅ [AUTH] Default planet created:', planet);
        
        addNotification({
          title: 'Planet Created',
          message: 'Your default planet has been created! Visit the Builder to customize it. 🚀',
          type: 'info'
        });
      }

      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, planet } : null
      }));
    } catch (error) {
      console.error('❌ [AUTH] Error loading planet:', error);
      addNotification({
        title: 'Planet Load Failed',
        message: 'Failed to load your planet. Please try again.',
        type: 'error'
      });
    }
  };

  // Load user achievements on-demand
  const loadUserAchievements = async () => {
    if (!authState.user || authState.user.achievements) return;

    console.log('🔵 [AUTH] Loading achievements for user:', authState.user.id);

    try {
      const achievements = await dbOps.getAchievementsByUserId(authState.user.id);

      const formattedAchievements = achievements?.map((achievement: any) => ({
        id: achievement.achievement_id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        rarity: 'common' as const, // Default rarity
        unlockedAt: new Date(achievement.unlocked_at),
      })) || [];

      console.log('✅ [AUTH] Achievements loaded successfully, count:', formattedAchievements.length);

      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, achievements: formattedAchievements } : null
      }));

      // Add notification for achievements loaded
      if (formattedAchievements.length > 0) {
        addNotification({
          title: 'Achievements Loaded',
          message: `${formattedAchievements.length} achievements unlocked! 🏆`,
          type: 'info'
        });
      }
    } catch (error) {
      console.error('❌ [AUTH] Error loading achievements:', error);
      addNotification({
        title: 'Achievements Load Failed',
        message: 'Failed to load your achievements. Please try again.',
        type: 'error'
      });
    }
  };

  useEffect(() => {
    // Check for existing session in localStorage
    const checkSession = async () => {
      console.log('🔵 [AUTH] Checking for existing session...');
      
      const sessionData = localStorage.getItem('devverse_session');
      if (sessionData) {
        try {
          const { userId, expiresAt } = JSON.parse(sessionData);
          
          // Check if session is still valid
          if (new Date().getTime() < expiresAt) {
            console.log('✅ [AUTH] Found valid session for user:', userId);
            
            const user = await loadUserData(userId);
            if (user) {
              setAuthState({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
              
              // Add session restored notification
              addNotification({
                title: 'Session Restored',
                message: 'Welcome back to DevVerse³! 🌌',
                type: 'info'
              });
              return;
            }
          } else {
            console.log('⚠️ [AUTH] Session expired, removing...');
            localStorage.removeItem('devverse_session');
            
            addNotification({
              title: 'Session Expired',
              message: 'Your session has expired. Please log in again.',
              type: 'warning'
            });
          }
        } catch (error) {
          console.error('❌ [AUTH] Error parsing session data:', error);
          localStorage.removeItem('devverse_session');
          
          addNotification({
            title: 'Session Error',
            message: 'There was an issue with your session. Please log in again.',
            type: 'error'
          });
        }
      }
      
      console.log('ℹ️ [AUTH] No valid session found');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
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
      console.log('🔵 [AUTH] Adding XP:', amount, 'to user:', authState.user.id);
      
      const oldLevel = calculateLevel(authState.user.xp);
      const newXp = authState.user.xp + amount;
      const newLevel = calculateLevel(newXp);
      
      try {
        // Update XP in database using logged operation
        await dbOps.updateUser(authState.user.id, { xp: newXp, level: newLevel });

        const updatedUser = { ...authState.user, xp: newXp, level: newLevel };
        setAuthState(prev => ({ ...prev, user: updatedUser }));
        
        console.log('✅ [AUTH] XP updated successfully. Old XP:', authState.user.xp, 'New XP:', newXp);
        
        // Add notification for XP gain
        addNotification({
          title: 'XP Gained!',
          message: `You earned ${amount} XP! 🌟`,
          type: 'success'
        });
        
        if (newLevel > oldLevel) {
          console.log('🎉 [AUTH] Level up! Old level:', oldLevel, 'New level:', newLevel);
          // Add notification for level up
          addNotification({
            title: 'Level Up!',
            message: `Congratulations! You're now level ${newLevel}! 🎉`,
            type: 'success'
          });
        }
      } catch (error) {
        console.error('❌ [AUTH] Error adding XP:', error);
        toast.error('Failed to update XP');
        
        addNotification({
          title: 'XP Update Failed',
          message: 'Failed to update your XP. Please try again.',
          type: 'error'
        });
      }
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔵 [AUTH] Attempting login for email:', email);
    
    try {
      // Get user from our database to verify password hash
      const userData = await dbOps.getUserByEmail(email);
      
      if (!userData) {
        console.log('⚠️ [AUTH] User not found in database');
        toast.error('Invalid email or password');
        
        addNotification({
          title: 'Login Failed',
          message: 'Invalid email or password. Please check your credentials.',
          type: 'error'
        });
        return false;
      }

      // Verify password against stored hash
      const isPasswordValid = await verifyPassword(password, userData.password_hash);
      
      if (!isPasswordValid) {
        console.log('⚠️ [AUTH] Password verification failed');
        toast.error('Invalid email or password');
        
        addNotification({
          title: 'Login Failed',
          message: 'Invalid email or password. Please check your credentials.',
          type: 'error'
        });
        return false;
      }

      console.log('✅ [AUTH] Password verified, logging in user...');

      // Create session
      const sessionData = {
        userId: userData.id,
        expiresAt: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) // 7 days
      };
      localStorage.setItem('devverse_session', JSON.stringify(sessionData));

      // Load user data
      const user = await loadUserData(userData.id);
      if (user) {
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });

        console.log('✅ [AUTH] Login successful');

        // Add welcome notification
        addNotification({
          title: 'Welcome back!',
          message: 'Successfully logged into DevVerse³ 🚀',
          type: 'success'
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ [AUTH] Login error:', error);
      toast.error('Login failed');
      
      addNotification({
        title: 'Login Error',
        message: 'An unexpected error occurred during login. Please try again.',
        type: 'error'
      });
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    console.log('🔵 [AUTH] Attempting registration for username:', username, 'email:', email);
    
    try {
      // Check if email already exists
      const existingUser = await dbOps.getUserByEmail(email);
      if (existingUser) {
        console.warn('⚠️ [AUTH] Email already exists');
        
        addNotification({
          title: 'Registration Failed',
          message: 'Email address is already registered. Please use a different email.',
          type: 'error'
        });
        return { success: false, message: 'Email already exists' };
      }

      // Check if username already exists
      const existingUsername = await dbOps.getUserByUsername(username);
      if (existingUsername) {
        console.warn('⚠️ [AUTH] Username already exists');
        
        addNotification({
          title: 'Registration Failed',
          message: 'Username is already taken. Please choose a different username.',
          type: 'error'
        });
        return { success: false, message: 'Username already exists' };
      }

      // Generate password hash
      console.log('🔵 [AUTH] Generating password hash...');
      const passwordHash = await hashPassword(password);
      console.log('✅ [AUTH] Password hash generated');

      // Generate user ID
      const userId = crypto.randomUUID();

      // Create user profile in our users table with password hash
      try {
        await dbOps.createUser({
          id: userId,
          username,
          email,
          password_hash: passwordHash,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        });
        console.log('✅ [AUTH] User profile created successfully with password hash');
      } catch (userError: any) {
        console.error('❌ [AUTH] User profile creation error:', userError);
        
        // Check if it's a username conflict
        if (userError.message?.includes('duplicate') || userError.message?.includes('unique')) {
          addNotification({
            title: 'Registration Failed',
            message: 'Username is already taken. Please choose a different username.',
            type: 'error'
          });
          return { success: false, message: 'Username already exists' };
        } else {
          addNotification({
            title: 'Registration Failed',
            message: 'An error occurred during registration. Please try again.',
            type: 'error'
          });
          return { success: false, message: 'Registration failed' };
        }
      }

      // Registration successful
      console.log('✅ [AUTH] Registration completed successfully');
      
      // Add success notification
      addNotification({
        title: 'Registration Successful!',
        message: 'Welcome to DevVerse³! Your account has been created successfully. 🎉',
        type: 'success'
      });
      
      // Create planet and achievement in the background (don't wait for them)
      setTimeout(async () => {
        try {
          console.log('🔵 [AUTH] Creating default planet in background...');
          await dbOps.createOrUpdatePlanet({
            user_id: userId,
            name: `${username}'s Planet`,
          });
          console.log('✅ [AUTH] Default planet created successfully');
          
          addNotification({
            title: 'Planet Created',
            message: 'Your Dev Planet has been created! Visit the Builder to customize it. 🌍',
            type: 'info'
          });
        } catch (planetError) {
          console.warn('⚠️ [AUTH] Planet creation failed (will be created later):', planetError);
        }

        try {
          console.log('🔵 [AUTH] Creating beginning achievement in background...');
          await dbOps.createAchievement({
            user_id: userId,
            achievement_id: 'beginning',
            name: 'The Beginning',
            description: 'User makes an account and Logs in',
            icon: 'user',
          });
          console.log('✅ [AUTH] Beginning achievement created successfully');
          
          addNotification({
            title: 'Achievement Unlocked!',
            message: 'The Beginning - Welcome to your coding journey! 🏆',
            type: 'success'
          });
        } catch (achievementError) {
          console.warn('⚠️ [AUTH] Achievement creation failed (will be awarded later):', achievementError);
        }
      }, 100); // Small delay to ensure registration completes first
      
      return { success: true, message: 'Registration successful! Your Dev Planet has been created.' };
    } catch (error) {
      console.error('❌ [AUTH] Registration error:', error);
      
      addNotification({
        title: 'Registration Error',
        message: 'An unexpected error occurred during registration. Please try again.',
        type: 'error'
      });
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = async () => {
    console.log('🔵 [AUTH] Attempting logout...');
    
    try {
      // Remove session from localStorage
      localStorage.removeItem('devverse_session');
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      console.log('✅ [AUTH] Logout successful');
      
      // Add logout notification
      addNotification({
        title: 'Logged out',
        message: 'See you in the galaxy soon! 👋',
        type: 'info'
      });
    } catch (error) {
      console.error('❌ [AUTH] Logout error:', error);
      toast.error('Logout failed');
      
      addNotification({
        title: 'Logout Error',
        message: 'An error occurred during logout. Please try again.',
        type: 'error'
      });
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (authState.user) {
      console.log('🔵 [AUTH] Updating user:', authState.user.id, 'with updates:', updates);
      
      try {
        // Update user in database using logged operation
        await dbOps.updateUser(authState.user.id, {
          username: updates.username,
          email: updates.email,
          avatar: updates.avatar,
          bio: updates.bio,
          location: updates.location,
          website: updates.website,
        });

        // Update planet if provided
        if (updates.planet) {
          console.log('🔵 [AUTH] Updating planet data...');
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
            categories: updates.planet.categories,
          });
          console.log('✅ [AUTH] Planet updated successfully');
          
          addNotification({
            title: 'Planet Updated',
            message: `Your planet "${updates.planet.name}" has been updated! 🌍`,
            type: 'success'
          });
        }

        // Update projects if provided
        if (updates.projects) {
          console.log('🔵 [AUTH] Updating projects...');
          // This is a simplified approach - in a real app you'd handle individual project updates
          for (const project of updates.projects) {
            if (!project.id.includes('temp')) { // Only update existing projects
              try {
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
              } catch (projectError) {
                console.error('❌ [AUTH] Error updating project:', project.id, projectError);
              }
            }
          }
          console.log('✅ [AUTH] Projects updated successfully');
          
          addNotification({
            title: 'Projects Updated',
            message: 'Your projects have been updated successfully! 📁',
            type: 'success'
          });
        }

        const updatedUser = { ...authState.user, ...updates };
        setAuthState(prev => ({ ...prev, user: updatedUser }));
        
        console.log('✅ [AUTH] User updated successfully');
        
        // Add update notification
        addNotification({
          title: 'Profile Updated',
          message: 'Your profile has been successfully updated! ✨',
          type: 'success'
        });
      } catch (error) {
        console.error('❌ [AUTH] Error updating user:', error);
        toast.error('Failed to update profile');
        
        addNotification({
          title: 'Update Failed',
          message: 'Failed to update your profile. Please try again.',
          type: 'error'
        });
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
        loadUserProjects,
        loadUserPlanet,
        loadUserAchievements,
        addNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};