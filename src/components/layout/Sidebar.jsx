import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  IoMenuOutline,
  IoCloseOutline,
  IoLogOutOutline,
} from "react-icons/io5";

import { authService } from "../../services/authService";

import toast from "react-hot-toast";

export default function Sidebar({
  links = [],
  title = "UrbanFix",

  collapsed,
  setCollapsed,

  mobileOpen,
  setMobileOpen,
}) {
  const location = useLocation();

  const navigate = useNavigate();

  const currentPath =
    location.pathname;

  let loginRoute = "/user/login";

  if (
    currentPath.startsWith("/admin")
  ) {
    loginRoute = "/admin/login";
  }

  else if (
    currentPath.startsWith("/worker")
  ) {
    loginRoute = "/worker/login";
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
      {/* MOBILE OVERLAY */}
      <div
        onClick={() =>
          setMobileOpen(false)
        }
        className={`
          fixed inset-0
          bg-black/70
          backdrop-blur-sm
          z-40
          transition-all duration-300
          
          lg:hidden
          
          ${
            mobileOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
        `}
      />

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0
          h-screen
          z-50

          flex flex-col

          bg-[#071120]/95
          backdrop-blur-2xl

          border-r border-white/10

          shadow-[0_0_40px_rgba(0,0,0,0.45)]

          transition-all duration-300

          ${
            collapsed
              ? "w-[88px]"
              : "w-[280px]"
          }

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* TOP */}
        <div
          className="
            h-[78px]
            shrink-0

            border-b border-white/10

            px-4

            flex items-center justify-between
          "
        >
          {/* LOGO */}
          {!collapsed && (
            <div className="overflow-hidden">
              <h1
                className="
                  text-[26px]
                  font-black
                  tracking-tight

                  bg-gradient-to-r
                  from-cyan-400
                  via-blue-500
                  to-purple-500

                  bg-clip-text
                  text-transparent
                "
              >
                {title}
              </h1>

              <p
                className="
                  text-[10px]
                  tracking-[0.25em]
                  text-gray-500
                  whitespace-nowrap
                "
              >
                SMART CITY SYSTEM
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            {/* DESKTOP COLLAPSE */}
            <button
              onClick={() =>
                setCollapsed(
                  !collapsed
                )
              }
              className="
                hidden lg:flex

                w-10 h-10

                rounded-2xl

                border border-white/10

                bg-white/5
                hover:bg-white/10

                items-center justify-center

                transition-all duration-300
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

                rounded-2xl

                border border-white/10

                bg-white/5

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

            px-3
            py-5
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
                    onClick={() =>
                      setMobileOpen(
                        false
                      )
                    }
                    className={`
                      relative

                      flex items-center
                      gap-4

                      h-[60px]

                      px-4

                      rounded-2xl

                      overflow-hidden

                      transition-all duration-300

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
                            hover:bg-white/[0.04]
                          `
                      }
                    `}
                  >
                    {/* ACTIVE GLOW */}
                    {active && (
                      <div
                        className="
                          absolute inset-0
                          bg-gradient-to-r
                          from-cyan-500/10
                          to-blue-500/10
                          blur-xl
                        "
                      />
                    )}

                    {/* ICON */}
                    <div
                      className={`
                        relative z-10

                        min-w-[22px]

                        ${
                          active
                            ? "text-cyan-400"
                            : "text-gray-500"
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
                      <div
                        className="
                          relative z-10
                          overflow-hidden
                        "
                      >
                        <p
                          className="
                            text-sm
                            font-semibold
                            whitespace-nowrap
                          "
                        >
                          {link.name}
                        </p>

                        {link.description && (
                          <p
                            className="
                              text-[11px]
                              text-gray-500
                              truncate
                            "
                          >
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

        {/* BOTTOM */}
        <div
          className="
            p-4
            border-t border-white/10
          "
        >
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

              transition-all duration-300
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