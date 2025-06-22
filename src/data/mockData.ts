import { DevPlanet, Achievement, DevLog } from '../types';

export const mockPlanets: DevPlanet[] = [
  {
    id: '1',
    name: 'ReactSphere',
    owner: 'CodeMaster',
    stack: {
      languages: ['TypeScript', 'JavaScript', 'Python'],
      frameworks: ['React', 'Next.js', 'FastAPI'],
      tools: ['Vite', 'Docker', 'GitHub Actions'],
      databases: ['PostgreSQL', 'Redis']
    },
    position: [0, 0, 0],
    color: '#00ffff',
    size: 1.2,
    rings: 3,
    achievements: [],
    featured: true,
    likes: 1337,
    views: 5420,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'VueNebula',
    owner: 'DevNinja',
    stack: {
      languages: ['JavaScript', 'TypeScript', 'Go'],
      frameworks: ['Vue.js', 'Nuxt.js', 'Gin'],
      tools: ['Webpack', 'Kubernetes', 'GitLab CI'],
      databases: ['MongoDB', 'InfluxDB']
    },
    position: [5, 2, -3],
    color: '#00ff00',
    size: 1.0,
    rings: 2,
    achievements: [],
    featured: false,
    likes: 892,
    views: 3210,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    name: 'AngularOrb',
    owner: 'TechWizard',
    stack: {
      languages: ['TypeScript', 'Java', 'Kotlin'],
      frameworks: ['Angular', 'Spring Boot', 'Android'],
      tools: ['Gradle', 'Jenkins', 'AWS'],
      databases: ['MySQL', 'DynamoDB']
    },
    position: [-4, -1, 2],
    color: '#ff00ff',
    size: 1.1,
    rings: 4,
    achievements: [],
    featured: true,
    likes: 654,
    views: 2890,
    createdAt: new Date('2024-01-08')
  },
  {
    id: '4',
    name: 'PythonPlanet',
    owner: 'DataScientist',
    stack: {
      languages: ['Python', 'R', 'SQL'],
      frameworks: ['Django', 'Flask', 'TensorFlow'],
      tools: ['Jupyter', 'Docker', 'Apache Airflow'],
      databases: ['PostgreSQL', 'MongoDB', 'Redis']
    },
    position: [3, -2, 4],
    color: '#ffff00',
    size: 1.3,
    rings: 5,
    achievements: [],
    featured: false,
    likes: 1024,
    views: 4567,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '5',
    name: 'RustRealm',
    owner: 'SystemsGuru',
    stack: {
      languages: ['Rust', 'C++', 'Assembly'],
      frameworks: ['Actix', 'Tokio', 'Wasm'],
      tools: ['Cargo', 'LLVM', 'Valgrind'],
      databases: ['SQLite', 'RocksDB']
    },
    position: [-2, 3, -1],
    color: '#ff6600',
    size: 0.9,
    rings: 3,
    achievements: [],
    featured: true,
    likes: 777,
    views: 2345,
    createdAt: new Date('2024-01-05')
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'First Commit',
    description: 'Made your first commit to the galaxy',
    icon: 'git-commit',
    rarity: 'common'
  },
  {
    id: '2',
    name: 'Stack Master',
    description: 'Built a planet with 10+ technologies',
    icon: 'layers',
    rarity: 'rare'
  },
  {
    id: '3',
    name: 'Galaxy Explorer',
    description: 'Visited 50 different dev planets',
    icon: 'telescope',
    rarity: 'epic'
  },
  {
    id: '4',
    name: 'Code Constellation',
    description: 'Created a legendary tech stack',
    icon: 'stars',
    rarity: 'legendary'
  },
  {
    id: '5',
    name: 'Battle Champion',
    description: 'Won 10 code battles in the arena',
    icon: 'trophy',
    rarity: 'epic'
  },
  {
    id: '6',
    name: 'Community Star',
    description: 'Received 1000+ likes on your planet',
    icon: 'heart',
    rarity: 'rare'
  }
];

export const mockDevLogs: DevLog[] = [
  {
    id: '1',
    title: 'Building My First 3D Dev Planet',
    content: 'Today I started working on my dev planet visualization. The combination of React Three Fiber and TypeScript is incredible for creating interactive 3D experiences. I spent hours tweaking the orbital mechanics and getting the perfect glow effect for my planet rings. The hardest part was implementing the magnetic cursor that follows interactive elements - but the result is absolutely worth it!',
    author: 'CodeMaster',
    tags: ['React', 'Three.js', '3D', 'TypeScript'],
    createdAt: new Date('2024-01-15'),
    likes: 42
  },
  {
    id: '2',
    title: 'Optimizing Performance in the DevVerse',
    content: 'Performance optimization is crucial when dealing with multiple 3D objects. Here are my findings on instancing and LOD techniques that helped me render 100+ planets simultaneously without dropping frames. The key is using Three.js InstancedMesh for repeated geometries and implementing a proper frustum culling system.',
    author: 'DevNinja',
    tags: ['Performance', 'Optimization', 'WebGL'],
    createdAt: new Date('2024-01-10'),
    likes: 38
  },
  {
    id: '3',
    title: 'Code Battle Arena: Real-time Multiplayer Coding',
    content: 'Just finished implementing the code battle system! Using WebSockets for real-time synchronization and Monaco Editor for the coding interface. The trickiest part was creating a fair judging system that can handle multiple programming languages. Next up: adding spectator mode and tournament brackets!',
    author: 'TechWizard',
    tags: ['WebSockets', 'Real-time', 'Monaco', 'Multiplayer'],
    createdAt: new Date('2024-01-08'),
    likes: 67
  },
  {
    id: '4',
    title: 'Machine Learning Planet Recommendations',
    content: 'Implemented an AI system that recommends similar dev planets based on tech stack similarity. Using TensorFlow.js to run the model client-side for instant recommendations. The algorithm considers not just the technologies used, but also project complexity and developer experience level.',
    author: 'DataScientist',
    tags: ['AI', 'TensorFlow', 'Recommendations', 'Machine Learning'],
    createdAt: new Date('2024-01-12'),
    likes: 89
  },
  {
    id: '5',
    title: 'Rust-Powered Backend for Ultimate Performance',
    content: 'Migrated our backend from Node.js to Rust using Actix-web. The performance gains are incredible - 10x faster response times and 50% less memory usage. The type safety and zero-cost abstractions make it perfect for a high-performance platform like DevVerse³. Rust is definitely the future!',
    author: 'SystemsGuru',
    tags: ['Rust', 'Performance', 'Backend', 'Actix'],
    createdAt: new Date('2024-01-05'),
    likes: 156
  }
];