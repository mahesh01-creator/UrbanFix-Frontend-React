import React from 'react';
import { motion } from 'framer-motion';

const Textarea = ({ 
  label, 
  error, 
  className = '',
  required = false,
  rows = 4,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={`
          input-glass resize-none
          ${error ? 'border-red-500/50 focus:border-red-500/70' : ''} 
          ${className}
        `}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm mt-1 flex items-center gap-1"
        >
          <span>⚠️</span>
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Textarea;