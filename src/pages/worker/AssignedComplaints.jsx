import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

import {
  IoMenu,
  IoClose,
  IoHammerOutline,
  IoPlayCircleOutline,
  IoCheckmarkCircleOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoNotificationsOutline,
  IoLogOutOutline,
  IoGridOutline,
  IoMapOutline,
  IoDocumentTextOutline,
  IoSparklesOutline,
  IoFlashOutline,
  IoChatbubbleEllipsesOutline,
  IoEyeOutline,
  IoStar,
} from "react-icons/io5";

import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import WorkerLayout from "../../components/layout/WorkerLayout";
import { complaintService } from "../../services/complaintService";
import { authService } from "../../services/authService";

import { useAuthStore } from "../../store/authStore";
import { formatDate } from "../../utils/helpers";

import toast from "react-hot-toast";
const BASE_URL = "http://localhost:8080";
const AssignedComplaints = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedFeedback, setSelectedFeedback] =
    useState(null);

  const [showFeedbackModal, setShowFeedbackModal] =
    useState(false);

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: <IoGridOutline size={20} />,
      path: "/worker/dashboard",
    },
    {
      title: "Assigned Tasks",
      icon: <IoHammerOutline size={20} />,
      path: "/worker/assigned-complaints",
    },
    {
      title: "Update Location",
      icon: <IoMapOutline size={20} />,
      path: "/worker/update-location",
    },
    {
      title: "All Complaints",
      icon: <IoDocumentTextOutline size={20} />,
      path: "/worker/all-complaints",
    },
  ];

  useEffect(() => {
    if (user?.id) {
      fetchAssignedComplaints();
    }
  }, [user]);

  const fetchAssignedComplaints = async () => {
    try {
      setLoading(true);

      const data =
        await complaintService.getWorkerComplaints(
          user.id
        );

      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load assigned complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleStartWork = async (complaintId) => {
    try {
      await complaintService.startWork(
        user.id,
        complaintId
      );

      toast.success("Work started successfully 🚀");

      fetchAssignedComplaints();
    } catch (error) {
      toast.error(
        error?.message || "Failed to start work"
      );
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.success("Logged out successfully");

      navigate("/worker/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    if (filter === "ALL") return true;

    if (filter === "ASSIGNED")
      return c.status === "ASSIGNED";

    if (filter === "IN_PROGRESS")
      return c.status === "IN_PROGRESS";

    if (filter === "RESOLVED")
      return c.status === "RESOLVED";

    return true;
  });

  const assignedCount = complaints.filter(
    (c) => c.status === "ASSIGNED"
  ).length;

  const inProgressCount = complaints.filter(
    (c) => c.status === "IN_PROGRESS"
  ).length;

  const completedCount = complaints.filter(
    (c) => c.status === "RESOLVED"
  ).length;

  if (loading) {
    return (
      <Loader
        fullScreen
        text="Loading Assigned Complaints..."
      />
    );
  }

  return (
  <WorkerLayout>
    <div className="relative min-h-screen text-white">
    
        {/* CONTENT */}
        <main className="relative space-y-8 overflow-hidden">          {/* BACKGROUND EFFECTS */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full" />

            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full" />
          </div>

          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[32px] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.2),transparent_40%)]" />

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-6">
                  <IoSparklesOutline />
                  Smart Workforce Management
                </div>

                <h1 className="text-4xl md:text-5xl font-black">
                  Assigned Tasks
                </h1>

                <p className="text-gray-300 mt-6 max-w-3xl text-base md:text-lg leading-relaxed">
                  View assigned complaints, start field
                  work, resolve issues and track citizen
                  feedback professionally.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 min-w-[300px]">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-gray-400 text-sm">
                    Assigned
                  </p>

                  <h2 className="text-4xl font-black text-yellow-400 mt-2">
                    {assignedCount}
                  </h2>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-gray-400 text-sm">
                    In Progress
                  </p>

                  <h2 className="text-4xl font-black text-orange-400 mt-2">
                    {inProgressCount}
                  </h2>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 col-span-2">
                  <p className="text-gray-400 text-sm">
                    Resolved
                  </p>

                  <h2 className="text-4xl font-black text-green-400 mt-2">
                    {completedCount}
                  </h2>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FILTERS */}
          <Card className="bg-white/5 border border-white/10 rounded-[30px] backdrop-blur-2xl">
            <div className="flex flex-wrap gap-3">
              {[
                "ALL",
                "ASSIGNED",
                "IN_PROGRESS",
                "RESOLVED",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    filter === tab
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                      : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {tab.replace("_", " ")}
                </button>
              ))}
            </div>
          </Card>

          {/* EMPTY STATE */}
          {filteredComplaints.length === 0 ? (
            <Card className="bg-white/5 border border-white/10 rounded-[32px]">
              <div className="py-16">
                <EmptyState
                  icon={IoCheckmarkCircleOutline}
                  title="No complaints found"
                  description="No assignments available for this filter"
                />
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredComplaints.map(
                (complaint, index) => (
                  <motion.div
                    key={complaint.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    whileHover={{ y: -6 }}
                  >
                    <Card className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[30px] overflow-hidden hover:border-cyan-500/30 transition-all duration-300">
                      {/* IMAGE */}
                      {complaint.imageUrl && (
                        <div className="relative h-64 overflow-hidden">
                         <img
  src={`${BASE_URL}/uploads/${encodeURIComponent(complaint.imageUrl)}`}
  alt="Complaint"
  className="w-full h-52 object-cover hover:scale-105 transition duration-700"
/>

                          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] to-transparent" />

                          <div className="absolute top-5 right-5">
                            <Badge
                              status={
                                complaint.status
                              }
                            />
                          </div>
                        </div>
                      )}

                      {/* CONTENT */}
                      <div className="p-6 space-y-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-cyan-400 text-sm mb-2">
                              Complaint #
                              {complaint.id}
                            </p>

                            <h2 className="text-2xl font-bold leading-snug">
                              {complaint.title}
                            </h2>
                          </div>

                          {!complaint.imageUrl && (
                            <Badge
                              status={
                                complaint.status
                              }
                            />
                          )}
                        </div>

                        <p className="text-gray-400 line-clamp-3 leading-relaxed">
                          {complaint.description}
                        </p>

                        {/* DETAILS */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                              <IoFlashOutline />
                              Category
                            </div>

                            <p className="font-semibold">
                              {complaint.category}
                            </p>
                          </div>

                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                              <IoTimeOutline />
                              Assigned
                            </div>

                            <p className="font-semibold">
                              {formatDate(
                                complaint.assignedAt ||
                                  complaint.createdAt
                              )}
                            </p>
                          </div>
                        </div>

                        {/* LOCATION */}
                        {complaint.location && (
                          <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                            <IoLocationOutline className="text-cyan-400 text-xl mt-1" />

                            <div>
                              <p className="text-sm text-gray-400">
                                Location
                              </p>

                              <p className="text-white mt-1">
                                {
                                  complaint.location
                                }
                              </p>
                            </div>
                          </div>
                        )}

                        {/* ADMIN REMARK */}
                        {complaint.adminRemark && (
                          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <IoChatbubbleEllipsesOutline className="text-cyan-400 text-lg" />

                              <h3 className="font-semibold text-cyan-300">
                                Admin Remark
                              </h3>
                            </div>

                            <p className="text-gray-300 leading-relaxed">
                              {
                                complaint.adminRemark
                              }
                            </p>
                          </div>
                        )}

                        {/* ACTIONS */}
                        <div className="pt-3 space-y-3">
                          {complaint.status ===
                            "ASSIGNED" && (
                            <Button
                              fullWidth
                              icon={
                                IoPlayCircleOutline
                              }
                              onClick={() =>
                                handleStartWork(
                                  complaint.id
                                )
                              }
                              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] transition-all"
                            >
                              Start Work
                            </Button>
                          )}

                          {complaint.status ===
                            "IN_PROGRESS" && (
                            <>
                              <Button
                                fullWidth
                                icon={
                                  IoCheckmarkCircleOutline
                                }
                                onClick={() =>
                                  navigate(
                                    `/worker/resolve/${complaint.id}`
                                  )
                                }
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02] transition-all"
                              >
                                Mark as Resolved
                              </Button>

                              <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center">
                                <p className="text-orange-300 text-sm font-medium flex items-center justify-center gap-2">
                                  <motion.span
                                    animate={{
                                      rotate: 360,
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat:
                                        Infinity,
                                      ease: "linear",
                                    }}
                                  >
                                    🔧
                                  </motion.span>

                                  Work Currently In
                                  Progress
                                </p>
                              </div>
                            </>
                          )}

                          {complaint.status ===
                            "RESOLVED" && (
                            <div className="space-y-3">
                              <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-center">
                                <p className="text-green-300 font-semibold flex items-center justify-center gap-2">
                                  <IoCheckmarkCircleOutline />

                                  Complaint
                                  Successfully
                                  Resolved
                                </p>
                              </div>

                              <Button
                                fullWidth
                                icon={IoEyeOutline}
                                onClick={() => {
                                  setSelectedFeedback(
                                    complaint
                                  );

                                  setShowFeedbackModal(
                                    true
                                  );
                                }}
                                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-[1.02] transition-all"
                              >
                                View User Feedback
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              )}
            </div>
          )}
        </main>
      </div>

      {/* FEEDBACK MODAL */}
      {showFeedbackModal &&
        selectedFeedback && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="w-full max-w-2xl rounded-[32px] bg-[#0B1120] border border-white/10 p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-white">
                    User Feedback
                  </h2>

                  <p className="text-gray-400 mt-2">
                    Review citizen response
                    for completed work
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowFeedbackModal(false)
                  }
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* COMPLAINT */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                <h3 className="text-xl font-bold text-white">
                  {selectedFeedback.title}
                </h3>

                <p className="text-gray-400 mt-2">
                  {
                    selectedFeedback.category
                  }
                </p>
              </div>

              {/* RATING */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <IoStar className="text-yellow-400 text-xl" />

                  <h3 className="text-yellow-300 font-semibold">
                    User Rating
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <IoStar
                        key={star}
                        className={`text-3xl ${
                          star <=
                          (selectedFeedback.rating ||
                            0)
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    )
                  )}
                </div>
              </div>

              {/* FEEDBACK */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <IoChatbubbleEllipsesOutline className="text-purple-400 text-xl" />

                  <h3 className="text-purple-300 font-semibold">
                    User Comment
                  </h3>
                </div>

                <p className="text-gray-300 leading-relaxed">
                  {selectedFeedback.feedback ||
                    "No feedback comment provided by user."}
                </p>
              </div>

              <Button
                fullWidth
                onClick={() =>
                  setShowFeedbackModal(false)
                }
                className="mt-8 bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                Close
              </Button>
            </motion.div>
          </div>
          
        )}
  </WorkerLayout>    
  );
};

export default AssignedComplaints;