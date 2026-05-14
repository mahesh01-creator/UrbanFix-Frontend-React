import {
  IoMenuOutline,
  IoSearchOutline,
  IoNotificationsOutline,
  IoSettingsOutline,
  IoLogOutOutline,
} from "react-icons/io5";

import { useNavigate } from "react-router-dom";

import { authService } from "../../services/authService";

export default function Navbar({
  onMenuClick,
}) {
  const navigate = useNavigate();

  const user =
    authService.getCurrentUser("ADMIN");

  const handleLogout = () => {
    authService.logout("ADMIN");

    navigate("/admin/login");
  };

  return (
    <header
      className="
        sticky top-0 z-40
        h-[76px]
        border-b border-white/10
        bg-[#071120]/80
        backdrop-blur-2xl
      "
    >
      <div
        className="
          h-full
          px-4 sm:px-6 lg:px-8
          flex items-center justify-between
          gap-5
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-4 min-w-0">

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
              transition-all
            "
          >
            <IoMenuOutline size={22} />
          </button>

          {/* TITLE */}
          <div className="min-w-0">
            <h1
              className="
                text-lg sm:text-2xl
                font-black
                truncate
              "
            >
              zUrban<span className="text-cyan-400">Fix</span>  
            </h1>

            <p
              className="
                hidden sm:block
                text-xs text-gray-400 mt-1
              "
            >
              Smarter Complaints. Faster Resolutions
            </p>
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div className="hidden lg:flex flex-1 max-w-xl">
          <div
            className="
              w-full
              h-12
              rounded-2xl
              bg-white/5
              border border-white/10
              flex items-center gap-3
              px-4
            "
          >
            <IoSearchOutline
              size={20}
              className="text-gray-400"
            />

            <input
              type="text"
              placeholder="Search complaints, users, workers..."
              className="
                bg-transparent
                outline-none
                border-none
                w-full
                text-sm
                placeholder:text-gray-500
              "
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          
          {/* NOTIFICATIONS */}
          <button
            className="
              relative
              w-11 h-11
              rounded-2xl
              bg-white/5
              hover:bg-white/10
              border border-white/10
              flex items-center justify-center
              transition-all
            "
          >
            <IoNotificationsOutline size={20} />

            <span
              className="
                absolute top-2 right-2
                w-2 h-2 rounded-full
                bg-red-500
              "
            />
          </button>

          {/* SETTINGS */}
          <button
            className="
              hidden sm:flex
              w-11 h-11
              rounded-2xl
              bg-white/5
              hover:bg-white/10
              border border-white/10
              items-center justify-center
              transition-all
            "
          >
            <IoSettingsOutline size={20} />
          </button>

          {/* PROFILE */}
          <div
            className="
              hidden md:flex
              items-center gap-3
              px-3 py-2
              rounded-2xl
              bg-white/5
              border border-white/10
            "
          >
            <div
              className="
                w-10 h-10
                rounded-xl
                bg-gradient-to-br
                from-cyan-500
                to-blue-600
                flex items-center justify-center
                font-bold
              "
            >
              A
            </div>

            <div>
              <p className="text-sm font-semibold">
                {user?.name || "Admin"}
              </p>

              <p className="text-[11px] text-gray-400">
                Administrator
              </p>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="
              w-11 h-11 md:w-auto
              md:px-4
              rounded-2xl
              bg-red-500/10
              hover:bg-red-500/20
              border border-red-500/20
              text-red-400
              flex items-center justify-center
              gap-2
              transition-all
            "
          >
            <IoLogOutOutline size={20} />

            <span className="hidden md:block text-sm font-medium">
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}