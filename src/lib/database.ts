import initSqlJs from 'sql.js';
import { v4 as uuidv4 } from 'uuid';

let SQL: any = null;
let db: any = null;

// Initialize SQLite
export const initDatabase = async () => {
  if (SQL && db) return db;

  try {
    SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    });

    // Try to load existing database from localStorage
    const savedDb = localStorage.getItem('devverse_db');
    if (savedDb) {
      const uint8Array = new Uint8Array(JSON.parse(savedDb));
      db = new SQL.Database(uint8Array);
    } else {
      db = new SQL.Database();
      await createTables();
    }

    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

// Save database to localStorage
export const saveDatabase = () => {
  if (db) {
    const data = db.export();
    const buffer = Array.from(data);
    localStorage.setItem('devverse_db', JSON.stringify(buffer));
  }
};

// Create all tables
const createTables = async () => {
  const createTablesSQL = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar TEXT,
      bio TEXT,
      location TEXT,
      website TEXT,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Projects table
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      language TEXT NOT NULL,
      github_url TEXT NOT NULL,
      homepage TEXT,
      topics TEXT, -- JSON string
      is_private BOOLEAN DEFAULT 0,
      stars INTEGER DEFAULT 0,
      forks INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Dev planets table
    CREATE TABLE IF NOT EXISTS dev_planets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      stack_languages TEXT, -- JSON string
      stack_frameworks TEXT, -- JSON string
      stack_tools TEXT, -- JSON string
      stack_databases TEXT, -- JSON string
      color TEXT DEFAULT '#00ffff',
      size REAL DEFAULT 1.0,
      rings INTEGER DEFAULT 1,
      likes INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- DevLogs table
    CREATE TABLE IF NOT EXISTS devlogs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT, -- JSON string
      likes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Achievements table
    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      achievement_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, achievement_id)
    );

    -- Code battles table
    CREATE TABLE IF NOT EXISTS code_battles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
      time_limit INTEGER NOT NULL,
      problem_title TEXT NOT NULL,
      problem_description TEXT NOT NULL,
      examples TEXT, -- JSON string
      constraints TEXT, -- JSON string
      status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
    CREATE INDEX IF NOT EXISTS idx_dev_planets_user_id ON dev_planets(user_id);
    CREATE INDEX IF NOT EXISTS idx_devlogs_user_id ON devlogs(user_id);
    CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
    CREATE INDEX IF NOT EXISTS idx_code_battles_user_id ON code_battles(user_id);
  `;

  db.exec(createTablesSQL);
  saveDatabase();
};

// Database operations
export const dbOps = {
  // Users
  async createUser(userData: {
    username: string;
    email: string;
    password_hash: string;
    avatar?: string;
  }) {
    await initDatabase();
    const id = uuidv4();
    
    const stmt = db.prepare(`
      INSERT INTO users (id, username, email, password_hash, avatar)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run([
      id,
      userData.username,
      userData.email,
      userData.password_hash,
      userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`
    ]);
    
    stmt.free();
    saveDatabase();
    return id;
  },

  async getUserByEmail(email: string) {
    await initDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const result = stmt.getAsObject([email]);
    stmt.free();
    return Object.keys(result).length > 0 ? result : null;
  },

  async getUserByUsername(username: string) {
    await initDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const result = stmt.getAsObject([username]);
    stmt.free();
    return Object.keys(result).length > 0 ? result : null;
  },

  async getUserById(id: string) {
    await initDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const result = stmt.getAsObject([id]);
    stmt.free();
    return Object.keys(result).length > 0 ? result : null;
  },

  async updateUser(id: string, updates: any) {
    await initDatabase();
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    const stmt = db.prepare(`
      UPDATE users 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    stmt.run([...values, id]);
    stmt.free();
    saveDatabase();
  },

  async getAllUsers() {
    await initDatabase();
    const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  },

  // Projects
  async createProject(projectData: any) {
    await initDatabase();
    const id = uuidv4();
    
    const stmt = db.prepare(`
      INSERT INTO projects (id, user_id, name, description, language, github_url, homepage, topics, is_private, stars, forks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([
      id,
      projectData.user_id,
      projectData.name,
      projectData.description,
      projectData.language,
      projectData.github_url,
      projectData.homepage || null,
      JSON.stringify(projectData.topics || []),
      projectData.is_private ? 1 : 0,
      projectData.stars || 0,
      projectData.forks || 0
    ]);
    
    stmt.free();
    saveDatabase();
    return id;
  },

  async getProjectsByUserId(userId: string) {
    await initDatabase();
    const stmt = db.prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC');
    const results = [];
    while (stmt.step()) {
      const project = stmt.getAsObject();
      project.topics = JSON.parse(project.topics || '[]');
      results.push(project);
    }
    stmt.free();
    return results;
  },

  // Dev Planets
  async createOrUpdatePlanet(planetData: any) {
    await initDatabase();
    
    // Check if planet exists
    const existingStmt = db.prepare('SELECT id FROM dev_planets WHERE user_id = ?');
    const existing = existingStmt.getAsObject([planetData.user_id]);
    existingStmt.free();
    
    if (Object.keys(existing).length > 0) {
      // Update existing planet
      const stmt = db.prepare(`
        UPDATE dev_planets 
        SET name = ?, stack_languages = ?, stack_frameworks = ?, stack_tools = ?, stack_databases = ?, 
            color = ?, size = ?, rings = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `);
      
      stmt.run([
        planetData.name,
        JSON.stringify(planetData.stack_languages || []),
        JSON.stringify(planetData.stack_frameworks || []),
        JSON.stringify(planetData.stack_tools || []),
        JSON.stringify(planetData.stack_databases || []),
        planetData.color || '#00ffff',
        planetData.size || 1.0,
        planetData.rings || 1,
        planetData.user_id
      ]);
      
      stmt.free();
    } else {
      // Create new planet
      const id = uuidv4();
      const stmt = db.prepare(`
        INSERT INTO dev_planets (id, user_id, name, stack_languages, stack_frameworks, stack_tools, stack_databases, color, size, rings)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        id,
        planetData.user_id,
        planetData.name,
        JSON.stringify(planetData.stack_languages || []),
        JSON.stringify(planetData.stack_frameworks || []),
        JSON.stringify(planetData.stack_tools || []),
        JSON.stringify(planetData.stack_databases || []),
        planetData.color || '#00ffff',
        planetData.size || 1.0,
        planetData.rings || 1
      ]);
      
      stmt.free();
    }
    
    saveDatabase();
  },

  async getPlanetByUserId(userId: string) {
    await initDatabase();
    const stmt = db.prepare('SELECT * FROM dev_planets WHERE user_id = ?');
    const result = stmt.getAsObject([userId]);
    stmt.free();
    
    if (Object.keys(result).length > 0) {
      result.stack_languages = JSON.parse(result.stack_languages || '[]');
      result.stack_frameworks = JSON.parse(result.stack_frameworks || '[]');
      result.stack_tools = JSON.parse(result.stack_tools || '[]');
      result.stack_databases = JSON.parse(result.stack_databases || '[]');
      return result;
    }
    return null;
  },

  async getAllPlanets() {
    await initDatabase();
    const stmt = db.prepare('SELECT * FROM dev_planets ORDER BY created_at DESC');
    const results = [];
    while (stmt.step()) {
      const planet = stmt.getAsObject();
      planet.stack_languages = JSON.parse(planet.stack_languages || '[]');
      planet.stack_frameworks = JSON.parse(planet.stack_frameworks || '[]');
      planet.stack_tools = JSON.parse(planet.stack_tools || '[]');
      planet.stack_databases = JSON.parse(planet.stack_databases || '[]');
      results.push(planet);
    }
    stmt.free();
    return results;
  },

  // DevLogs
  async createDevLog(devlogData: any) {
    await initDatabase();
    const id = uuidv4();
    
    const stmt = db.prepare(`
      INSERT INTO devlogs (id, user_id, title, content, tags, likes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([
      id,
      devlogData.user_id,
      devlogData.title,
      devlogData.content,
      JSON.stringify(devlogData.tags || []),
      devlogData.likes || 0
    ]);
    
    stmt.free();
    saveDatabase();
    return id;
  },

  async getAllDevLogs() {
    await initDatabase();
    const stmt = db.prepare('SELECT * FROM devlogs ORDER BY created_at DESC');
    const results = [];
    while (stmt.step()) {
      const devlog = stmt.getAsObject();
      devlog.tags = JSON.parse(devlog.tags || '[]');
      results.push(devlog);
    }
    stmt.free();
    return results;
  },

  // Achievements
  async createAchievement(achievementData: any) {
    await initDatabase();
    const id = uuidv4();
    
    try {
      const stmt = db.prepare(`
        INSERT INTO achievements (id, user_id, achievement_id, name, description, icon)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        id,
        achievementData.user_id,
        achievementData.achievement_id,
        achievementData.name,
        achievementData.description,
        achievementData.icon
      ]);
      
      stmt.free();
      saveDatabase();
      return id;
    } catch (error) {
      // Achievement already exists, ignore
      return null;
    }
  },

  async getAchievementsByUserId(userId: string) {
    await initDatabase();
    const stmt = db.prepare('SELECT * FROM achievements WHERE user_id = ? ORDER BY unlocked_at DESC');
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  },

  // Code Battles
  async createCodeBattle(battleData: any) {
    await initDatabase();
    const id = uuidv4();
    
    const stmt = db.prepare(`
      INSERT INTO code_battles (id, user_id, title, description, difficulty, time_limit, problem_title, problem_description, examples, constraints, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([
      id,
      battleData.user_id,
      battleData.title,
      battleData.description,
      battleData.difficulty,
      battleData.time_limit,
      battleData.problem_title,
      battleData.problem_description,
      JSON.stringify(battleData.examples || []),
      JSON.stringify(battleData.constraints || []),
      battleData.status || 'waiting'
    ]);
    
    stmt.free();
    saveDatabase();
    return id;
  },

  async getCodeBattlesByUserId(userId: string) {
    await initDatabase();
    const stmt = db.prepare('SELECT * FROM code_battles WHERE user_id = ? ORDER BY created_at DESC');
    const results = [];
    while (stmt.step()) {
      const battle = stmt.getAsObject();
      battle.examples = JSON.parse(battle.examples || '[]');
      battle.constraints = JSON.parse(battle.constraints || '[]');
      results.push(battle);
    }
    stmt.free();
    return results;
  }
};