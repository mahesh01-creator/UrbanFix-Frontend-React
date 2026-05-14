import React from 'react';
import { motion } from 'framer-motion';

const Select = ({ 
  label, 
  error, 
  options = [],
  placeholder = 'Select an option',
  className = '',
  required = false,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <select
        className={`
          input-glass appearance-none cursor-pointer
          ${error ? 'border-red-500/50 focus:border-red-500/70' : ''} 
          ${className}
        `}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option, index) => (
          <option 
            key={index} 
            value={option.value || option}
            className="bg-gray-800 text-white"
          >
            {option.label || option}
          </option>
        ))}
      </select>
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

export default Select;