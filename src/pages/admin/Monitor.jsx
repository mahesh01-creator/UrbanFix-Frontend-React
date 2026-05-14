import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  IoRefreshOutline,
  IoTrendingUpOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoWarningOutline,
  IoCheckmarkDoneOutline,
  IoPulseOutline,
  IoNotificationsOutline,
  IoSearchOutline,
  IoSparklesOutline,
} from "react-icons/io5";

import AdminLayout from "../../components/layout/AdminLayout";

import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

import { ComplaintBarChart } from "../../components/charts/StatsChart";

import { complaintService } from "../../services/complaintService";
import { authService } from "../../services/authService";

import { formatDate } from "../../utils/helpers";

import toast from "react-hot-toast";

const Monitor = () => {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(true);

  const [complaints, setComplaints] = useState([]);
  const [activeComplaints, setActiveComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    verified: 0,
  });

  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchMonitorData();

    const interval = setInterval(() => {
      fetchMonitorData(false);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const fetchMonitorData = async (showToast = false) => {
    try {
      setLoading(true);

      const [complaintsData, workersData] = await Promise.all([
        complaintService.getAllComplaints(),
        complaintService.getAllWorkers(),
      ]);

      setComplaints(complaintsData);
      setWorkers(workersData);

      const active = complaintsData.filter(
        (c) =>
          c.status === "ASSIGNED" ||
          c.status === "IN_PROGRESS" ||
          c.status === "VERIFIED"
      );

      setActiveComplaints(active);

      setStats({
        total: complaintsData.length,
        pending: complaintsData.filter(
          (c) => c.status === "PENDING"
        ).length,
        assigned: complaintsData.filter(
          (c) => c.status === "ASSIGNED"
        ).length,
        inProgress: complaintsData.filter(
          (c) => c.status === "IN_PROGRESS"
        ).length,
        resolved: complaintsData.filter(
          (c) => c.status === "RESOLVED"
        ).length,
        verified: complaintsData.filter(
          (c) => c.status === "VERIFIED"
        ).length,
      });

      setLastUpdate(new Date());

      if (showToast) {
        toast.success("Monitoring data refreshed");
      }
    } catch (err) {
      toast.error("Failed to load monitoring data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    toast.loading("Refreshing live data...");
    await fetchMonitorData(true);
    toast.dismiss();
  };

  const handleLogout = async () => {
    await authService.logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  if (loading && complaints.length === 0) {
    return <Loader fullScreen text="Loading Monitoring System..." />;
  }

  const weeklyChartData = [
    { name: "Pending", count: stats.pending },
    { name: "Verified", count: stats.verified },
    { name: "Assigned", count: stats.assigned },
    { name: "Working", count: stats.inProgress },
    { name: "Resolved", count: stats.resolved },
  ];

  const liveActivities = complaints
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    )
    .slice(0, 6);

  return (
    <AdminLayout>
      <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">

        {/* BACKGROUND (same dashboard style) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        {/* MAIN */}
        <main className="relative z-10 p-4 md:p-6 xl:p-8 space-y-8">

          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 p-8"
          >
            <div className="flex items-center gap-3 text-cyan-300 mb-3">
              <IoSparklesOutline />
              Live Monitoring System
            </div>

            <h1 className="text-4xl font-black">
              Monitoring Control Center
            </h1>

            <p className="text-gray-400 mt-2 max-w-2xl">
              Real-time tracking of complaints, workers, and system health across the smart city.
            </p>

            <div className="mt-6">
              <Button
                onClick={handleRefresh}
                icon={IoRefreshOutline}
                loading={loading}
              >
                Refresh Data
              </Button>
            </div>
          </motion.div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            <Card className="bg-orange-500/10 border border-orange-500/20">
              <h2 className="text-4xl font-black">{stats.inProgress}</h2>
              <p className="text-gray-300">In Progress</p>
            </Card>

            <Card className="bg-purple-500/10 border border-purple-500/20">
              <h2 className="text-4xl font-black">{stats.assigned}</h2>
              <p className="text-gray-300">Assigned</p>
            </Card>

            <Card className="bg-cyan-500/10 border border-cyan-500/20">
              <h2 className="text-4xl font-black">{stats.verified}</h2>
              <p className="text-gray-300">Verified</p>
            </Card>

            <Card className="bg-green-500/10 border border-green-500/20">
              <h2 className="text-4xl font-black">{stats.resolved}</h2>
              <p className="text-gray-300">Resolved</p>
            </Card>

          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* ACTIVE COMPLAINTS */}
            <div className="xl:col-span-2">
              <Card className="bg-white/5 border border-white/10 rounded-[32px]">
                <h2 className="text-2xl font-bold mb-6">
                  Active Complaints
                </h2>

                {activeComplaints.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    No active complaints currently
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeComplaints.map((c) => (
                      <div
                        key={c.id}
                        className="p-5 rounded-2xl bg-white/5 border border-white/10"
                      >
                        <div className="flex justify-between">
                          <h3 className="font-bold">{c.title}</h3>
                          <Badge status={c.status} />
                        </div>

                        <p className="text-gray-400 text-sm mt-2">
                          {c.description}
                        </p>

                        <p className="text-xs text-gray-500 mt-3">
                          {formatDate(c.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">

              {/* CHART */}
              <Card className="bg-white/5 border border-white/10">
                <h2 className="text-xl font-bold mb-4">
                  System Analytics
                </h2>

                <ComplaintBarChart data={weeklyChartData} />
              </Card>

              {/* LIVE FEED */}
              <Card className="bg-white/5 border border-white/10">
                <h2 className="text-xl font-bold mb-4">
                  Live Activity
                </h2>

                <div className="space-y-3">
                  {liveActivities.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <p className="text-sm">
                        Complaint #{item.id} → {item.status}
                      </p>

                      <p className="text-xs text-gray-400">
                        {formatDate(item.updatedAt || item.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* SYSTEM HEALTH */}
              <Card className="bg-white/5 border border-white/10">
                <h2 className="text-xl font-bold mb-4">
                  System Health
                </h2>

                <p className="text-gray-400 text-sm">
                  Resolution Rate:{" "}
                  {stats.total
                    ? ((stats.resolved / stats.total) * 100).toFixed(1)
                    : 0}
                  %
                </p>
              </Card>

              {/* LAST UPDATED */}
              <Card className="bg-white/5 border border-white/10">
                <p className="text-gray-400 text-sm">Last Updated</p>
                <p className="font-bold">{formatDate(lastUpdate)}</p>
              </Card>

            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default Monitor;