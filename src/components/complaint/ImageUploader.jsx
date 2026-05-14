import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloudUploadOutline, IoCloseCircle, IoImageOutline } from 'react-icons/io5';
import { uploadService } from '../../services/uploadService';
import toast from 'react-hot-toast';

const ImageUploader = ({ onImageUpload, maxFiles = 1, existingImage = null }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(existingImage);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    try {
      // Validate file
      uploadService.validateImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Store file object (will be sent with form data)
      setSelectedFile(file);
      
      if (onImageUpload) {
        onImageUpload(file);
      }

      toast.success('Image selected successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to select image');
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageUpload) {
      onImageUpload(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      fileInputRef.current.files = e.dataTransfer.files;
      handleFileSelect({ target: { files: [file] } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <AnimatePresence>
        {!preview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="glass rounded-xl border-2 border-dashed border-white/20 hover:border-primary-500/50 
                     transition-all cursor-pointer p-8 text-center"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex justify-center mb-4"
            >
              <IoCloudUploadOutline className="w-16 h-16 text-primary-400" />
            </motion.div>

            <h3 className="text-lg font-semibold text-white mb-2">
              Upload Image
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Drag and drop or click to browse
            </p>
            <p className="text-gray-500 text-xs">
              Supports: JPG, PNG, GIF (max 5MB)
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview */}
      {preview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="glass rounded-lg overflow-hidden aspect-video">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full 
                     opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <IoCloseCircle className="w-6 h-6 text-white" />
          </button>

          {/* Image Icon */}
          <div className="absolute bottom-2 left-2 p-1 bg-black/50 rounded">
            <IoImageOutline className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ImageUploader;