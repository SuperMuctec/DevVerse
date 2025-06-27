import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a fallback client for demo purposes
let supabase: any;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase environment variables not found. Creating mock client for demo.');
  
  // Create a mock Supabase client for demo purposes
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Demo mode - database not connected' } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Demo mode - database not connected' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      updateUser: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Demo mode - database not connected' } }),
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
        }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Demo mode - database not connected' } }),
        }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: { message: 'Demo mode - database not connected' } }),
      }),
      upsert: () => Promise.resolve({ error: { message: 'Demo mode - database not connected' } }),
    }),
    rpc: () => Promise.resolve({ error: { message: 'Demo mode - database not connected' } }),
  };
}

export { supabase };

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          password_hash: string;
          avatar: string | null;
          bio: string | null;
          location: string | null;
          website: string | null;
          xp: number;
          level: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          password_hash: string;
          avatar?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          xp?: number;
          level?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          password_hash?: string;
          avatar?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          xp?: number;
          level?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          language: string;
          github_url: string;
          homepage: string | null;
          topics: string[];
          is_private: boolean;
          stars: number;
          forks: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description: string;
          language: string;
          github_url: string;
          homepage?: string | null;
          topics?: string[];
          is_private?: boolean;
          stars?: number;
          forks?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          language?: string;
          github_url?: string;
          homepage?: string | null;
          topics?: string[];
          is_private?: boolean;
          stars?: number;
          forks?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      dev_planets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          stack_languages: string[];
          stack_frameworks: string[];
          stack_tools: string[];
          stack_databases: string[];
          color: string;
          size: number;
          rings: number;
          likes: number;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          stack_languages?: string[];
          stack_frameworks?: string[];
          stack_tools?: string[];
          stack_databases?: string[];
          color?: string;
          size?: number;
          rings?: number;
          likes?: number;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          stack_languages?: string[];
          stack_frameworks?: string[];
          stack_tools?: string[];
          stack_databases?: string[];
          color?: string;
          size?: number;
          rings?: number;
          likes?: number;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      devlogs: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          tags: string[];
          likes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          tags?: string[];
          likes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          tags?: string[];
          likes?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          name: string;
          description: string;
          icon: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          name: string;
          description: string;
          icon: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          name?: string;
          description?: string;
          icon?: string;
          unlocked_at?: string;
        };
      };
      code_battles: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          difficulty: string;
          time_limit: number;
          problem_title: string;
          problem_description: string;
          examples: any;
          constraints: string[];
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          difficulty: string;
          time_limit: number;
          problem_title: string;
          problem_description: string;
          examples?: any;
          constraints?: string[];
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          difficulty?: string;
          time_limit?: number;
          problem_title?: string;
          problem_description?: string;
          examples?: any;
          constraints?: string[];
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}