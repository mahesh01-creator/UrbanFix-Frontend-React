import React from 'react';
import { motion } from 'framer-motion';
import { COMPLAINT_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

const ComplaintTimeline = ({ complaint }) => {
  const timelineSteps = [
    { status: COMPLAINT_STATUS.PENDING, label: 'Pending', icon: '⏳' },
    { status: COMPLAINT_STATUS.VERIFIED, label: 'Verified', icon: '✓' },
    { status: COMPLAINT_STATUS.ASSIGNED, label: 'Assigned', icon: '👷' },
    { status: COMPLAINT_STATUS.IN_PROGRESS, label: 'In Progress', icon: '🔧' },
    { status: COMPLAINT_STATUS.RESOLVED, label: 'Resolved', icon: '✅' },
  ];

  const currentIndex = timelineSteps.findIndex(step => step.status === complaint.status);

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-xl font-bold gradient-text mb-6">Complaint Timeline</h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${(currentIndex / (timelineSteps.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-primary-500 to-purple-600"
        />

        {/* Timeline Steps */}
        <div className="space-y-8">
          {timelineSteps.map((step, index) => {
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <motion.div
                key={step.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Icon */}
                <div className={`
                  relative z-10 w-12 h-12 rounded-full flex items-center justify-center
                  border-2 transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-br from-primary-500 to-purple-600 border-primary-400' 
                    : 'bg-white/5 border-white/20'
                  }
                  ${isCurrent ? 'ring-4 ring-primary-500/30 scale-110' : ''}
                `}>
                  <span className="text-xl">{step.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {step.label}
                    </h4>
                    {isActive && complaint.updatedAt && (
                      <span className="text-xs text-gray-400">
                        {formatDate(complaint.updatedAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    {isActive 
                      ? isCurrent 
                        ? 'Current status' 
                        : 'Completed'
                      : 'Pending'
                    }
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Additional Info */}
      {complaint.resolvedAt && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400 text-sm font-medium">
            ✅ Resolved on {formatDate(complaint.resolvedAt)}
          </p>
          {complaint.resolutionNotes && (
            <p className="text-gray-300 text-sm mt-2">{complaint.resolutionNotes}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintTimeline;