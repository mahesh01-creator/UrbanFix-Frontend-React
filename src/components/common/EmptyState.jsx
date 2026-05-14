import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon,
  title = 'No data found',
  description = 'There is no data to display at the moment.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      {Icon && (
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-6"
        >
          <Icon className="w-24 h-24 text-gray-600" />
        </motion.div>
      )}
      <h3 className="text-2xl font-bold text-gray-300 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;