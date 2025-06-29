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
    // Ultra-fast session check with hard timeout
    const checkSession = async () => {
      console.log('🔵 [AUTH] Starting fast session check...');
      
      // Set a hard timeout to prevent hanging - reduced to 1 second
      const timeoutId = setTimeout(() => {
        console.log('⚠️ [AUTH] Session check timeout - proceeding without session');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }, 1000); // 1 second hard timeout

      try {
        const sessionResponse = await supabase.auth.getSession();
        const session = sessionResponse.data.session;
        const error = sessionResponse.error;
        
        // Clear timeout since we got a response
        clearTimeout(timeoutId);
        
        if (error) {
          console.warn('⚠️ [AUTH] Session check error:', error);
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }
        
        if (session?.user) {
          console.log('✅ [AUTH] Found existing session for user:', session.user.id);
          
          // Try to load user data with timeout
          const userDataTimeout = setTimeout(() => {
            console.log('⚠️ [AUTH] User data loading timeout - proceeding without user data');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }, 2000);
          
          try {
            const user = await loadUserData(session.user.id);
            clearTimeout(userDataTimeout);
            
            if (user) {
              setAuthState({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              console.log('⚠️ [AUTH] Failed to load user data');
              setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          } catch (userError) {
            clearTimeout(userDataTimeout);
            console.error('❌ [AUTH] Error loading user data:', userError);
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          console.log('ℹ️ [AUTH] No existing session found');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.log('ℹ️ [AUTH] Session check failed - starting fresh:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkSession();

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
      // Try Supabase auth first (this is the primary authentication method)
      console.log('🔵 [AUTH] Attempting Supabase authentication...');
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.warn('⚠️ [AUTH] Supabase auth failed:', authError);
        
        // If Supabase auth fails, check if user exists in our database
        console.log('🔵 [AUTH] Checking user in database...');
        const userData = await dbOps.getUserByEmail(email);
        
        if (!userData) {
          console.log('⚠️ [AUTH] User not found in database');
          toast.error('Invalid email or password');
          return false;
        }

        // Verify password against stored hash
        const isPasswordValid = await verifyPassword(password, userData.password_hash);
        
        if (!isPasswordValid) {
          console.log('⚠️ [AUTH] Password verification failed');
          toast.error('Invalid email or password');
          return false;
        }

        // Password is correct but Supabase auth failed
        // This can happen if the user was created in our system but not in Supabase auth
        console.log('🔵 [AUTH] Password correct but Supabase auth failed. Attempting to sync...');
        
        // Try to create the user in Supabase auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          console.error('❌ [AUTH] Failed to sync user to Supabase auth:', signUpError);
          toast.error('Authentication service error. Please try again.');
          return false;
        }

        console.log('✅ [AUTH] User synced to Supabase auth successfully');
      } else {
        console.log('✅ [AUTH] Supabase authentication successful');
      }

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
      // COMPREHENSIVE USER EXISTENCE CHECK
      console.log('🔵 [AUTH] Performing comprehensive user existence check...');
      const existenceCheck = await dbOps.checkUserExists(email, username);
      
      if (!existenceCheck.canRegister) {
        const conflicts = [];
        if (existenceCheck.existsInAuth) {
          conflicts.push('email already registered in authentication system');
        }
        if (existenceCheck.existsInPublic) {
          if (existenceCheck.publicConflictType === 'email') {
            conflicts.push('email already registered');
          } else if (existenceCheck.publicConflictType === 'username') {
            conflicts.push('username already taken');
          }
        }
        
        const errorMessage = conflicts.length > 0 
          ? `Registration failed: ${conflicts.join(', ')}`
          : 'User already exists';
        
        console.error('❌ [AUTH] Registration blocked:', errorMessage);
        toast.error(errorMessage);
        return false;
      }

      console.log('✅ [AUTH] User existence check passed - proceeding with registration');

      // Generate password hash
      console.log('🔵 [AUTH] Generating password hash...');
      const passwordHash = await hashPassword(password);
      console.log('✅ [AUTH] Password hash generated');

      // Create user in Supabase Auth first
      console.log('🔵 [AUTH] Creating auth user...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.warn('⚠️ [AUTH] Email already exists in auth (missed by existence check)');
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

      // Create user profile in our users table with password hash
      try {
        await dbOps.createUser({
          id: authData.user.id,
          username,
          email,
          password_hash: passwordHash, // Store the hashed password
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        });
        console.log('✅ [AUTH] User profile created successfully with password hash');
      } catch (userError: any) {
        console.error('❌ [AUTH] User profile creation error:', userError);
        
        // Check if it's a username conflict
        if (userError.message?.includes('duplicate') || userError.message?.includes('unique')) {
          toast.error('Username already exists');
        } else {
          toast.error('Registration failed');
        }
        
        // Clean up auth user if profile creation failed
        try {
          await supabase.auth.signOut();
        } catch (cleanupError) {
          console.error('Failed to cleanup auth user:', cleanupError);
        }
        
        return false;
      }

      // Registration successful - show immediate success
      console.log('✅ [AUTH] Registration completed successfully');
      
      // Create planet and achievement in the background (don't wait for them)
      setTimeout(async () => {
        try {
          console.log('🔵 [AUTH] Creating default planet in background...');
          await dbOps.createOrUpdatePlanet({
            user_id: authData.user.id,
            name: `${username}'s Planet`,
          });
          console.log('✅ [AUTH] Default planet created successfully');
        } catch (planetError) {
          console.warn('⚠️ [AUTH] Planet creation failed (will be created later):', planetError);
        }

        try {
          console.log('🔵 [AUTH] Creating beginning achievement in background...');
          await dbOps.createAchievement({
            user_id: authData.user.id,
            achievement_id: 'beginning',
            name: 'The Beginning',
            description: 'User makes an account and Logs in',
            icon: 'user',
          });
          console.log('✅ [AUTH] Beginning achievement created successfully');
          
          // Award XP for the beginning achievement
          if (authState.user) {
            addXP(50);
          }
        } catch (achievementError) {
          console.warn('⚠️ [AUTH] Achievement creation failed (will be awarded later):', achievementError);
        }
      }, 100); // Small delay to ensure registration completes first
      
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