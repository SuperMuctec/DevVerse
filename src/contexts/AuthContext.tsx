import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { supabase } from '../lib/supabase';
import { dbOps } from '../lib/database';
import { toast } from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addXP: (amount: number) => void;
  // New methods for on-demand loading
  loadUserProjects: () => Promise<void>;
  loadUserPlanet: () => Promise<void>;
  loadUserAchievements: () => Promise<void>;
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

  // Get notifications context if available
  let addNotification: any = null;
  try {
    const { useNotifications } = require('./NotificationContext');
    const notificationContext = useNotifications();
    addNotification = notificationContext.addNotification;
  } catch {
    // Notifications context not available yet
  }

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
    } catch (error) {
      console.error('❌ [AUTH] Error loading projects:', error);
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
      }

      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, planet } : null
      }));
    } catch (error) {
      console.error('❌ [AUTH] Error loading planet:', error);
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
    } catch (error) {
      console.error('❌ [AUTH] Error loading achievements:', error);
    }
  };

  useEffect(() => {
    // Check for existing session with reduced timeout and better error handling
    const checkSession = async () => {
      console.log('🔵 [AUTH] Checking existing session...');
      
      try {
        // Clear any stale session data first
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          console.log('✅ [AUTH] Found existing session for user:', currentSession.user.id);
          const user = await loadUserData(currentSession.user.id);
          if (user) {
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            console.log('⚠️ [AUTH] Session found but user data not loaded');
            setAuthState(prev => ({ ...prev, isLoading: false }));
          }
        } else {
          // No previous session found
          console.log('ℹ️ [AUTH] No previous session found');
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.log('ℹ️ [AUTH] Session check failed - starting fresh');
        
        // Clear any problematic session data
        try {
          await supabase.auth.signOut();
        } catch (signOutError) {
          // Ignore signout errors
        }
        
        // Set as not authenticated regardless of error type
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    // Add a maximum timeout for the entire session check
    const sessionCheckWithTimeout = async () => {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session check timeout')), 3000)
      );

      try {
        await Promise.race([checkSession(), timeoutPromise]);
      } catch (error) {
        console.log('ℹ️ [AUTH] Session check timed out - proceeding without session');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    sessionCheckWithTimeout();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔵 [AUTH] Auth state change:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // User just signed in, load their data
        const user = await loadUserData(session.user.id);
        if (user) {
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('ℹ️ [AUTH] User signed out');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
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
        if (addNotification) {
          addNotification({
            title: 'XP Gained!',
            message: `You earned ${amount} XP! 🌟`,
            type: 'success'
          });
        }
        
        if (newLevel > oldLevel) {
          console.log('🎉 [AUTH] Level up! Old level:', oldLevel, 'New level:', newLevel);
          // Add notification for level up
          if (addNotification) {
            addNotification({
              title: 'Level Up!',
              message: `Congratulations! You're now level ${newLevel}! 🎉`,
              type: 'success'
            });
          }
        }
      } catch (error) {
        console.error('❌ [AUTH] Error adding XP:', error);
        toast.error('Failed to update XP');
      }
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔵 [AUTH] Attempting login for email:', email);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ [AUTH] Login error:', error);
        toast.error('Invalid email or password');
        return false;
      }

      console.log('✅ [AUTH] Login successful');

      // Add welcome notification
      if (addNotification) {
        addNotification({
          title: 'Welcome back!',
          message: 'Successfully logged into DevVerse³ 🚀',
          type: 'success'
        });
      }

      return true;
    } catch (error) {
      console.error('❌ [AUTH] Login error:', error);
      toast.error('Login failed');
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    console.log('🔵 [AUTH] Attempting registration for username:', username, 'email:', email);
    
    try {
      // Check if username already exists using logged database operation
      const existingUser = await dbOps.getUserByUsername(username);

      if (existingUser) {
        console.log('⚠️ [AUTH] Username already exists:', username);
        toast.error('Username already exists');
        return false;
      }

      // Create user in Supabase Auth
      console.log('🔵 [AUTH] Creating auth user...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.warn('⚠️ [AUTH] Auth creation warning: User already registered');
          toast.error('Email already exists');
        } else {
          console.error('❌ [AUTH] Auth creation error:', authError);
          toast.error('Registration failed');
        }
        return false;
      }

      if (!authData.user) {
        console.error('❌ [AUTH] No user data returned from auth signup');
        toast.error('Registration failed');
        return false;
      }

      console.log('✅ [AUTH] Auth user created with ID:', authData.user.id);

      // Create user profile in our users table using logged database operation
      try {
        await dbOps.createUser({
          id: authData.user.id,
          username,
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        });
        console.log('✅ [AUTH] User profile created successfully');
      } catch (userError) {
        console.error('❌ [AUTH] User profile creation error:', userError);
        toast.error('Registration failed');
        return false;
      }

      // Create default planet using logged database operation with error handling
      try {
        console.log('🔵 [AUTH] Creating default planet...');
        await dbOps.createOrUpdatePlanet({
          user_id: authData.user.id,
          name: `${username}'s Planet`,
        });
        console.log('✅ [AUTH] Default planet created successfully');
      } catch (planetError) {
        console.warn('⚠️ [AUTH] Planet creation warning:', planetError);
        // Don't fail registration if planet creation fails
        // The planet can be created later when the user visits the builder
      }

      // Award achievement for registering using logged database operation
      try {
        console.log('🔵 [AUTH] Creating beginning achievement...');
        await dbOps.createAchievement({
          user_id: authData.user.id,
          achievement_id: 'beginning',
          name: 'The Beginning',
          description: 'User makes an account and Logs in',
          icon: 'user',
        });
        console.log('✅ [AUTH] Beginning achievement created successfully');
      } catch (achievementError) {
        console.warn('⚠️ [AUTH] Achievement creation warning:', achievementError);
        // Don't fail registration if achievement creation fails
      }
      
      // Add welcome notifications
      if (addNotification) {
        addNotification({
          title: 'Welcome to DevVerse³!',
          message: 'Your account has been created! 🌍',
          type: 'success'
        });
        
        addNotification({
          title: 'Achievement Unlocked!',
          message: 'The Beginning - You\'ve joined the galaxy! 🎉',
          type: 'success'
        });
      }
      
      console.log('✅ [AUTH] Registration completed successfully');
      return true;
    } catch (error) {
      console.error('❌ [AUTH] Registration error:', error);
      toast.error('Registration failed');
      return false;
    }
  };

  const logout = async () => {
    console.log('🔵 [AUTH] Attempting logout...');
    
    try {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      console.log('✅ [AUTH] Logout successful');
      
      // Add logout notification
      if (addNotification) {
        addNotification({
          title: 'Logged out',
          message: 'See you in the galaxy soon! 👋',
          type: 'info'
        });
      }
    } catch (error) {
      console.error('❌ [AUTH] Logout error:', error);
      toast.error('Logout failed');
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
        }

        const updatedUser = { ...authState.user, ...updates };
        setAuthState(prev => ({ ...prev, user: updatedUser }));
        
        console.log('✅ [AUTH] User updated successfully');
        
        // Add update notification
        if (addNotification) {
          addNotification({
            title: 'Profile Updated',
            message: 'Your profile has been successfully updated! ✨',
            type: 'success'
          });
        }
      } catch (error) {
        console.error('❌ [AUTH] Error updating user:', error);
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
        loadUserProjects,
        loadUserPlanet,
        loadUserAchievements,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};