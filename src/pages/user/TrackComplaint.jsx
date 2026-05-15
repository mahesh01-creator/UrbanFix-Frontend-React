import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoHomeOutline,
  IoAddCircleOutline,
  IoDocumentTextOutline,
  IoTrendingUpOutline,
  IoChatbubbleEllipsesOutline,
  IoSearchOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoLocationOutline,
  IoImageOutline,
  IoStarOutline,
  IoFilterOutline
} from 'react-icons/io5';

import DashboardLayout from '../../components/layout/Layout';
import { complaintService } from '../../services/complaintService';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const TrackComplaint = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const complaintId = searchParams.get('id');

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);

  const [myComplaints, setMyComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const sidebarLinks = [
    { name: 'Dashboard', path: '/user/dashboard', icon: IoHomeOutline },
    { name: 'Issue Complaint', path: '/user/issue-complaint', icon: IoAddCircleOutline },
    { name: 'My Complaints', path: '/user/my-complaints', icon: IoDocumentTextOutline },
    { name: 'Track Complaint', path: '/user/track-complaint', icon: IoTrendingUpOutline },
    { name: 'Feedback', path: '/user/feedback', icon: IoChatbubbleEllipsesOutline },
  ];

  const statusSteps = [
    { key: 'PENDING', label: 'Submitted', icon: IoTimeOutline, color: 'yellow' },
    { key: 'VERIFIED', label: 'Verified', icon: IoCheckmarkCircle, color: 'blue' },
    { key: 'ASSIGNED', label: 'Assigned', icon: IoPersonOutline, color: 'purple' },
    { key: 'IN_PROGRESS', label: 'In Progress', icon: IoTrendingUpOutline, color: 'orange' },
    { key: 'RESOLVED', label: 'Resolved', icon: IoCheckmarkCircle, color: 'green' },
  ];

  const colorClasses = {
    yellow: "bg-yellow-500/30 border-yellow-400 text-yellow-400 shadow-yellow-500/50",
    blue: "bg-blue-500/30 border-blue-400 text-blue-400 shadow-blue-500/50",
    purple: "bg-purple-500/30 border-purple-400 text-purple-400 shadow-purple-500/50",
    orange: "bg-orange-500/30 border-orange-400 text-orange-400 shadow-orange-500/50",
    green: "bg-green-500/30 border-green-400 text-green-400 shadow-green-500/50",
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  useEffect(() => {
    if (complaintId) {
      fetchComplaintDetails(complaintId);
    }
  }, [complaintId]);

  const fetchMyComplaints = async () => {
    try {
      const data = await complaintService.getUserComplaints(user.id);
      setMyComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = myComplaints.filter((c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredComplaints(filtered);
      setShowSearchResults(true);

    } else {
      setShowSearchResults(false);
    }
  }, [searchTerm, myComplaints]);

  const fetchComplaintDetails = async (id) => {
    try {
      setLoading(true);

      const data = await complaintService.trackComplaint(user.id, id);

      setComplaint(data);

    } catch (error) {
      console.error(error);
      toast.error("Failed to load complaint");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectComplaint = (selectedComplaint) => {
    navigate(`/user/track-complaint?id=${selectedComplaint.id}`);
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const getCurrentStepIndex = () => {
    if (!complaint) return 0;

    return statusSteps.findIndex(
      (step) => step.key === complaint.status
    );
  };

  const getStatusColor = (status) => {
    const step = statusSteps.find((s) => s.key === status);
    return step?.color || 'gray';
  };

  return (
    <DashboardLayout links={sidebarLinks}>

      <div className="relative min-h-screen overflow-hidden">

        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full"></div>

        <div className="relative z-10 space-y-8">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8 border border-white/10 relative z-[100]"
          >

            <div className="flex items-center justify-between mb-6">

              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Track Complaint
                </h1>

                <p className="text-gray-400 mt-2">
                  Monitor complaint progress in real-time
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <IoFilterOutline className="text-cyan-400" size={24} />
              </div>
            </div>

            {/* SEARCH */}
            <div className="relative z-[100]">

              <IoSearchOutline
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type="text"
                placeholder="Search complaints by title, category, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
  w-full pl-12 pr-4 py-3
  bg-black/40
  border border-white/10
  rounded-xl
  text-white
  placeholder:text-gray-400
  focus:border-primary-500
  focus:ring-2
  focus:ring-primary-500/30
  outline-none
  transition-all duration-300
"
              />

              {/* DROPDOWN */}
              <AnimatePresence>

                {showSearchResults && filteredComplaints.length > 0 && (

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-3 w-full bg-[#111827]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] max-h-80 overflow-y-auto z-[9999]"
                  >

                    {filteredComplaints.map((c) => (

                      <div
                        key={c.id}
                        onClick={() => handleSelectComplaint(c)}
                        className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-all"
                      >

                        <div className="flex items-center justify-between">

                          <div>
                            <p className="font-semibold text-white">
                              {c.title}
                            </p>

                            <p className="text-sm text-gray-400">
                              {c.category} • {c.location}
                            </p>
                          </div>

                          <span className="px-3 py-1 rounded-full text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {c.status}
                          </span>
                        </div>

                      </div>
                    ))}

                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Quick Filters */} <div className="flex gap-3 mt-4 flex-wrap"> <button onClick={() => setSearchTerm('Road')} className="px-4 py-2 glass rounded-lg hover:bg-white/10 text-sm transition" > 🛣 Road Issues </button> <button onClick={() => setSearchTerm('Water')} className="px-4 py-2 glass rounded-lg hover:bg-white/10 text-sm transition" > 💧 Water Supply </button> <button onClick={() => setSearchTerm('Electricity')} className="px-4 py-2 glass rounded-lg hover:bg-white/10 text-sm transition" > ⚡ Electricity </button> <button onClick={() => setSearchTerm('Garbage')} className="px-4 py-2 glass rounded-lg hover:bg-white/10 text-sm transition" > 🗑 Garbage </button> </div> </motion.div>

          {/* RECENT COMPLAINTS */}
          {!complaintId && !loading && myComplaints.length > 0 && (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-3xl p-8 border border-white/10"
            >

              <div className="mb-8">

                <h2 className="text-3xl font-black text-white">
                  Recent Complaints
                </h2>

                <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-3"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {myComplaints.slice(0, 6).map((c) => (

                  <motion.div
                    whileHover={{ y: -4 }}
                    key={c.id}
                    onClick={() => handleSelectComplaint(c)}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:border-cyan-500/30 transition-all"
                  >

                    <div className="flex justify-between">

                      <div>
                        <h3 className="font-semibold text-white">
                          {c.title}
                        </h3>

                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 h-fit">
                        {c.status}
                      </span>
                    </div>

                  </motion.div>
                ))}
              </div>

            </motion.div>
          )}

          {/* LOADING */}
          {loading && (

            <div className="glass rounded-3xl p-16 text-center border border-white/10">

              <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-5"></div>

              <p className="text-gray-400">
                Loading complaint details...
              </p>

            </div>
          )}

          {/* TIMELINE */}
          {complaint && !loading && (

            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-3xl p-8 relative z-10 overflow-hidden border border-white/10"
              >

                <div className="flex items-center justify-between mb-10">

                  <div>

                    <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                      Complaint Timeline
                    </h2>

                    <p className="text-sm text-gray-400 mt-2">
                      Real-time complaint workflow progress
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-cyan-300 uppercase tracking-widest">
                      Live Status
                    </span>
                  </div>
                </div>

                <div className="relative mb-12">

                  <div className="absolute top-6 left-0 right-0 h-1 bg-white/10"></div>

                  <div
                    className="absolute top-6 left-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
                    style={{
                      width: `${(getCurrentStepIndex() / (statusSteps.length - 1)) * 100}%`
                    }}
                  ></div>

                  <div className="relative flex justify-between gap-4 overflow-x-auto pb-4">

                    {statusSteps.map((step, index) => {

                      const isActive = index <= getCurrentStepIndex();

                      return (

                        <div
                          key={step.key}
                          className="flex flex-col items-center min-w-[90px]"
                        >

                          <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all
                            ${isActive
                                ? colorClasses[step.color]
                                : 'bg-white/5 border-white/10 text-gray-500'
                              }`}
                          >

                            <step.icon size={24} />

                          </div>

                          <p className="text-xs text-center mt-3 text-gray-300">
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-center">

                  <span className="px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-semibold">
                    Current Status :
                    {" "}
                    {complaint.status.replace("_", " ")}
                  </span>

                </div>

              </motion.div>

              {/* DETAILS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEFT */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-3xl p-8 border border-white/10"
                >

                  <div className="mb-8">

                    <h3 className="text-3xl font-black text-white">
                      Complaint Details
                    </h3>

                    <div className="w-20 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 mt-3"></div>

                    <p className="text-gray-400 text-sm mt-3">
                      Complete issue information submitted by citizen
                    </p>
                  </div>

                  <div className="space-y-6">

                    <div className="flex gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                        <IoDocumentTextOutline className="text-cyan-400" size={22} />
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">
                          Title
                        </p>

                        <p className="text-white font-semibold text-lg">
                          {complaint.title}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                        <IoDocumentTextOutline className="text-purple-400" size={22} />
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">
                          Description
                        </p>

                        <p className="text-white leading-relaxed">
                          {complaint.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                        <IoCalendarOutline className="text-orange-400" size={22} />
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">
                          Submitted On
                        </p>

                        <p className="text-white">
                          {new Date(complaint.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                        <IoLocationOutline className="text-green-400" size={22} />
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">
                          Location
                        </p>

                        <p className="text-white">
                          {complaint.location}
                        </p>
                      </div>
                    </div>

                  </div>

                </motion.div>

                {/* RIGHT */}
                <div className="space-y-8">

                  {/* WORKER */}
                  {complaint.worker && (

                    <motion.div
                      whileHover={{ y: -4 }}
                      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-black/40 to-cyan-500/10 backdrop-blur-2xl p-6 shadow-[0_10px_50px_rgba(16,185,129,0.2)]"
                    >

                      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full"></div>

                      <div className="relative z-10">

                        <div className="flex items-center justify-between mb-6">

                          <div>
                            <h3 className="text-2xl font-black text-white">
                              Assigned Worker
                            </h3>

                            <p className="text-sm text-emerald-300 mt-1">
                              Field response team information
                            </p>
                          </div>

                          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/20">
                            <span className="text-xs font-semibold text-emerald-300">
                              ACTIVE
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-5">

                          <div className="relative">

                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                              <IoPersonOutline size={36} className="text-white" />
                            </div>

                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-black animate-pulse"></div>
                          </div>

                          <div className="space-y-2">

                            <h4 className="text-xl font-bold text-white">
                              {complaint.worker.name}
                            </h4>

                            <div className="flex flex-wrap gap-2">

                              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs border border-cyan-500/20">
                                {complaint.worker.department}
                              </span>

                              <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs border border-white/10">
                                📞 {complaint.worker.phone}
                              </span>
                            </div>

                            <p className="text-sm text-gray-400">
                              Worker assigned to resolve this issue
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ISSUE IMAGE */}
                  {complaint.imageUrl && (

                    <div className="glass rounded-3xl p-6 border border-white/10">

                      <h3 className="text-2xl font-black text-white mb-5">
                        Issue Photo
                      </h3>

                      <img
  src={`${BASE_URL}/uploads/${encodeURIComponent(complaint.imageUrl)}`}
  alt="Complaint"
  className="w-full h-52 object-cover hover:scale-105 transition duration-700"
/>
                    </div>
                  )}

                  {/* RESOLUTION */}
                  {complaint.proofImageUrl && (

                    <div className="glass rounded-3xl p-6 border border-white/10">

                      <h3 className="text-2xl font-black text-white mb-5">
                        Resolution Proof
                      </h3>

                      <img
                        src={`${BASE_URL}/uploads/${encodeURIComponent(complaint.proofImageUrl)}`}
                        alt="Resolution"
                        className="w-full rounded-2xl"
                      />

                      {complaint.resolutionNotes && (

                        <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10">

                          <p className="text-sm text-gray-400 mb-2">
                            Resolution Notes
                          </p>

                          <p className="text-white">
                            {complaint.resolutionNotes}
                          </p>

                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* RESOLVED */}
              {complaint.status === 'RESOLVED' && (

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-3xl p-10 text-center border border-green-500/20 bg-gradient-to-r from-green-500/10 to-emerald-600/10"
                >

                  <IoCheckmarkCircle className="w-20 h-20 text-green-400 mx-auto mb-5" />

                  <h2 className="text-4xl font-black text-white mb-3">
                    Complaint Resolved 🎉
                  </h2>

                  <p className="text-gray-400 mb-8">
                    We hope your issue has been resolved successfully
                  </p>

                  <button
                    onClick={() => navigate(`/user/feedback?id=${complaint.id}`)}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition-all duration-300 font-semibold shadow-lg shadow-green-500/30"
                  >
                    Give Feedback
                  </button>

                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrackComplaint;