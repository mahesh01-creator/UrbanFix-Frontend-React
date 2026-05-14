import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  IoDocumentTextOutline,
  IoCheckmarkCircle,
  IoTrendingUpOutline,
  IoAlertCircleOutline,
  IoPeopleOutline,
  IoTimeOutline,
  IoSparklesOutline,
  IoCloseOutline,
  IoArrowForwardOutline,
  IoShieldCheckmarkOutline,
  IoConstructOutline,
} from "react-icons/io5";

import StatCard from "../../components/common/StatCard";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Badge from "../../components/common/Badge";

import {
  ComplaintBarChart,
  ComplaintPieChart,
} from "../../components/charts/StatsChart";

import AdminLayout from "../../components/layout/AdminLayout";

import { complaintService } from "../../services/complaintService";
import { formatDate } from "../../utils/helpers";

import toast from "react-hot-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    inProgress: 0,
    resolved: 0,
    workers: 0,
  });

  const [allComplaints, setAllComplaints] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);

  const [chartData, setChartData] = useState({
    categoryData: [],
    statusData: [],
  });

  /* ================= FILTER MODAL ================= */

  const [showStatusModal, setShowStatusModal] =
    useState(false);

  const [selectedStatus, setSelectedStatus] =
    useState("");

  const admin = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [complaints, workers] = await Promise.all([
        complaintService.getAllComplaints(),
        complaintService.getAllWorkers(),
      ]);

      setAllComplaints(complaints);

      const calculatedStats = {
        total: complaints.length,

        pending: complaints.filter(
          (c) => c.status === "PENDING"
        ).length,

        verified: complaints.filter(
          (c) => c.status === "VERIFIED"
        ).length,

        inProgress: complaints.filter(
          (c) =>
            c.status === "IN_PROGRESS" ||
            c.status === "ASSIGNED"
        ).length,

        resolved: complaints.filter(
          (c) => c.status === "RESOLVED"
        ).length,

        workers: workers.length,
      };

      setStats(calculatedStats);

      setRecentComplaints(
        complaints
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt) -
              new Date(a.createdAt)
          )
          .slice(0, 6)
      );

      /* CATEGORY DATA */

      const categoryCount = {};

      complaints.forEach((c) => {
        categoryCount[c.category] =
          (categoryCount[c.category] || 0) + 1;
      });

      const categoryData = Object.entries(
        categoryCount
      ).map(([name, count]) => ({
        name,
        count,
      }));

      /* STATUS DATA */

      const statusData = [
        {
          name: "Pending",
          value: calculatedStats.pending,
        },
        {
          name: "Verified",
          value: calculatedStats.verified,
        },
        {
          name: "In Progress",
          value: calculatedStats.inProgress,
        },
        {
          name: "Resolved",
          value: calculatedStats.resolved,
        },
      ];

      setChartData({
        categoryData,
        statusData,
      });
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS FILTER ================= */

  const filteredComplaints = useMemo(() => {
    if (!selectedStatus) return [];

    if (selectedStatus === "IN_PROGRESS") {
      return allComplaints.filter(
        (c) =>
          c.status === "IN_PROGRESS" ||
          c.status === "ASSIGNED"
      );
    }

    return allComplaints.filter(
      (c) => c.status === selectedStatus
    );
  }, [selectedStatus, allComplaints]);

  const openStatusModal = (status) => {
    setSelectedStatus(status);
    setShowStatusModal(true);
  };

  if (loading) {
    return (
      <Loader
        fullScreen
        text="Loading Smart Dashboard..."
      />
    );
  }

  return (
    <AdminLayout>
      <div className="relative min-h-screen text-white">

        {/* BACKGROUND EFFECTS */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full" />

          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full" />
        </div>

        <div className="relative z-10 space-y-8">

          {/* HERO */}

          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              relative overflow-hidden
              rounded-[36px]
              border border-cyan-500/20
              bg-gradient-to-br
              from-cyan-500/10
              via-purple-500/10
              to-pink-500/10
              p-8 md:p-10
            "
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.20),transparent_40%)]" />

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

              {/* LEFT */}

              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-6">
                  <IoSparklesOutline />
                  Premium Smart Administration
                </div>

                <h1 className="text-4xl md:text-6xl font-black leading-tight">
                  Welcome Back,
                </h1>

                <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mt-2">
                  {admin?.name || "Administrator"}
                </h2>

                <p className="text-gray-300 mt-6 max-w-3xl text-base md:text-lg leading-relaxed">
                  Monitor live city complaints,
                  analyze operational activity,
                  manage workers and maintain
                  seamless smart city services
                  through one premium command center.
                </p>
              </div>

              {/* RIGHT */}

              <div className="grid grid-cols-2 gap-4 min-w-[320px]">

                <div className="rounded-3xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl">
                  <p className="text-gray-400 text-sm">
                    Resolution Rate
                  </p>

                  <h3 className="text-4xl font-black mt-3 text-green-400">
                    {stats.total > 0
                      ? (
                          (stats.resolved /
                            stats.total) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </h3>
                </div>

                <div className="rounded-3xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl">
                  <p className="text-gray-400 text-sm">
                    Active Workers
                  </p>

                  <h3 className="text-4xl font-black mt-3 text-cyan-400">
                    {stats.workers}
                  </h3>
                </div>

              </div>
            </div>
          </motion.div>

          {/* PREMIUM STATS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

            {/* TOTAL */}

            <motion.div
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
              onClick={() =>
                navigate("/admin/all-complaints")
              }
            >
              <StatCard
                title="Total Complaints"
                value={stats.total}
                icon={IoDocumentTextOutline}
                color="primary"
              />
            </motion.div>

            {/* PENDING */}

            <motion.div
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
              onClick={() =>
                openStatusModal("PENDING")
              }
            >
              <StatCard
                title="Pending"
                value={stats.pending}
                icon={IoAlertCircleOutline}
                color="warning"
              />
            </motion.div>

            {/* IN PROGRESS */}

            <motion.div
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
              onClick={() =>
                openStatusModal("IN_PROGRESS")
              }
            >
              <StatCard
                title="In Progress"
                value={stats.inProgress}
                icon={IoTrendingUpOutline}
                color="purple"
              />
            </motion.div>

            {/* RESOLVED */}

            <motion.div
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
              onClick={() =>
                openStatusModal("RESOLVED")
              }
            >
              <StatCard
                title="Resolved"
                value={stats.resolved}
                icon={IoCheckmarkCircle}
                color="success"
              />
            </motion.div>

          </div>

          {/* CHARTS */}

          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">

            <Card className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[30px] overflow-hidden p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black">
                    Complaint Categories
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    Category wise analytics
                  </p>
                </div>
              </div>

              <ComplaintBarChart
                data={chartData.categoryData}
              />
            </Card>

            <Card className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[30px] overflow-hidden p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black">
                    Status Distribution
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    Live operational insights
                  </p>
                </div>
              </div>

              <ComplaintPieChart
                data={chartData.statusData}
              />
            </Card>

          </div>

          {/* MAIN GRID */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* RECENT COMPLAINTS */}

            <div className="xl:col-span-2">

              <Card className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-6">

                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black">
                      Recent Complaints
                    </h2>

                    <p className="text-gray-400 mt-1">
                      Latest complaints submitted
                      across the city
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      navigate(
                        "/admin/all-complaints"
                      )
                    }
                    className="
                      flex items-center gap-2
                      px-4 py-3 rounded-2xl
                      bg-white/5 hover:bg-white/10
                      border border-white/10
                      transition-all
                    "
                  >
                    View All
                    <IoArrowForwardOutline />
                  </button>
                </div>

                <div className="space-y-4">

                  {recentComplaints.map(
                    (complaint, index) => (
                      <motion.div
                        key={complaint.id}
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay:
                            index * 0.05,
                        }}
                        onClick={() =>
                          navigate(
                            `/admin/complaint/${complaint.id}`
                          )
                        }
                        className="
                          group cursor-pointer
                          rounded-3xl
                          border border-white/10
                          bg-white/[0.03]
                          hover:bg-white/[0.07]
                          hover:border-cyan-500/30
                          p-5
                          transition-all duration-300
                        "
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">

                          <div className="flex-1">

                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-xl font-bold group-hover:text-cyan-300 transition-all">
                                {
                                  complaint.title
                                }
                              </h3>

                              <Badge
                                status={
                                  complaint.status
                                }
                                size="sm"
                              />
                            </div>

                            <p className="text-gray-400 text-sm line-clamp-2">
                              {
                                complaint.description
                              }
                            </p>

                            <div className="flex flex-wrap items-center gap-3 mt-5">

                              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                                {
                                  complaint.category
                                }
                              </span>

                              <span className="flex items-center gap-2 text-xs text-gray-500">
                                <IoTimeOutline />

                                {formatDate(
                                  complaint.createdAt
                                )}
                              </span>

                            </div>
                          </div>

                          <div className="flex items-center">
                            <IoArrowForwardOutline className="text-2xl text-gray-500 group-hover:text-cyan-400 transition-all" />
                          </div>

                        </div>
                      </motion.div>
                    )
                  )}

                </div>

              </Card>

            </div>

            {/* SIDE PANEL */}

            <div className="space-y-6">

              {/* QUICK ACTIONS */}

              <Card className="rounded-[30px] bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-500/20 p-6">

                <h3 className="text-2xl font-black mb-6">
                  Quick Actions
                </h3>

                <div className="space-y-4">

                  <button
                    onClick={() =>
                      navigate(
                        "/admin/verify-complaint"
                      )
                    }
                    className="
                      w-full text-left p-5
                      rounded-3xl
                      bg-white/5 hover:bg-white/10
                      border border-white/10
                      transition-all
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-yellow-500/10">
                        <IoShieldCheckmarkOutline
                          className="text-yellow-400"
                          size={24}
                        />
                      </div>

                      <div>
                        <h4 className="font-bold">
                          Verify Complaints
                        </h4>

                        <p className="text-xs text-gray-400 mt-1">
                          Review & approve
                          submitted reports
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        "/admin/assignWorkers"
                      )
                    }
                    className="
                      w-full text-left p-5
                      rounded-3xl
                      bg-white/5 hover:bg-white/10
                      border border-white/10
                      transition-all
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-purple-500/10">
                        <IoPeopleOutline
                          className="text-purple-400"
                          size={24}
                        />
                      </div>

                      <div>
                        <h4 className="font-bold">
                          Assign Workers
                        </h4>

                        <p className="text-xs text-gray-400 mt-1">
                          Allocate complaints
                          to workers
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        "/admin/workersManagement"
                      )
                    }
                    className="
                      w-full text-left p-5
                      rounded-3xl
                      bg-white/5 hover:bg-white/10
                      border border-white/10
                      transition-all
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-cyan-500/10">
                        <IoConstructOutline
                          className="text-cyan-400"
                          size={24}
                        />
                      </div>

                      <div>
                        <h4 className="font-bold">
                          Worker Management
                        </h4>

                        <p className="text-xs text-gray-400 mt-1">
                          Manage workforce &
                          operations
                        </p>
                      </div>
                    </div>
                  </button>

                </div>

              </Card>

            </div>

          </div>
        </div>

        {/* ================= STATUS MODAL ================= */}

        <AnimatePresence>

          {showStatusModal && (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="
                fixed inset-0 z-[100]
                bg-black/70 backdrop-blur-sm
                flex items-center justify-center
                p-4
              "
            >

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: 40,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                }}
                className="
                  w-full max-w-5xl
                  max-h-[90vh]
                  overflow-hidden
                  rounded-[36px]
                  border border-white/10
                  bg-[#0B1120]/95
                  backdrop-blur-2xl
                "
              >

                {/* HEADER */}

                <div className="flex items-center justify-between p-6 border-b border-white/10">

                  <div>
                    <h2 className="text-3xl font-black">
                      {selectedStatus.replace(
                        "_",
                        " "
                      )}{" "}
                      Complaints
                    </h2>

                    <p className="text-gray-400 mt-1">
                      Complaints filtered by
                      selected status
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setShowStatusModal(false)
                    }
                    className="
                      p-3 rounded-2xl
                      bg-white/5 hover:bg-white/10
                      border border-white/10
                    "
                  >
                    <IoCloseOutline size={24} />
                  </button>

                </div>

                {/* CONTENT */}

                <div className="p-6 overflow-y-auto max-h-[75vh]">

                  {filteredComplaints.length >
                  0 ? (

                    <div className="space-y-4">

                      {filteredComplaints.map(
                        (complaint) => (

                          <motion.div
                            whileHover={{
                              scale: 1.01,
                            }}
                            key={complaint.id}
                            onClick={() =>
                              navigate(
                                `/admin/complaint/${complaint.id}`
                              )
                            }
                            className="
                              cursor-pointer
                              rounded-3xl
                              border border-white/10
                              bg-white/[0.03]
                              hover:bg-white/[0.07]
                              hover:border-cyan-500/30
                              p-5 transition-all
                            "
                          >

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                              <div className="flex-1">

                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="text-xl font-bold">
                                    {
                                      complaint.title
                                    }
                                  </h3>

                                  <Badge
                                    status={
                                      complaint.status
                                    }
                                    size="sm"
                                  />
                                </div>

                                <p className="text-gray-400 text-sm line-clamp-2">
                                  {
                                    complaint.description
                                  }
                                </p>

                                <div className="flex flex-wrap gap-3 mt-4">

                                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                                    {
                                      complaint.category
                                    }
                                  </span>

                                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                                    {
                                      complaint.location
                                    }
                                  </span>

                                </div>

                              </div>

                              <IoArrowForwardOutline className="text-2xl text-cyan-400" />

                            </div>

                          </motion.div>
                        )
                      )}

                    </div>

                  ) : (

                    <div className="py-20 text-center">

                      <h3 className="text-3xl font-black">
                        No Complaints Found
                      </h3>

                      <p className="text-gray-400 mt-3">
                        There are currently no
                        complaints in this status.
                      </p>

                    </div>

                  )}

                </div>

              </motion.div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;