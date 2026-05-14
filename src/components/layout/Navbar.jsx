import { useState } from "react";

import {
  IoMenuOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
  IoPersonOutline,
  IoSunnyOutline,
  IoMoonOutline,
} from "react-icons/io5";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { authService } from "../../services/authService";

export default function Navbar({
  onMenuClick,
}) {
  const navigate = useNavigate();

  const location = useLocation();

  const [theme, setTheme] =
    useState("dark");

  let role = "USER";

  if (
    location.pathname.startsWith(
      "/admin"
    )
  ) {
    role = "ADMIN";
  }

  else if (
    location.pathname.startsWith(
      "/worker"
    )
  ) {
    role = "WORKER";
  }

  const user =
    authService.getCurrentUser(role);

  const toggleTheme = () => {
    setTheme(
      theme === "dark"
        ? "light"
        : "dark"
    );
  };

  const handleLogout = () => {
    authService.logout();

    navigate(
      `/${role.toLowerCase()}/login`
    );
  };

  return (
    <header
      className="
        sticky top-0 z-30

        h-[78px]
        shrink-0

        bg-[#030712]/80
        backdrop-blur-2xl

        border-b border-white/10
      "
    >
      <div
        className="
          h-full

          px-4
          sm:px-6
          lg:px-8

          flex items-center justify-between

          gap-4
        "
      >
        {/* LEFT */}
        <div
          className="
            flex items-center
            gap-4
            min-w-0
          "
        >
          {/* MOBILE MENU */}
          <button
            onClick={onMenuClick}
            className="
              lg:hidden

              w-11 h-11

              rounded-2xl

              border border-white/10

              bg-white/5
              hover:bg-white/10

              flex items-center justify-center

              transition-all duration-300
            "
          >
            <IoMenuOutline
              size={24}
            />
          </button>

          {/* TITLE */}
          <div className="min-w-0">
            <h1
              className="
                text-lg
                sm:text-2xl

                font-black

                truncate
              "
            >
              {role === "USER"
                ? "Citizen Dashboard"
                : role ===
                  "ADMIN"
                ? "Admin Control Center"
                : "Worker Operations"}
            </h1>

            <p
              className="
                hidden sm:block

                text-xs
                text-gray-400
              "
            >
              Smarter Complaints. Faster Resolutions
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div
          className="
            flex items-center
            gap-2 sm:gap-3
          "
        >
          {/* THEME */}
          <button
            onClick={toggleTheme}
            className="
              w-11 h-11

              rounded-2xl

              bg-white/5
              hover:bg-white/10

              border border-white/10

              flex items-center justify-center

              transition-all duration-300
            "
          >
            {theme === "dark" ? (
              <IoSunnyOutline
                size={20}
                className="text-yellow-400"
              />
            ) : (
              <IoMoonOutline
                size={20}
                className="text-cyan-400"
              />
            )}
          </button>

          {/* NOTIFICATION */}
          <button
            className="
              relative

              w-11 h-11

              rounded-2xl

              bg-white/5
              hover:bg-white/10

              border border-white/10

              flex items-center justify-center

              transition-all duration-300
            "
          >
            <IoNotificationsOutline
              size={20}
            />

            <span
              className="
                absolute top-2 right-2

                w-2 h-2

                rounded-full

                bg-red-500
              "
            />
          </button>

          {/* PROFILE */}
          <button
            onClick={() =>
              navigate(
                `/${role.toLowerCase()}/profile`
              )
            }
            className="
              hidden md:flex

              items-center
              gap-3

              px-3 py-2

              rounded-2xl

              bg-white/5
              hover:bg-white/10

              border border-white/10

              transition-all duration-300
            "
          >
            <div
              className="
                w-10 h-10

                rounded-xl

                bg-gradient-to-br
                from-cyan-500
                to-purple-600

                flex items-center justify-center
              "
            >
              <IoPersonOutline
                size={18}
              />
            </div>

            <div className="text-left">
              <p
                className="
                  text-sm
                  font-semibold
                  leading-none
                "
              >
                {user?.name ||
                  "User"}
              </p>

              <p
                className="
                  text-[11px]
                  text-gray-400
                  mt-1
                "
              >
                {role}
              </p>
            </div>
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="
              w-11 h-11
              md:w-auto

              md:px-4

              rounded-2xl

              bg-red-500/10
              hover:bg-red-500/20

              border border-red-500/20

              text-red-400

              flex items-center justify-center
              gap-2

              transition-all duration-300
            "
          >
            <IoLogOutOutline
              size={20}
            />

            <span
              className="
                hidden md:block
                text-sm
                font-medium
              "
            >
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}