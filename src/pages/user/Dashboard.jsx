import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  IoAddCircleOutline, 
  IoDocumentTextOutline, 
  IoCheckmarkCircle, 
  IoTimeOutline,
  IoTrendingUpOutline,
  IoStarOutline,
  IoHomeOutline,
  IoChatbubbleEllipsesOutline
} from 'react-icons/io5';
import DashboardLayout from '../../components/layout/Layout';
import { complaintService } from '../../services/complaintService';
import { useAuthStore } from '../../store/authStore';

const UserDashboard = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  // Sidebar links
  const sidebarLinks = [
    { name: 'Dashboard', path: '/user/dashboard', icon: IoHomeOutline },
    { name: 'Issue Complaint', path: '/user/issue-complaint', icon: IoAddCircleOutline },
    { name: 'My Complaints', path: '/user/my-complaints', icon: IoDocumentTextOutline },
    { name: 'Track Complaint', path: '/user/track-complaint', icon: IoTrendingUpOutline },
    { name: 'Feedback', path: '/user/feedback', icon: IoChatbubbleEllipsesOutline },
  ];

  useEffect(() => {
  if (user?.id) {
    fetchDashboardData();
  }
}, [user]);

 const fetchDashboardData = async () => {
  try {
    if (!user?.id) return;

    setLoading(true);

    const data =
      await complaintService.getUserComplaints(
        user.id
      );

    const validData = Array.isArray(data)
      ? data
      : [];

    setComplaints(validData.slice(0, 5));

    const calculatedStats = {
      total: validData.length,

      pending: validData.filter(
        (c) =>
          c.status === "PENDING" ||
          c.status === "VERIFIED"
      ).length,

      inProgress: validData.filter(
        (c) =>
          c.status === "IN_PROGRESS" ||
          c.status === "ASSIGNED"
      ).length,

      resolved: validData.filter(
        (c) => c.status === "RESOLVED"
      ).length,
    };

    setStats(calculatedStats);
  } catch (error) {
    console.error(
      "Dashboard error:",
      error
    );

    setComplaints([]);

    setStats({
      total: 0,
      pending: 0,
      inProgress: 0,
      resolved: 0,
    });
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <DashboardLayout links={sidebarLinks}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  if (!user) {
  return (
    <DashboardLayout links={sidebarLinks}>
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-400">
            Loading user...
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

  return (
    <DashboardLayout links={sidebarLinks}>
      <div className="space-y-6">
        
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 bg-gradient-to-r from-primary-500/10 to-purple-600/10 border border-primary-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-400">
                {stats.total === 0 
                  ? 'Get started by reporting your first complaint' 
                  : `You have ${stats.pending} pending complaints`}
              </p>
            </div>
            <button
              onClick={() => navigate('/user/issue-complaint')}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-primary-500/50 transition flex items-center gap-2"
            >
              <IoAddCircleOutline size={20} />
              Report Issue
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Total Complaints */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="glass rounded-xl p-6 hover:border-primary-500/50 transition cursor-pointer"
    onClick={() => navigate('/user/my-complaints')}
  >
    <div className="flex items-center justify-between mb-4">
      <IoDocumentTextOutline className="w-8 h-8 text-primary-400" />
      <span className="text-3xl font-bold text-white">{stats.total}</span>
    </div>
    <p className="text-gray-400">Total Complaints</p>
  </motion.div>

  {/* Pending */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="glass rounded-xl p-6 hover:border-yellow-500/50 transition cursor-pointer"
    onClick={() => navigate('/user/my-complaints?status=PENDING')}  // ✅ ADDED
  >
    <div className="flex items-center justify-between mb-4">
      <IoTimeOutline className="w-8 h-8 text-yellow-400" />
      <span className="text-3xl font-bold text-white">{stats.pending}</span>
    </div>
    <p className="text-gray-400">Pending</p>
  </motion.div>

  {/* In Progress */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="glass rounded-xl p-6 hover:border-purple-500/50 transition cursor-pointer"
    onClick={() => navigate('/user/my-complaints?status=IN_PROGRESS')}  // ✅ ADDED
  >
    <div className="flex items-center justify-between mb-4">
      <IoTrendingUpOutline className="w-8 h-8 text-purple-400" />
      <span className="text-3xl font-bold text-white">{stats.inProgress}</span>
    </div>
    <p className="text-gray-400">In Progress</p>
  </motion.div>

  {/* Resolved */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="glass rounded-xl p-6 hover:border-green-500/50 transition cursor-pointer"
    onClick={() => navigate('/user/my-complaints?status=RESOLVED')}  // ✅ ADDED
  >
    <div className="flex items-center justify-between mb-4">
      <IoCheckmarkCircle className="w-8 h-8 text-green-400" />
      <span className="text-3xl font-bold text-white">{stats.resolved}</span>
    </div>
    <p className="text-gray-400">Resolved</p>
  </motion.div>
</div>

        {/* Recent Complaints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Complaints</h2>
            {complaints.length > 0 && (
              <button
                onClick={() => navigate('/user/my-complaints')}
                className="text-primary-400 hover:text-primary-300 text-sm"
              >
                
              </button>
            )}
          </div>

          {complaints.length > 0 ? (
  <div className="space-y-3">
    {complaints.map((complaint) => (
      <div
        key={complaint.id}
        className="glass rounded-xl p-4 hover:bg-white/5 cursor-pointer transition"
        onClick={() => {
          // ✅ Only navigate if complaint has ID
          if (complaint.id) {
            navigate(`/user/track-complaint?id=${complaint.id}`);
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">{complaint.title}</h3>
            <p className="text-sm text-gray-400">{complaint.category}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs
            ${complaint.status === 'RESOLVED' ? 'bg-green-500/20 text-green-400' :
              complaint.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
            {complaint.status}
          </span>
        </div>
      </div>
    ))}
  </div>
          ) : (
            <div className="text-center py-12">
              <IoDocumentTextOutline className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No complaints yet</p>
              <button
                onClick={() => navigate('/user/issue-complaint')}
                className="px-4 py-2 bg-primary-500 rounded-lg hover:bg-primary-600 transition"
              >
                Report Your First Issue
              </button>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="glass rounded-xl p-6 cursor-pointer"
            onClick={() => navigate('/user/issue-complaint')}
          >
            <IoAddCircleOutline className="w-10 h-10 text-primary-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">Report Issue</h3>
            <p className="text-sm text-gray-400">Submit a new complaint</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            className="glass rounded-xl p-6 cursor-pointer"
            onClick={() => navigate('/user/my-complaints')}
          >
            <IoDocumentTextOutline className="w-10 h-10 text-purple-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">My Complaints</h3>
            <p className="text-sm text-gray-400">View all submissions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            className="glass rounded-xl p-6 cursor-pointer"
            onClick={() => navigate('/user/feedback')}
          >
            <IoStarOutline className="w-10 h-10 text-green-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">Give Feedback</h3>
            <p className="text-sm text-gray-400">Rate resolved issues</p>
          </motion.div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;