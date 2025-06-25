import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Github, Globe, Tag, Lock, Unlock } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { CreateProjectData } from '../../types';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(50, 'Name must be less than 50 characters'),
  description: z.string().min(1, 'Description is required').max(200, 'Description must be less than 200 characters'),
  language: z.string().min(1, 'Primary language is required'),
  githubUrl: z.string().url('Must be a valid GitHub URL').refine(
    (url) => url.includes('github.com'),
    'Must be a GitHub repository URL'
  ),
  homepage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  topics: z.string(),
  isPrivate: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectData) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
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
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      isPrivate: false,
      topics: '',
    },
  });

  const isPrivate = watch('isPrivate');

  const handleFormSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    try {
      const projectData: CreateProjectData = {
        ...data,
        topics: data.topics.split(',').map(tag => tag.trim()).filter(Boolean),
      };
      await onSubmit(projectData);
      reset();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const languages = [
    'TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
    'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Scala', 'R', 'MATLAB'
  ];

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
            initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateX: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl h-fit"
          >
            <GlassPanel glowColor="#00ffff">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-orbitron text-lg font-bold text-cyber-blue">
                  Create New Project
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      Project Name
                    </label>
                    <input
                      {...register('name')}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300 text-sm"
                      placeholder="My Awesome Project"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      Primary Language
                    </label>
                    <select
                      {...register('language')}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300 text-sm"
                    >
                      <option value="" className="bg-space-dark">Select Language</option>
                      {languages.map(lang => (
                        <option key={lang} value={lang} className="bg-space-dark">
                          {lang}
                        </option>
                      ))}
                    </select>
                    {errors.language && (
                      <p className="mt-1 text-xs text-red-400">{errors.language.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={2}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300 resize-none text-sm"
                    placeholder="Describe your project..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    GitHub Repository URL
                  </label>
                  <div className="relative">
                    <Github className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <input
                      {...register('githubUrl')}
                      className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300 text-sm"
                      placeholder="https://github.com/username/repository"
                    />
                  </div>
                  {errors.githubUrl && (
                    <p className="mt-1 text-xs text-red-400">{errors.githubUrl.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    Homepage URL (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <input
                      {...register('homepage')}
                      className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300 text-sm"
                      placeholder="https://your-project-demo.com"
                    />
                  </div>
                  {errors.homepage && (
                    <p className="mt-1 text-xs text-red-400">{errors.homepage.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    Topics (comma-separated)
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <input
                      {...register('topics')}
                      className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300 text-sm"
                      placeholder="react, typescript, web-development"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    type="button"
                    onClick={() => {
                      const checkbox = document.getElementById('isPrivate') as HTMLInputElement;
                      checkbox.click();
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                      isPrivate 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                        : 'bg-green-500/20 text-green-400 border border-green-500/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPrivate ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    <span>{isPrivate ? 'Private' : 'Public'}</span>
                  </motion.button>
                  <input
                    {...register('isPrivate')}
                    type="checkbox"
                    id="isPrivate"
                    className="hidden"
                  />
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
                    className="flex-1 bg-gradient-to-r from-cyber-blue to-cyber-pink px-4 py-2 rounded-lg font-orbitron font-bold text-white transition-all duration-300 disabled:opacity-50 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? 'Creating...' : 'Create Project'}
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