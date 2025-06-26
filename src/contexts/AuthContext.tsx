import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { supabase } from '../lib/supabase';
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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user data from our users table
          const { data: userData, error } = await supabase
            .from('users')
            .select(`
              *,
              projects (*),
              dev_planets (*),
              achievements (*)
            `)
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user data:', error);
            // If user doesn't exist in our table but exists in auth, sign them out
            await supabase.auth.signOut();
            setAuthState(prev => ({ ...prev, isLoading: false }));
            return;
          }

          if (userData) {
            // Transform database data to match our User type
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
              projects: userData.projects || [],
              followers: 0,
              following: 0,
              joinedAt: new Date(userData.created_at),
              planet: userData.dev_planets?.[0] ? {
                id: userData.dev_planets[0].id,
                name: userData.dev_planets[0].name,
                owner: userData.username,
                stack: {
                  languages: userData.dev_planets[0].stack_languages || [],
                  frameworks: userData.dev_planets[0].stack_frameworks || [],
                  tools: userData.dev_planets[0].stack_tools || [],
                  databases: userData.dev_planets[0].stack_databases || [],
                },
                position: [0, 0, 0],
                color: userData.dev_planets[0].color,
                size: userData.dev_planets[0].size,
                rings: userData.dev_planets[0].rings,
                achievements: userData.achievements || [],
                likes: userData.dev_planets[0].likes,
                views: userData.dev_planets[0].views,
                createdAt: new Date(userData.dev_planets[0].created_at),
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
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

  const cleanupAuthUser = async (email: string) => {
    try {
      // First, try to sign in to get the user ID
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email,
        password: 'temp_password_for_cleanup'
      });

      if (signInData.user) {
        // Delete the auth user
        await supabase.auth.admin.deleteUser(signInData.user.id);
      }
    } catch (error) {
      // If we can't clean up, that's okay - we'll handle it in registration
      console.log('Could not cleanup auth user:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // First, check if user exists in our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, password_hash, username')
        .eq('email', email)
        .maybeSingle();

      if (userError) {
        console.error('Database error:', userError);
        toast.error('Login failed');
        return false;
      }

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

      // Sign in with Supabase Auth using a consistent password
      const authPassword = `devverse_${userData.id}`;
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: authPassword,
      });

      if (signInError) {
        console.error('Auth sign in error:', signInError);
        toast.error('Authentication failed');
        return false;
      }

      // Award achievement for logging in
      await supabase
        .from('achievements')
        .upsert({
          user_id: userData.id,
          achievement_id: 'beginning',
          name: 'The Beginning',
          description: 'User makes an account and Logs in',
          icon: 'user',
        }, { onConflict: 'user_id,achievement_id' });
      
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
      // Check if email or username already exists in our users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .or(`email.eq.${email},username.eq.${username}`)
        .maybeSingle();

      if (existingUser) {
        toast.error('Email or username already exists');
        return false;
      }

      // Hash password for our database
      const passwordHash = await bcrypt.hash(password, 10);

      // Generate a unique user ID
      const userId = crypto.randomUUID();
      const authPassword = `devverse_${userId}`;

      // Try to create user in Supabase Auth first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: authPassword,
      });

      // If auth user already exists, try to handle it
      if (authError && authError.message.includes('User already registered')) {
        // Try to sign in with various possible passwords to find the existing user
        let existingAuthUser = null;
        
        // Try signing in with the new auth password
        const { data: signInData1 } = await supabase.auth.signInWithPassword({
          email,
          password: authPassword,
        });
        
        if (signInData1.user) {
          existingAuthUser = signInData1.user;
        } else {
          // Try with the original password
          const { data: signInData2 } = await supabase.auth.signInWithPassword({
            email,
            password: password,
          });
          
          if (signInData2.user) {
            existingAuthUser = signInData2.user;
            // Update password to our system
            await supabase.auth.updateUser({ password: authPassword });
          }
        }

        if (existingAuthUser) {
          // Check if user exists in our table
          const { data: existingUserData } = await supabase
            .from('users')
            .select('id')
            .eq('id', existingAuthUser.id)
            .maybeSingle();

          if (existingUserData) {
            toast.error('User already exists');
            return false;
          }

          // Create user in our table with the existing auth user's ID
          const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert({
              id: existingAuthUser.id,
              username,
              email,
              password_hash: passwordHash,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            })
            .select()
            .single();

          if (userError) {
            console.error('User creation error:', userError);
            await supabase.auth.signOut();
            toast.error('Registration failed');
            return false;
          }

          // Create default planet and achievement
          await Promise.all([
            supabase.from('dev_planets').insert({
              user_id: newUser.id,
              name: `${username}'s Planet`,
            }),
            supabase.from('achievements').insert({
              user_id: newUser.id,
              achievement_id: 'beginning',
              name: 'The Beginning',
              description: 'User makes an account and Logs in',
              icon: 'user',
            })
          ]);

          toast.success('Welcome to DevVerse³! Your account has been set up!');
          toast.success('Achievement unlocked: The Beginning! 🎉');
          return true;
        } else {
          toast.error('Registration failed - unable to create account');
          return false;
        }
      }

      if (authError) {
        console.error('Auth creation error:', authError);
        toast.error('Registration failed');
        return false;
      }

      if (!authData.user) {
        toast.error('Registration failed');
        return false;
      }

      // Create user in our users table
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          username,
          email,
          password_hash: passwordHash,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        })
        .select()
        .single();

      if (userError) {
        console.error('User creation error:', userError);
        // Clean up auth user if our user creation fails
        await supabase.auth.signOut();
        toast.error('Registration failed');
        return false;
      }

      // Create default planet and achievement
      await Promise.all([
        supabase.from('dev_planets').insert({
          user_id: newUser.id,
          name: `${username}'s Planet`,
        }),
        supabase.from('achievements').insert({
          user_id: newUser.id,
          achievement_id: 'beginning',
          name: 'The Beginning',
          description: 'User makes an account and Logs in',
          icon: 'user',
        })
      ]);
      
      toast.success('Welcome to DevVerse³! Your planet has been created!');
      toast.success('Achievement unlocked: The Beginning! 🎉');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
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
      toast.success('Logged out successfully');
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
            }, { onConflict: 'user_id' });
        }

        // Update projects if provided
        if (updates.projects) {
          for (const project of updates.projects) {
            if (!project.id.includes('temp')) {
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