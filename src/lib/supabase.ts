import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase first.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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