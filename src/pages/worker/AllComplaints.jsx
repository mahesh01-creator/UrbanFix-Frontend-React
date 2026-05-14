import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

import {
  IoSearchOutline,
  IoEyeOutline,
  IoMenu,
  IoClose,
  IoHomeOutline,
  IoHammerOutline,
  IoDocumentTextOutline,
  IoMapOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
  IoShieldCheckmarkOutline,
  IoCalendarOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
} from "react-icons/io5";

import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";

import { complaintService } from "../../services/complaintService";
import { formatDate } from "../../utils/helpers";
import { useAuthStore } from "../../store/authStore";
import WorkerLayout from "../../components/layout/WorkerLayout";
import toast from "react-hot-toast";
const BASE_URL = "http://localhost:8080";
const sidebarItems = [
  {
    title: "Dashboard",
    path: "/worker/dashboard",
    icon: <IoHomeOutline size={22} />,
  },
  {
    title: "Assigned Tasks",
    path: "/worker/assigned-complaints",
    icon: <IoHammerOutline size={22} />,
  },
  {
    title: "Update Location",
    path: "/worker/update-location",
    icon: <IoMapOutline size={22} />,
  },
  {
    title: "All Complaints",
    path: "/worker/all-complaints",
    icon: <IoDocumentTextOutline size={22} />,
  },
];

const WorkerAllComplaints = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] =
    useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [searchQuery, complaints]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      let data = [];

      // ✅ FIXED API CALL
      if (complaintService.getWorkerComplaints) {
        data =
          await complaintService.getWorkerComplaints(
            user?.id
          );
      } else if (
        complaintService.getAssignedComplaints
      ) {
        data =
          await complaintService.getAssignedComplaints(
            user?.id
          );
      } else if (
        complaintService.getAllComplaints
      ) {
        data =
          await complaintService.getAllComplaints();
      }

      // ✅ Safe fallback
      if (!Array.isArray(data)) {
        data = data?.data || [];
      }

      setComplaints(data);
      setFilteredComplaints(data);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    if (!searchQuery.trim()) {
      setFilteredComplaints(complaints);
      return;
    }

    const filtered = complaints.filter(
      (complaint) =>
        complaint?.title
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        complaint?.category
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        complaint?.status
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    );

    setFilteredComplaints(filtered);
  };

  const handleLogout = async () => {
    try {
      await logout();

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.success("Logged out successfully");

      navigate("/worker/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <Loader
        fullScreen
        text="Loading Worker Complaints..."
      />
    );
  }

  return (
  <WorkerLayout>
    <div className="relative min-h-screen text-white">
      

        {/* CONTENT */}
        <main className="p-4 md:p-6 xl:p-8 space-y-8">
          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[32px] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.2),transparent_35%)]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-6">
                <IoCheckmarkCircleOutline />
                Complaint History System
              </div>

              <h1 className="text-5xl font-black">
                Worker Complaint
              </h1>

              <h2 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mt-2">
                History Center
              </h2>

              <p className="text-gray-300 mt-6 max-w-3xl text-lg leading-relaxed">
                Track all assigned complaints,
                completed tasks, and work activity
                history in one place.
              </p>
            </div>
          </motion.div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-[28px] p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                  <IoDocumentTextOutline className="text-3xl text-cyan-400" />
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    Total Complaints
                  </p>

                  <h2 className="text-3xl font-black">
                    {complaints.length}
                  </h2>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-[28px] p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
                  <IoCheckmarkCircleOutline className="text-3xl text-green-400" />
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    Completed
                  </p>

                  <h2 className="text-3xl font-black">
                    {
                      complaints.filter(
                        (c) =>
                          c.status === "RESOLVED"
                      ).length
                    }
                  </h2>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-[28px] p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                  <IoTimeOutline className="text-3xl text-purple-400" />
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    Active Tasks
                  </p>

                  <h2 className="text-3xl font-black">
                    {
                      complaints.filter(
                        (c) =>
                          c.status !== "RESOLVED"
                      ).length
                    }
                  </h2>
                </div>
              </div>
            </Card>
          </div>

          {/* SEARCH */}
          <Card className="bg-white/[0.04] border border-white/10 rounded-[32px] p-6">
            <div className="relative">
              <IoSearchOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search complaints by title, category or status..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-5 py-4 outline-none focus:border-cyan-500 transition-all"
              />
            </div>
          </Card>

          {/* TABLE */}
          <Card className="bg-white/[0.04] border border-white/10 rounded-[32px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-white/[0.03] border-b border-white/10">
                  <tr>
                    <th className="p-5 text-left text-gray-400">
                      ID
                    </th>

                    <th className="p-5 text-left text-gray-400">
                      Title
                    </th>

                    <th className="p-5 text-left text-gray-400">
                      Category
                    </th>

                    <th className="p-5 text-left text-gray-400">
                      Status
                    </th>

                    <th className="p-5 text-left text-gray-400">
                      Date
                    </th>

                    <th className="p-5 text-left text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map(
                      (complaint, index) => (
                        <motion.tr
                          key={complaint.id}
                          initial={{
                            opacity: 0,
                            y: 10,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay: index * 0.03,
                          }}
                          className="border-b border-white/5 hover:bg-white/[0.03] transition-all"
                        >
                          <td className="p-5 text-gray-400">
                            #{complaint.id}
                          </td>

                          <td className="p-5">
                            <div>
                              <h3 className="font-semibold">
                                {complaint.title}
                              </h3>

                              <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                                {
                                  complaint.description
                                }
                              </p>
                            </div>
                          </td>

                          <td className="p-5">
                            <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 text-sm border border-purple-500/20">
                              {complaint.category}
                            </span>
                          </td>

                          <td className="p-5">
                            <Badge
                              status={
                                complaint.status
                              }
                              size="sm"
                            />
                          </td>

                          <td className="p-5 text-gray-400">
                            <div className="flex items-center gap-2">
                              <IoCalendarOutline />

                              {formatDate(
                                complaint.createdAt
                              )}
                            </div>
                          </td>

                          <td className="p-5">
                            <Button
                              size="sm"
                              variant="secondary"
                              icon={IoEyeOutline}
                              onClick={() => {
                                setSelectedComplaint(
                                  complaint
                                );

                                setShowModal(true);
                              }}
                            >
                              View
                            </Button>
                          </td>
                        </motion.tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-20 text-gray-400"
                      >
                        No complaints found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Complaint Details"
        size="lg"
      >
        {selectedComplaint && (
          <div className="space-y-6">
            {selectedComplaint.imageUrl && (
              <img
                src={`${BASE_URL}/uploads/${encodeURIComponent(selectedComplaint.imageUrl)}`}
                alt={selectedComplaint.title}
                className="w-full h-72 object-cover rounded-2xl"
              />
            )}

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">
                    {selectedComplaint.title}
                  </h2>

                  <p className="text-gray-400 mt-1">
                    Complaint ID #
                    {selectedComplaint.id}
                  </p>
                </div>

                <Badge
                  status={selectedComplaint.status}
                />
              </div>

              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-sm text-gray-400 mb-2">
                  Description
                </p>

                <p className="leading-relaxed text-gray-200">
                  {
                    selectedComplaint.description
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <p className="text-sm text-gray-400 mb-2">
                    Category
                  </p>

                  <p className="font-semibold">
                    {
                      selectedComplaint.category
                    }
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <p className="text-sm text-gray-400 mb-2">
                    Location
                  </p>

                  <p className="font-semibold">
                    {selectedComplaint.location ||
                      "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
        
  </WorkerLayout>
);
};

export default WorkerAllComplaints;