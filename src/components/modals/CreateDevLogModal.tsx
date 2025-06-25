import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, FileText, Tag } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { CreateDevLogData } from '../../types';

const devLogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  content: z.string().min(1, 'Content is required').max(2000, 'Content must be less than 2000 characters'),
  tags: z.string(),
});

type DevLogFormData = z.infer<typeof devLogSchema>;

interface CreateDevLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDevLogData) => void;
}

export const CreateDevLogModal: React.FC<CreateDevLogModalProps> = ({
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
    watch,
  } = useForm<DevLogFormData>({
    resolver: zodResolver(devLogSchema),
    defaultValues: {
      tags: '',
    },
  });

  const content = watch('content');
  const contentLength = content?.length || 0;

  const handleFormSubmit = async (data: DevLogFormData) => {
    setIsLoading(true);
    try {
      const devLogData: CreateDevLogData = {
        ...data,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };
      await onSubmit(devLogData);
      reset();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center p-4 pt-40"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateZ: -5 }}
            animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateZ: 5 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl h-fit"
          >
            <GlassPanel glowColor="#ffff00">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-orbitron text-lg font-bold text-cyber-yellow">
                  Create DevLog Entry
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

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    DevLog Title
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <input
                      {...register('title')}
                      className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-yellow focus:ring-1 focus:ring-cyber-yellow transition-all duration-300 text-sm"
                      placeholder="Building My First 3D Dev Planet"
                    />
                  </div>
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-white/80">
                      Content
                    </label>
                    <span className={`text-xs ${contentLength > 1800 ? 'text-red-400' : 'text-white/60'}`}>
                      {contentLength}/2000
                    </span>
                  </div>
                  <textarea
                    {...register('content')}
                    rows={8}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-yellow focus:ring-1 focus:ring-cyber-yellow transition-all duration-300 resize-none text-sm"
                    placeholder="Share your development journey, insights, challenges, and breakthroughs..."
                  />
                  {errors.content && (
                    <p className="mt-1 text-xs text-red-400">{errors.content.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    Tags (comma-separated)
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <input
                      {...register('tags')}
                      className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-yellow focus:ring-1 focus:ring-cyber-yellow transition-all duration-300 text-sm"
                      placeholder="React, Three.js, 3D, TypeScript"
                    />
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
                    className="flex-1 bg-gradient-to-r from-cyber-yellow to-cyber-pink px-4 py-2 rounded-lg font-orbitron font-bold text-white transition-all duration-300 disabled:opacity-50 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? 'Publishing...' : 'Publish DevLog'}
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