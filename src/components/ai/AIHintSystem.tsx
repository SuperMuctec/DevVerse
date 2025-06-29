import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Sparkles, X, Brain, Zap, Target, Code, Gamepad2, Trophy, BookOpen } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';

interface AIHintSystemProps {
  problemTitle: string;
  problemDescription: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language?: string;
  arenaType?: 'coding' | 'design' | 'algorithm' | 'debugging' | 'optimization' | 'system-design' | 'database' | 'security' | 'general';
  onHintUsed: () => void;
  isHintUsed: boolean;
}

export const AIHintSystem: React.FC<AIHintSystemProps> = ({
  problemTitle,
  problemDescription,
  difficulty,
  language = 'javascript',
  arenaType = 'coding',
  onHintUsed,
  isHintUsed
}) => {
  const [showHint, setShowHint] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hint, setHint] = useState<string>('');

  const generateAIHint = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate contextual hints based on arena type, problem, and difficulty
    const hints = getContextualHints(problemTitle, problemDescription, difficulty, language, arenaType);
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    
    setHint(randomHint);
    setIsGenerating(false);
    setShowHint(true);
    onHintUsed();
  };

  const getContextualHints = (title: string, description: string, diff: string, lang: string, arena: string) => {
    // Arena-specific hint databases
    const arenaHints = {
      coding: getCodingHints(title, description, diff, lang),
      design: getDesignHints(title, description, diff),
      algorithm: getAlgorithmHints(title, description, diff),
      debugging: getDebuggingHints(title, description, diff, lang),
      optimization: getOptimizationHints(title, description, diff, lang),
      'system-design': getSystemDesignHints(title, description, diff),
      database: getDatabaseHints(title, description, diff),
      security: getSecurityHints(title, description, diff),
      general: getGeneralHints(title, description, diff)
    };

    return arenaHints[arena as keyof typeof arenaHints] || arenaHints.general;
  };

  // Coding Arena Hints
  const getCodingHints = (title: string, description: string, diff: string, lang: string) => {
    const specificHints: { [key: string]: string[] } = {
      'Two Sum': [
        `💡 Consider using a hash map to store numbers you've seen and their indices. This allows O(1) lookup time.`,
        `🎯 For each number, check if its complement (target - current) exists in your data structure.`,
        `⚡ Think about the trade-off between time and space complexity. Can you solve this in one pass?`,
        `🔍 Remember: you're looking for two numbers that add up to the target, not the numbers themselves.`
      ],
      'Palindrome': [
        `🔄 A palindrome reads the same forwards and backwards. Consider comparing characters from both ends.`,
        `📝 You can convert the number to a string, or work with the number directly using math operations.`,
        `⚖️ Two-pointer technique: start from both ends and move towards the center.`,
        `🚫 Edge case: negative numbers are typically not considered palindromes.`
      ],
      'Valid Parentheses': [
        `📚 Stack data structure is perfect for this problem - Last In, First Out (LIFO).`,
        `🔗 For every opening bracket, expect a corresponding closing bracket in the correct order.`,
        `✅ Push opening brackets onto the stack, pop when you find matching closing brackets.`,
        `❌ If stack is empty when trying to pop, or not empty at the end, parentheses are invalid.`
      ],
      'Binary Search': [
        `🎯 Divide and conquer: eliminate half of the search space in each iteration.`,
        `📊 Keep track of left and right boundaries, calculate middle point.`,
        `⚡ Time complexity should be O(log n) - much faster than linear search.`,
        `🔍 Handle edge cases: empty array, single element, target not found.`
      ]
    };

    // Check for specific problem patterns
    for (const [key, hints] of Object.entries(specificHints)) {
      if (title.toLowerCase().includes(key.toLowerCase())) {
        return hints;
      }
    }

    // Generic coding hints by difficulty
    const difficultyHints = {
      easy: [
        `🎯 Start with the brute force approach, then optimize if needed.`,
        `📝 Break down the problem into smaller, manageable steps.`,
        `🔍 Look for patterns in the examples provided.`,
        `💭 Think about what data structures might be helpful here.`,
        `🧪 Test your solution with the given examples first.`
      ],
      medium: [
        `🧠 Consider using hash maps, sets, or two-pointers technique.`,
        `⚡ Think about time complexity - can you do better than O(n²)?`,
        `🔄 Dynamic programming or greedy algorithms might be useful.`,
        `📊 Draw out the problem with examples to visualize the solution.`,
        `🎨 Sometimes the optimal solution requires a creative approach.`
      ],
      hard: [
        `🎓 This likely requires advanced algorithms or data structures.`,
        `🔬 Consider divide and conquer, or complex dynamic programming.`,
        `🌳 Tree or graph algorithms might be needed.`,
        `🧮 Mathematical insights or number theory could be key.`,
        `🚀 Think about edge cases and optimization techniques.`
      ]
    };

    const languageHints = {
      javascript: [
        `🟨 Use Array methods like map(), filter(), reduce() for cleaner code.`,
        `📦 Consider using Map() or Set() for O(1) lookups.`,
        `🔢 Remember that JavaScript has both == and === for comparisons.`,
        `⚡ Use destructuring and spread operators for elegant solutions.`
      ],
      python: [
        `🐍 List comprehensions and built-in functions can simplify your solution.`,
        `📚 Consider using collections.defaultdict or collections.Counter.`,
        `🔧 Python's slice notation can be very powerful for string/array problems.`,
        `🎯 Use enumerate() when you need both index and value.`
      ],
      rust: [
        `🦀 Use Vec<T> for dynamic arrays and HashMap for key-value storage.`,
        `🔒 Remember Rust's ownership rules - consider using references (&) when appropriate.`,
        `⚡ Use iterators and functional programming patterns for efficient solutions.`,
        `🛡️ Pattern matching with match statements can make your code more readable.`
      ]
    };

    return [...(difficultyHints[diff as keyof typeof difficultyHints] || difficultyHints.medium), 
            ...(languageHints[lang.toLowerCase() as keyof typeof languageHints] || [])];
  };

  // Design Arena Hints
  const getDesignHints = (title: string, description: string, diff: string) => {
    const designHints = {
      easy: [
        `🎨 Start with a clear visual hierarchy - what should users see first?`,
        `📱 Consider mobile-first design principles.`,
        `🎯 Focus on user experience - make it intuitive and accessible.`,
        `🌈 Choose a consistent color palette that reflects the brand.`,
        `📐 Use proper spacing and alignment for a professional look.`
      ],
      medium: [
        `🔄 Think about user flow - how will users navigate through the interface?`,
        `⚡ Consider performance implications of your design choices.`,
        `🎭 Use design patterns that users are already familiar with.`,
        `📊 Implement responsive design that works across all devices.`,
        `🎪 Add subtle animations to enhance user engagement.`
      ],
      hard: [
        `🏗️ Design for scalability - how will this work with thousands of users?`,
        `🔍 Consider accessibility standards (WCAG) for inclusive design.`,
        `🎯 Implement advanced interaction patterns and micro-interactions.`,
        `📈 Design with analytics and A/B testing in mind.`,
        `🌐 Consider internationalization and localization requirements.`
      ]
    };

    return designHints[diff as keyof typeof designHints] || designHints.medium;
  };

  // Algorithm Arena Hints
  const getAlgorithmHints = (title: string, description: string, diff: string) => {
    const algorithmHints = {
      easy: [
        `📊 Start by understanding the input and expected output format.`,
        `🔄 Consider if you need to iterate through data once or multiple times.`,
        `📝 Write out the algorithm steps in plain English first.`,
        `🎯 Look for simple patterns like sorting, searching, or counting.`,
        `⚡ Think about the most straightforward approach first.`
      ],
      medium: [
        `🧠 Consider divide and conquer strategies for complex problems.`,
        `📈 Analyze time and space complexity trade-offs.`,
        `🔍 Look for opportunities to use memoization or caching.`,
        `🌳 Tree and graph traversal algorithms might be applicable.`,
        `🎨 Sometimes a greedy approach can lead to optimal solutions.`
      ],
      hard: [
        `🎓 Advanced algorithms like dynamic programming might be needed.`,
        `🔬 Consider mathematical properties and number theory.`,
        `🌊 Flow algorithms or network optimization could be relevant.`,
        `🧮 Look for ways to reduce the problem to a known solved problem.`,
        `🚀 Think about approximation algorithms if exact solutions are too complex.`
      ]
    };

    return algorithmHints[diff as keyof typeof algorithmHints] || algorithmHints.medium;
  };

  // Debugging Arena Hints
  const getDebuggingHints = (title: string, description: string, diff: string, lang: string) => {
    const debuggingHints = {
      easy: [
        `🔍 Start by reading the error message carefully - it often tells you exactly what's wrong.`,
        `📝 Add console.log statements to trace the flow of your program.`,
        `🎯 Check for common issues: typos, missing semicolons, incorrect variable names.`,
        `📊 Verify that your variables contain the expected values at each step.`,
        `🔧 Use your browser's developer tools to inspect the code execution.`
      ],
      medium: [
        `🧠 Use the debugger to step through your code line by line.`,
        `🔄 Check for logical errors in your conditions and loops.`,
        `📈 Look for off-by-one errors in array indexing.`,
        `🎭 Verify that functions are being called with correct parameters.`,
        `⚡ Check for asynchronous issues - are you handling promises correctly?`
      ],
      hard: [
        `🎓 Use advanced debugging techniques like breakpoints and watch expressions.`,
        `🔬 Look for memory leaks or performance bottlenecks.`,
        `🌊 Check for race conditions in concurrent code.`,
        `🧮 Use profiling tools to identify performance issues.`,
        `🚀 Consider edge cases that might not be immediately obvious.`
      ]
    };

    return debuggingHints[diff as keyof typeof debuggingHints] || debuggingHints.medium;
  };

  // Optimization Arena Hints
  const getOptimizationHints = (title: string, description: string, diff: string, lang: string) => {
    const optimizationHints = {
      easy: [
        `⚡ Look for redundant operations that can be eliminated.`,
        `📊 Consider if you're doing unnecessary work in loops.`,
        `🎯 Cache results of expensive operations when possible.`,
        `📝 Use more efficient data structures for your use case.`,
        `🔍 Minimize DOM manipulations in web applications.`
      ],
      medium: [
        `🧠 Analyze your algorithm's time complexity - can you reduce it?`,
        `📈 Consider space-time trade-offs - sometimes using more memory saves time.`,
        `🔄 Look for opportunities to use lazy loading or pagination.`,
        `🎨 Implement efficient sorting and searching algorithms.`,
        `⚡ Use batch operations instead of individual operations when possible.`
      ],
      hard: [
        `🎓 Consider advanced optimization techniques like memoization or dynamic programming.`,
        `🔬 Profile your code to identify actual bottlenecks, not assumed ones.`,
        `🌊 Implement parallel processing or web workers for CPU-intensive tasks.`,
        `🧮 Use mathematical optimizations and algorithmic improvements.`,
        `🚀 Consider database query optimization and indexing strategies.`
      ]
    };

    return optimizationHints[diff as keyof typeof optimizationHints] || optimizationHints.medium;
  };

  // System Design Arena Hints
  const getSystemDesignHints = (title: string, description: string, diff: string) => {
    const systemDesignHints = {
      easy: [
        `🏗️ Start by identifying the core components and their responsibilities.`,
        `📊 Think about data flow between different parts of the system.`,
        `🎯 Consider the user journey and main use cases.`,
        `📝 Define clear interfaces between components.`,
        `🔍 Think about how different parts will communicate.`
      ],
      medium: [
        `🧠 Consider scalability requirements - how many users will this serve?`,
        `📈 Think about data storage and retrieval patterns.`,
        `🔄 Design for fault tolerance and error handling.`,
        `🎨 Consider caching strategies at different levels.`,
        `⚡ Think about load balancing and distribution strategies.`
      ],
      hard: [
        `🎓 Design for high availability and disaster recovery.`,
        `🔬 Consider microservices architecture and service boundaries.`,
        `🌊 Think about eventual consistency and distributed systems challenges.`,
        `🧮 Design monitoring, logging, and observability into the system.`,
        `🚀 Consider security, compliance, and data privacy requirements.`
      ]
    };

    return systemDesignHints[diff as keyof typeof systemDesignHints] || systemDesignHints.medium;
  };

  // Database Arena Hints
  const getDatabaseHints = (title: string, description: string, diff: string) => {
    const databaseHints = {
      easy: [
        `📊 Start by understanding the data relationships and entities.`,
        `🎯 Think about what queries you'll need to run frequently.`,
        `📝 Design your tables with proper primary and foreign keys.`,
        `🔍 Consider data types that best represent your information.`,
        `⚡ Think about data validation and constraints.`
      ],
      medium: [
        `🧠 Consider indexing strategies for better query performance.`,
        `📈 Think about normalization vs. denormalization trade-offs.`,
        `🔄 Design for data integrity and consistency.`,
        `🎨 Consider partitioning strategies for large datasets.`,
        `⚡ Think about backup and recovery strategies.`
      ],
      hard: [
        `🎓 Design for horizontal scaling and sharding.`,
        `🔬 Consider ACID properties and transaction management.`,
        `🌊 Think about replication strategies and consistency models.`,
        `🧮 Design for high availability and disaster recovery.`,
        `🚀 Consider performance monitoring and query optimization.`
      ]
    };

    return databaseHints[diff as keyof typeof databaseHints] || databaseHints.medium;
  };

  // Security Arena Hints
  const getSecurityHints = (title: string, description: string, diff: string) => {
    const securityHints = {
      easy: [
        `🔒 Always validate and sanitize user input.`,
        `🎯 Use HTTPS for all data transmission.`,
        `📝 Implement proper authentication and authorization.`,
        `🔍 Never store passwords in plain text - use proper hashing.`,
        `⚡ Keep your dependencies and frameworks up to date.`
      ],
      medium: [
        `🧠 Implement proper session management and CSRF protection.`,
        `📈 Use parameterized queries to prevent SQL injection.`,
        `🔄 Implement rate limiting and DDoS protection.`,
        `🎨 Use proper error handling that doesn't leak sensitive information.`,
        `⚡ Implement proper logging and monitoring for security events.`
      ],
      hard: [
        `🎓 Design for zero-trust architecture principles.`,
        `🔬 Implement advanced threat detection and response.`,
        `🌊 Consider cryptographic protocols and key management.`,
        `🧮 Design for compliance with security standards (SOC2, ISO27001).`,
        `🚀 Implement security testing and vulnerability assessment processes.`
      ]
    };

    return securityHints[diff as keyof typeof securityHints] || securityHints.medium;
  };

  // General Arena Hints
  const getGeneralHints = (title: string, description: string, diff: string) => {
    const generalHints = {
      easy: [
        `🎯 Break down the problem into smaller, manageable pieces.`,
        `📝 Start with a simple solution, then iterate and improve.`,
        `🔍 Look for patterns and examples in the problem description.`,
        `💭 Think about edge cases and how to handle them.`,
        `⚡ Test your solution with different inputs.`
      ],
      medium: [
        `🧠 Consider multiple approaches and compare their trade-offs.`,
        `📈 Think about scalability and maintainability.`,
        `🔄 Look for opportunities to reuse existing solutions or patterns.`,
        `🎨 Consider the user experience and usability aspects.`,
        `⚡ Think about performance implications of your choices.`
      ],
      hard: [
        `🎓 Research industry best practices and established patterns.`,
        `🔬 Consider long-term implications and future requirements.`,
        `🌊 Think about integration with existing systems and processes.`,
        `🧮 Consider monitoring, analytics, and continuous improvement.`,
        `🚀 Think about documentation and knowledge transfer.`
      ]
    };

    return generalHints[diff as keyof typeof generalHints] || generalHints.medium;
  };

  const getArenaIcon = (arena: string) => {
    switch (arena) {
      case 'coding': return <Code className="w-4 h-4" />;
      case 'design': return <Sparkles className="w-4 h-4" />;
      case 'algorithm': return <Target className="w-4 h-4" />;
      case 'debugging': return <Zap className="w-4 h-4" />;
      case 'optimization': return <Trophy className="w-4 h-4" />;
      case 'system-design': return <Brain className="w-4 h-4" />;
      case 'database': return <BookOpen className="w-4 h-4" />;
      case 'security': return <Lightbulb className="w-4 h-4" />;
      default: return <Gamepad2 className="w-4 h-4" />;
    }
  };

  const getArenaColor = (arena: string) => {
    switch (arena) {
      case 'coding': return '#00ffff';
      case 'design': return '#ff00ff';
      case 'algorithm': return '#ffff00';
      case 'debugging': return '#ff6600';
      case 'optimization': return '#00ff00';
      case 'system-design': return '#9d4edd';
      case 'database': return '#0099ff';
      case 'security': return '#ff0066';
      default: return '#ffffff';
    }
  };

  return (
    <>
      {!isHintUsed && (
        <motion.button
          onClick={generateAIHint}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(45deg, ${getArenaColor(arenaType)}, #9d4edd)`
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: `0 0 20px ${getArenaColor(arenaType)}50`
          }}
          whileTap={{ scale: 0.95 }}
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotateZ: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-4 h-4" />
              </motion.div>
              <span>AI Thinking...</span>
            </>
          ) : (
            <>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotateZ: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                {getArenaIcon(arenaType)}
              </motion.div>
              <span>Get AI Hint</span>
              <motion.div
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.3, 1]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Sparkles className="w-3 h-3" />
              </motion.div>
            </>
          )}
        </motion.button>
      )}

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
            onClick={() => setShowHint(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <GlassPanel glowColor={getArenaColor(arenaType)}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ 
                        rotateZ: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        rotateZ: { duration: 4, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                      style={{ color: getArenaColor(arenaType) }}
                    >
                      <Brain className="w-5 h-5" />
                    </motion.div>
                    <h3 className="font-orbitron text-lg font-bold" style={{ color: getArenaColor(arenaType) }}>
                      AI Hint
                    </h3>
                    <motion.div
                      animate={{ 
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.3, 1]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      {getArenaIcon(arenaType)}
                    </motion.div>
                  </div>
                  <motion.button
                    onClick={() => setShowHint(false)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4 text-white/70" />
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="p-4 rounded-lg border mb-4"
                  style={{ 
                    backgroundColor: `${getArenaColor(arenaType)}20`,
                    borderColor: `${getArenaColor(arenaType)}30`
                  }}
                >
                  <p className="text-white leading-relaxed">
                    {hint}
                  </p>
                </motion.div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-yellow-400 mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="font-semibold text-sm">One-Time Use</span>
                  </div>
                  <p className="text-yellow-300/80 text-sm">
                    You can only use one AI hint per challenge. Use it wisely!
                  </p>
                </div>
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};