import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  IoShieldCheckmark,
  IoPeople,
  IoStatsChart,
  IoArrowForward,
  IoCheckmarkCircle,
  IoFlash,
  IoLayers,
  IoGlobeOutline,
  IoDesktopOutline,
  IoBarChartOutline,
  IoPulseOutline,
} from "react-icons/io5";

export default function AdminLanding() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Complaint Verification",
      desc: "Validate reports instantly and detect fake complaints using smart moderation.",
      icon: IoShieldCheckmark,
      color: "from-purple-500 to-fuchsia-500",
    },
    {
      title: "Worker Management",
      desc: "Monitor field workers, assign tasks intelligently and optimize operations.",
      icon: IoPeople,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Live Analytics",
      desc: "Track resolution efficiency, workload and city-wide complaint trends live.",
      icon: IoStatsChart,
      color: "from-emerald-500 to-green-500",
    },
  ];

  const stats = [
    {
      label: "System Monitoring",
      value: "24/7",
      icon: IoPulseOutline,
    },
    {
      label: "AI Assignment",
      value: "SMART",
      icon: IoFlash,
    },
    {
      label: "Control Layers",
      value: "FULL",
      icon: IoLayers,
    },
    {
      label: "Live Operations",
      value: "ACTIVE",
      icon: IoDesktopOutline,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">

      {/* BACKGROUND */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[-200px] left-[-100px] w-[650px] h-[650px] bg-purple-600/15 blur-[160px] rounded-full" />

        <div className="absolute bottom-[-250px] right-[-100px] w-[650px] h-[650px] bg-cyan-500/15 blur-[160px] rounded-full" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:70px_70px]" />

      </div>

      {/* NAVBAR */}

      <nav className="relative z-20 border-b border-white/10 bg-black/20 backdrop-blur-2xl">

        <div className="w-full px-6 xl:px-14 py-5 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-purple-500/20">
              <IoShieldCheckmark className="text-3xl" />
            </div>

            <div>

              <h1 className="text-3xl font-black tracking-wide bg-gradient-to-r from-purple-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                UrbanFix - Admin Pannel
              </h1>

              <p className="text-gray-400 text-sm mt-1">
                Intelligent Operations & Monitoring Center
              </p>

            </div>

          </div>

          <button
            onClick={() => navigate("/admin/login")}
            className="px-7 py-3 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/10 transition-all duration-300 font-semibold backdrop-blur-xl"
          >
            Admin Login
          </button>

        </div>

      </nav>

      {/* MAIN */}

      <main className="relative z-10 w-full px-6 xl:px-14 py-10">

        {/* TOP SECTION */}

        <div className="grid grid-cols-1 2xl:grid-cols-[1.2fr_0.8fr] gap-8 min-h-[820px]">

          {/* LEFT SIDE */}

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-[40px] border border-white/10 bg-white/[0.04] backdrop-blur-3xl overflow-hidden relative"
          >

            {/* INNER BG */}

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.18),transparent_30%)]" />

            <div className="relative z-10 h-full p-10 xl:p-14 flex flex-col justify-between">

              {/* HERO */}

              <div>

                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-sm font-medium">
                  <IoGlobeOutline />
                  Smart Governance Platform
                </div>

                <h1 className="mt-8 text-5xl md:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tight">

                  Intelligent
                  <br />

                  <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Admin Panel
                  </span>

                </h1>

                <p className="mt-8 text-xl text-gray-300 leading-relaxed max-w-3xl">
                  Advanced smart city administration system for monitoring complaints,
                  assigning workers, verifying reports and managing real-time city operations
                  through one centralized AI powered dashboard.
                </p>

                {/* ACTIONS */}

                <div className="flex flex-wrap gap-5 mt-12">

                  <button
                    onClick={() => navigate("/admin/login")}
                    className="group px-9 py-5 rounded-3xl bg-gradient-to-r from-purple-500 via-violet-500 to-cyan-500 text-lg font-bold flex items-center gap-3 shadow-2xl shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300"
                  >
                    Enter Dashboard

                    <IoArrowForward className="group-hover:translate-x-1 transition-transform duration-300" />
                  </button>

                </div>

              </div>

              {/* BOTTOM STATS */}

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mt-14">

                {stats.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={index}
                      whileHover={{ y: -4 }}
                      className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6"
                    >

                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                        <Icon className="text-2xl text-cyan-300" />
                      </div>

                      <h3 className="text-3xl font-black">
                        {item.value}
                      </h3>

                      <p className="text-gray-400 text-sm mt-2">
                        {item.label}
                      </p>

                    </motion.div>
                  );
                })}

              </div>

            </div>

          </motion.div>

          {/* RIGHT SIDE */}

          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-6"
          >

            {/* TOP ANALYTICS CARD */}

            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-3xl p-8 overflow-hidden relative">

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.15),transparent_35%)]" />

              <div className="relative z-10">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-cyan-300 text-sm font-medium">
                      LIVE CONTROL CENTER
                    </p>

                    <h2 className="text-4xl font-black mt-3">
                      Operations Status
                    </h2>

                  </div>

                  <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <IoBarChartOutline className="text-3xl text-cyan-300" />
                  </div>

                </div>

                <div className="mt-10 space-y-5">

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div>
                      <p className="text-gray-400 text-sm">
                        Complaint Verification
                      </p>

                      <h3 className="text-xl font-bold mt-1">
                        Active Monitoring
                      </h3>
                    </div>

                    <IoCheckmarkCircle className="text-3xl text-emerald-400" />
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div>
                      <p className="text-gray-400 text-sm">
                        Worker Routing
                      </p>

                      <h3 className="text-xl font-bold mt-1">
                        Smart Assignment Enabled
                      </h3>
                    </div>

                    <IoCheckmarkCircle className="text-3xl text-cyan-400" />
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div>
                      <p className="text-gray-400 text-sm">
                        Analytics Engine
                      </p>

                      <h3 className="text-xl font-bold mt-1">
                        Real-Time Insights Running
                      </h3>
                    </div>

                    <IoCheckmarkCircle className="text-3xl text-purple-400" />
                  </div>

                </div>

              </div>

            </div>

            {/* FEATURE CARDS */}

            <div className="grid gap-6 flex-1">

              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={index}
                    whileHover={{
                      y: -5,
                    }}
                    className="group rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-3xl p-8 relative overflow-hidden"
                  >

                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/[0.03] to-transparent" />

                    <div className="relative z-10 flex items-start gap-6">

                      <div
                        className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-2xl`}
                      >
                        <Icon className="text-4xl" />
                      </div>

                      <div className="flex-1">

                        <h3 className="text-3xl font-black">
                          {feature.title}
                        </h3>

                        <p className="text-gray-400 mt-4 text-lg leading-relaxed">
                          {feature.desc}
                        </p>

                      </div>

                    </div>

                  </motion.div>
                );
              })}

            </div>

          </motion.div>

        </div>

      </main>

    </div>
  );
}