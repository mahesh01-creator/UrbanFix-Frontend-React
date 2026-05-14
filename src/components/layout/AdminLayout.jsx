import Layout from "./Layout";

import {
  IoGridOutline,
  IoDocumentTextOutline,
  IoShieldCheckmarkOutline,
  IoPeopleOutline,
  IoConstructOutline,
  IoStatsChartOutline,
  IoSettingsOutline,
} from "react-icons/io5";

export default function AdminLayout({
  children,
}) {
  const adminLinks = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: IoGridOutline,
      description:
        "Overview & analytics",
    },

    {
      name: "All Complaints",
      path: "/admin/all-complaints",
      icon: IoDocumentTextOutline,
      description:
        "Manage all reports",
    },

    {
      name: "Verify Complaints",
      path: "/admin/verify-complaint",
      icon: IoShieldCheckmarkOutline,
      description:
        "Approve submissions",
    },

    {
      name: "Assign Workers",
      path: "/admin/assignWorkers",
      icon: IoPeopleOutline,
      description:
        "Allocate workforce",
    },

    {
      name: "Worker Management",
      path: "/admin/workersManagement",
      icon: IoConstructOutline,
      description:
        "Manage workers",
    },

    {
      name: "Analytics",
      path: "/admin/monitor",
      icon: IoStatsChartOutline,
      description:
        "Performance insights",
    },

   
  ];

  return (
    <Layout links={adminLinks}>
      {children}
    </Layout>
  );
}