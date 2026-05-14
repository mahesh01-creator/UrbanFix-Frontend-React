export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


export const ROLES = {
  USER: 'ROLE_USER',
  ADMIN: 'ROLE_ADMIN',
  WORKER: 'ROLE_WORKER'
};

export const COMPLAINT_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED'
};

export const COMPLAINT_CATEGORIES = [
  'Road Damage',
  'Street Light',
  'Garbage Collection',
  'Water Supply',
  'Drainage',
  'Public Property',
  'Parks & Recreation',
  'Noise Pollution',
  'Others'
];

export const STATUS_COLORS = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  VERIFIED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ASSIGNED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  IN_PROGRESS: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  RESOLVED: 'bg-green-500/20 text-green-400 border-green-500/30',
  REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30'
};

export const DEFAULT_CENTER = {
  lat: 28.6139,
  lng: 77.2090
};

export const PRIORITY_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};