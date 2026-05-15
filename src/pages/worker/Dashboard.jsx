import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

import {
  IoHammerOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoTrendingUpOutline,
  IoMapOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoGridOutline,
  IoDocumentTextOutline,
  IoLocationOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
  IoSparklesOutline,
  IoArrowForwardOutline,
  IoConstructOutline,
} from "react-icons/io5";

import StatCard from "../../components/common/StatCard";
import ComplaintCard from "../../components/complaint/ComplaintCard";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import WorkerLayout from "../../components/layout/WorkerLayout";
import { complaintService } from "../../services/complaintService";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/authService";

import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WorkerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [complaints, setComplaints] = useState([]);

  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    completed: 0,
    total: 0,
  });

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const data =
        await complaintService.getWorkerComplaints(
          user.id
        );

      const complaintList = Array.isArray(data)
        ? data
        : [];

      setComplaints(complaintList);

      setStats({
        assigned: complaintList.filter(
          (c) => c.status === "ASSIGNED"
        ).length,

        inProgress: complaintList.filter(
          (c) => c.status === "IN_PROGRESS"
        ).length,

        completed: complaintList.filter(
          (c) => c.status === "RESOLVED"
        ).length,

        total: complaintList.length,
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

const { logout } = useAuthStore();
const handleLogout = async () => {
  try {
    logout();

    toast.success("Logged out successfully");

    navigate("/worker/login");

  } catch (error) {
    toast.error("Logout failed");
  }
};

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: <IoGridOutline size={22} />,
      path: "/worker/dashboard",
    },
    {
      title: "Assigned Tasks",
      icon: <IoHammerOutline size={22} />,
      path: "/worker/assigned-complaints",
    },
    {
      title: "All Complaints",
      icon: <IoDocumentTextOutline size={22} />,
      path: "/worker/all-complaints",
    },
    {
      title: "Update Location",
      icon: <IoLocationOutline size={22} />,
      path: "/worker/update-location",
    },
  ];

  if (loading) {
    return (
      <Loader
        fullScreen
        text="Loading Worker Dashboard..."
      />
    );
  }

  return (
  <WorkerLayout>
    <div className="relative min-h-screen text-white">
      {/* BACKGROUND */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-cyan-500/10 blur-[120px] rounded-full" />

        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>
      
      {/* MAIN CONTENT */}

      <div className="relative z-10">
        
        {/* PAGE CONTENT */}

        <main className="space-y-8">
          {/* HERO */}

          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              relative overflow-hidden
              rounded-[32px]
              border border-cyan-500/20
              bg-gradient-to-r
              from-cyan-500/10
              via-blue-500/10
              to-purple-500/10
              p-8 md:p-10
            "
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.20),transparent_35%)]" />

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-6">
                  <IoSparklesOutline />
                  Smart Worker Intelligence
                </div>

                <h1 className="text-4xl md:text-5xl font-black leading-tight">
                  Welcome Back,
                </h1>

                <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mt-2">
                  {user?.name}
                </h2>

                <p className="text-gray-300 mt-6 max-w-3xl text-base md:text-lg leading-relaxed">
                  Manage assigned complaints,
                  monitor field progress and
                  resolve city issues efficiently
                  through the smart worker system.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white/10 border border-white/10 p-6 min-w-[160px]">
                  <p className="text-gray-400 text-sm">
                    Active Tasks
                  </p>

                  <h2 className="text-4xl font-black text-cyan-400 mt-2">
                    {stats.assigned +
                      stats.inProgress}
                  </h2>
                </div>

                <div className="rounded-3xl bg-white/10 border border-white/10 p-6 min-w-[160px]">
                  <p className="text-gray-400 text-sm">
                    Resolved
                  </p>

                  <h2 className="text-4xl font-black text-green-400 mt-2">
                    {stats.completed}
                  </h2>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STATS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard
              title="Total Tasks"
              value={stats.total}
              icon={IoHammerOutline}
              color="primary"
              onClick={() =>
                navigate(
                  "/worker/assigned-complaints"
                )
              }
            />

            <StatCard
              title="Assigned"
              value={stats.assigned}
              icon={IoTimeOutline}
              color="warning"
            />

            <StatCard
              title="In Progress"
              value={stats.inProgress}
              icon={IoTrendingUpOutline}
              color="purple"
            />

            <StatCard
              title="Completed"
              value={stats.completed}
              icon={IoCheckmarkCircle}
              color="success"
            />
          </div>

          {/* ACTIVE TASKS */}

          <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-black">
                  Active Tasks
                </h2>

                <p className="text-gray-400 mt-2">
                  Current complaints assigned to
                  you
                </p>
              </div>

              <Button
                onClick={() =>
                  navigate(
                    "/worker/assigned-complaints"
                  )
                }
                icon={IoArrowForwardOutline}
                className="bg-gradient-to-r from-cyan-500 to-purple-600"
              >
                View All Tasks
              </Button>
            </div>

            {complaints.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {complaints
                  .slice(0, 4)
                  .map((complaint, index) => (
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
                          index * 0.08,
                      }}
                    >
                      <ComplaintCard
                        complaint={complaint}
                        onClick={() =>
                          navigate(
                            `/worker/resolve/${complaint.id}`
                          )
                        }
                      />
                    </motion.div>
                  ))}
              </div>
            ) : (
              <EmptyState
                icon={IoConstructOutline}
                title="No Active Tasks"
                description="You currently do not have any assigned complaints."
              />
            )}
          </div>

          {/* QUICK ACTIONS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Assigned Tasks",
                description:
                  "View and manage assigned complaints",
                icon: IoHammerOutline,
                color:
                  "from-orange-500/20 to-red-500/20",
                iconColor: "text-orange-400",
                path:
                  "/worker/assigned-complaints",
              },
              {
                title: "Update Location",
                description:
                  "Update live worker location",
                icon: IoLocationOutline,
                color:
                  "from-cyan-500/20 to-blue-500/20",
                iconColor: "text-cyan-400",
                path:
                  "/worker/update-location",
              },
              {
                title: "All Complaints",
                description:
                  "View complete complaint overview",
                icon: IoDocumentTextOutline,
                color:
                  "from-purple-500/20 to-pink-500/20",
                iconColor: "text-purple-400",
                path:
                  "/worker/all-complaints",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  whileHover={{
                    y: -6,
                  }}
                  onClick={() =>
                    navigate(item.path)
                  }
                  className={`
                    cursor-pointer
                    rounded-[30px]
                    border border-white/10
                    bg-gradient-to-br ${item.color}
                    backdrop-blur-2xl
                    p-8
                    transition-all duration-300
                    hover:border-cyan-500/30
                  `}
                >
                  <div
                    className={`
                      w-16 h-16 rounded-2xl
                      bg-white/10
                      flex items-center justify-center
                      mb-6
                    `}
                  >
                    <Icon
                      className={`${item.iconColor} text-3xl`}
                    />
                  </div>

                  <h3 className="text-2xl font-bold mb-3">
                    {item.title}
                  </h3>

                  <p className="text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  </WorkerLayout>
);

};

export default WorkerDashboard;