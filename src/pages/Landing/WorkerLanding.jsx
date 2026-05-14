import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  IoConstruct,
  IoLocation,
  IoCheckmarkDone,
  IoArrowForward,
  IoFlash,
  IoMapOutline,
  IoShieldCheckmark,
  IoTimerOutline,
  IoNavigateOutline,
  IoLayersOutline,
  IoPulseOutline,
  IoCheckmarkCircle,
  IoHammerOutline,
} from "react-icons/io5";

export default function WorkerLanding() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Assigned Complaints",
      desc: "Receive real-time civic tasks directly from the smart assignment engine.",
      icon: IoConstruct,
      color: "from-emerald-500 to-green-500",
    },
    {
      title: "Live Location Tracking",
      desc: "Keep your location updated for intelligent routing and task optimization.",
      icon: IoLocation,
      color: "from-cyan-500 to-emerald-500",
    },
    {
      title: "Quick Resolution",
      desc: "Upload work proof, update complaint progress and close issues faster.",
      icon: IoCheckmarkDone,
      color: "from-lime-500 to-green-600",
    },
  ];

  const stats = [
    {
      title: "Smart Routing",
      value: "ACTIVE",
      icon: IoNavigateOutline,
    },
    {
      title: "Live Tracking",
      value: "ON",
      icon: IoPulseOutline,
    },
    {
      title: "Field Network",
      value: "24/7",
      icon: IoLayersOutline,
    },
    {
      title: "Task Sync",
      value: "REALTIME",
      icon: IoFlash,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020b07] text-white">

      {/* BACKGROUND */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[-200px] left-[-120px] w-[650px] h-[650px] bg-emerald-500/15 blur-[160px] rounded-full" />

        <div className="absolute bottom-[-220px] right-[-120px] w-[650px] h-[650px] bg-green-500/15 blur-[160px] rounded-full" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:70px_70px]" />

      </div>

      {/* NAVBAR */}

      <nav className="relative z-20 border-b border-white/10 bg-black/20 backdrop-blur-2xl">

        <div className="w-full px-6 xl:px-14 py-5 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/20">
              <IoHammerOutline className="text-3xl" />
            </div>

            <div>

              <h1 className="text-3xl font-black tracking-wide bg-gradient-to-r from-green-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                UrbanFix - Worker Portal
              </h1>

              <p className="text-gray-400 text-sm mt-1">
                Real-Time Smart City Operations
              </p>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate("/worker/login")}
              className="px-7 py-3 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/10 transition-all duration-300 font-semibold backdrop-blur-xl"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/worker/register")}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 font-bold hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-green-500/20"
            >
              Register
            </button>

          </div>

        </div>

      </nav>

      {/* MAIN */}

      <main className="relative z-10 w-full px-6 xl:px-14 py-10">

        <div className="grid grid-cols-1 2xl:grid-cols-[1.2fr_0.8fr] gap-8 min-h-[820px]">

          {/* LEFT HERO */}

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-[40px] border border-white/10 bg-white/[0.04] backdrop-blur-3xl overflow-hidden relative"
          >

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.20),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.15),transparent_30%)]" />

            <div className="relative z-10 h-full p-10 xl:p-14 flex flex-col justify-between">

              {/* HERO CONTENT */}

              <div>

                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-green-500/20 bg-green-500/10 text-green-300 text-sm font-medium">
                  <IoShieldCheckmark />
                  Smart Workforce System
                </div>

                <h1 className="mt-8 text-5xl md:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tight">

                  Field
                  <br />

                  <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
                    Operations
                  </span>

                </h1>

                <p className="mt-8 text-xl text-gray-300 leading-relaxed max-w-3xl">
                  Manage assigned complaints, receive intelligent routing,
                  track work progress and resolve civic issues efficiently
                  using the smart city worker platform.
                </p>

                {/* BUTTONS */}

                <div className="flex flex-wrap gap-5 mt-12">

                  <button
                    onClick={() => navigate("/worker/login")}
                    className="group px-9 py-5 rounded-3xl bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 text-lg font-bold flex items-center gap-3 shadow-2xl shadow-green-500/20 hover:scale-[1.02] transition-all duration-300"
                  >
                    Start Working

                    <IoArrowForward className="group-hover:translate-x-1 transition-transform duration-300" />
                  </button>

                </div>

              </div>

              {/* STATS */}

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
                        <Icon className="text-2xl text-green-300" />
                      </div>

                      <h3 className="text-3xl font-black">
                        {item.value}
                      </h3>

                      <p className="text-gray-400 text-sm mt-2">
                        {item.title}
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

            {/* LIVE STATUS */}

            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-3xl p-8 overflow-hidden relative">

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.18),transparent_35%)]" />

              <div className="relative z-10">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-green-300 text-sm font-medium">
                      LIVE WORK STATUS
                    </p>

                    <h2 className="text-4xl font-black mt-3">
                      Operations Center
                    </h2>

                  </div>

                  <div className="w-16 h-16 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <IoMapOutline className="text-3xl text-green-300" />
                  </div>

                </div>

                <div className="mt-10 space-y-5">

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                    <div>
                      <p className="text-gray-400 text-sm">
                        Smart Assignments
                      </p>

                      <h3 className="text-xl font-bold mt-1">
                        Receiving Live Tasks
                      </h3>
                    </div>

                    <IoCheckmarkCircle className="text-3xl text-emerald-400" />

                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                    <div>
                      <p className="text-gray-400 text-sm">
                        Worker Navigation
                      </p>

                      <h3 className="text-xl font-bold mt-1">
                        GPS Routing Enabled
                      </h3>
                    </div>

                    <IoCheckmarkCircle className="text-3xl text-cyan-400" />

                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                    <div>
                      <p className="text-gray-400 text-sm">
                        Complaint Resolution
                      </p>

                      <h3 className="text-xl font-bold mt-1">
                        Fast Response Active
                      </h3>
                    </div>

                    <IoCheckmarkCircle className="text-3xl text-green-400" />

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
                    whileHover={{ y: -5 }}
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