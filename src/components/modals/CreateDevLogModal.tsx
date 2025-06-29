import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, FileText, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger,
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
      setCurrentPage(1);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const nextPage = async () => {
    let fieldsToValidate: (keyof DevLogFormData)[] = [];
    
    switch (currentPage) {
      case 1:
        fieldsToValidate = ['title'];
        break;
      case 2:
        fieldsToValidate = ['content'];
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

  // Handle form submission only when explicitly called
  const handleExplicitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(handleFormSubmit)(e);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">
                DevLog Title
              </label>
              <div className="relative">
                <FileText className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-white/50" />
                <input
                  {...register('title')}
                  className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-yellow focus:ring-1 focus:ring-cyber-yellow transition-all duration-300 text-xs"
                  placeholder="Building My First 3D Dev Planet"
                />
              </div>
              {errors.title && (
                <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div className="bg-cyber-yellow/10 border border-cyber-yellow/30 rounded-lg p-3">
              <h3 className="font-semibold text-cyber-yellow mb-1 text-xs">💡 DevLog Tips</h3>
              <ul className="text-xs text-white/70 space-y-1">
                <li>• Share your development journey and insights</li>
                <li>• Document challenges you faced and how you solved them</li>
                <li>• Include code snippets, screenshots, or demos</li>
                <li>• Help other developers learn from your experience</li>
              </ul>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
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
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-yellow focus:ring-1 focus:ring-cyber-yellow transition-all duration-300 resize-none text-xs"
                placeholder="Share your development journey, insights, challenges, and breakthroughs...

Example:
Today I started working on my first 3D dev planet visualization. The combination of React Three Fiber and TypeScript is incredible for creating interactive 3D experiences. 

The biggest challenge was implementing the orbital mechanics for the planets. I spent hours tweaking the rotation speeds and getting the perfect glow effect for the planet rings.

Here's what I learned:
- Three.js performance optimization techniques
- How to handle complex 3D animations
- The importance of proper lighting in 3D scenes

Next steps:
- Add particle effects for space dust
- Implement planet collision detection
- Create a more realistic physics system"
              />
              {errors.content && (
                <p className="mt-1 text-xs text-red-400">{errors.content.message}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">
                Tags (comma-separated)
              </label>
              <div className="relative">
                <Tag className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-white/50" />
                <input
                  {...register('tags')}
                  className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-yellow focus:ring-1 focus:ring-cyber-yellow transition-all duration-300 text-xs"
                  placeholder="React, Three.js, 3D, TypeScript, WebGL"
                  onKeyDown={(e) => {
                    // Prevent Enter key from submitting the form
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-white/60">
                Add relevant tags to help others discover your DevLog
              </p>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <h3 className="font-semibold text-green-400 mb-1 text-xs">🚀 Ready to Publish!</h3>
              <p className="text-xs text-white/70">
                Your DevLog is ready to be shared with the DevVerse³ community. 
                Other developers will be able to read, like, and learn from your experience.
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
            initial={{ opacity: 0, scale: 0.9, rotateZ: -5 }}
            animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateZ: 5 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg h-fit"
          >
            <GlassPanel glowColor="#ffff00">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-orbitron text-sm font-bold text-cyber-yellow">
                    Create DevLog Entry
                  </h2>
                  <p className="text-xs text-white/60">
                    Step {currentPage} of 3: {
                      currentPage === 1 ? 'Title & Overview' :
                      currentPage === 2 ? 'Content' : 'Tags & Publish'
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
                        step <= currentPage ? 'bg-cyber-yellow' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Form - Only wrap the final submit in form */}
              {currentPage < 3 ? (
                <div>
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

                    <motion.button
                      type="button"
                      onClick={nextPage}
                      className="flex items-center space-x-1 bg-gradient-to-r from-cyber-yellow to-cyber-pink px-3 py-2 rounded-lg font-orbitron font-bold text-white transition-all duration-300 text-xs"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleExplicitSubmit}>
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
                      className="flex items-center space-x-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors text-xs"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Previous</span>
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center space-x-1 bg-gradient-to-r from-cyber-yellow to-cyber-pink px-3 py-2 rounded-lg font-orbitron font-bold text-white transition-all duration-300 disabled:opacity-50 text-xs"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{isLoading ? 'Publishing...' : 'Publish DevLog'}</span>
                    </motion.button>
                  </div>
                </form>
              )}
            </GlassPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};