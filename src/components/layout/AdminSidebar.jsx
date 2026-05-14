import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  useState,
  memo,
  useEffect,
} from "react";

import {
  IoMenuOutline,
  IoCloseOutline,
  IoLogOutOutline,
} from "react-icons/io5";

import { authService } from "../../services/authService";

import toast from "react-hot-toast";

const Sidebar = memo(
  ({
    links = [],
    title = "SmartCity",
  }) => {
    const [collapsed, setCollapsed] =
      useState(false);

    const [mobileOpen, setMobileOpen] =
      useState(false);

    const navigate = useNavigate();

    const location = useLocation();

    const currentPath =
      location.pathname;

    /* CLOSE MOBILE SIDEBAR ON ROUTE CHANGE */

    useEffect(() => {
      setMobileOpen(false);
    }, [location.pathname]);

    let loginRoute =
      "/user/login";

    if (
      currentPath.startsWith(
        "/admin"
      )
    ) {
      loginRoute =
        "/admin/login";
    } else if (
      currentPath.startsWith(
        "/worker"
      )
    ) {
      loginRoute =
        "/worker/login";
    }

    const handleLogout = () => {
      authService.logout();

      toast.success(
        "Logged out successfully"
      );

      navigate(loginRoute);
    };

    return (
      <>
        {/* MOBILE MENU BUTTON */}

        {!mobileOpen && (
          <button
            onClick={() =>
              setMobileOpen(true)
            }
            className="
              lg:hidden
              fixed top-4 left-4
              z-[80]

              w-11 h-11
              rounded-2xl

              bg-[#0B1120]/90
              backdrop-blur-2xl

              border border-white/10

              flex items-center justify-center

              shadow-[0_8px_30px_rgba(0,0,0,0.45)]

              transition-all duration-200
              hover:scale-105
            "
          >
            <IoMenuOutline
              size={22}
              className="text-white"
            />
          </button>
        )}

        {/* OVERLAY */}

        {mobileOpen && (
          <div
            onClick={() =>
              setMobileOpen(false)
            }
            className="
              fixed inset-0
              bg-black/70
              backdrop-blur-sm
              z-40
              lg:hidden
            "
          />
        )}

        {/* SIDEBAR */}

        <aside
          className={`
            fixed lg:sticky
            top-0 left-0

            h-screen
            z-50

            flex flex-col

            bg-[#071120]/95
            backdrop-blur-3xl

            border-r border-white/10

            shadow-[0_10px_50px_rgba(0,0,0,0.55)]

            transition-[width,transform]
            duration-300
            ease-out

            ${
              collapsed
                ? "w-[92px]"
                : "w-[290px]"
            }

            ${
              mobileOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          {/* HEADER */}

          <div
            className="
              h-[78px]
              px-4

              border-b border-white/10

              flex items-center justify-between

              shrink-0
            "
          >
            {!collapsed && (
              <div className="overflow-hidden">
                <h1
                  className="
                    text-[28px]
                    font-black
                    leading-none

                    bg-gradient-to-r
                    from-cyan-400
                    via-blue-500
                    to-purple-500

                    bg-clip-text
                    text-transparent

                    whitespace-nowrap
                  "
                >
                  {title}
                </h1>

                <p
                  className="
                    text-[10px]
                    tracking-[0.25em]
                    text-gray-500
                    mt-1
                  "
                >
                  SMART ADMIN PANEL
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* COLLAPSE */}

              <button
                onClick={() =>
                  setCollapsed(
                    !collapsed
                  )
                }
                className="
                  hidden lg:flex

                  w-10 h-10

                  rounded-xl

                  bg-white/5
                  hover:bg-white/10

                  border border-white/10

                  items-center justify-center

                  transition-all duration-200
                "
              >
                <IoMenuOutline
                  size={20}
                />
              </button>

              {/* MOBILE CLOSE */}

              <button
                onClick={() =>
                  setMobileOpen(false)
                }
                className="
                  lg:hidden

                  w-10 h-10

                  rounded-xl

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

          {/* NAVIGATION */}

          <div
            className="
              flex-1
              overflow-y-auto

              px-3 py-5
            "
          >
            <div className="space-y-2">
              {links.map(
                (link, index) => {
                  const active =
                    currentPath ===
                    link.path;

                  return (
                    <NavLink
                      key={index}
                      to={link.path}
                      className={`
                        group

                        relative

                        flex items-center

                        gap-4

                        h-[60px]

                        px-4

                        rounded-2xl

                        overflow-hidden

                        transition-all duration-200

                        ${
                          active
                            ? `
                              bg-gradient-to-r
                              from-cyan-500/20
                              to-blue-500/20

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
                      {/* ACTIVE GLOW */}

                      {active && (
                        <div
                          className="
                            absolute left-0 top-0

                            w-1 h-full

                            bg-cyan-400

                            rounded-r-full
                          "
                        />
                      )}

                      {/* ICON */}

                      <div
                        className={`
                          min-w-[22px]

                          ${
                            active
                              ? "text-cyan-400"
                              : "text-gray-500 group-hover:text-white"
                          }
                        `}
                      >
                        {link.icon && (
                          <link.icon
                            size={22}
                          />
                        )}
                      </div>

                      {/* TEXT */}

                      {!collapsed && (
                        <div className="overflow-hidden">
                          <p className="font-semibold text-sm whitespace-nowrap">
                            {link.name}
                          </p>

                          {link.description && (
                            <p className="text-[11px] text-gray-500 truncate">
                              {
                                link.description
                              }
                            </p>
                          )}
                        </div>
                      )}
                    </NavLink>
                  );
                }
              )}
            </div>
          </div>

          {/* FOOTER */}

          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="
                w-full
                h-12

                rounded-2xl

                bg-red-500/10
                hover:bg-red-500/20

                border border-red-500/20

                text-red-400

                flex items-center justify-center
                gap-3

                transition-all duration-200
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
        </aside>
      </>
    );
  }
);

export default Sidebar;