import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Trophy, Play, Code, CheckCircle, Plus } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { GlassPanel } from '../ui/GlassPanel';
import { CreateBattleModal } from '../modals/CreateBattleModal';
import { useAuth } from '../../contexts/AuthContext';
import { CodeBattle, BattleProblem, CreateBattleData } from '../../types';
import { toast } from 'react-hot-toast';

const mockBattleProblem: BattleProblem = {
  title: "Two Sum Challenge",
  description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]"
    }
  ],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Only one valid answer exists."
  ],
  testCases: [
    { input: "[2,7,11,15], 9", expectedOutput: "[0,1]" },
    { input: "[3,2,4], 6", expectedOutput: "[1,2]" },
    { input: "[3,3], 6", expectedOutput: "[0,1]" }
  ]
};

export const CodeArena: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'practice' | 'battle'>('practice');
  const [selectedBattle, setSelectedBattle] = useState<CodeBattle | null>(null);
  const [code, setCode] = useState('// Write your solution here\nfunction twoSum(nums, target) {\n    \n}');
  const [language, setLanguage] = useState('javascript');
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [testResults, setTestResults] = useState<{ passed: number; total: number } | null>(null);
  const [showCreateBattle, setShowCreateBattle] = useState(false);
  const [battles, setBattles] = useState<CodeBattle[]>([]);
  const [userStats, setUserStats] = useState({
    totalChallenges: 0,
    challengesCompleted: 0,
    averageTime: 0,
    bestTime: 0,
    currentStreak: 0
  });
  const { user } = useAuth();

  // Load user stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem(`arena_stats_${user?.id}`);
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  }, [user?.id]);

  // Save user stats to localStorage
  const saveUserStats = (newStats: typeof userStats) => {
    setUserStats(newStats);
    localStorage.setItem(`arena_stats_${user?.id}`, JSON.stringify(newStats));
  };

  useEffect(() => {
    if (activeTab === 'battle' && selectedBattle?.status === 'active') {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeTab, selectedBattle]);

  const handleCreateBattle = (data: CreateBattleData) => {
    const newBattle: CodeBattle = {
      id: Date.now().toString(),
      ...data,
      participants: [],
      status: 'waiting',
      createdAt: new Date(),
      problem: {
        title: data.problemTitle,
        description: data.problemDescription,
        examples: data.examples,
        constraints: data.constraints,
        testCases: [] // In a real app, this would be generated from examples
      }
    };

    setBattles(prev => [newBattle, ...prev]);
    toast.success('Challenge created successfully!');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#00ff00';
      case 'medium': return '#ffff00';
      case 'hard': return '#ff0000';
      default: return '#ffffff';
    }
  };

  const runTests = () => {
    // Simulate test execution
    const passed = Math.floor(Math.random() * 3) + 1;
    setTestResults({ passed, total: 3 });
    toast.success(`Tests completed: ${passed}/3 passed`);
  };

  const submitSolution = () => {
    const startTime = Date.now();
    runTests();
    
    if (testResults && testResults.passed === testResults.total) {
      const completionTime = Math.floor((Date.now() - startTime) / 1000);
      const newStats = {
        ...userStats,
        totalChallenges: userStats.totalChallenges + 1,
        challengesCompleted: userStats.challengesCompleted + 1,
        averageTime: Math.floor((userStats.averageTime * userStats.challengesCompleted + completionTime) / (userStats.challengesCompleted + 1)),
        bestTime: userStats.bestTime === 0 ? completionTime : Math.min(userStats.bestTime, completionTime),
        currentStreak: userStats.currentStreak + 1
      };
      saveUserStats(newStats);
      toast.success('Challenge completed successfully! 🎉');
    } else {
      toast.error('Some tests failed. Keep trying!');
    }
  };

  const startChallenge = (battle: CodeBattle) => {
    setSelectedBattle(battle);
    setActiveTab('battle');
    setTimeLeft(battle.timeLimit * 60);
    toast.success(`Started ${battle.title}!`);
  };

  if (activeTab === 'battle' && selectedBattle) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto py-8">
          {/* Battle Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-orbitron text-3xl font-bold text-white mb-2">
                  {selectedBattle.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm">
                  <span 
                    className="px-3 py-1 rounded-full font-semibold"
                    style={{ 
                      backgroundColor: `${getDifficultyColor(selectedBattle.difficulty)}20`,
                      color: getDifficultyColor(selectedBattle.difficulty)
                    }}
                  >
                    {selectedBattle.difficulty.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-1 text-white/70">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('practice')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                Back to Practice
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Problem Description */}
            <GlassPanel glowColor="#00ffff">
              <div className="h-full">
                <h2 className="font-orbitron text-xl font-bold text-cyber-blue mb-4">
                  Problem Statement
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-white mb-2">Description</h3>
                    <p className="text-white/80 leading-relaxed">
                      {selectedBattle.problem.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-2">Examples</h3>
                    {selectedBattle.problem.examples.map((example, index) => (
                      <div key={index} className="bg-white/5 p-3 rounded-lg mb-2">
                        <div className="font-mono text-sm">
                          <div className="text-cyber-green">Input: {example.input}</div>
                          <div className="text-cyber-pink">Output: {example.output}</div>
                          {example.explanation && (
                            <div className="text-white/70 mt-1">
                              Explanation: {example.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-2">Constraints</h3>
                    <ul className="text-white/80 text-sm space-y-1">
                      {selectedBattle.problem.constraints.map((constraint, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-cyber-blue mr-2">•</span>
                          {constraint}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </GlassPanel>

            {/* Code Editor */}
            <GlassPanel glowColor="#ff00ff">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-orbitron text-xl font-bold text-cyber-pink">
                    Code Editor
                  </h2>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-cyber-pink"
                  >
                    <option value="javascript" className="bg-space-dark">JavaScript</option>
                    <option value="python" className="bg-space-dark">Python</option>
                    <option value="java" className="bg-space-dark">Java</option>
                    <option value="cpp" className="bg-space-dark">C++</option>
                  </select>
                </div>

                <div className="flex-1 border border-white/20 rounded-lg overflow-hidden">
                  <Editor
                    height="400px"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </div>

                <div className="mt-4 space-y-3">
                  {testResults && (
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-cyber-green" />
                      <span className="text-white">
                        Tests passed: {testResults.passed}/{testResults.total}
                      </span>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <motion.button
                      onClick={runTests}
                      className="flex-1 bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play className="w-4 h-4" />
                      <span>Run Tests</span>
                    </motion.button>
                    <motion.button
                      onClick={submitSolution}
                      className="flex-1 bg-gradient-to-r from-cyber-pink to-cyber-blue py-2 px-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Code className="w-4 h-4" />
                      <span>Submit</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-orbitron text-5xl font-bold mb-4">
            <span className="neon-text text-cyber-blue">Code</span>{' '}
            <span className="neon-text text-cyber-pink">Arena</span>
          </h1>
          <p className="font-sora text-xl text-white/70">
            Practice coding challenges and improve your skills
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassPanel glowColor="#00ffff">
            <div className="text-center">
              <Zap className="w-8 h-8 text-cyber-blue mx-auto mb-2" />
              <div className="text-2xl font-orbitron font-bold text-cyber-blue">{userStats.challengesCompleted}</div>
              <div className="text-white/70 text-sm">Completed</div>
            </div>
          </GlassPanel>
          <GlassPanel glowColor="#ff00ff">
            <div className="text-center">
              <Trophy className="w-8 h-8 text-cyber-pink mx-auto mb-2" />
              <div className="text-2xl font-orbitron font-bold text-cyber-pink">{userStats.currentStreak}</div>
              <div className="text-white/70 text-sm">Current Streak</div>
            </div>
          </GlassPanel>
          <GlassPanel glowColor="#ffff00">
            <div className="text-center">
              <Clock className="w-8 h-8 text-cyber-yellow mx-auto mb-2" />
              <div className="text-2xl font-orbitron font-bold text-cyber-yellow">
                {userStats.averageTime > 0 ? `${Math.floor(userStats.averageTime / 60)}:${(userStats.averageTime % 60).toString().padStart(2, '0')}` : '--:--'}
              </div>
              <div className="text-white/70 text-sm">Avg Time</div>
            </div>
          </GlassPanel>
          <GlassPanel glowColor="#00ff00">
            <div className="text-center">
              <Clock className="w-8 h-8 text-cyber-green mx-auto mb-2" />
              <div className="text-2xl font-orbitron font-bold text-cyber-green">
                {userStats.bestTime > 0 ? `${Math.floor(userStats.bestTime / 60)}:${(userStats.bestTime % 60).toString().padStart(2, '0')}` : '--:--'}
              </div>
              <div className="text-white/70 text-sm">Best Time</div>
            </div>
          </GlassPanel>
        </div>

        {/* Practice Challenges */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-orbitron text-2xl font-bold text-white">
              Practice Challenges
            </h2>
            <motion.button
              onClick={() => setShowCreateBattle(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyber-blue to-cyber-pink px-6 py-3 rounded-lg font-orbitron font-bold hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              <span>Create Challenge</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {battles.map((battle, index) => (
              <motion.div
                key={battle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassPanel 
                  glowColor={getDifficultyColor(battle.difficulty)}
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-orbitron text-xl font-bold text-white mb-2">
                        {battle.title}
                      </h3>
                      <p className="text-white/70 text-sm mb-3">
                        {battle.description}
                      </p>
                    </div>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-semibold"
                      style={{ 
                        backgroundColor: `${getDifficultyColor(battle.difficulty)}20`,
                        color: getDifficultyColor(battle.difficulty)
                      }}
                    >
                      {battle.difficulty.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 mb-4 text-sm text-white/60">
                    <div className="flex items-center space-x-1">
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getDifficultyColor(battle.difficulty) }}
                      />
                      <span>{battle.difficulty}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{battle.timeLimit}min</span>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => startChallenge(battle)}
                    className="w-full py-2 px-4 rounded-lg font-semibold transition-colors bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Challenge
                  </motion.button>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>

        <CreateBattleModal
          isOpen={showCreateBattle}
          onClose={() => setShowCreateBattle(false)}
          onSubmit={handleCreateBattle}
        />
      </div>
    </div>
  );
};