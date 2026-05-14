import React from 'react';
import { STATUS_COLORS } from '../../utils/constants'; // Changed from helpers.js
import { getStatusIcon } from '../../utils/helpers';

const Badge = ({ 
  status, 
  showIcon = true,
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span className={`
      inline-flex items-center gap-2 rounded-full font-medium border 
      ${STATUS_COLORS[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'} 
      ${sizes[size]}
      ${className}
    `}>
      {showIcon && <span>{getStatusIcon(status)}</span>}
      {status}
    </span>
  );
};

export default Badge;