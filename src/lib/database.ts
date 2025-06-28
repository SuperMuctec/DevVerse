import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export const dbOps = {
  // Test database connection with comprehensive auth debugging
  async testDatabaseInsert() {
    console.log('🔵 [DB] Testing database insert...');
    
    try {
      // First, check authentication state with correct syntax
      const sessionResponse = await supabase.auth.getSession();
      const session = sessionResponse.data.session;
      const sessionError = sessionResponse.error;
      
      console.log('🔍 [DB] Current session:', session ? 'Authenticated' : 'Not authenticated');
      console.log('🔍 [DB] Session error:', sessionError);
      console.log('🔍 [DB] User ID:', session?.user?.id);
      console.log('🔍 [DB] Access token present:', !!session?.access_token);
      
      // Check if we can access the table at all
      console.log('🔍 [DB] Testing table access...');
      const { data: testAccess, error: accessError } = await supabase
        .from('test')
        .select('count', { count: 'exact', head: true });
      
      console.log('🔍 [DB] Table access result:', { count: testAccess, error: accessError });
      
      if (accessError) {
        console.error('❌ [DB] Cannot access test table:', accessError);
        return { success: false, error: `Table access failed: ${accessError.message}` };
      }
      
      // Try to insert a record
      const testMessage = `Test record created at ${new Date().toISOString()}`;
      console.log('🔍 [DB] Attempting insert with message:', testMessage);
      
      const { data, error } = await supabase
        .from('test')
        .insert({
          message: testMessage
        })
        .select()
        .single();
      
      if (error) {
        console.error('❌ [DB] Test insert failed:', error);
        console.error('❌ [DB] Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return { success: false, error: error.message };
      }
      
      console.log('✅ [DB] Test insert successful:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ [DB] Test insert error:', error);
      return { success: false, error: error.message };
    }
  },

  // Simple test without authentication
  async testSimpleInsert() {
    console.log('🔵 [DB] Testing simple insert without auth check...');
    
    try {
      const testMessage = `Simple test at ${new Date().toISOString()}`;
      
      const { data, error } = await supabase
        .from('test')
        .insert({ message: testMessage })
        .select()
        .single();
      
      if (error) {
        console.error('❌ [DB] Simple insert failed:', error);
        return { success: false, error: error.message, details: error };
      }
      
      console.log('✅ [DB] Simple insert successful:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ [DB] Simple insert error:', error);
      return { success: false, error: error.message };
    }
  },

  // Test with manual authentication
  async testWithAuth(email = 'test@example.com', password = 'testpassword123') {
    console.log('🔵 [DB] Testing with manual authentication...');
    
    try {
      // Try to sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('🔍 [DB] Auth result:', { user: authData.user?.id, error: authError });
      
      if (authError) {
        console.log('🔍 [DB] Auth failed, trying to create test user...');
        
        // Try to create a test user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });
        
        console.log('🔍 [DB] SignUp result:', { user: signUpData.user?.id, error: signUpError });
        
        if (signUpError) {
          return { success: false, error: `Auth failed: ${signUpError.message}` };
        }
      }
      
      // Now try the database operation
      const insertResult = await this.testSimpleInsert();
      return insertResult;
      
    } catch (error) {
      console.error('❌ [DB] Auth test error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all test records
  async getTestRecords() {
    console.log('🔵 [DB] Getting test records...');
    
    try {
      const { data, error } = await supabase
        .from('test')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('❌ [DB] Error getting test records:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ [DB] Test records retrieved:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ [DB] Test records error:', error);
      return { success: false, error: error.message };
    }
  },

  // Test database connection
  async testConnection() {
    console.log('🔵 [DB] Testing database connection...');
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        console.error('❌ [DB] Connection test failed:', error);
        return false;
      }
      
      console.log('✅ [DB] Connection test successful, users count:', data);
      return true;
    } catch (error) {
      console.error('❌ [DB] Connection test error:', error);
      return false;
    }
  },

  // Users
  async createUser(userData) {
    console.log('🔵 [DB] Creating user with data:', userData);
    console.log('🔵 [DB] Full userData object:', JSON.stringify(userData, null, 2));

    try {
      // Test connection first
      const connectionOk = await this.testConnection();
      if (!connectionOk) {
        throw new Error('Database connection failed');
      }

      // Try a simple select first to test RLS
      console.log('🔵 [DB] Testing RLS with simple select...');
      const { data: testData, error: testError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      
      console.log('🔵 [DB] RLS test result:', { testData, testError });

      // Now try to insert the user
      const insertData = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        password_hash: userData.password_hash || 'supabase_auth_managed',
        avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
        bio: userData.bio || null,
        location: userData.location || null,
        website: userData.website || null,
        xp: userData.xp || 0,
        level: userData.level || 1
      };

      console.log('🔵 [DB] Attempting to insert:', JSON.stringify(insertData, null, 2));

      const { data, error } = await supabase
        .from('users')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('❌ [DB] Error creating user:', error);
        console.error('❌ [DB] Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('✅ [DB] User created successfully:', data);
      return data.id;
    } catch (error) {
      console.error('❌ [DB] Unexpected error in createUser:', error);
      throw error;
    }
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