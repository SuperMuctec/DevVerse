import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export const dbOps = {
  // Users
  async createUser(userData) {
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

  async getUserByEmail(email) {
    console.log('🔵 [DB] Getting user by email:', email);

    const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    
    if (error && error.code !== 'PGRST116') {
      console.error('❌ [DB] Error getting user by email:', error);
      throw error;
    }

    console.log('✅ [DB] User by email result:', data ? 'Found user' : 'No user found');
    return data;
  },

  async getUserByUsername(username) {
    console.log('🔵 [DB] getUserByUsername: Checking username =', username);

    try {
      // Simple query with timeout handling
      const { data, error } = await supabase
        .from('users')
        .select('id, username')
        .eq('username', username)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ [DB] Error querying username:', error);
        throw error;
      }

      console.log('✅ [DB] getUserByUsername result:', data ? 'Found' : 'Not found');
      return data;
    } catch (error) {
      console.error('❌ [DB] getUserByUsername failed:', error);
      // Return null to allow registration to continue
      return null;
    }
  },

  async getUserById(id) {
    console.log('🔵 [DB] Getting user by ID:', id);

    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ [DB] Error getting user by ID:', error);
      throw error;
    }

    console.log('✅ [DB] User by ID result:', data ? 'Found user' : 'No user found');
    return data;
  },

  async updateUser(id, updates) {
    console.log('🔵 [DB] Updating user with ID:', id);

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
    return data || [];
  },

  // Projects
  async createProject(projectData) {
    console.log('🔵 [DB] Creating project with data:', projectData);

    const { data, error } = await supabase
      .from('projects')
      .insert({
        id: projectData.id || uuidv4(),
        user_id: projectData.user_id,
        name: projectData.name,
        description: projectData.description,
        language: projectData.language,
        github_url: projectData.github_url,
        homepage: projectData.homepage,
        topics: projectData.topics || [],
        is_private: projectData.is_private || false,
        stars: projectData.stars || 0,
        forks: projectData.forks || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [DB] Error creating project:', error);
      throw error;
    }

    console.log('✅ [DB] Project created successfully:', data);
    return data;
  },

  async getProjectsByUserId(userId) {
    console.log('🔵 [DB] Getting projects for user ID:', userId);

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [DB] Error getting projects:', error);
      throw error;
    }

    console.log('✅ [DB] Projects retrieved successfully, count:', data?.length || 0);
    return data || [];
  },

  async updateProject(id, updates) {
    console.log('🔵 [DB] Updating project with ID:', id);

    const { error } = await supabase.from('projects').update(updates).eq('id', id);

    if (error) {
      console.error('❌ [DB] Error updating project:', error);
      throw error;
    }

    console.log('✅ [DB] Project updated successfully');
  },

  async deleteProject(id) {
    console.log('🔵 [DB] Deleting project with ID:', id);

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      console.error('❌ [DB] Error deleting project:', error);
      throw error;
    }

    console.log('✅ [DB] Project deleted successfully');
  },

  // Dev Planets
  async createOrUpdatePlanet(planetData) {
    console.log('🔵 [DB] Creating or updating planet with data:', planetData);

    const { data, error } = await supabase
      .from('dev_planets')
      .upsert({
        user_id: planetData.user_id,
        name: planetData.name || `${planetData.user_id}'s Planet`,
        stack_languages: planetData.stack_languages || [],
        stack_frameworks: planetData.stack_frameworks || [],
        stack_tools: planetData.stack_tools || [],
        stack_databases: planetData.stack_databases || [],
        color: planetData.color || '#00ffff',
        size: planetData.size || 1.0,
        rings: planetData.rings || 1,
        likes: planetData.likes || 0,
        views: planetData.views || 0,
        categories: planetData.categories || [],
      }, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [DB] Error creating/updating planet:', error);
      throw error;
    }

    console.log('✅ [DB] Planet created/updated successfully:', data);
    return data;
  },

  async getPlanetByUserId(userId) {
    console.log('🔵 [DB] Getting planet for user ID:', userId);

    const { data, error } = await supabase
      .from('dev_planets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ [DB] Error getting planet:', error);
      throw error;
    }

    console.log('✅ [DB] Planet retrieved successfully:', data ? 'Found planet' : 'No planet found');
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

    console.log('✅ [DB] All planets retrieved successfully, count:', data?.length || 0);
    return data || [];
  },

  async updatePlanet(id, updates) {
    console.log('🔵 [DB] Updating planet with ID:', id);

    const { error } = await supabase.from('dev_planets').update(updates).eq('id', id);

    if (error) {
      console.error('❌ [DB] Error updating planet:', error);
      throw error;
    }

    console.log('✅ [DB] Planet updated successfully');
  },

  // DevLogs
  async createDevLog(devLogData) {
    console.log('🔵 [DB] Creating devlog with data:', devLogData);

    const { data, error } = await supabase
      .from('devlogs')
      .insert({
        user_id: devLogData.user_id,
        title: devLogData.title,
        content: devLogData.content,
        tags: devLogData.tags || [],
        likes: devLogData.likes || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [DB] Error creating devlog:', error);
      throw error;
    }

    console.log('✅ [DB] DevLog created successfully:', data);
    return data;
  },

  async getDevLogsByUserId(userId) {
    console.log('🔵 [DB] Getting devlogs for user ID:', userId);

    const { data, error } = await supabase
      .from('devlogs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [DB] Error getting devlogs:', error);
      throw error;
    }

    console.log('✅ [DB] DevLogs retrieved successfully, count:', data?.length || 0);
    return data || [];
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

    console.log('✅ [DB] All devlogs retrieved successfully, count:', data?.length || 0);
    return data || [];
  },

  async updateDevLog(id, updates) {
    console.log('🔵 [DB] Updating devlog with ID:', id);

    const { error } = await supabase.from('devlogs').update(updates).eq('id', id);

    if (error) {
      console.error('❌ [DB] Error updating devlog:', error);
      throw error;
    }

    console.log('✅ [DB] DevLog updated successfully');
  },

  async deleteDevLog(id) {
    console.log('🔵 [DB] Deleting devlog with ID:', id);

    const { error } = await supabase.from('devlogs').delete().eq('id', id);

    if (error) {
      console.error('❌ [DB] Error deleting devlog:', error);
      throw error;
    }

    console.log('✅ [DB] DevLog deleted successfully');
  },

  // Achievements
  async createAchievement(achievementData) {
    console.log('🔵 [DB] Creating achievement with data:', achievementData);

    const { data, error } = await supabase
      .from('achievements')
      .insert({
        user_id: achievementData.user_id,
        achievement_id: achievementData.achievement_id,
        name: achievementData.name,
        description: achievementData.description,
        icon: achievementData.icon,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [DB] Error creating achievement:', error);
      throw error;
    }

    console.log('✅ [DB] Achievement created successfully:', data);
    return data;
  },

  async getAchievementsByUserId(userId) {
    console.log('🔵 [DB] Getting achievements for user ID:', userId);

    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) {
      console.error('❌ [DB] Error getting achievements:', error);
      throw error;
    }

    console.log('✅ [DB] Achievements retrieved successfully, count:', data?.length || 0);
    return data || [];
  },

  async deleteAchievement(id) {
    console.log('🔵 [DB] Deleting achievement with ID:', id);

    const { error } = await supabase.from('achievements').delete().eq('id', id);

    if (error) {
      console.error('❌ [DB] Error deleting achievement:', error);
      throw error;
    }

    console.log('✅ [DB] Achievement deleted successfully');
  },

  // Code Battles
  async createCodeBattle(battleData) {
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
        status: battleData.status || 'waiting',
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [DB] Error creating code battle:', error);
      throw error;
    }

    console.log('✅ [DB] Code battle created successfully:', data);
    return data;
  },

  async getCodeBattlesByUserId(userId) {
    console.log('🔵 [DB] Getting code battles for user ID:', userId);

    const { data, error } = await supabase
      .from('code_battles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [DB] Error getting code battles:', error);
      throw error;
    }

    console.log('✅ [DB] Code battles retrieved successfully, count:', data?.length || 0);
    return data || [];
  },

  async getAllCodeBattles() {
    console.log('🔵 [DB] Getting all code battles');

    const { data, error } = await supabase
      .from('code_battles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [DB] Error getting all code battles:', error);
      throw error;
    }

    console.log('✅ [DB] All code battles retrieved successfully, count:', data?.length || 0);
    return data || [];
  },

  async updateCodeBattle(id, updates) {
    console.log('🔵 [DB] Updating code battle with ID:', id);

    const { error } = await supabase.from('code_battles').update(updates).eq('id', id);

    if (error) {
      console.error('❌ [DB] Error updating code battle:', error);
      throw error;
    }

    console.log('✅ [DB] Code battle updated successfully');
  },

  async deleteCodeBattle(id) {
    console.log('🔵 [DB] Deleting code battle with ID:', id);

    const { error } = await supabase.from('code_battles').delete().eq('id', id);

    if (error) {
      console.error('❌ [DB] Error deleting code battle:', error);
      throw error;
    }

    console.log('✅ [DB] Code battle deleted successfully');
  },
};

export const getDatabaseStats = async () => {
  console.log('🔵 [DB] Getting database statistics');

  const stats = {
    users: 0,
    projects: 0,
    planets: 0,
    devlogs: 0,
    achievements: 0,
    battles: 0
  };

  try {
    console.log('📊 [DB] Fetching counts for all tables...');

    const [users, projects, planets, devlogs, achievements, battles] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('dev_planets').select('*', { count: 'exact', head: true }),
      supabase.from('devlogs').select('*', { count: 'exact', head: true }),
      supabase.from('achievements').select('*', { count: 'exact', head: true }),
      supabase.from('code_battles').select('*', { count: 'exact', head: true })
    ]);

    stats.users = users.count || 0;
    stats.projects = projects.count || 0;
    stats.planets = planets.count || 0;
    stats.devlogs = devlogs.count || 0;
    stats.achievements = achievements.count || 0;
    stats.battles = battles.count || 0;

    console.log('✅ [DB] Database statistics retrieved successfully');
  } catch (error) {
    console.error('❌ [DB] Failed to get database stats:', error);
  }

  return stats;
};