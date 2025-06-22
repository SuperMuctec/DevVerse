import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Crop, Save, RotateCw } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { toast } from 'react-hot-toast';

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImage: string) => void;
  currentAvatar?: string;
}

export const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentAvatar,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropData, setCropData] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    scale: 1,
    rotation: 0,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setCroppedImage(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCrop = useCallback(() => {
    if (!selectedImage || !canvasRef.current || !imageRef.current) return;

    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx) return;

    // Set canvas size to desired output size
    const outputSize = 300;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Calculate scaling to fit the crop area
    const scaleX = outputSize / cropData.width;
    const scaleY = outputSize / cropData.height;

    // Clear canvas
    ctx.clearRect(0, 0, outputSize, outputSize);

    // Save context state
    ctx.save();

    // Apply transformations
    ctx.translate(outputSize / 2, outputSize / 2);
    ctx.rotate((cropData.rotation * Math.PI) / 180);
    ctx.scale(cropData.scale, cropData.scale);

    // Draw the cropped portion
    ctx.drawImage(
      img,
      cropData.x,
      cropData.y,
      cropData.width,
      cropData.height,
      -outputSize / 2,
      -outputSize / 2,
      outputSize,
      outputSize
    );

    // Restore context state
    ctx.restore();

    // Get the cropped image as data URL
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCroppedImage(croppedDataUrl);
    setIsProcessing(false);
  }, [selectedImage, cropData]);

  const handleSave = () => {
    if (croppedImage) {
      onSave(croppedImage);
      onClose();
      toast.success('Profile picture updated!');
    }
  };

  const resetCrop = () => {
    setCropData({
      x: 0,
      y: 0,
      width: 200,
      height: 200,
      scale: 1,
      rotation: 0,
    });
  };

  const handleImageLoad = () => {
    if (imageRef.current) {
      const img = imageRef.current;
      const size = Math.min(img.naturalWidth, img.naturalHeight);
      setCropData({
        x: (img.naturalWidth - size) / 2,
        y: (img.naturalHeight - size) / 2,
        width: size,
        height: size,
        scale: 1,
        rotation: 0,
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <GlassPanel glowColor="#00ffff">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-orbitron text-2xl font-bold text-cyber-blue">
                  Update Profile Picture
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

              <div className="space-y-6">
                {/* Current Avatar */}
                {currentAvatar && !selectedImage && (
                  <div className="text-center">
                    <h3 className="font-semibold text-white mb-3">Current Avatar</h3>
                    <img
                      src={currentAvatar}
                      alt="Current avatar"
                      className="w-32 h-32 rounded-full mx-auto border-2 border-cyber-blue"
                    />
                  </div>
                )}

                {/* File Upload */}
                <div className="text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <motion.button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue px-6 py-3 rounded-lg font-semibold transition-colors mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Upload className="w-5 h-5" />
                    <span>Choose Image</span>
                  </motion.button>
                  <p className="text-white/60 text-sm mt-2">
                    Max size: 5MB. Supported formats: JPG, PNG, GIF
                  </p>
                </div>

                {/* Image Preview and Crop Controls */}
                {selectedImage && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-white mb-3">Crop Your Image</h3>
                      <div className="relative inline-block">
                        <img
                          ref={imageRef}
                          src={selectedImage}
                          alt="Selected"
                          onLoad={handleImageLoad}
                          className="max-w-full max-h-64 rounded-lg"
                          style={{
                            transform: `scale(${cropData.scale}) rotate(${cropData.rotation}deg)`,
                          }}
                        />
                        {/* Crop overlay would go here in a real implementation */}
                      </div>
                    </div>

                    {/* Crop Controls */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/80 mb-1">Scale</label>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={cropData.scale}
                          onChange={(e) => setCropData(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/80 mb-1">Rotation</label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          step="1"
                          value={cropData.rotation}
                          onChange={(e) => setCropData(prev => ({ ...prev, rotation: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="flex justify-center space-x-3">
                      <motion.button
                        onClick={resetCrop}
                        className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <RotateCw className="w-4 h-4" />
                        <span>Reset</span>
                      </motion.button>
                      <motion.button
                        onClick={handleCrop}
                        disabled={isProcessing}
                        className="flex items-center space-x-2 bg-cyber-pink/20 hover:bg-cyber-pink/30 text-cyber-pink px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Crop className="w-4 h-4" />
                        <span>{isProcessing ? 'Processing...' : 'Crop'}</span>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Cropped Preview */}
                {croppedImage && (
                  <div className="text-center">
                    <h3 className="font-semibold text-white mb-3">Preview</h3>
                    <img
                      src={croppedImage}
                      alt="Cropped preview"
                      className="w-32 h-32 rounded-full mx-auto border-2 border-cyber-green"
                    />
                  </div>
                )}

                {/* Hidden canvas for cropping */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <motion.button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    disabled={!croppedImage}
                    className="flex-1 bg-gradient-to-r from-cyber-blue to-cyber-green px-6 py-3 rounded-lg font-orbitron font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Avatar</span>
                  </motion.button>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};