import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Save, 
  Star, 
  GitFork, 
  Calendar,
  MapPin,
  Link as LinkIcon,
  Settings,
  Code,
  Plus,
  ExternalLink
} from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { useAuth } from '../../contexts/AuthContext';
import { CreateProjectModal } from '../modals/CreateProjectModal';
import { ProfilePictureModal } from '../modals/ProfilePictureModal';
import { Project, CreateProjectData } from '../../types';
import { toast } from 'react-hot-toast';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional(),
  location: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export const UserPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showProfilePicture, setShowProfilePicture] = useState(false);
  const { user, updateUser } = useAuth();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    updateUser(data);
    setIsEditing(false);
    
    // Award achievement for writing bio
    if (data.bio && data.bio.trim() && user) {
      const achievements = JSON.parse(localStorage.getItem(`achievements_${user.id}`) || '[]');
      if (!achievements.some((a: any) => a.id === 'biography')) {
        const newAchievement = {
          id: 'biography',
          name: 'Biography',
          description: 'User writes their Bio in their profile page',
          icon: 'edit',
          unlockedAt: new Date()
        };
        achievements.push(newAchievement);
        localStorage.setItem(`achievements_${user.id}`, JSON.stringify(achievements));
        toast.success('Achievement unlocked: Biography! ✍️');
      }
    }
    
    toast.success('Profile updated successfully!');
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    // In a real app, this would make an API call to change password
    console.log('Password change:', data);
    passwordForm.reset();
    toast.success('Password updated successfully!');
  };

  const handleAvatarSave = (croppedImage: string) => {
    updateUser({ avatar: croppedImage });
  };

  const handleCreateProject = (data: CreateProjectData) => {
    if (!user) return;

    const newProject: Project = {
      id: Date.now().toString(),
      ...data,
      stars: 0,
      forks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: user.username,
    };

    const updatedProjects = [...(user.projects || []), newProject];
    updateUser({ projects: updatedProjects });

    // Award achievement for first project
    const achievements = JSON.parse(localStorage.getItem(`achievements_${user.id}`) || '[]');
    if (!achievements.some((a: any) => a.id === 'creator')) {
      const newAchievement = {
        id: 'creator',
        name: 'Creator',
        description: 'User makes their first project from their user page',
        icon: 'code',
        unlockedAt: new Date()
      };
      achievements.push(newAchievement);
      localStorage.setItem(`achievements_${user.id}`, JSON.stringify(achievements));
      toast.success('Achievement unlocked: Creator! 💻');
    }

    toast.success('Project created successfully!');
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      TypeScript: '#3178c6',
      JavaScript: '#f7df1e',
      Python: '#3776ab',
      Java: '#ed8b00',
      'C++': '#00599c',
      React: '#61dafb',
    };
    return colors[language] || '#ffffff';
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-orbitron text-4xl font-bold mb-4">
            <span className="neon-text text-cyber-blue">Control</span>{' '}
            <span className="neon-text text-cyber-pink">Deck</span>
          </h1>
          <p className="font-sora text-xl text-white/70">
            Manage your dev planet configuration
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <GlassPanel glowColor="#00ffff">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full border-2 border-cyber-blue"
                  />
                  <motion.button
                    onClick={() => setShowProfilePicture(true)}
                    className="absolute bottom-0 right-0 w-6 h-6 bg-cyber-blue rounded-full flex items-center justify-center cursor-pointer hover:bg-cyber-pink transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Camera className="w-3 h-3 text-white" />
                  </motion.button>
                </div>
                <h2 className="font-orbitron text-xl font-bold text-white mt-3">
                  {user?.username}
                </h2>
                <p className="text-white/70 text-sm">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-sora">{tab.label}</span>
                  </motion.button>
                ))}
              </nav>
            </GlassPanel>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <GlassPanel glowColor="#ff00ff">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-orbitron text-2xl font-bold text-white">
                    Profile Settings
                  </h2>
                  <motion.button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 px-4 py-2 bg-cyber-pink/20 text-cyber-pink rounded-lg hover:bg-cyber-pink/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings className="w-4 h-4" />
                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                  </motion.button>
                </div>

                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                        <input
                          {...profileForm.register('username')}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all duration-300 disabled:opacity-50"
                        />
                      </div>
                      {profileForm.formState.errors.username && (
                        <p className="mt-1 text-sm text-red-400">
                          {profileForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                        <input
                          {...profileForm.register('email')}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all duration-300 disabled:opacity-50"
                        />
                      </div>
                      {profileForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-400">
                          {profileForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Bio
                    </label>
                    <textarea
                      {...profileForm.register('bio')}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all duration-300 disabled:opacity-50 resize-none"
                      placeholder="Tell the galaxy about yourself..."
                    />
                    {profileForm.formState.errors.bio && (
                      <p className="mt-1 text-sm text-red-400">
                        {profileForm.formState.errors.bio.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                        <input
                          {...profileForm.register('location')}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all duration-300 disabled:opacity-50"
                          placeholder="Earth, Solar System"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Website
                      </label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                        <input
                          {...profileForm.register('website')}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink transition-all duration-300 disabled:opacity-50"
                          placeholder="https://your-website.com"
                        />
                      </div>
                      {profileForm.formState.errors.website && (
                        <p className="mt-1 text-sm text-red-400">
                          {profileForm.formState.errors.website.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <motion.button
                      type="submit"
                      className="flex items-center space-x-2 bg-gradient-to-r from-cyber-pink to-cyber-blue px-6 py-3 rounded-lg font-orbitron font-bold text-white hover:scale-105 transition-transform"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </motion.button>
                  )}
                </form>
              </GlassPanel>
            )}

            {activeTab === 'projects' && (
              <GlassPanel glowColor="#00ff00">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-orbitron text-2xl font-bold text-white">
                    Your Projects ({user?.projects?.length || 0})
                  </h2>
                  <motion.button
                    onClick={() => setShowCreateProject(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-cyber-green to-cyber-blue px-4 py-2 rounded-lg font-semibold text-white hover:scale-105 transition-transform"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Project</span>
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {user?.projects?.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <motion.h3 
                              className="font-orbitron text-lg font-bold text-white group-hover:text-cyber-green transition-colors cursor-pointer"
                              whileHover={{ scale: 1.02 }}
                              onClick={() => window.open(project.githubUrl, '_blank')}
                            >
                              {project.name}
                            </motion.h3>
                            <motion.button
                              onClick={() => window.open(project.githubUrl, '_blank')}
                              className="p-1 text-white/50 hover:text-cyber-green transition-colors"
                              whileHover={{ scale: 1.2, rotate: 15 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </motion.button>
                            {project.isPrivate && (
                              <span className="px-2 py-1 bg-white/20 text-white/70 text-xs rounded-full">
                                Private
                              </span>
                            )}
                          </div>
                          <p className="text-white/70 text-sm mb-3">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <div className="flex items-center space-x-1">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getLanguageColor(project.language) }}
                            />
                            <span>{project.language}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>{project.stars}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GitFork className="w-4 h-4" />
                            <span>{project.forks}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Updated {project.updatedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.topics.map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-1 bg-cyber-blue/20 text-cyber-blue text-xs rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )) || (
                    <div className="text-center py-12">
                      <Code className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <p className="text-white/70 mb-4">No projects yet</p>
                      <motion.button
                        onClick={() => setShowCreateProject(true)}
                        className="bg-gradient-to-r from-cyber-green to-cyber-blue px-6 py-3 rounded-lg font-semibold text-white hover:scale-105 transition-transform"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Create Your First Project
                      </motion.button>
                    </div>
                  )}
                </div>
              </GlassPanel>
            )}

            {activeTab === 'security' && (
              <GlassPanel glowColor="#ffff00">
                <h2 className="font-orbitron text-2xl font-bold text-white mb-6">
                  Security Settings
                </h2>

                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        {...passwordForm.register('currentPassword')}
                        type="password"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-yellow focus:ring-1 focus:ring-cyber-yellow transition-all duration-300"
                        placeholder="Enter current password"
                      />
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-400">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        {...passwordForm.register('newPassword')}
                        type="password"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-yellow focus:ring-1 focus:ring-cyber-yellow transition-all duration-300"
                        placeholder="Enter new password"
                      />
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="mt-1 text-sm text-red-400">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        {...passwordForm.register('confirmPassword')}
                        type="password"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyber-yellow focus:ring-1 focus:ring-cyber-yellow transition-all duration-300"
                        placeholder="Confirm new password"
                      />
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-400">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    className="bg-gradient-to-r from-cyber-yellow to-cyber-pink px-6 py-3 rounded-lg font-orbitron font-bold text-white hover:scale-105 transition-transform"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Update Password
                  </motion.button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/20">
                  <h3 className="font-orbitron text-lg font-bold text-white mb-4">
                    Account Actions
                  </h3>
                  <div className="space-y-3">
                    <motion.button
                      className="w-full text-left px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Delete Account
                    </motion.button>
                  </div>
                </div>
              </GlassPanel>
            )}
          </div>
        </div>

        <CreateProjectModal
          isOpen={showCreateProject}
          onClose={() => setShowCreateProject(false)}
          onSubmit={handleCreateProject}
        />

        <ProfilePictureModal
          isOpen={showProfilePicture}
          onClose={() => setShowProfilePicture(false)}
          onSave={handleAvatarSave}
          currentAvatar={user?.avatar}
        />
      </div>
    </div>
  );
};