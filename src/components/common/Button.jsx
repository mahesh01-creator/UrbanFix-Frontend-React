import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  icon: Icon,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-white',
    danger: 'px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all',
    success: 'px-6 py-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-all',
    outline: 'px-6 py-3 border-2 border-primary-500 text-primary-400 rounded-lg hover:bg-primary-500/10 transition-all',
    ghost: 'px-6 py-3 text-gray-300 hover:bg-white/5 rounded-lg transition-all',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''}
        ${className} 
        flex items-center justify-center gap-2 font-semibold
        disabled:opacity-50 disabled:cursor-not-allowed
        relative overflow-hidden
      `}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;