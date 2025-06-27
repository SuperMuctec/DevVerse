import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Sparkles, X, Brain, Zap } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';

interface AIHintSystemProps {
  problemTitle: string;
  problemDescription: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  onHintUsed: () => void;
  isHintUsed: boolean;
}

export const AIHintSystem: React.FC<AIHintSystemProps> = ({
  problemTitle,
  problemDescription,
  difficulty,
  language,
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
    
    // Generate contextual hints based on problem and difficulty
    const hints = getContextualHints(problemTitle, problemDescription, difficulty, language);
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    
    setHint(randomHint);
    setIsGenerating(false);
    setShowHint(true);
    onHintUsed();
  };

  const getContextualHints = (title: string, description: string, diff: string, lang: string) => {
    const baseHints = {
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
      'Longest Substring': [
        `🪟 Sliding window technique: expand the window when characters are unique, shrink when duplicates appear.`,
        `📍 Use a hash set or map to track characters in the current window.`,
        `📏 Keep track of the maximum length seen so far as you slide the window.`,
        `🔄 When you find a duplicate, move the left pointer to eliminate the duplicate.`
      ]
    };

    // Find matching hints based on problem title
    for (const [key, hints] of Object.entries(baseHints)) {
      if (title.toLowerCase().includes(key.toLowerCase())) {
        return hints;
      }
    }

    // Generic hints based on difficulty and language
    const genericHints = {
      easy: [
        `🎯 Start with the brute force approach, then optimize if needed.`,
        `📝 Break down the problem into smaller, manageable steps.`,
        `🔍 Look for patterns in the examples provided.`,
        `💭 Think about what data structures might be helpful here.`
      ],
      medium: [
        `🧠 Consider using hash maps, sets, or two-pointers technique.`,
        `⚡ Think about time complexity - can you do better than O(n²)?`,
        `🔄 Dynamic programming or greedy algorithms might be useful.`,
        `📊 Draw out the problem with examples to visualize the solution.`
      ],
      hard: [
        `🎓 This likely requires advanced algorithms or data structures.`,
        `🔬 Consider divide and conquer, or complex dynamic programming.`,
        `🌳 Tree or graph algorithms might be needed.`,
        `🧮 Mathematical insights or number theory could be key.`
      ]
    };

    const languageHints = {
      javascript: [
        `🟨 Use Array methods like map(), filter(), reduce() for cleaner code.`,
        `📦 Consider using Map() or Set() for O(1) lookups.`,
        `🔢 Remember that JavaScript has both == and === for comparisons.`
      ],
      python: [
        `🐍 List comprehensions and built-in functions can simplify your solution.`,
        `📚 Consider using collections.defaultdict or collections.Counter.`,
        `🔧 Python's slice notation can be very powerful for string/array problems.`
      ],
      rust: [
        `🦀 Use Vec<T> for dynamic arrays and HashMap for key-value storage.`,
        `🔒 Remember Rust's ownership rules - consider using references (&) when appropriate.`,
        `⚡ Use iterators and functional programming patterns for efficient solutions.`,
        `🛡️ Pattern matching with match statements can make your code more readable.`
      ],
      java: [
        `☕ Use ArrayList for dynamic arrays and HashMap for key-value pairs.`,
        `🔄 Consider using StringBuilder for string manipulations.`,
        `📦 Java 8+ streams can make your code more functional and readable.`
      ],
      cpp: [
        `⚡ Use std::vector for dynamic arrays and std::unordered_map for hash tables.`,
        `🎯 Consider using auto keyword for type deduction.`,
        `🔧 STL algorithms like std::sort, std::find can be very helpful.`
      ]
    };

    const difficultyHints = genericHints[diff] || genericHints.medium;
    const langHints = languageHints[lang.toLowerCase()] || [];
    
    return [...difficultyHints, ...langHints];
  };

  return (
    <>
      {!isHintUsed && (
        <motion.button
          onClick={generateAIHint}
          disabled={isGenerating}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.5)'
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
                <Lightbulb className="w-4 h-4" />
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
              <GlassPanel glowColor="#9333ea">
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
                    >
                      <Brain className="w-5 h-5 text-purple-400" />
                    </motion.div>
                    <h3 className="font-orbitron text-lg font-bold text-purple-400">
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
                      <Sparkles className="w-4 h-4 text-pink-400" />
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
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/30 mb-4"
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