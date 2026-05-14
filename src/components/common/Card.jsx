import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  neon = false,
  onClick,
  padding = 'p-6'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -5 } : {}}
      onClick={onClick}
      className={`
        glass rounded-xl ${padding}
        ${hover ? 'glass-hover card-hover cursor-pointer' : ''}
        ${neon ? 'neon-border neon-glow' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;