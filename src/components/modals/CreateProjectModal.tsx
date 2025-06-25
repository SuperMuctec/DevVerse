import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Github, Globe, Tag, Lock, Unlock, ArrowLeft, ArrowRight } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger,
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
      setCurrentPage(1);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const languages = [
    'TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
    'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Scala', 'R', 'MATLAB'
  ];

  const nextPage = async () => {
    let fieldsToValidate: (keyof ProjectFormData)[] = [];
    
    switch (currentPage) {
      case 1:
        fieldsToValidate = ['name', 'description', 'language'];
        break;
      case 2:
        fieldsToValidate = ['githubUrl'];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    setCurrentPage(prev => prev - 1);
  };

  const handleClose = () => {
    setCurrentPage(1);
    reset();
    onClose();
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">
                Project Name
              </label>
              <input
                {...register('name')}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300 text-xs"
                placeholder="My Awesome Project"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300 resize-none text-xs"
                placeholder="A brief description of your project..."
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">
                Primary Language
              </label>
              <select
                {...register('language')}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300 text-xs"
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
        );

      case 2:
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">
                GitHub Repository URL
              </label>
              <div className="relative">
                <Github className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-white/50" />
                <input
                  {...register('githubUrl')}
                  className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300 text-xs"
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
                <Globe className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-white/50" />
                <input
                  {...register('homepage')}
                  className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300 text-xs"
                  placeholder="https://your-project-demo.com"
                />
              </div>
              {errors.homepage && (
                <p className="mt-1 text-xs text-red-400">{errors.homepage.message}</p>
              )}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <h3 className="font-semibold text-blue-400 mb-1 text-xs">📋 Repository Requirements</h3>
              <ul className="text-xs text-white/70 space-y-1">
                <li>• Make sure your repository is accessible</li>
                <li>• Include a README.md with project description</li>
                <li>• Add proper documentation for setup instructions</li>
                <li>• Consider adding screenshots or demo links</li>
              </ul>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">
                Topics (comma-separated)
              </label>
              <div className="relative">
                <Tag className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-white/50" />
                <input
                  {...register('topics')}
                  className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300 text-xs"
                  placeholder="react, typescript, web-development, api"
                />
              </div>
              <p className="mt-1 text-xs text-white/60">
                Add relevant topics to help others discover your project
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">
                Visibility
              </label>
              <div className="flex items-center space-x-3">
                <motion.button
                  type="button"
                  onClick={() => {
                    const checkbox = document.getElementById('isPrivate') as HTMLInputElement;
                    checkbox.click();
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-xs border-2 ${
                    isPrivate 
                      ? 'bg-red-500/20 text-red-400 border-red-500/50' 
                      : 'bg-green-500/20 text-green-400 border-green-500/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isPrivate ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  <div>
                    <span className="font-semibold">{isPrivate ? 'Private' : 'Public'}</span>
                    <p className="text-xs opacity-80">
                      {isPrivate 
                        ? 'Only you can see this project' 
                        : 'Anyone can discover this project'
                      }
                    </p>
                  </div>
                </motion.button>
                <input
                  {...register('isPrivate')}
                  type="checkbox"
                  id="isPrivate"
                  className="hidden"
                />
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <h3 className="font-semibold text-green-400 mb-1 text-xs">🚀 Ready to Showcase!</h3>
              <p className="text-xs text-white/70">
                Your project will be added to your profile and visible in the DevVerse³ community. 
                Other developers can explore your work and get inspired!
              </p>
            </div>
          </div>
        );

      default:
        return null;
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
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateX: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg h-fit"
          >
            <GlassPanel glowColor="#00ffff">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-orbitron text-sm font-bold text-cyber-blue">
                    Create New Project
                  </h2>
                  <p className="text-xs text-white/60">
                    Step {currentPage} of 3: {
                      currentPage === 1 ? 'Basic Information' :
                      currentPage === 2 ? 'Repository Links' : 'Topics & Settings'
                    }
                  </p>
                </div>
                <motion.button
                  onClick={handleClose}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-3 h-3 text-white/70" />
                </motion.button>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex space-x-1">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                        step <= currentPage ? 'bg-cyber-blue' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderPage()}
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-between mt-4 pt-3 border-t border-white/10">
                  <motion.button
                    type="button"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                    whileHover={{ scale: currentPage === 1 ? 1 : 1.02 }}
                    whileTap={{ scale: currentPage === 1 ? 1 : 0.98 }}
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Previous</span>
                  </motion.button>

                  {currentPage < 3 ? (
                    <motion.button
                      type="button"
                      onClick={nextPage}
                      className="flex items-center space-x-1 bg-gradient-to-r from-cyber-blue to-cyber-pink px-3 py-2 rounded-lg font-orbitron font-bold text-white transition-all duration-300 text-xs"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3 h-3" />
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center space-x-1 bg-gradient-to-r from-cyber-blue to-cyber-pink px-3 py-2 rounded-lg font-orbitron font-bold text-white transition-all duration-300 disabled:opacity-50 text-xs"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{isLoading ? 'Creating...' : 'Create Project'}</span>
                    </motion.button>
                  )}
                </div>
              </form>
            </GlassPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};