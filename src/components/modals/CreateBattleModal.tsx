import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Trash2, Zap, Clock, Sparkles } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { CreateBattleData } from '../../types';
import { toast } from 'react-hot-toast';

const battleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(300, 'Description must be less than 300 characters'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  timeLimit: z.number().min(5, 'Minimum 5 minutes').max(180, 'Maximum 3 hours'),
  problemTitle: z.string().min(1, 'Problem title is required'),
  problemDescription: z.string().min(1, 'Problem description is required'),
  examples: z.array(z.object({
    input: z.string().min(1, 'Input is required'),
    output: z.string().min(1, 'Output is required'),
    explanation: z.string().optional(),
  })).min(1, 'At least one example is required'),
  constraints: z.array(z.string().min(1, 'Constraint cannot be empty')).min(1, 'At least one constraint is required'),
});

type BattleFormData = z.infer<typeof battleSchema>;

interface CreateBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBattleData) => void;
}

// AI Challenge Generator
const generateAIChallenge = (difficulty: 'easy' | 'medium' | 'hard') => {
  const challenges = {
    easy: [
      {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
          }
        ],
        constraints: [
          "2 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "Only one valid answer exists."
        ]
      },
      {
        title: "Palindrome Number",
        description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
        examples: [
          {
            input: "x = 121",
            output: "true",
            explanation: "121 reads as 121 from left to right and from right to left."
          }
        ],
        constraints: [
          "-2^31 <= x <= 2^31 - 1"
        ]
      },
      {
        title: "Valid Parentheses",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        examples: [
          {
            input: "s = \"()\"",
            output: "true"
          },
          {
            input: "s = \"()[]{}\"",
            output: "true"
          }
        ],
        constraints: [
          "1 <= s.length <= 10^4",
          "s consists of parentheses only '()[]{}'."
        ]
      }
    ],
    medium: [
      {
        title: "Longest Substring Without Repeating Characters",
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        examples: [
          {
            input: "s = \"abcabcbb\"",
            output: "3",
            explanation: "The answer is \"abc\", with the length of 3."
          }
        ],
        constraints: [
          "0 <= s.length <= 5 * 10^4",
          "s consists of English letters, digits, symbols and spaces."
        ]
      },
      {
        title: "Add Two Numbers",
        description: "You are given two non-empty linked lists representing two non-negative integers. Add the two numbers and return the sum as a linked list.",
        examples: [
          {
            input: "l1 = [2,4,3], l2 = [5,6,4]",
            output: "[7,0,8]",
            explanation: "342 + 465 = 807."
          }
        ],
        constraints: [
          "The number of nodes in each linked list is in the range [1, 100].",
          "0 <= Node.val <= 9"
        ]
      },
      {
        title: "Container With Most Water",
        description: "Given n non-negative integers representing an elevation map, find two lines that together with the x-axis form a container that holds the most water.",
        examples: [
          {
            input: "height = [1,8,6,2,5,4,8,3,7]",
            output: "49",
            explanation: "The maximum area of water the container can store is 49."
          }
        ],
        constraints: [
          "n >= 2",
          "0 <= height[i] <= 3 * 10^4"
        ]
      }
    ],
    hard: [
      {
        title: "Median of Two Sorted Arrays",
        description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
        examples: [
          {
            input: "nums1 = [1,3], nums2 = [2]",
            output: "2.00000",
            explanation: "merged array = [1,2,3] and median is 2."
          }
        ],
        constraints: [
          "nums1.length == m",
          "nums2.length == n",
          "0 <= m <= 1000",
          "The overall run time complexity should be O(log (m+n))."
        ]
      },
      {
        title: "Regular Expression Matching",
        description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*'.",
        examples: [
          {
            input: "s = \"aa\", p = \"a*\"",
            output: "true",
            explanation: "'*' means zero or more of the preceding element, 'a'."
          }
        ],
        constraints: [
          "1 <= s.length <= 20",
          "1 <= p.length <= 30",
          "s contains only lowercase English letters."
        ]
      },
      {
        title: "Merge k Sorted Lists",
        description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        examples: [
          {
            input: "lists = [[1,4,5],[1,3,4],[2,6]]",
            output: "[1,1,2,3,4,4,5,6]",
            explanation: "The linked-lists are merged into one sorted list."
          }
        ],
        constraints: [
          "k == lists.length",
          "0 <= k <= 10^4",
          "0 <= lists[i].length <= 500"
        ]
      }
    ]
  };

  const difficultyPool = challenges[difficulty];
  return difficultyPool[Math.floor(Math.random() * difficultyPool.length)];
};

export const CreateBattleModal: React.FC<CreateBattleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<BattleFormData>({
    resolver: zodResolver(battleSchema),
    defaultValues: {
      difficulty: 'easy',
      timeLimit: 5,
      examples: [{ input: '', output: '', explanation: '' }],
      constraints: [''],
    },
  });

  const { fields: exampleFields, append: appendExample, remove: removeExample } = useFieldArray({
    control,
    name: 'examples',
  });

  const { fields: constraintFields, append: appendConstraint, remove: removeConstraint } = useFieldArray({
    control,
    name: 'constraints',
  });

  const difficulty = watch('difficulty');

  // Set time limits based on difficulty
  React.useEffect(() => {
    const timeLimits = {
      easy: 5,
      medium: 10,
      hard: 20
    };
    setValue('timeLimit', timeLimits[difficulty]);
  }, [difficulty, setValue]);

  const handleFormSubmit = async (data: BattleFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const generateChallenge = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const challenge = generateAIChallenge(difficulty);
      
      setValue('problemTitle', challenge.title);
      setValue('problemDescription', challenge.description);
      setValue('examples', challenge.examples);
      setValue('constraints', challenge.constraints);
      setValue('title', `${challenge.title} Challenge`);
      setValue('description', `AI-generated ${difficulty} level challenge: ${challenge.title}`);
      
      toast.success('🤖 AI Challenge Generated!');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return '#00ff00';
      case 'medium': return '#ffff00';
      case 'hard': return '#ff0000';
      default: return '#ffffff';
    }
  };

  const getTimeRange = (diff: string) => {
    switch (diff) {
      case 'easy': return '5 minutes';
      case 'medium': return '10 minutes';
      case 'hard': return '20-30 minutes';
      default: return '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center p-4 pt-52"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-7xl h-fit"
          >
            <GlassPanel glowColor="#ff00ff">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-orbitron text-lg font-bold text-cyber-pink">
                  Create AI Challenge
                </h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-white/70" />
                </motion.button>
              </div>

              {/* AI Challenge Generator */}
              <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h3 className="font-orbitron text-base font-bold text-purple-400">
                      AI Challenge Generator
                    </h3>
                  </div>
                  <motion.button
                    onClick={generateChallenge}
                    disabled={isGenerating}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isGenerating ? 'Generating...' : 'Generate Challenge'}</span>
                  </motion.button>
                </div>
                <p className="text-white/70 text-xs">
                  Let AI create a coding challenge based on your selected difficulty level. 
                  Time limit will be automatically set: {getTimeRange(difficulty)}
                </p>
              </div>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      Challenge Title
                    </label>
                    <input
                      {...register('title')}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all duration-300 text-sm"
                      placeholder="Two Sum Challenge"
                    />
                    {errors.title && (
                      <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      Time Limit (minutes)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        {...register('timeLimit', { valueAsNumber: true })}
                        type="number"
                        min="5"
                        max="180"
                        className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all duration-300 text-sm"
                        placeholder="30"
                      />
                    </div>
                    {errors.timeLimit && (
                      <p className="mt-1 text-xs text-red-400">{errors.timeLimit.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    Challenge Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={2}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all duration-300 resize-none text-sm"
                    placeholder="Describe the coding challenge..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    Difficulty
                  </label>
                  <div className="flex space-x-3">
                    {['easy', 'medium', 'hard'].map((diff) => (
                      <motion.label
                        key={diff}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                          difficulty === diff
                            ? 'border-2'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                        style={{
                          borderColor: difficulty === diff ? getDifficultyColor(diff) : 'transparent',
                          backgroundColor: difficulty === diff ? `${getDifficultyColor(diff)}20` : undefined,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <input
                          {...register('difficulty')}
                          type="radio"
                          value={diff}
                          className="hidden"
                        />
                        <Zap className="w-3 h-3" style={{ color: getDifficultyColor(diff) }} />
                        <div>
                          <span className="capitalize font-semibold text-sm" style={{ color: getDifficultyColor(diff) }}>
                            {diff}
                          </span>
                          <div className="text-xs text-white/60">
                            {getTimeRange(diff)}
                          </div>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                  {errors.difficulty && (
                    <p className="mt-1 text-xs text-red-400">{errors.difficulty.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    Problem Title
                  </label>
                  <input
                    {...register('problemTitle')}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all duration-300 text-sm"
                    placeholder="Two Sum"
                  />
                  {errors.problemTitle && (
                    <p className="mt-1 text-xs text-red-400">{errors.problemTitle.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    Problem Description
                  </label>
                  <textarea
                    {...register('problemDescription')}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all duration-300 resize-none text-sm"
                    placeholder="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..."
                  />
                  {errors.problemDescription && (
                    <p className="mt-1 text-xs text-red-400">{errors.problemDescription.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-medium text-white/80">
                      Examples
                    </label>
                    <motion.button
                      type="button"
                      onClick={() => appendExample({ input: '', output: '', explanation: '' })}
                      className="flex items-center space-x-1 px-2 py-1 bg-cyber-blue/20 text-cyber-blue rounded-lg hover:bg-cyber-blue/30 transition-colors text-xs"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Example</span>
                    </motion.button>
                  </div>
                  
                  <div className="space-y-3">
                    {exampleFields.map((field, index) => (
                      <div key={field.id} className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white text-sm">Example {index + 1}</h4>
                          {exampleFields.length > 1 && (
                            <motion.button
                              type="button"
                              onClick={() => removeExample(index)}
                              className="p-1 text-red-400 hover:bg-red-400/20 rounded"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </motion.button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-white/60 mb-1">Input</label>
                            <input
                              {...register(`examples.${index}.input`)}
                              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue text-xs"
                              placeholder="nums = [2,7,11,15], target = 9"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/60 mb-1">Output</label>
                            <input
                              {...register(`examples.${index}.output`)}
                              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue text-xs"
                              placeholder="[0,1]"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <label className="block text-xs text-white/60 mb-1">Explanation (Optional)</label>
                          <input
                            {...register(`examples.${index}.explanation`)}
                            className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue text-xs"
                            placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-medium text-white/80">
                      Constraints
                    </label>
                    <motion.button
                      type="button"
                      onClick={() => appendConstraint('')}
                      className="flex items-center space-x-1 px-2 py-1 bg-cyber-yellow/20 text-cyber-yellow rounded-lg hover:bg-cyber-yellow/30 transition-colors text-xs"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Constraint</span>
                    </motion.button>
                  </div>
                  
                  <div className="space-y-2">
                    {constraintFields.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <input
                          {...register(`constraints.${index}`)}
                          className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-yellow focus:ring-1 focus:ring-cyber-yellow transition-all duration-300 text-xs"
                          placeholder="2 <= nums.length <= 10^4"
                        />
                        {constraintFields.length > 1 && (
                          <motion.button
                            type="button"
                            onClick={() => removeConstraint(index)}
                            className="p-1 text-red-400 hover:bg-red-400/20 rounded"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-3">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-cyber-pink to-cyber-blue px-4 py-2 rounded-lg font-orbitron font-bold text-white transition-all duration-300 disabled:opacity-50 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? 'Creating Challenge...' : 'Create Challenge'}
                  </motion.button>
                </div>
              </form>
            </GlassPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};