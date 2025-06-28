import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export const dbOps = {
  // Users
  async createUser(userData: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  }) {
    console.log('🔵 [DB] Creating user with data:', userData);
    
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [DB] Error creating user:', error);
      throw error;
    }
    
    console.log('✅ [DB] User created successfully:', data);
    return data.id;
  },

  async getUserByEmail(email: string) {
    console.log('🔵 [DB] Getting user by email:', email);
    
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('❌ [DB] Error getting user by email:', error);
      throw error;
    }
    
    console.log('✅ [DB] User by email result:', data ? 'Found user' : 'No user found');
    console.log('📊 [DB] User data:', data);
    return data;
  },

  async getUserByUsername(username: string) {
    console.log('🔵 [DB] Getting user by username:', username);
    
    const { data, error } = await supabase.from('users').select('*').eq('username', username).single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('❌ [DB] Error getting user by username:', error);
      throw error;
    }
    
    console.log('✅ [DB] User by username result:', data ? 'Found user' : 'No user found');
    console.log('📊 [DB] User data:', data);
    return data;
  },

  async getUserById(id: string) {
    console.log('🔵 [DB] Getting user by ID:', id);
    
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('❌ [DB] Error getting user by ID:', error);
      throw error;
    }
    
    console.log('✅ [DB] User by ID result:', data ? 'Found user' : 'No user found');
    console.log('📊 [DB] User data:', data);
    return data;
  },

  async updateUser(id: string, updates: any) {
    console.log('🔵 [DB] Updating user with ID:', id);
    console.log('📝 [DB] Update data:', updates);
    
    const { error } = await supabase.from('users').update(updates).eq('id', id);
    
    if (error) {
      console.error('❌ [DB] Error updating user:', error);
      throw error;
    }
    
    console.log('✅ [DB] User updated successfully');
  },

  async getAllUsers() {
    console.log('🔵 [DB] Getting all users');
    
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ [DB] Error getting all users:', error);
      throw error;
    }
    
    console.log('✅ [DB] All users retrieved successfully');
    console.log('📊 [DB] Users count:', data?.length || 0);
    console.log('📊 [DB] Users data:', data);
    return data || [];
  },

  // Projects
  async createProject(projectData: any) {
    console.log('🔵 [DB] Creating project with data:', projectData);
    
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

    if (error) {
      console.error('❌ [DB] Error creating project:', error);
      throw error;
    }
    
    console.log('✅ [DB] Project created successfully:', data);
    return data.id;
  },

  async getProjectsByUserId(userId: string) {
    console.log('🔵 [DB] Getting projects for user ID:', userId);
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [DB] Error getting projects by user ID:', error);
      throw error;
    }
    
    console.log('✅ [DB] Projects retrieved successfully');
    console.log('📊 [DB] Projects count:', data?.length || 0);
    console.log('📊 [DB] Projects data:', data);
    return data || [];
  },

  // Dev Planets
  async createOrUpdatePlanet(planetData: any) {
    console.log('🔵 [DB] Creating or updating planet with data:', planetData);
    
    const { data: existing } = await supabase
      .from('dev_planets')
      .select('id')
      .eq('user_id', planetData.user_id)
      .single();

    console.log('📊 [DB] Existing planet check result:', existing ? 'Found existing planet' : 'No existing planet');

    if (existing) {
      console.log('🔄 [DB] Updating existing planet');
      const updateData = {
        name: planetData.name,
        stack_languages: planetData.stack_languages || [],
        stack_frameworks: planetData.stack_frameworks || [],
        stack_tools: planetData.stack_tools || [],
        stack_databases: planetData.stack_databases || [],
        color: planetData.color || '#00ffff',
        size: planetData.size || 1.0,
        rings: planetData.rings || 1
      };
      console.log('📝 [DB] Planet update data:', updateData);
      
      const { error } = await supabase
        .from('dev_planets')
        .update(updateData)
        .eq('user_id', planetData.user_id);

      if (error) {
        console.error('❌ [DB] Error updating planet:', error);
        throw error;
      }
      console.log('✅ [DB] Planet updated successfully');
    } else {
      console.log('➕ [DB] Creating new planet');
      const insertData = {
        user_id: planetData.user_id,
        name: planetData.name,
        stack_languages: planetData.stack_languages || [],
        stack_frameworks: planetData.stack_frameworks || [],
        stack_tools: planetData.stack_tools || [],
        stack_databases: planetData.stack_databases || [],
        color: planetData.color || '#00ffff',
        size: planetData.size || 1.0,
        rings: planetData.rings || 1
      };
      console.log('📝 [DB] Planet insert data:', insertData);
      
      const { error } = await supabase
        .from('dev_planets')
        .insert(insertData);

      if (error) {
        console.error('❌ [DB] Error creating planet:', error);
        throw error;
      }
      console.log('✅ [DB] Planet created successfully');
    }
  },

  async getPlanetByUserId(userId: string) {
    console.log('🔵 [DB] Getting planet for user ID:', userId);
    
    const { data, error } = await supabase
      .from('dev_planets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ [DB] Error getting planet by user ID:', error);
      throw error;
    }
    
    console.log('✅ [DB] Planet by user ID result:', data ? 'Found planet' : 'No planet found');
    console.log('📊 [DB] Planet data:', data);
    return data;
  },

  async getAllPlanets() {
    console.log('🔵 [DB] Getting all planets');
    
    const { data, error } = await supabase
      .from('dev_planets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [DB] Error getting all planets:', error);
      throw error;
    }
    
    console.log('✅ [DB] All planets retrieved successfully');
    console.log('📊 [DB] Planets count:', data?.length || 0);
    console.log('📊 [DB] Planets data:', data);
    return data || [];
  },

  // DevLogs
  async createDevLog(devlogData: any) {
    console.log('🔵 [DB] Creating devlog with data:', devlogData);
    
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

    if (error) {
      console.error('❌ [DB] Error creating devlog:', error);
      throw error;
    }
    
    console.log('✅ [DB] DevLog created successfully:', data);
    return data.id;
  },

  async getAllDevLogs() {
    console.log('🔵 [DB] Getting all devlogs');
    
    const { data, error } = await supabase
      .from('devlogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [DB] Error getting all devlogs:', error);
      throw error;
    }
    
    console.log('✅ [DB] All devlogs retrieved successfully');
    console.log('📊 [DB] DevLogs count:', data?.length || 0);
    console.log('📊 [DB] DevLogs data:', data);
    return data || [];
  },

  // Achievements
  async createAchievement(achievementData: any) {
    console.log('🔵 [DB] Creating achievement with data:', achievementData);
    
    try {
      const { data, error } = await supabase
        .from('achievements')
        .insert({
          user_id: achievementData.user_id,
          achievement_id: achievementData.achievement_id,
          name: achievementData.name,
          description: achievementData.description,
          icon: achievementData.icon
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [DB] Error creating achievement:', error);
        throw error;
      }
      
      console.log('✅ [DB] Achievement created successfully:', data);
      return data.id;
    } catch (error: any) {
      if (error.code === '23505') {
        console.log('⚠️ [DB] Achievement already exists (duplicate key), skipping');
        return null;
      }
      console.error('❌ [DB] Unexpected error creating achievement:', error);
      throw error;
    }
  },

  async getAchievementsByUserId(userId: string) {
    console.log('🔵 [DB] Getting achievements for user ID:', userId);
    
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) {
      console.error('❌ [DB] Error getting achievements by user ID:', error);
      throw error;
    }
    
    console.log('✅ [DB] Achievements retrieved successfully');
    console.log('📊 [DB] Achievements count:', data?.length || 0);
    console.log('📊 [DB] Achievements data:', data);
    return data || [];
  },

  // Code Battles
  async createCodeBattle(battleData: any) {
    console.log('🔵 [DB] Creating code battle with data:', battleData);
    
    const { data, error } = await supabase
      .from('code_battles')
      .insert({
        user_id: battleData.user_id,
        title: battleData.title,
        description: battleData.description,
        difficulty: battleData.difficulty,
        time_limit: battleData.time_limit,
        problem_title: battleData.problem_title,
        problem_description: battleData.problem_description,
        examples: battleData.examples || [],
        constraints: battleData.constraints || [],
        status: battleData.status || 'waiting'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [DB] Error creating code battle:', error);
      throw error;
    }
    
    console.log('✅ [DB] Code battle created successfully:', data);
    return data.id;
  },

  async getCodeBattlesByUserId(userId: string) {
    console.log('🔵 [DB] Getting code battles for user ID:', userId);
    
    const { data, error } = await supabase
      .from('code_battles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [DB] Error getting code battles by user ID:', error);
      throw error;
    }
    
    console.log('✅ [DB] Code battles retrieved successfully');
    console.log('📊 [DB] Code battles count:', data?.length || 0);
    console.log('📊 [DB] Code battles data:', data);
    return data || [];
  }
};

export const getDatabaseStats = async () => {
  console.log('🔵 [DB] Getting database statistics');
  
  const stats = {
    users: 0,
    projects: 0,
    planets: 0,
    devlogs: 0,
    achievements: 0,
    battles: 0,
    size: 0
  };

  try {
    console.log('📊 [DB] Fetching counts for all tables...');
    
    const [usersCount, projectsCount, planetsCount, devlogsCount, achievementsCount, battlesCount] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('dev_planets').select('*', { count: 'exact', head: true }),
      supabase.from('devlogs').select('*', { count: 'exact', head: true }),
      supabase.from('achievements').select('*', { count: 'exact', head: true }),
      supabase.from('code_battles').select('*', { count: 'exact', head: true })
    ]);

    stats.users = usersCount.count || 0;
    stats.projects = projectsCount.count || 0;
    stats.planets = planetsCount.count || 0;
    stats.devlogs = devlogsCount.count || 0;
    stats.achievements = achievementsCount.count || 0;
    stats.battles = battlesCount.count || 0;
    
    console.log('✅ [DB] Database statistics retrieved successfully');
    console.log('📊 [DB] Statistics:', stats);
  } catch (error) {
    console.error('❌ [DB] Failed to get database stats:', error);
  }

  return stats;
};