import React from 'react';
import { motion } from 'framer-motion';
import { IoLocationOutline, IoCalendarOutline, IoPersonOutline } from 'react-icons/io5';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatDate, truncateText } from '../../utils/helpers';

const ComplaintCard = ({ complaint, onClick }) => {
  return (
    <Card hover onClick={onClick}>
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">
              {complaint.title}
            </h3>
            <p className="text-sm text-gray-400">
              ID: {complaint.id || complaint.complaintId}
            </p>
          </div>
          <Badge status={complaint.status} />
        </div>

        {/* Image */}
        {complaint.imageUrl && (
          <div className="relative rounded-lg overflow-hidden h-48 group">
            <img
              src={complaint.imageUrl}
              alt={complaint.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        {/* Description */}
        <p className="text-gray-300 text-sm">
          {truncateText(complaint.description, 120)}
        </p>

        {/* Category */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium border border-purple-500/30">
            {complaint.category}
          </span>
        </div>

        {/* Footer Info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-400 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <IoLocationOutline className="w-4 h-4" />
            <span>{complaint.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center gap-2">
            <IoCalendarOutline className="w-4 h-4" />
            <span>{formatDate(complaint.createdAt)}</span>
          </div>
          {complaint.assignedWorker && (
            <div className="flex items-center gap-2">
              <IoPersonOutline className="w-4 h-4" />
              <span>{complaint.assignedWorker.name}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ComplaintCard;