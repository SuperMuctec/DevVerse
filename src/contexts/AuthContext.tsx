import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { supabase } from '../lib/supabase';
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
    try {
      console.log('Loading user data for ID:', userId);
      
      // Simple, fast query with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const { data: userData, error } = await supabase
        .from('users')
        .select('id, username, email, avatar, bio, location, website, xp, level, created_at')
        .eq('id', userId)
        .abortSignal(controller.signal)
        .single();

      clearTimeout(timeoutId);

      if (error) {
        console.error('Error fetching user data:', error);
        return null;
      }

      if (userData) {
        console.log('User data loaded successfully');
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

        return user;
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
    return null;
  };

  // Load user projects on-demand
  const loadUserProjects = async () => {
    if (!authState.user || authState.user.projects) return;

    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', authState.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading projects:', error);
        return;
      }

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

      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, projects: formattedProjects } : null
      }));
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  // Load user planet on-demand
  const loadUserPlanet = async () => {
    if (!authState.user || authState.user.planet) return;

    try {
      const { data: planetData, error } = await supabase
        .from('dev_planets')
        .select('*')
        .eq('user_id', authState.user.id)
        .single();

      let planet;
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading planet:', error);
        return;
      }

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
      }

      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, planet } : null
      }));
    } catch (error) {
      console.error('Error loading planet:', error);
    }
  };

  // Load user achievements on-demand
  const loadUserAchievements = async () => {
    if (!authState.user || authState.user.achievements) return;

    try {
      const { data: achievements, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', authState.user.id)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error loading achievements:', error);
        return;
      }

      const formattedAchievements = achievements?.map((achievement: any) => ({
        id: achievement.achievement_id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        rarity: 'common' as const, // Default rarity
        unlockedAt: new Date(achievement.unlocked_at),
      })) || [];

      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, achievements: formattedAchievements } : null
      }));
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  useEffect(() => {
    // Fast session check with immediate timeout
    const checkSession = async () => {
      try {
        console.log('Checking for existing session...');
        
        // Set a very short timeout for session check
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          console.log('Session check timed out, proceeding without session');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }, 2000); // Only 2 seconds for session check
        
        const { data: { session } } = await supabase.auth.getSession();
        clearTimeout(timeoutId);
        
        if (session?.user) {
          console.log('Found existing session for user:', session.user.id);
          const user = await loadUserData(session.user.id);
          if (user) {
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        }
        
        // No session or failed to load user data
        console.log('No session found or failed to load user data');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } catch (error) {
        console.error('Session check error:', error);
        // Always set loading to false on error
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    // Start session check immediately
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      
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
      const oldLevel = calculateLevel(authState.user.xp);
      const newXp = authState.user.xp + amount;
      const newLevel = calculateLevel(newXp);
      
      try {
        // Update XP in database
        const { error } = await supabase
          .from('users')
          .update({ xp: newXp, level: newLevel })
          .eq('id', authState.user.id);

        if (error) {
          console.error('Error updating XP:', error);
          return;
        }

        const updatedUser = { ...authState.user, xp: newXp, level: newLevel };
        setAuthState(prev => ({ ...prev, user: updatedUser }));
        
        // Add notification for XP gain
        if (addNotification) {
          addNotification({
            title: 'XP Gained!',
            message: `You earned ${amount} XP! 🌟`,
            type: 'success'
          });
        }
        
        if (newLevel > oldLevel) {
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
        console.error('Error adding XP:', error);
        toast.error('Failed to update XP');
      }
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Starting simplified login process for:', email);
      
      // Use Supabase Auth directly - much faster than custom password verification
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        console.error('Login error:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please confirm your email address');
        } else {
          toast.error('Login failed - please try again');
        }
        return false;
      }

      if (!data.user) {
        toast.error('Login failed - no user data');
        return false;
      }

      console.log('Login successful!');

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
      console.error('Login error:', error);
      toast.error('Login failed - unexpected error');
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('Starting simplified registration process for:', email);
      
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username.trim().toLowerCase())
        .single();

      if (existingUser) {
        toast.error('Username already exists');
        return false;
      }

      console.log('Username available, creating Supabase Auth user...');

      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            username: username.trim(),
          }
        }
      });

      if (authError) {
        console.error('Auth creation error:', authError);
        
        if (authError.message.includes('User already registered')) {
          toast.error('Email already registered');
        } else {
          toast.error('Registration failed - please try again');
        }
        return false;
      }

      if (!authData.user) {
        toast.error('Registration failed - no user data');
        return false;
      }

      console.log('Auth user created, creating database user...');

      // Create user in our database
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password_hash: 'supabase_auth', // Placeholder since we use Supabase Auth
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        });

      if (userError) {
        console.error('User creation error:', userError);
        // Clean up auth user if our user creation fails
        await supabase.auth.signOut();
        toast.error('Registration failed - database error');
        return false;
      }

      console.log('Database user created, creating default planet...');

      // Create default planet (don't wait for it)
      supabase
        .from('dev_planets')
        .insert({
          user_id: authData.user.id,
          name: `${username}'s Planet`,
        })
        .then(() => console.log('Default planet created'))
        .catch(err => console.error('Failed to create default planet:', err));

      // Award achievement for registering (don't wait for it)
      supabase
        .from('achievements')
        .insert({
          user_id: authData.user.id,
          achievement_id: 'beginning',
          name: 'The Beginning',
          description: 'User makes an account and Logs in',
          icon: 'user',
        })
        .then(() => console.log('Achievement awarded'))
        .catch(err => console.error('Failed to award achievement:', err));
      
      // Add welcome notifications
      if (addNotification) {
        addNotification({
          title: 'Welcome to DevVerse³!',
          message: 'Your planet has been created! 🌍',
          type: 'success'
        });
        
        addNotification({
          title: 'Achievement Unlocked!',
          message: 'The Beginning - You\'ve joined the galaxy! 🎉',
          type: 'success'
        });
      }
      
      console.log('Registration successful!');
      // The auth state change listener will handle setting the user data
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed - unexpected error');
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      // Add logout notification
      if (addNotification) {
        addNotification({
          title: 'Logged out',
          message: 'See you in the galaxy soon! 👋',
          type: 'info'
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (authState.user) {
      try {
        // Update user in database
        const { error } = await supabase
          .from('users')
          .update({
            username: updates.username,
            email: updates.email,
            avatar: updates.avatar,
            bio: updates.bio,
            location: updates.location,
            website: updates.website,
          })
          .eq('id', authState.user.id);

        if (error) {
          console.error('Error updating user:', error);
          toast.error('Failed to update profile');
          return;
        }

        // Update planet if provided
        if (updates.planet) {
          await supabase
            .from('dev_planets')
            .upsert({
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
            }, { onConflict: 'user_id' });
        }

        // Update projects if provided
        if (updates.projects) {
          // This is a simplified approach - in a real app you'd handle individual project updates
          for (const project of updates.projects) {
            if (!project.id.includes('temp')) { // Only update existing projects
              await supabase
                .from('projects')
                .upsert({
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
        
        // Add update notification
        if (addNotification) {
          addNotification({
            title: 'Profile Updated',
            message: 'Your profile has been successfully updated! ✨',
            type: 'success'
          });
        }
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
        loadUserProjects,
        loadUserPlanet,
        loadUserAchievements,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};