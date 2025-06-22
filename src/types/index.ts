export interface DevPlanet {
  id: string;
  name: string;
  owner: string;
  stack: TechStack;
  position: [number, number, number];
  color: string;
  size: number;
  rings: number;
  achievements: Achievement[];
  featured?: boolean;
  likes: number;
  views: number;
  createdAt: Date;
}

export interface TechStack {
  languages: string[];
  frameworks: string[];
  tools: string[];
  databases: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

export interface DevLog {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  createdAt: Date;
  likes: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  planet: DevPlanet;
  level: number;
  xp: number;
  projects: Project[];
  followers: number;
  following: number;
  bio?: string;
  location?: string;
  website?: string;
  joinedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  topics: string[];
  readme?: string;
  githubUrl: string;
  homepage?: string;
}

export interface CodeBattle {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in minutes
  participants: BattleParticipant[];
  status: 'waiting' | 'active' | 'completed';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  winner?: string;
  problem: BattleProblem;
}

export interface BattleParticipant {
  userId: string;
  username: string;
  avatar?: string;
  code: string;
  language: string;
  submittedAt?: Date;
  testsPassed: number;
  totalTests: number;
}

export interface BattleProblem {
  title: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CreateProjectData {
  name: string;
  description: string;
  language: string;
  githubUrl: string;
  homepage?: string;
  topics: string[];
  isPrivate: boolean;
}

export interface CreateBattleData {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  problemTitle: string;
  problemDescription: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
}

export interface CreateDevLogData {
  title: string;
  content: string;
  tags: string[];
}