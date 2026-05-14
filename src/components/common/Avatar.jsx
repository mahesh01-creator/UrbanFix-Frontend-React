import React from 'react';
import { getInitials } from '../../utils/helpers';

const Avatar = ({ 
  name = 'User',
  src,
  size = 'md',
  online = false,
  className = ''
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`
        ${sizes[size]} 
        rounded-full 
        flex items-center justify-center
        font-bold
        ${src ? '' : 'bg-gradient-to-br from-primary-500 to-purple-600'}
        overflow-hidden
        border-2 border-white/20
      `}>
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white">{getInitials(name)}</span>
        )}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
      )}
    </div>
  );
};

export default Avatar;