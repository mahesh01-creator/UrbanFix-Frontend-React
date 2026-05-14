// src/components/layout/WorkerLayout.jsx

import React, { useState } from "react";

import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  IoGridOutline,
  IoDocumentTextOutline,
  IoLocationOutline,
  IoCheckmarkDoneOutline,
  IoHammerOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoNotificationsOutline,
  IoLogOutOutline,
  IoSparklesOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";

import { useAuthStore } from "../../store/authStore";

import { authService } from "../../services/authService";

import toast from "react-hot-toast";

const WorkerLayout = ({
  children,
}) => {
  const navigate = useNavigate();

  const location = useLocation();

  const { user } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [collapsed, setCollapsed] =
    useState(false);

  const sidebarWidth = collapsed
    ? 96
    : 290;

  const sidebarItems = [
    {
      title: "Dashboard",
      description:
        "Overview & analytics",
      path: "/worker/dashboard",
      icon: IoGridOutline,
    },

    {
      title: "Assigned Tasks",
      description:
        "Manage active work",
      path: "/worker/assigned-complaints",
      icon: IoHammerOutline,
    },

    {
      title: "Update Location",
      description:
        "Live tracking updates",
      path: "/worker/update-location",
      icon: IoLocationOutline,
    },

    

    {
      title: "All Complaints",
      description:
        "Browse all reports",
      path: "/worker/all-complaints",
      icon: IoDocumentTextOutline,
    },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {}

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    toast.success(
      "Logged out successfully"
    );

    navigate("/worker/login");
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#030712]
        text-white
        overflow-hidden
        flex
      "
    >
      {/* BACKGROUND */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="
            absolute top-[-150px] left-[-150px]
            w-[420px] h-[420px]
            rounded-full
            bg-cyan-500/10
            blur-[120px]
          "
        />

        <div
          className="
            absolute bottom-[-180px] right-[-180px]
            w-[460px] h-[460px]
            rounded-full
            bg-purple-500/10
            blur-[140px]
          "
        />
      </div>

      {/* MOBILE OVERLAY */}

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
              fixed inset-0
              bg-black/70
              backdrop-blur-sm
              z-40
              xl:hidden
            "
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}

      <motion.aside
        animate={{
          width: collapsed
            ? 96
            : 290,
        }}
        transition={{
          duration: 0.25,
        }}
        className={`
          fixed top-0 left-0
          z-50
          h-screen
          flex flex-col
          bg-[#071120]/95
          backdrop-blur-3xl
          border-r border-white/10
          overflow-hidden
          transition-transform duration-300

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full xl:translate-x-0"
          }
        `}
      >
        {/* TOP */}

        <div
          className="
            h-24
            px-5
            border-b border-white/10
            flex items-center justify-between
            shrink-0
          "
        >
          {!collapsed && (
            <div className="min-w-0">
              <h1
                className="
                  text-[28px]
                  font-black
                  bg-gradient-to-r
                  from-cyan-400
                  via-blue-500
                  to-purple-500
                  bg-clip-text
                  text-transparent
                  leading-none
                "
              >
                UrbanFix 
              </h1>

              <p
                className="
                  text-[11px]
                  tracking-[0.25em]
                  text-gray-500
                  mt-2
                "
              >
                Real-Time Smart City Operations
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {/* COLLAPSE */}

            <button
              onClick={() =>
                setCollapsed(
                  !collapsed
                )
              }
              className="
                hidden xl:flex
                w-10 h-10
                rounded-2xl
                bg-white/5
                border border-white/10
                hover:bg-white/10
                items-center justify-center
                transition-all
              "
            >
              {collapsed ? (
                <IoChevronForwardOutline
                  size={18}
                />
              ) : (
                <IoChevronBackOutline
                  size={18}
                />
              )}
            </button>

            {/* MOBILE CLOSE */}

            <button
              onClick={() =>
                setSidebarOpen(false)
              }
              className="
                xl:hidden
                w-10 h-10
                rounded-2xl
                bg-white/5
                border border-white/10
                flex items-center justify-center
              "
            >
              <IoCloseOutline
                size={20}
              />
            </button>
          </div>
        </div>

        {/* PROFILE */}

        <div
          className="
            px-5 py-5
            border-b border-white/10
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                relative
                min-w-[58px]
                h-[58px]
                rounded-2xl
                bg-gradient-to-br
                from-cyan-500
                via-blue-500
                to-purple-600
                flex items-center justify-center
                text-xl font-black
                shadow-lg shadow-cyan-500/20
              "
            >
              {user?.name?.charAt(0) ||
                "W"}

              <div
                className="
                  absolute -bottom-1 -right-1
                  w-4 h-4
                  rounded-full
                  bg-green-400
                  border-2 border-[#071120]
                "
              />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <h3
                  className="
                    font-bold
                    text-lg
                    truncate
                  "
                >
                  {user?.name ||
                    "Worker"}
                </h3>

                <p
                  className="
                    text-sm
                    text-gray-400
                  "
                >
                  Field Operations
                </p>
              </div>
            )}
          </div>
        </div>

        {/* NAVIGATION */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-4 py-5
          "
        >
          <div className="space-y-2">
            {sidebarItems.map(
              (item, index) => {
                const isActive =
                  location.pathname ===
                  item.path;

                const Icon =
                  item.icon;

                return (
                  <motion.div
                    key={item.path}
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.04,
                    }}
                  >
                    <NavLink
                      to={item.path}
                      onClick={() =>
                        setSidebarOpen(
                          false
                        )
                      }
                      className={`
                        relative
                        flex items-center
                        gap-4
                        h-[64px]
                        px-4
                        rounded-2xl
                        overflow-hidden
                        transition-all duration-300
                        group

                        ${
                          collapsed
                            ? "justify-center"
                            : ""
                        }

                        ${
                          isActive
                            ? `
                              bg-gradient-to-r
                              from-cyan-500/20
                              via-blue-500/20
                              to-purple-500/20
                              border border-cyan-500/20
                              text-white
                            `
                            : `
                              text-gray-400
                              hover:text-white
                              hover:bg-white/5
                            `
                        }
                      `}
                    >
                      {/* ACTIVE BAR */}

                      {isActive && (
                        <motion.div
                          layoutId="workerActive"
                          className="
                            absolute left-0
                            top-3 bottom-3
                            w-[4px]
                            rounded-full
                            bg-cyan-400
                          "
                        />
                      )}

                      {/* ICON */}

                      <div
                        className={`
                          relative z-10

                          ${
                            isActive
                              ? "text-cyan-300"
                              : "text-gray-500 group-hover:text-white"
                          }
                        `}
                      >
                        <Icon size={22} />
                      </div>

                      {/* TEXT */}

                      {!collapsed && (
                        <div className="relative z-10 min-w-0">
                          <p
                            className="
                              text-sm
                              font-semibold
                              truncate
                            "
                          >
                            {item.title}
                          </p>

                          <p
                            className="
                              text-[11px]
                              text-gray-500
                              truncate mt-0.5
                            "
                          >
                            {
                              item.description
                            }
                          </p>
                        </div>
                      )}
                    </NavLink>
                  </motion.div>
                );
              }
            )}
          </div>
        </div>

        {/* BOTTOM */}

        <div
          className="
            p-4
            border-t border-white/10
            shrink-0
          "
        >
          {!collapsed && (
            <div
              className="
                mb-4
                rounded-3xl
                border border-cyan-500/20
                bg-gradient-to-br
                from-cyan-500/10
                to-purple-500/10
                p-5
              "
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="
                    w-10 h-10
                    rounded-2xl
                    bg-cyan-500/10
                    flex items-center justify-center
                  "
                >
                  <IoSparklesOutline
                    className="text-cyan-400"
                    size={20}
                  />
                </div>

                <div>
                  <h3 className="font-bold">
                    Smart Tips
                  </h3>

                  <p className="text-[11px] text-gray-400">
                    Live Worker AI
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                Keep location updates
                enabled for faster nearby
                task assignments.
              </p>
            </div>
          )}

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="
              w-full
              h-[54px]
              rounded-2xl
              bg-red-500/10
              hover:bg-red-500/20
              border border-red-500/20
              text-red-400
              flex items-center justify-center
              gap-3
              transition-all
            "
          >
            <IoLogOutOutline
              size={20}
            />

            {!collapsed && (
              <span className="font-medium">
                Logout
              </span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* MAIN */}

      <div
        className="
          flex-1
          flex flex-col
          min-w-0
          relative z-10
        "
        style={{
          marginLeft:
            window.innerWidth >= 1280
              ? `${sidebarWidth}px`
              : "0px",
        }}
      >
        {/* NAVBAR */}

        <header
          className="
            sticky top-0 z-30
            h-24
            border-b border-white/10
            bg-[#030712]/70
            backdrop-blur-2xl
          "
        >
          <div
            className="
              h-full
              px-4 md:px-6 xl:px-8
              flex items-center justify-between
              gap-4
            "
          >
            {/* LEFT */}

            <div className="flex items-center gap-4 min-w-0">
              {/* MOBILE MENU */}

              <button
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="
                  xl:hidden
                  w-11 h-11
                  rounded-2xl
                  bg-white/5
                  border border-white/10
                  hover:bg-white/10
                  transition-all
                  flex items-center justify-center
                  shrink-0
                "
              >
                <IoMenuOutline
                  size={22}
                />
              </button>

              {/* TITLE */}

              <div className="min-w-0">
                <h2
                  className="
                    text-2xl md:text-3xl
                    font-black
                    truncate
                  "
                >
                  Worker Workspace
                </h2>

                <p
                  className="
                    hidden sm:block
                    text-sm text-gray-400 mt-1
                  "
                >
                 Complaints Resolution Platform
                </p>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-4">
              {/* NOTIFICATION */}

              <button
                className="
                  relative
                  p-3
                  rounded-2xl
                  bg-white/5
                  border border-white/10
                  hover:bg-white/10
                  transition-all
                "
              >
                <IoNotificationsOutline
                  size={22}
                />

                <span
                  className="
                    absolute top-2 right-2
                    w-2 h-2
                    rounded-full
                    bg-cyan-400 animate-pulse
                  "
                />
              </button>

              {/* PROFILE */}

              <div
                onClick={() =>
                  navigate(
                    "/worker/profile"
                  )
                }
                className="
                  hidden md:flex
                  items-center gap-3
                  px-4 py-2
                  rounded-2xl
                  bg-white/5
                  border border-white/10
                  hover:bg-white/10
                  transition-all
                  cursor-pointer
                "
              >
                <div
                  className="
                    w-11 h-11
                    rounded-xl
                    bg-gradient-to-r
                    from-cyan-500
                    to-purple-600
                    flex items-center justify-center
                    font-bold
                  "
                >
                  {user?.name?.charAt(0) ||
                    "W"}
                </div>

                <div>
                  <p className="font-semibold text-sm">
                    {user?.name ||
                      "Worker"}
                  </p>

                  <p className="text-xs text-gray-400">
                    Active Worker
                  </p>
                </div>

                <IoPersonCircleOutline
                  size={20}
                  className="text-gray-400"
                />
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}

        <main
          className="
            flex-1
            overflow-y-auto
            overflow-x-hidden
            p-4 sm:p-6 xl:p-8
          "
        >
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkerLayout;