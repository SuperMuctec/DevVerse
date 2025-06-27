import { supabase } from './supabase';

export const dbOps = {
  // Users
  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    avatar?: string;
  }) {
    const email = userData.email.trim().toLowerCase();
    const username = userData.username.trim().toLowerCase();
    const password = userData.password;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      if (
        authError.message.includes('User already registered') ||
        authError.status === 422
      ) {
        const { data: existingUserData, error: fetchError } =
          await supabase.auth.admin.getUserByEmail(email);
        if (fetchError || !existingUserData?.user?.id) throw authError;
        return existingUserData.user.id;
      }
      throw authError;
    }

    const userId = authData?.user?.id;
    if (!userId) throw new Error('Could not retrieve user ID from Supabase Auth');

    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        username,
        email,
        avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async getUserByUsername(username: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async updateUser(id: string, updates: Record<string, any>) {
    const { error } = await supabase.from('users').update(updates).eq('id', id);
    if (error) throw error;
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Projects
  async createProject(projectData: Record<string, any>) {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: projectData.user_id,
        name: projectData.name,
        description: projectData.description,
        language: projectData.language,
        github_url: projectData.github_url,
        homepage: projectData.homepage || null,
        topics: projectData.topics || [],
        is_private: projectData.is_private || false,
        stars: projectData.stars || 0,
        forks: projectData.forks || 0
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  async getProjectsByUserId(userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Dev Planets
  async createOrUpdatePlanet(planetData: Record<string, any>) {
    const { data: existing } = await supabase
      .from('dev_planets')
      .select('id')
      .eq('user_id', planetData.user_id)
      .single();

    const payload = {
      name: planetData.name,
      stack_languages: planetData.stack_languages || [],
      stack_frameworks: planetData.stack_frameworks || [],
      stack_tools: planetData.stack_tools || [],
      stack_databases: planetData.stack_databases || [],
      color: planetData.color || '#00ffff',
      size: planetData.size || 1.0,
      rings: planetData.rings || 1
    };

    const query = existing
      ? supabase.from('dev_planets').update(payload).eq('user_id', planetData.user_id)
      : supabase.from('dev_planets').insert({ user_id: planetData.user_id, ...payload });

    const { error } = await query;
    if (error) throw error;
  },

  async getPlanetByUserId(userId: string) {
    const { data, error } = await supabase
      .from('dev_planets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  async getAllPlanets() {
    const { data, error } = await supabase
      .from('dev_planets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // DevLogs
  async createDevLog(devlogData: Record<string, any>) {
    const { data, error } = await supabase
      .from('devlogs')
      .insert({
        user_id: devlogData.user_id,
        title: devlogData.title,
        content: devlogData.content,
        tags: devlogData.tags || [],
        likes: devlogData.likes || 0
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  async getAllDevLogs() {
    const { data, error } = await supabase
      .from('devlogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Achievements
  async createAchievement(achievementData: Record<string, any>) {
    try {
      const { data, error } = await supabase
        .from('achievements')
