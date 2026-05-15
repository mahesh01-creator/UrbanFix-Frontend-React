import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoHomeOutline,
  IoAddCircleOutline,
  IoDocumentTextOutline,
  IoTrendingUpOutline,
  IoChatbubbleEllipsesOutline,
  IoFilterOutline,
  IoCloseOutline,
  IoPersonOutline,
  IoLocationOutline,
  IoCalendarOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoImageOutline
} from 'react-icons/io5';

import DashboardLayout from '../../components/layout/Layout';
import { complaintService } from '../../services/complaintService';
import { useAuthStore } from '../../store/authStore';

const MyComplaints = () => {

  const { user } = useAuthStore();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [searchParams, setSearchParams] = useSearchParams();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get('status') || 'ALL'
  );

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const sidebarLinks = [
    {
      name: 'Dashboard',
      path: '/user/dashboard',
      icon: IoHomeOutline,
    },
    {
      name: 'Issue Complaint',
      path: '/user/issue-complaint',
      icon: IoAddCircleOutline,
    },
    {
      name: 'My Complaints',
      path: '/user/my-complaints',
      icon: IoDocumentTextOutline,
    },
    {
      name: 'Track Complaint',
      path: '/user/track-complaint',
      icon: IoTrendingUpOutline,
    },
    {
      name: 'Feedback',
      path: '/user/feedback',
      icon: IoChatbubbleEllipsesOutline,
    },
  ];

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    const status = searchParams.get('status');

    if (status) {
      setSelectedStatus(status);
    }
  }, [searchParams]);

  const fetchComplaints = async () => {
    try {

      setLoading(true);

      const data = await complaintService.getUserComplaints(user.id);

      setComplaints(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error('Fetch error:', error);

      setComplaints([]);

    } finally {

      setLoading(false);
    }
  };

  const filteredComplaints =
    selectedStatus === 'ALL'
      ? complaints
      : complaints.filter((c) => {

          if (selectedStatus === 'PENDING') {
            return c.status === 'PENDING' || c.status === 'VERIFIED';
          }

          if (selectedStatus === 'IN_PROGRESS') {
            return (
              c.status === 'IN_PROGRESS' ||
              c.status === 'ASSIGNED'
            );
          }

          return c.status === selectedStatus;
        });

  const handleFilterChange = (status) => {

    setSelectedStatus(status);

    if (status === 'ALL') {
      setSearchParams({});
    } else {
      setSearchParams({ status });
    }
  };

  return (

    <DashboardLayout links={sidebarLinks}>

      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          <div>

            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              My Complaints
            </h1>

            <p className="text-gray-400 mt-2 text-lg">
              Total Complaints : {filteredComplaints.length}
            </p>

          </div>

          {/* Filter */}
          <div className="relative">

            <div className="flex items-center gap-3 bg-[#111827]/80 border border-white/10 backdrop-blur-xl rounded-2xl px-5 py-3 shadow-xl">

              <IoFilterOutline className="text-cyan-400 text-xl" />

              <select
                value={selectedStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="bg-transparent text-white outline-none appearance-none cursor-pointer pr-4"
              >
                <option className="bg-gray-900 text-white" value="ALL">
                  All Status
                </option>

                <option className="bg-gray-900 text-white" value="PENDING">
                  Pending
                </option>

                <option className="bg-gray-900 text-white" value="IN_PROGRESS">
                  In Progress
                </option>

                <option className="bg-gray-900 text-white" value="RESOLVED">
                  Resolved
                </option>

              </select>
            </div>
          </div>
        </div>

        {/* Pills */}
        <div className="flex flex-wrap gap-4">

          {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'].map((status) => (

            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300
              ${
                selectedStatus === status
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-white/[0.04] border border-white/10 text-gray-400 hover:bg-white/[0.08]'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (

          <div className="flex items-center justify-center h-[400px]">

            <div className="w-20 h-20 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>

          </div>

        ) : filteredComplaints.length > 0 ? (

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-7">

            {filteredComplaints.map((complaint, index) => (

              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{
                  y: -8,
                  scale: 1.015,
                }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/70 backdrop-blur-2xl p-6 shadow-2xl hover:border-cyan-500/30 transition-all duration-500"
              >

                {/* Glow */}
                <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-cyan-500/10 to-purple-500/10"></div>

                {/* Header */}
                <div className="relative flex items-start justify-between gap-4 mb-5">

                  <div className="flex-1">

                    <h3 className="text-2xl font-bold text-white mb-2">
                      {complaint.title}
                    </h3>

                    <p className="text-cyan-300 text-sm">
                      {complaint.category}
                    </p>

                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-xs font-bold border
                    ${
                      complaint.status === 'RESOLVED'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : complaint.status === 'IN_PROGRESS' ||
                          complaint.status === 'ASSIGNED'
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}
                  >
                    {complaint.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Description */}
                <p className="relative text-gray-300 leading-relaxed mb-5 line-clamp-3">
                  {complaint.description}
                </p>

                {/* Image */}
                {complaint.imageUrl && (

                  <div className="relative mb-5 overflow-hidden rounded-2xl border border-white/10">

                    <img
  src={`${BASE_URL}/uploads/${encodeURIComponent(complaint.imageUrl)}`}
  alt="Complaint"
  className="w-full h-52 object-cover hover:scale-105 transition duration-700"
/>
                  </div>
                )}

                {/* Footer */}
                <div className="relative flex items-center justify-between pt-4 border-t border-white/10">

                  <span className="text-sm text-gray-500">
                    {new Date(
                      complaint.createdAt
                    ).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => setSelectedComplaint(complaint)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
                  >
                    View Details →
                  </button>

                </div>
              </motion.div>
            ))}
          </div>

        ) : (

          <div className="rounded-3xl border border-white/10 bg-[#111827]/70 backdrop-blur-2xl p-16 text-center">

            <IoDocumentTextOutline className="w-20 h-20 text-gray-600 mx-auto mb-6" />

            <h3 className="text-2xl font-bold text-white mb-3">
              No Complaints Found
            </h3>

            <p className="text-gray-400">
              No {selectedStatus.toLowerCase()} complaints available
            </p>

          </div>
        )}

        {/* Modal */}
        <AnimatePresence>

          {selectedComplaint && (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-lg flex items-center justify-center p-4"
            >

              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0f172a]/95 backdrop-blur-2xl shadow-2xl"
              >

                {/* Modal Header */}
                <div className="sticky top-0 z-20 bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 px-8 py-5 flex items-center justify-between">

                  <div>

                    <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Complaint Details
                    </h2>

                    <p className="text-gray-400 mt-1">
                      Track complaint progress and updates
                    </p>

                  </div>

                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="w-11 h-11 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 flex items-center justify-center transition"
                  >
                    <IoCloseOutline className="text-white text-2xl" />
                  </button>

                </div>

                <div className="p-8 space-y-8">

                  {/* Top */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                    <div>

                      <h3 className="text-3xl font-bold text-white">
                        {selectedComplaint.title}
                      </h3>

                      <p className="text-cyan-300 mt-2">
                        {selectedComplaint.category}
                      </p>

                    </div>

                    <span
                      className={`px-5 py-2 rounded-full text-sm font-bold border w-fit
                      ${
                        selectedComplaint.status === 'RESOLVED'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : selectedComplaint.status === 'IN_PROGRESS' ||
                            selectedComplaint.status === 'ASSIGNED'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}
                    >
                      {selectedComplaint.status.replace('_', ' ')}
                    </span>

                  </div>

                  {/* Timeline */}
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

                    <h3 className="text-2xl font-bold text-white mb-10">
                      Complaint Status Timeline
                    </h3>

                    <div className="relative flex justify-between">

                      <div className="absolute top-5 left-0 w-full h-1 bg-white/10 rounded-full"></div>

                      {[
                        'PENDING',
                        'VERIFIED',
                        'ASSIGNED',
                        'IN_PROGRESS',
                        'RESOLVED',
                      ].map((step, index) => {

                        const currentIndex = [
                          'PENDING',
                          'VERIFIED',
                          'ASSIGNED',
                          'IN_PROGRESS',
                          'RESOLVED',
                        ].indexOf(selectedComplaint.status);

                        const active = index <= currentIndex;

                        return (
                          <div
                            key={step}
                            className="relative z-10 flex flex-col items-center"
                          >

                            <div
                              className={`w-11 h-11 rounded-full border-4 flex items-center justify-center
                              ${
                                active
                                  ? 'bg-cyan-500 border-cyan-400 shadow-lg shadow-cyan-500/40'
                                  : 'bg-gray-800 border-gray-600'
                              }`}
                            >
                              {active ? (
                                <IoCheckmarkCircle className="text-white text-lg" />
                              ) : (
                                <IoTimeOutline className="text-gray-400 text-lg" />
                              )}
                            </div>

                            <p
                              className={`text-xs mt-3 text-center font-semibold
                              ${
                                active
                                  ? 'text-white'
                                  : 'text-gray-500'
                              }`}
                            >
                              {step.replace('_', ' ')}
                            </p>

                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    {/* Left */}
                    <div className="space-y-7">

                      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

                        <h3 className="text-2xl font-bold text-white mb-7">
                          Complaint Information
                        </h3>

                        <div className="space-y-6">

                          <div className="flex gap-4">

                            <IoDocumentTextOutline className="text-cyan-400 text-2xl mt-1" />

                            <div>

                              <p className="text-sm text-gray-400">
                                Description
                              </p>

                              <p className="text-white mt-2 leading-relaxed">
                                {selectedComplaint.description}
                              </p>

                            </div>
                          </div>

                          <div className="flex gap-4">

                            <IoLocationOutline className="text-pink-400 text-2xl mt-1" />

                            <div>

                              <p className="text-sm text-gray-400">
                                Location
                              </p>

                              <p className="text-white mt-2">
                                {selectedComplaint.location}
                              </p>

                            </div>
                          </div>

                          <div className="flex gap-4">

                            <IoCalendarOutline className="text-yellow-400 text-2xl mt-1" />

                            <div>

                              <p className="text-sm text-gray-400">
                                Created At
                              </p>

                              <p className="text-white mt-2">
                                {new Date(
                                  selectedComplaint.createdAt
                                ).toLocaleString()}
                              </p>

                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Worker */}
                      {selectedComplaint.worker && (

                        <div className="rounded-3xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/5 p-7">

                          <h3 className="text-2xl font-bold text-white mb-7">
                            Assigned Worker
                          </h3>

                          <div className="flex items-center gap-5">

                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">

                              <IoPersonOutline className="text-4xl text-white" />

                            </div>

                            <div className="space-y-2">

                              <h4 className="text-2xl font-bold text-white">
                                {selectedComplaint.worker.name}
                              </h4>

                              <p className="text-green-300">
                                {selectedComplaint.worker.department}
                              </p>

                              <p className="text-gray-300">
                                📞 {selectedComplaint.worker.phone}
                              </p>

                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right */}
                    <div className="space-y-7">

                      {selectedComplaint.imageUrl && (

                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">

                            <IoImageOutline className="text-cyan-400" />

                            Issue Photo

                          </h3>

                          <img
  src={`${BASE_URL}/uploads/${encodeURIComponent(selectedComplaint.imageUrl)}`}
  alt="Complaint"
/>
                        </div>
                      )}

                      {selectedComplaint.proofImageUrl && (

                        <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-7">

                          <h3 className="text-2xl font-bold text-green-300 mb-6">
                            Resolution Proof
                          </h3>

                          <img
  src={`${BASE_URL}/uploads/${encodeURIComponent(selectedComplaint.proofImageUrl)}`}
  alt="Proof"
/>

                          {selectedComplaint.resolutionNotes && (

                            <div className="mt-6 rounded-2xl bg-black/20 p-5 border border-white/10">

                              <p className="text-sm text-gray-400 mb-2">
                                Resolution Notes
                              </p>

                              <p className="text-white leading-relaxed">
                                {selectedComplaint.resolutionNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default MyComplaints;