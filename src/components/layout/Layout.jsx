import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({
  links,
  children,
}) {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <div
      className="
        h-screen
        overflow-hidden
        bg-[#030712]
        text-white
        flex
      "
    >
      {/* SIDEBAR */}
      <Sidebar
        links={links}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN */}
      <div
        className={`
          flex flex-col flex-1
          min-w-0
          transition-all duration-300
          
          ${
            sidebarCollapsed
              ? "lg:ml-[88px]"
              : "lg:ml-[280px]"
          }
        `}
      >
        {/* NAVBAR */}
        <Navbar
          onMenuClick={() =>
            setMobileOpen(true)
          }
        />

        {/* CONTENT */}
        <main
          className="
            flex-1
            overflow-y-auto
            overflow-x-hidden

            p-4
            sm:p-6
            lg:p-8
          "
        >
          <div
            className="
              w-full
              max-w-[1700px]
              mx-auto
            "
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}