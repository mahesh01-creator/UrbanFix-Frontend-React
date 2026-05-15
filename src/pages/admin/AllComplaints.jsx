import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

import AdminLayout from "../../components/layout/AdminLayout";

import {
  IoSearchOutline,
  IoDownloadOutline,
  IoEyeOutline,
  IoNotificationsOutline,
  IoSparklesOutline,
  IoTimeOutline,
  IoCheckmarkDoneOutline,
  IoDocumentTextOutline,
  IoAnalyticsOutline,
  IoLocationOutline,
  IoCalendarOutline,
  IoChevronDownOutline,
} from "react-icons/io5";

import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

import { complaintService } from "../../services/complaintService";

import {
  COMPLAINT_STATUS,
  COMPLAINT_CATEGORIES,
} from "../../utils/constants";

import { formatDate } from "../../utils/helpers";

import toast from "react-hot-toast";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AllComplaints = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const admin = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(true);

  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] =
    useState([]);

  const [filters, setFilters] = useState({
    search: "",
    status: "ALL",
    category: "ALL",
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(
      location.search
    );

    const status = queryParams.get("status");

    if (status) {
      setFilters((prev) => ({
        ...prev,
        status,
      }));
    }
  }, [location.search]);

  useEffect(() => {
    filterComplaints();
  }, [filters, complaints]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const data =
        await complaintService.getAllComplaints();

      setComplaints(data);
      setFilteredComplaints(data);
    } catch (error) {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = [...complaints];

    /* SEARCH */

    if (filters.search.trim()) {
      filtered = filtered.filter(
        (c) =>
          c.title
            ?.toLowerCase()
            .includes(
              filters.search.toLowerCase()
            ) ||
          c.description
            ?.toLowerCase()
            .includes(
              filters.search.toLowerCase()
            ) ||
          c.category
            ?.toLowerCase()
            .includes(
              filters.search.toLowerCase()
            ) ||
          c.id
            ?.toString()
            .includes(filters.search)
      );
    }

    /* STATUS */

    if (filters.status !== "ALL") {
      if (filters.status === "VERIFIED") {
        filtered = filtered.filter(
          (c) =>
            c.status === "VERIFIED" ||
            c.status === "ASSIGNED" ||
            c.status === "IN_PROGRESS" ||
            c.status === "RESOLVED"
        );
      } else {
        filtered = filtered.filter(
          (c) => c.status === filters.status
        );
      }
    }

    /* CATEGORY */

    if (filters.category !== "ALL") {
      filtered = filtered.filter((c) => {
        const complaintCategory =
          c.category
            ?.toString()
            .trim()
            .toLowerCase() || "";

        const selectedCategory =
          filters.category
            ?.toString()
            .trim()
            .toLowerCase() || "";

        return (
          complaintCategory === selectedCategory
        );
      });
    }

    setFilteredComplaints(filtered);
  };

  const handleExport = () => {
    const csvContent = [
      [
        "ID",
        "Title",
        "Category",
        "Status",
        "Location",
        "Date",
      ],

      ...filteredComplaints.map((c) => [
        c.id,
        c.title,
        c.category,
        c.status,
        c.location,
        formatDate(c.createdAt),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv",
    });

    const url =
      window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `complaints_${Date.now()}.csv`;

    a.click();

    toast.success(
      "Complaints exported successfully!"
    );
  };

  const totalComplaints = complaints.length;

  const pendingCount = complaints.filter(
    (c) => c.status === "PENDING"
  ).length;

  const verifiedCount = complaints.filter(
    (c) =>
      c.status === "VERIFIED" ||
      c.status === "ASSIGNED" ||
      c.status === "IN_PROGRESS" ||
      c.status === "RESOLVED"
  ).length;

  const resolvedCount = complaints.filter(
    (c) => c.status === "RESOLVED"
  ).length;

  if (loading) {
    return (
      <Loader
        fullScreen
        text="Loading Premium Complaint Center..."
      />
    );
  }

  return (
    <AdminLayout>
      <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">

        {/* BACKGROUND */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-cyan-500/10 blur-[120px] rounded-full" />

          <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        {/* HEADER */}

        <header className="sticky top-0 z-30 backdrop-blur-2xl bg-[#030712]/80 border-b border-white/10">
          <div className="flex items-center justify-between px-4 md:px-8 py-5">

            {/* LEFT */}

            <div>
              <h1 className="text-3xl md:text-4xl font-black">
                All Complaints 📋
              </h1>

              <p className="text-sm text-gray-400 mt-1">
                Smart Complaint Monitoring Center
              </p>
            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-3">

              {/* SEARCH */}

              <div className="hidden xl:flex items-center w-80 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <IoSearchOutline className="text-gray-400 mr-2" />

                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                  className="bg-transparent outline-none w-full text-sm placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </header>

        {/* MAIN */}

        <main className="relative z-10 p-4 md:p-6 xl:p-8 space-y-8">

          {/* HERO */}

          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[32px] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-6 md:p-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.25),transparent_35%)]" />

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">

              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-6">
                  <IoSparklesOutline />
                  Smart Complaint Intelligence
                </div>

                <h1 className="text-4xl md:text-5xl font-black leading-tight">
                  Complaint
                </h1>

                <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mt-2">
                  Monitoring Center
                </h2>

                <p className="text-gray-300 mt-6 max-w-3xl text-base md:text-lg leading-relaxed">
                  Review, monitor and manage all
                  city complaints from one premium
                  administration center.
                </p>
              </div>

              <Button
                onClick={handleExport}
                icon={IoDownloadOutline}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 transition-all shadow-lg shadow-cyan-500/30"
              >
                Export Reports
              </Button>
            </div>
          </motion.div>

          {/* STATS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

            {/* TOTAL */}

            <motion.button
              whileHover={{ y: -6 }}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  status: "ALL",
                }))
              }
              className="text-left"
            >
              <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-[32px] hover:border-cyan-400/40 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      Total Complaints
                    </p>

                    <h2 className="text-5xl font-black mt-3">
                      {totalComplaints}
                    </h2>
                  </div>

                  <div className="h-20 w-20 rounded-3xl bg-cyan-500/20 flex items-center justify-center">
                    <IoDocumentTextOutline className="text-cyan-400 text-4xl" />
                  </div>
                </div>
              </Card>
            </motion.button>

            {/* PENDING */}

            <motion.button
              whileHover={{ y: -6 }}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  status: "PENDING",
                }))
              }
              className="text-left"
            >
              <Card className="bg-yellow-500/10 border border-yellow-500/20 rounded-[32px] hover:border-yellow-400/40 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      Pending
                    </p>

                    <h2 className="text-5xl font-black text-yellow-400 mt-3">
                      {pendingCount}
                    </h2>
                  </div>

                  <div className="h-20 w-20 rounded-3xl bg-yellow-500/20 flex items-center justify-center">
                    <IoTimeOutline className="text-yellow-400 text-4xl" />
                  </div>
                </div>
              </Card>
            </motion.button>

            {/* VERIFIED */}

            <motion.button
              whileHover={{ y: -6 }}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  status: "VERIFIED",
                }))
              }
              className="text-left"
            >
              <Card className="bg-green-500/10 border border-green-500/20 rounded-[32px] hover:border-green-400/40 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      Verified
                    </p>

                    <h2 className="text-5xl font-black text-green-400 mt-3">
                      {verifiedCount}
                    </h2>
                  </div>

                  <div className="h-20 w-20 rounded-3xl bg-green-500/20 flex items-center justify-center">
                    <IoCheckmarkDoneOutline className="text-green-400 text-4xl" />
                  </div>
                </div>
              </Card>
            </motion.button>

            {/* RESOLVED */}

            <motion.button
              whileHover={{ y: -6 }}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  status: "RESOLVED",
                }))
              }
              className="text-left"
            >
              <Card className="bg-purple-500/10 border border-purple-500/20 rounded-[32px] hover:border-purple-400/40 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      Resolved
                    </p>

                    <h2 className="text-5xl font-black text-purple-400 mt-3">
                      {resolvedCount}
                    </h2>
                  </div>

                  <div className="h-20 w-20 rounded-3xl bg-purple-500/20 flex items-center justify-center">
                    <IoAnalyticsOutline className="text-purple-400 text-4xl" />
                  </div>
                </div>
              </Card>
            </motion.button>
          </div>

          {/* FILTERS */}

          <Card className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px]">

            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-black flex items-center gap-3">
                  <IoSearchOutline className="text-cyan-400" />
                  Smart Filters
                </h2>

                <p className="text-gray-400 mt-2">
                  Filter complaints intelligently
                </p>
              </div>

              <div className="px-5 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">
                Showing {filteredComplaints.length} complaints
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* SEARCH */}

              <div className="relative">
                <IoSearchOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />

                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                  placeholder="Search complaints..."
                  className="w-full bg-[#111827]/80 border border-white/10 rounded-2xl pl-14 pr-5 py-4 text-white outline-none focus:border-cyan-500"
                />
              </div>

              {/* STATUS */}

              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="appearance-none w-full bg-[#111827] border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-500"
                >
                  <option value="ALL">
                    All Status
                  </option>

                  {Object.values(
                    COMPLAINT_STATUS
                  ).map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>

                <IoChevronDownOutline className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* CATEGORY */}

              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="appearance-none w-full bg-[#111827] border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-cyan-500"
                >
                  <option value="ALL">
                    All Categories
                  </option>

                  {[
                    ...new Set(
                      complaints
                        .map((c) => c.category)
                        .filter(Boolean)
                    ),
                  ].map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>

                <IoChevronDownOutline className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </Card>

          {/* COMPLAINT GRID */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {filteredComplaints.map(
              (complaint, index) => (
                <motion.div
                  key={complaint.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.04,
                  }}
                  whileHover={{ y: -6 }}
                >
                  <Card className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[30px] overflow-hidden hover:border-cyan-500/30 transition-all duration-300">

                    {/* IMAGE */}

                    {complaint.imageUrl && (
                      <div className="relative h-64 overflow-hidden">
                        <img
  src={`${BASE_URL}/uploads/${encodeURIComponent(complaint.imageUrl)}`}
  alt="Complaint"
  className="w-full h-52 object-cover hover:scale-105 transition duration-700"
/>

                        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] to-transparent"></div>

                        <div className="absolute top-5 right-5">
                          <Badge
                            status={
                              complaint.status
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* CONTENT */}

                    <div className="p-6 space-y-5">

                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-cyan-400 text-sm mb-2">
                            Complaint #
                            {complaint.id}
                          </p>

                          <h2 className="text-2xl font-bold leading-snug">
                            {complaint.title}
                          </h2>
                        </div>

                        {!complaint.imageUrl && (
                          <Badge
                            status={
                              complaint.status
                            }
                          />
                        )}
                      </div>

                      <p className="text-gray-400 line-clamp-3 leading-relaxed">
                        {complaint.description}
                      </p>

                      {/* INFO */}

                      <div className="grid grid-cols-2 gap-4">

                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                            <IoLocationOutline />
                            Category
                          </div>

                          <p className="font-semibold">
                            {complaint.category}
                          </p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                            <IoCalendarOutline />
                            Date
                          </div>

                          <p className="font-semibold">
                            {formatDate(
                              complaint.createdAt
                            )}
                          </p>
                        </div>
                      </div>

                      {/* FOOTER */}

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <p className="text-sm text-gray-500">
                            Submitted By
                          </p>

                          <p className="font-semibold">
                            {complaint.user
                              ?.name || "Unknown"}
                          </p>
                        </div>

                        <Button
                          icon={IoEyeOutline}
                          onClick={() =>
                            navigate(
                              `/admin/complaint/${complaint.id}`
                            )
                          }
                          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 transition-all"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            )}
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default AllComplaints;