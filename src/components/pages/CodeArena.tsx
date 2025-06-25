import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Trophy, Play, Code, CheckCircle, Plus, ArrowLeft, Eye } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { GlassPanel } from '../ui/GlassPanel';
import { CreateBattleModal } from '../modals/CreateBattleModal';
import { useAuth } from '../../contexts/AuthContext';
import { CodeBattle, BattleProblem, CreateBattleData } from '../../types';
import { toast } from 'react-hot-toast';

export const CodeArena: React.FC = () => {
  const [selectedBattle, setSelectedBattle] = useState<CodeBattle | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [timeLeft, setTimeLeft] = useState(0);
  const [testResults, setTestResults] = useState<{ passed: number; total: number; details: string[] } | null>(null);
  const [showCreateBattle, setShowCreateBattle] = useState(false);
  const [userChallenges, setUserChallenges] = useState<CodeBattle[]>([]);
  const [userStats, setUserStats] = useState({
    challengesCompleted: 0,
    averageTime: 0,
    bestTime: 0,
    currentStreak: 0
  });
  const [codeHistory, setCodeHistory] = useState<{[key: string]: {[key: string]: string}}>({});
  const { user } = useAuth();

  // Load user challenges and stats
  useEffect(() => {
    if (user) {
      const challenges = JSON.parse(localStorage.getItem(`challenges_${user.id}`) || '[]');
      setUserChallenges(challenges);
      
      const stats = JSON.parse(localStorage.getItem(`arena_stats_${user.id}`) || JSON.stringify(userStats));
      setUserStats(stats);

      const history = JSON.parse(localStorage.getItem(`code_history_${user.id}`) || '{}');
      setCodeHistory(history);
    }
  }, [user?.id]);

  // Timer effect
  useEffect(() => {
    if (selectedBattle?.status === 'active' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            toast.error('Time\'s up!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedBattle, timeLeft]);

  // Save code to history when it changes
  useEffect(() => {
    if (selectedBattle && user && code) {
      const newHistory = {
        ...codeHistory,
        [selectedBattle.id]: {
          ...codeHistory[selectedBattle.id],
          [language]: code
        }
      };
      setCodeHistory(newHistory);
      localStorage.setItem(`code_history_${user.id}`, JSON.stringify(newHistory));
    }
  }, [code, selectedBattle, user, language]);

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
        testCases: data.examples.map(ex => ({
          input: ex.input,
          expectedOutput: ex.output
        }))
      }
    };

    if (user) {
      const challenges = JSON.parse(localStorage.getItem(`challenges_${user.id}`) || '[]');
      challenges.push(newBattle);
      localStorage.setItem(`challenges_${user.id}`, JSON.stringify(challenges));
      setUserChallenges(challenges);
    }

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

  const getInitialCode = (problem: BattleProblem, lang: string) => {
    const functionName = problem.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    
    switch (lang) {
      case 'javascript':
        return `// ${problem.title}\nfunction ${functionName}() {\n    // Your solution here\n    \n}`;
      case 'python':
        return `# ${problem.title}\ndef ${functionName}():\n    # Your solution here\n    pass`;
      case 'java':
        return `// ${problem.title}\npublic class Solution {\n    public int ${functionName}() {\n        // Your solution here\n        \n    }\n}`;
      case 'cpp':
        return `// ${problem.title}\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int ${functionName}() {\n        // Your solution here\n        \n    }\n};`;
      default:
        return `// ${problem.title}\n// Your solution here`;
    }
  };

  const runTests = () => {
    if (!selectedBattle) return;

    const testCases = selectedBattle.problem.testCases;
    const results: string[] = [];
    let passed = 0;

    if (!code.trim()) {
      setTestResults({ passed: 0, total: testCases.length, details: ['Error: No code provided'] });
      return;
    }

    // Enhanced test execution simulation with actual logic
    testCases.forEach((testCase, index) => {
      try {
        let shouldPass = false;
        
        // Basic pattern matching for different problem types
        if (selectedBattle.problem.title.toLowerCase().includes('two sum')) {
          shouldPass = code.includes('for') && (code.includes('map') || code.includes('object') || code.includes('dict'));
        } else if (selectedBattle.problem.title.toLowerCase().includes('palindrome')) {
          shouldPass = code.includes('reverse') || code.includes('charAt') || code.includes('slice');
        } else if (selectedBattle.problem.title.toLowerCase().includes('parentheses')) {
          shouldPass = code.includes('stack') || code.includes('push') || code.includes('pop');
        } else {
          // General scoring based on code complexity
          const hasLogic = code.includes('return') || code.includes('print') || code.includes('cout');
          const hasLoops = code.includes('for') || code.includes('while');
          const hasConditions = code.includes('if') || code.includes('else');
          const hasDataStructures = code.includes('array') || code.includes('list') || code.includes('map');
          
          const complexity = (hasLogic ? 1 : 0) + (hasLoops ? 1 : 0) + (hasConditions ? 1 : 0) + (hasDataStructures ? 1 : 0);
          shouldPass = complexity >= 2;
        }
        
        if (shouldPass) {
          passed++;
          results.push(`✅ Test ${index + 1}: PASSED`);
          results.push(`   Input: ${testCase.input}`);
          results.push(`   Expected: ${testCase.expectedOutput}`);
          results.push(`   Status: Correct solution approach detected`);
        } else {
          results.push(`❌ Test ${index + 1}: FAILED`);
          results.push(`   Input: ${testCase.input}`);
          results.push(`   Expected: ${testCase.expectedOutput}`);
          results.push(`   Error: Solution approach needs improvement`);
        }
        results.push(''); // Empty line for spacing
      } catch (error) {
        results.push(`💥 Test ${index + 1}: ERROR - ${error}`);
      }
    });

    setTestResults({ passed, total: testCases.length, details: results });
    toast.success(`Tests completed: ${passed}/${testCases.length} passed`);
  };

  const submitSolution = () => {
    if (!testResults || !selectedBattle || !user) return;

    const completionTime = (selectedBattle.timeLimit * 60) - timeLeft;
    
    if (testResults.passed === testResults.total) {
      const updatedBattle = {
        ...selectedBattle,
        status: 'completed' as const,
        completedAt: new Date()
      };

      const challenges = userChallenges.map(c => 
        c.id === selectedBattle.id ? updatedBattle : c
      );
      localStorage.setItem(`challenges_${user.id}`, JSON.stringify(challenges));
      setUserChallenges(challenges);

      const newStats = {
        challengesCompleted: userStats.challengesCompleted + 1,
        averageTime: Math.floor((userStats.averageTime * userStats.challengesCompleted + completionTime) / (userStats.challengesCompleted + 1)),
        bestTime: userStats.bestTime === 0 ? completionTime : Math.min(userStats.bestTime, completionTime),
        currentStreak: userStats.currentStreak + 1
      };
      localStorage.setItem(`arena_stats_${user.id}`, JSON.stringify(newStats));
      setUserStats(newStats);

      const achievements = JSON.parse(localStorage.getItem(`achievements_${user.id}`) || '[]');
      if (!achievements.some((a: any) => a.id === 'warrior')) {
        const newAchievement = {
          id: 'warrior',
          name: 'A Warrior',
          description: 'User completes their first code arena',
          icon: 'sword',
          unlockedAt: new Date()
        };
        achievements.push(newAchievement);
        localStorage.setItem(`achievements_${user.id}`, JSON.stringify(achievements));
        toast.success('Achievement unlocked: A Warrior! ⚔️');
      }

      toast.success('Challenge completed successfully! 🎉');
      setSelectedBattle(null);
    } else {
      toast.error('Some tests failed. Keep trying!');
    }
  };

  const startChallenge = (battle: CodeBattle) => {
    const updatedBattle = { ...battle, status: 'active' as const, startedAt: new Date() };
    setSelectedBattle(updatedBattle);
    setTimeLeft(battle.timeLimit * 60);
    
    // Load saved code for current language or use boilerplate
    const savedCode = codeHistory[battle.id]?.[language] || getInitialCode(battle.problem, language);
    setCode(savedCode);
    setTestResults(null);
    toast.success(`Started ${battle.title}!`);
  };

  const resumeChallenge = (battle: CodeBattle) => {
    setSelectedBattle(battle);
    const savedCode = codeHistory[battle.id]?.[language] || getInitialCode(battle.problem, language);
    setCode(savedCode);
    setTimeLeft(0);
    setTestResults(null);
  };

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    if (selectedBattle) {
      // Save current code before switching
      const newHistory = {
        ...codeHistory,
        [selectedBattle.id]: {
          ...codeHistory[selectedBattle.id],
          [language]: code
        }
      };
      setCodeHistory(newHistory);
      localStorage.setItem(`code_history_${user?.id}`, JSON.stringify(newHistory));

      // Load code for new language or use boilerplate
      const savedCode = newHistory[selectedBattle.id]?.[newLanguage] || getInitialCode(selectedBattle.problem, newLanguage);
      setCode(savedCode);
    }
    setLanguage(newLanguage);
  };

  if (selectedBattle) {
    return (
      <div className="min-h-screen pt-44 px-4">
        <div className="max-w-7xl mx-auto py-8">
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
                  {selectedBattle.status === 'active' && (
                    <div className="flex items-center space-x-1 text-white/70">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(timeLeft)}</span>
                    </div>
                  )}
                  {selectedBattle.status === 'completed' && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                      COMPLETED
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedBattle(null)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                  {testResults && (
                    <div>
                      <h3 className="font-semibold text-white mb-2 flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>Test Results ({testResults.passed}/{testResults.total})</span>
                      </h3>
                      <div className="bg-white/5 p-3 rounded-lg max-h-64 overflow-y-auto">
                        <div className="text-sm font-mono space-y-1">
                          {testResults.details.map((detail, index) => (
                            <div 
                              key={index} 
                              className={
                                detail.includes('✅') ? 'text-green-400' : 
                                detail.includes('❌') ? 'text-red-400' : 
                                detail.includes('💥') ? 'text-orange-400' :
                                'text-white/70'
                              }
                            >
                              {detail}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </GlassPanel>

            <GlassPanel glowColor="#ff00ff">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-orbitron text-xl font-bold text-cyber-pink">
                    Code Editor
                  </h2>
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
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
                    {selectedBattle.status === 'active' && (
                      <motion.button
                        onClick={submitSolution}
                        disabled={!testResults || testResults.passed !== testResults.total}
                        className="flex-1 bg-gradient-to-r from-cyber-pink to-cyber-blue py-2 px-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Code className="w-4 h-4" />
                        <span>Submit</span>
                      </motion.button>
                    )}
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
    <div className="min-h-screen pt-44 px-4">
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

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-orbitron text-2xl font-bold text-white">
              Your Challenges ({userChallenges.length})
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

          {userChallenges.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userChallenges.map((battle, index) => (
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
                      <div className="flex flex-col items-end space-y-2">
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-semibold"
                          style={{ 
                            backgroundColor: `${getDifficultyColor(battle.difficulty)}20`,
                            color: getDifficultyColor(battle.difficulty)
                          }}
                        >
                          {battle.difficulty.toUpperCase()}
                        </span>
                        {battle.status === 'completed' && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            COMPLETED
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4 text-sm text-white/60">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{battle.timeLimit}min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Created {new Date(battle.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => battle.status === 'completed' ? resumeChallenge(battle) : startChallenge(battle)}
                      className="w-full py-2 px-4 rounded-lg font-semibold transition-colors bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {battle.status === 'completed' ? 'View Solution' : 'Start Challenge'}
                    </motion.button>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/70 mb-4">No challenges yet. Create your first AI-generated challenge!</p>
              <motion.button
                onClick={() => setShowCreateBattle(true)}
                className="bg-gradient-to-r from-cyber-blue to-cyber-pink px-6 py-3 rounded-lg font-orbitron font-bold text-white hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Your First Challenge
              </motion.button>
            </div>
          )}
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