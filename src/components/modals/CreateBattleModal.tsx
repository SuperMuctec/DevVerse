import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Trash2, Zap, Clock } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { CreateBattleData } from '../../types';

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

export const CreateBattleModal: React.FC<CreateBattleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<BattleFormData>({
    resolver: zodResolver(battleSchema),
    defaultValues: {
      difficulty: 'easy',
      timeLimit: 30,
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

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return '#00ff00';
      case 'medium': return '#ffff00';
      case 'hard': return '#ff0000';
      default: return '#ffffff';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl my-8"
          >
            <GlassPanel glowColor="#ff00ff">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-orbitron text-2xl font-bold text-cyber-pink">
                  Create Code Battle
                </h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-white/70" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Battle Title
                    </label>
                    <input
                      {...register('title')}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all duration-300"
                      placeholder="Two Sum Challenge"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Time Limit (minutes)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        {...register('timeLimit', { valueAsNumber: true })}
                        type="number"
                        min="5"
                        max="180"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all duration-300"
                        placeholder="30"
                      />
                    </div>
                    {errors.timeLimit && (
                      <p className="mt-1 text-sm text-red-400">{errors.timeLimit.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Battle Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all duration-300 resize-none"
                    placeholder="Describe the coding challenge..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Difficulty
                  </label>
                  <div className="flex space-x-4">
                    {['easy', 'medium', 'hard'].map((diff) => (
                      <motion.label
                        key={diff}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
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
                        <Zap className="w-4 h-4" style={{ color: getDifficultyColor(diff) }} />
                        <span className="capitalize font-semibold" style={{ color: getDifficultyColor(diff) }}>
                          {diff}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                  {errors.difficulty && (
                    <p className="mt-1 text-sm text-red-400">{errors.difficulty.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Problem Title
                  </label>
                  <input
                    {...register('problemTitle')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all duration-300"
                    placeholder="Two Sum"
                  />
                  {errors.problemTitle && (
                    <p className="mt-1 text-sm text-red-400">{errors.problemTitle.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Problem Description
                  </label>
                  <textarea
                    {...register('problemDescription')}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all duration-300 resize-none"
                    placeholder="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..."
                  />
                  {errors.problemDescription && (
                    <p className="mt-1 text-sm text-red-400">{errors.problemDescription.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-white/80">
                      Examples
                    </label>
                    <motion.button
                      type="button"
                      onClick={() => appendExample({ input: '', output: '', explanation: '' })}
                      className="flex items-center space-x-2 px-3 py-1 bg-cyber-blue/20 text-cyber-blue rounded-lg hover:bg-cyber-blue/30 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Example</span>
                    </motion.button>
                  </div>
                  
                  <div className="space-y-4">
                    {exampleFields.map((field, index) => (
                      <div key={field.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-white">Example {index + 1}</h4>
                          {exampleFields.length > 1 && (
                            <motion.button
                              type="button"
                              onClick={() => removeExample(index)}
                              className="p-1 text-red-400 hover:bg-red-400/20 rounded"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-white/60 mb-1">Input</label>
                            <input
                              {...register(`examples.${index}.input`)}
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue text-sm"
                              placeholder="nums = [2,7,11,15], target = 9"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/60 mb-1">Output</label>
                            <input
                              {...register(`examples.${index}.output`)}
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue text-sm"
                              placeholder="[0,1]"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <label className="block text-xs text-white/60 mb-1">Explanation (Optional)</label>
                          <input
                            {...register(`examples.${index}.explanation`)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue text-sm"
                            placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-white/80">
                      Constraints
                    </label>
                    <motion.button
                      type="button"
                      onClick={() => appendConstraint('')}
                      className="flex items-center space-x-2 px-3 py-1 bg-cyber-yellow/20 text-cyber-yellow rounded-lg hover:bg-cyber-yellow/30 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Constraint</span>
                    </motion.button>
                  </div>
                  
                  <div className="space-y-2">
                    {constraintFields.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <input
                          {...register(`constraints.${index}`)}
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-yellow focus:ring-1 focus:ring-cyber-yellow transition-all duration-300"
                          placeholder="2 <= nums.length <= 10^4"
                        />
                        {constraintFields.length > 1 && (
                          <motion.button
                            type="button"
                            onClick={() => removeConstraint(index)}
                            className="p-2 text-red-400 hover:bg-red-400/20 rounded"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-cyber-pink to-cyber-blue px-6 py-3 rounded-lg font-orbitron font-bold text-white transition-all duration-300 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? 'Creating Battle...' : 'Create Battle'}
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