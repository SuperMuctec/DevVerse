import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { toast } from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
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
    const storedUser = localStorage.getItem('devverse_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem('devverse_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem('devverse_users') || '[]');
      const user = users.find((u: any) => u.email === email);
      
      if (!user) {
        toast.error('User not found');
        return false;
      }

      // In production, use bcrypt to compare passwords
      if (user.password !== password) {
        toast.error('Invalid password');
        return false;
      }

      const { password: _, ...userWithoutPassword } = user;
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false,
      });

      localStorage.setItem('devverse_user', JSON.stringify(userWithoutPassword));
      
      // Award achievement for logging in
      const achievements = JSON.parse(localStorage.getItem(`achievements_${user.id}`) || '[]');
      if (!achievements.some((a: any) => a.id === 'beginning')) {
        const newAchievement = {
          id: 'beginning',
          name: 'The Beginning',
          description: 'User makes an account and Logs in',
          icon: 'user',
          unlockedAt: new Date()
        };
        achievements.push(newAchievement);
        localStorage.setItem(`achievements_${user.id}`, JSON.stringify(achievements));
        toast.success('Achievement unlocked: The Beginning! 🎉');
      }
      
      toast.success('Welcome back to DevVerse³!');
      return true;
    } catch (error) {
      toast.error('Login failed');
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('devverse_users') || '[]');
      
      // Check if email already exists
      if (users.some((u: any) => u.email === email)) {
        toast.error('Email already registered');
        return false;
      }

      // Check if username already exists
      if (users.some((u: any) => u.username === username)) {
        toast.error('Username already taken');
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password, // In production, hash with bcrypt
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        projects: [],
        joinedAt: new Date(),
        planet: {
          id: Date.now().toString(),
          name: `${username}'s Planet`,
          owner: username,
          stack: {
            languages: [],
            frameworks: [],
            tools: [],
            databases: []
          },
          position: [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5],
          color: '#00ffff',
          size: 1.0,
          rings: 1,
          achievements: [],
          likes: 0,
          views: 0,
          createdAt: new Date()
        }
      };

      users.push(newUser);
      localStorage.setItem('devverse_users', JSON.stringify(users));
      
      // Auto-login after registration
      const { password: _, ...userWithoutPassword } = newUser;
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false,
      });

      localStorage.setItem('devverse_user', JSON.stringify(userWithoutPassword));
      
      // Award achievement for registering
      const achievements = [{
        id: 'beginning',
        name: 'The Beginning',
        description: 'User makes an account and Logs in',
        icon: 'user',
        unlockedAt: new Date()
      }];
      localStorage.setItem(`achievements_${newUser.id}`, JSON.stringify(achievements));
      
      toast.success('Welcome to DevVerse³! Your planet has been created!');
      toast.success('Achievement unlocked: The Beginning! 🎉');
      return true;
    } catch (error) {
      toast.error('Registration failed');
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('devverse_user');
    toast.success('Logged out successfully');
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem('devverse_user', JSON.stringify(updatedUser));
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('devverse_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('devverse_users', JSON.stringify(users));
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};