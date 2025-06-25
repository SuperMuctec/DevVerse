import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Crop, Save, RotateCw, ArrowLeft, ArrowRight } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
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
        setCurrentPage(2);
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
    setCurrentPage(3);
    setIsProcessing(false);
  }, [selectedImage, cropData]);

  const handleSave = () => {
    if (croppedImage) {
      onSave(croppedImage);
      handleClose();
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

  const nextPage = () => {
    if (currentPage === 2 && selectedImage) {
      handleCrop();
    } else {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    setCurrentPage(prev => prev - 1);
  };

  const handleClose = () => {
    setCurrentPage(1);
    setSelectedImage(null);
    setCroppedImage(null);
    resetCrop();
    onClose();
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="space-y-4">
            {/* Current Avatar */}
            {currentAvatar && (
              <div className="text-center">
                <h3 className="font-semibold text-white mb-3 text-sm">Current Avatar</h3>
                <img
                  src={currentAvatar}
                  alt="Current avatar"
                  className="w-24 h-24 rounded-full mx-auto border-2 border-cyber-blue"
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
                className="flex items-center space-x-3 bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue px-6 py-4 rounded-lg font-semibold transition-colors mx-auto text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload className="w-5 h-5" />
                <span>Choose New Image</span>
              </motion.button>
              <p className="text-white/60 text-xs mt-2">
                Max size: 5MB. Supported formats: JPG, PNG, GIF
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h3 className="font-semibold text-blue-400 mb-2 text-sm">📸 Image Guidelines</h3>
              <ul className="text-xs text-white/70 space-y-1">
                <li>• Use a clear, high-quality image</li>
                <li>• Square images work best for profile pictures</li>
                <li>• Make sure your face is clearly visible</li>
                <li>• Avoid images with text or logos</li>
              </ul>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {selectedImage && (
              <>
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-3 text-sm">Crop Your Image</h3>
                  <div className="relative inline-block">
                    <img
                      ref={imageRef}
                      src={selectedImage}
                      alt="Selected"
                      onLoad={handleImageLoad}
                      className="max-w-full max-h-48 rounded-lg"
                      style={{
                        transform: `scale(${cropData.scale}) rotate(${cropData.rotation}deg)`,
                      }}
                    />
                  </div>
                </div>

                {/* Crop Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/80 mb-1">Scale</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={cropData.scale}
                      onChange={(e) => setCropData(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-xs text-white/60 text-center">{cropData.scale.toFixed(1)}x</div>
                  </div>
                  <div>
                    <label className="block text-xs text-white/80 mb-1">Rotation</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="1"
                      value={cropData.rotation}
                      onChange={(e) => setCropData(prev => ({ ...prev, rotation: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-xs text-white/60 text-center">{cropData.rotation}°</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <motion.button
                    onClick={resetCrop}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Reset</span>
                  </motion.button>
                </div>
              </>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            {croppedImage && (
              <>
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-3 text-sm">Preview</h3>
                  <img
                    src={croppedImage}
                    alt="Cropped preview"
                    className="w-32 h-32 rounded-full mx-auto border-2 border-cyber-green"
                  />
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-green-400 mb-2 text-sm">✨ Perfect!</h3>
                  <p className="text-xs text-white/70">
                    Your new profile picture looks great! This will be visible across DevVerse³ 
                    and will help other developers recognize you in the community.
                  </p>
                </div>
              </>
            )}
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
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl h-fit"
          >
            <GlassPanel glowColor="#00ffff">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-orbitron text-lg font-bold text-cyber-blue">
                    Update Profile Picture
                  </h2>
                  <p className="text-xs text-white/60">
                    Step {currentPage} of 3: {
                      currentPage === 1 ? 'Select Image' :
                      currentPage === 2 ? 'Crop & Adjust' : 'Preview & Save'
                    }
                  </p>
                </div>
                <motion.button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-white/70" />
                </motion.button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
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

              {/* Hidden canvas for cropping */}
              <canvas ref={canvasRef} className="hidden" />

              <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
                <motion.button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  whileHover={{ scale: currentPage === 1 ? 1 : 1.02 }}
                  whileTap={{ scale: currentPage === 1 ? 1 : 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </motion.button>

                {currentPage < 3 ? (
                  <motion.button
                    onClick={nextPage}
                    disabled={currentPage === 2 && isProcessing}
                    className="flex items-center space-x-2 bg-gradient-to-r from-cyber-blue to-cyber-green px-4 py-2 rounded-lg font-orbitron font-bold text-white transition-all duration-300 disabled:opacity-50 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {currentPage === 2 ? (
                      <>
                        <Crop className="w-4 h-4" />
                        <span>{isProcessing ? 'Processing...' : 'Crop Image'}</span>
                      </>
                    ) : (
                      <>
                        <span>Next</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleSave}
                    disabled={!croppedImage}
                    className="flex items-center space-x-2 bg-gradient-to-r from-cyber-blue to-cyber-green px-4 py-2 rounded-lg font-orbitron font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Avatar</span>
                  </motion.button>
                )}
              </div>
            </GlassPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};