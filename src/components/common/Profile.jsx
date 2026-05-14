import React from "react";
import { motion } from "framer-motion";
import {
  IoPersonCircleOutline,
  IoMailOutline,
  IoCallOutline,
  IoShieldCheckmarkOutline,
  IoLocationOutline,
  IoCalendarOutline,
} from "react-icons/io5";

import DashboardLayout from "../../components/layout/Layout";
import { useAuthStore } from "../../store/authStore";

const Profile = () => {
  const { user } = useAuthStore();

  const sidebarLinks = [
    { name: "Dashboard", path: `/${user?.role?.toLowerCase()}/dashboard` },
  ];

  const getRoleColor = () => {
    if (user?.role === "ADMIN") {
      return "from-red-500 to-pink-600";
    }
    if (user?.role === "WORKER") {
      return "from-orange-500 to-amber-600";
    }
    return "from-primary-500 to-purple-600";
  };

  return (
    <DashboardLayout links={sidebarLinks}>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.2),transparent_40%)]" />

          <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Avatar */}
            <div
              className={`w-32 h-32 rounded-full bg-gradient-to-br ${getRoleColor()} p-[3px] shadow-2xl`}
            >
              <div className="w-full h-full rounded-full bg-[#0B1120] flex items-center justify-center">
                <IoPersonCircleOutline className="text-white" size={80} />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                <h1 className="text-4xl font-black text-white">
                  {user?.name}
                </h1>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${getRoleColor()} text-white shadow-lg`}
                >
                  {user?.role}
                </span>
              </div>

              <p className="text-gray-400 text-lg max-w-2xl">
                Manage your account information and monitor your activity inside
                the Smart City Management System.
              </p>

              <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300">
                  Smart City Portal User
                </div>

                <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400">
                  Account Active
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Personal Information
            </h2>

            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <IoPersonCircleOutline
                    className="text-primary-400"
                    size={24}
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-400">Full Name</p>
                  <p className="text-white font-semibold">
                    {user?.name || "Not Available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <IoMailOutline className="text-blue-400" size={24} />
                </div>

                <div>
                  <p className="text-sm text-gray-400">Email Address</p>
                  <p className="text-white font-semibold">
                    {user?.email || "Not Available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <IoCallOutline className="text-emerald-400" size={24} />
                </div>

                <div>
                  <p className="text-sm text-gray-400">Phone Number</p>
                  <p className="text-white font-semibold">
                    {user?.phone || "Not Available"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Account Details
            </h2>

            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <IoShieldCheckmarkOutline
                    className="text-purple-400"
                    size={24}
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-400">Role</p>
                  <p className="text-white font-semibold">{user?.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <IoLocationOutline
                    className="text-orange-400"
                    size={24}
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white font-semibold">
                    Pune, Maharashtra
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                  <IoCalendarOutline className="text-pink-400" size={24} />
                </div>

                <div>
                  <p className="text-sm text-gray-400">Account Status</p>
                  <p className="text-green-400 font-semibold">
                    Verified & Active
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl overflow-hidden border border-primary-500/20 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10 p-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Smart City Management System
              </h2>

              <p className="text-gray-300">
                Making city services smarter, faster, and more transparent.
              </p>
            </div>

            <div className="px-6 py-3 rounded-2xl bg-white/10 border border-white/10 text-white font-semibold backdrop-blur-xl">
              Premium Citizen Dashboard
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;