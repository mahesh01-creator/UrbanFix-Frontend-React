import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon,
  trend,
  trendValue,
  color = 'primary',
  onClick
}) => {
  const colors = {
    primary: 'from-primary-500 to-blue-600',
    success: 'from-green-500 to-emerald-600',
    warning: 'from-yellow-500 to-orange-600',
    danger: 'from-red-500 to-pink-600',
    purple: 'from-purple-500 to-indigo-600',
  };

  return (
    <Card hover neon onClick={onClick} className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors[color]} opacity-10`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          {Icon && (
            <div className={`p-3 rounded-lg bg-gradient-to-br ${colors[color]} bg-opacity-20`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        <motion.h3 
          className="text-3xl font-bold text-white mb-2"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {value}
        </motion.h3>

        {trend && (
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
            <span className="text-gray-500 text-sm">vs last month</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;