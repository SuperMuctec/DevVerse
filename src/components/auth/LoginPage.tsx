import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, Rocket } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GlassPanel } from '../ui/GlassPanel';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: -15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
        style={{ perspective: '1000px' }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="flex items-center justify-center space-x-2 mb-4"
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          >
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-cyber-blue to-cyber-pink rounded-lg flex items-center justify-center"
              animate={{
                rotateY: [0, 360],
                boxShadow: [
                  '0 0 20px rgba(0, 255, 255, 0.5)',
                  '0 0 40px rgba(255, 0, 255, 0.8)',
                  '0 0 20px rgba(0, 255, 255, 0.5)'
                ]
              }}
              transition={{
                rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Rocket className="w-8 h-8 text-white" />
            </motion.div>
            <motion.span
              className="font-orbitron text-3xl font-bold neon-text text-cyber-blue"
              animate={{
                textShadow: [
                  '0 0 10px #00ffff',
                  '0 0 20px #00ffff, 0 0 30px #00ffff',
                  '0 0 10px #00ffff'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              DevVerse³
            </motion.span>
          </motion.div>
          <motion.h1
            className="font-orbitron text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Welcome Back, Developer
          </motion.h1>
          <motion.p
            className="text-white/70 font-sora"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Enter the coding galaxy
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, z: -100 }}
          animate={{ opacity: 1, scale: 1, z: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <GlassPanel glowColor="#00ffff">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  </motion.div>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300 hover:bg-white/15"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <motion.p
                    className="mt-1 text-sm text-red-400"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  </motion.div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all duration-300 hover:bg-white/15"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors flex items-center justify-center w-6 h-6"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    className="mt-1 text-sm text-red-400"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Remember Me */}
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-cyber-blue bg-white/10 border-white/20 rounded focus:ring-cyber-blue focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-white/70">Remember me</span>
                </label>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyber-blue to-cyber-pink py-3 rounded-lg font-orbitron font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
                  rotateX: 5
                }}
                whileTap={{ scale: 0.98 }}
                animate={isLoading ? {
                  background: [
                    'linear-gradient(45deg, #00ffff, #ff00ff)',
                    'linear-gradient(45deg, #ff00ff, #00ffff)',
                    'linear-gradient(45deg, #00ffff, #ff00ff)'
                  ]
                } : {}}
                transition={{ duration: 0.5 }}
              >
                {isLoading ? 'Launching...' : 'Launch Into DevVerse³'}
              </motion.button>
            </form>

            {/* Switch to Register */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <p className="text-white/70">
                New to the galaxy?{' '}
                <motion.button
                  onClick={onSwitchToRegister}
                  className="text-cyber-blue hover:text-cyber-pink transition-colors font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Your Planet
                </motion.button>
              </p>
            </motion.div>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </div>
  );
};