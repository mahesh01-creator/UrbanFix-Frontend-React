import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

import {
  IoCheckmarkCircle,
  IoTimeOutline,
  IoLocationOutline,
  IoSparklesOutline,
  IoPeopleOutline,
  IoConstructOutline,
  IoDocumentTextOutline,
  IoArrowForwardOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

import AdminLayout from "../../components/layout/AdminLayout";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";

import { complaintService } from "../../services/complaintService";
import { formatDate } from "../../utils/helpers";

import toast from "react-hot-toast";

const AssignWorker = () => {
  const navigate = useNavigate();

  const { user: admin } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const [verifiedComplaints, setVerifiedComplaints] =
    useState([]);

  const [inProgressComplaints, setInProgressComplaints] =
    useState([]);

  const [workers, setWorkers] = useState([]);

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  useEffect(() => {
    if (admin?.id) {
      fetchData();
    }
  }, [admin]);

  // ================= FETCH DATA =================

  const fetchData = async () => {
    try {
      setLoading(true);

      const complaints =
        await complaintService.getAllComplaints(
          admin?.id
        );

      const workersData =
        await complaintService.getAllWorkers(
          admin?.id
        );

      // READY TO ASSIGN

      const verified = complaints.filter(
        (c) =>
          c.status === "VERIFIED" ||
          c.status === "APPROVED"
      );

      // ACTIVE

      const activeComplaints = complaints.filter(
        (c) =>
          c.status === "ASSIGNED" ||
          c.status === "IN_PROGRESS"
      );

      setVerifiedComplaints(verified);

      setInProgressComplaints(activeComplaints);

      setWorkers(workersData || []);

      // AUTO SELECT

      if (verified.length > 0) {
        setSelectedComplaint((prev) => {
          if (
            prev &&
            verified.find(
              (c) => c.id === prev.id
            )
          ) {
            return prev;
          }

          return verified[0];
        });
      } else {
        setSelectedComplaint(null);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to load assignment data"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= DISTANCE =================

  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {
    if (
      !lat1 ||
      !lon1 ||
      !lat2 ||
      !lon2
    ) {
      return "N/A";
    }

    const R = 6371;

    const dLat =
      ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
      ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    return (
      R *
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      )
    ).toFixed(1);
  };

  // ================= SMART SUGGESTIONS =================

  const suggestedWorkers = workers
    .filter(
      (worker) =>
        worker.department
          ?.toLowerCase()
          ?.trim() ===
        selectedComplaint?.category
          ?.toLowerCase()
          ?.trim()
    )
    .map((worker) => ({
      ...worker,
      distance: calculateDistance(
        selectedComplaint?.latitude,
        selectedComplaint?.longitude,
        worker.latitude,
        worker.longitude
      ),
    }))
    .sort((a, b) => {
      if (a.distance === "N/A") return 1;
      if (b.distance === "N/A") return -1;

      return (
        parseFloat(a.distance) -
        parseFloat(b.distance)
      );
    });

  // ================= SMART ASSIGN =================

  const handleAssignWorker = async (
    complaintId
  ) => {
    try {
      if (!admin?.id) {
        toast.error(
          "Admin session expired"
        );
        return;
      }

      setAssigning(true);

      await complaintService.assignWorkerSmart(
        admin.id,
        complaintId
      );

      toast.success(
        "Worker Assigned Successfully"
      );

      // REMOVE FROM READY LIST

      setVerifiedComplaints((prev) =>
        prev.filter(
          (c) => c.id !== complaintId
        )
      );

      setSelectedComplaint(null);

      await fetchData();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data ||
          "Failed to assign worker"
      );
    } finally {
      setAssigning(false);
    }
  };

  // ================= MANUAL ASSIGN =================

  const handleManualAssign = async (
    complaintId,
    workerId
  ) => {
    try {
      setAssigning(true);

      await complaintService.assignWorkerManual(
        admin.id,
        complaintId,
        workerId
      );

      toast.success(
        "Worker Assigned Manually"
      );

      setVerifiedComplaints((prev) =>
        prev.filter(
          (c) => c.id !== complaintId
        )
      );

      setSelectedComplaint(null);

      await fetchData();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data ||
          "Manual assignment failed"
      );
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <Loader
        fullScreen
        text="Loading Smart Assignment Center..."
      />
    );
  }

  return (
    <AdminLayout>
      <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">

        {/* BG */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-cyan-500/10 blur-[120px] rounded-full" />

          <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        <main className="relative z-10 p-4 md:p-6 xl:p-8 space-y-8">

          {/* HERO */}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[32px] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-8 md:p-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.18),transparent_35%)]" />

            <div className="relative z-10">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-6">
                <IoSparklesOutline />
                AI Powered Assignment Engine
              </div>

              <h1 className="text-4xl md:text-5xl font-black">
                Smart Worker Assignment
              </h1>

              <p className="text-gray-300 mt-5 max-w-3xl text-lg leading-relaxed">
                Automatically assign nearest and
                suitable workers based on category
                and location intelligence.
              </p>

            </div>
          </motion.div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <Card className="rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-400 text-sm">
                    Ready To Assign
                  </p>

                  <h2 className="text-4xl font-black mt-2 text-cyan-400">
                    {verifiedComplaints.length}
                  </h2>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                  <IoShieldCheckmarkOutline className="text-cyan-400 text-3xl" />
                </div>

              </div>
            </Card>

            <Card className="rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-400 text-sm">
                    Active Complaints
                  </p>

                  <h2 className="text-4xl font-black mt-2 text-yellow-400">
                    {inProgressComplaints.length}
                  </h2>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                  <IoTimeOutline className="text-yellow-400 text-3xl" />
                </div>

              </div>
            </Card>

            <Card className="rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-400 text-sm">
                    System Workers
                  </p>

                  <h2 className="text-4xl font-black mt-2 text-green-400">
                    {workers.length}
                  </h2>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
                  <IoPeopleOutline className="text-green-400 text-3xl" />
                </div>

              </div>
            </Card>

          </div>

          {/* MAIN GRID */}

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

            {/* READY COMPLAINTS */}

            <Card className="xl:col-span-1 rounded-[32px] bg-white/5 border border-white/10 p-6">

              <div className="flex items-center gap-3 mb-6">

                <IoDocumentTextOutline className="text-cyan-400 text-2xl" />

                <div>
                  <h2 className="text-2xl font-black">
                    Ready Complaints
                  </h2>

                  <p className="text-sm text-gray-400">
                    Waiting for assignment
                  </p>
                </div>

              </div>

              {verifiedComplaints.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  No complaints ready
                </div>
              ) : (
                <div className="space-y-4">

                  {verifiedComplaints.map((c) => (

                    <motion.div
                      key={c.id}
                      whileHover={{ y: -3 }}
                      onClick={() =>
                        setSelectedComplaint(c)
                      }
                      className={`cursor-pointer rounded-3xl p-5 border transition-all duration-300 ${
                        selectedComplaint?.id ===
                        c.id
                          ? "border-cyan-500 bg-cyan-500/10"
                          : "border-white/10 bg-white/5"
                      }`}
                    >

                      <div className="flex justify-between items-start">

                        <div>
                          <h3 className="font-bold text-lg">
                            {c.title}
                          </h3>

                          <p className="text-gray-400 text-sm mt-2">
                            {c.category}
                          </p>
                        </div>

                        <Badge status={c.status} />

                      </div>

                      <div className="flex items-center gap-2 text-gray-400 text-sm mt-4">
                        <IoLocationOutline />

                        {c.location ||
                          "Location unavailable"}
                      </div>

                    </motion.div>

                  ))}

                </div>
              )}

            </Card>

            {/* RIGHT SECTION */}

            <div className="xl:col-span-3 space-y-6">

              {/* SELECTED */}

              {selectedComplaint && (
                <Card className="rounded-[32px] bg-gradient-to-br from-cyan-500/10 via-[#0f172a] to-purple-500/10 border border-white/10 overflow-hidden">

                  <div className="p-8">

                    <div className="flex flex-col lg:flex-row justify-between gap-6">

                      <div>

                        <div className="flex items-center gap-3 mb-4">

                          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                            Complaint #
                            {selectedComplaint.id}
                          </span>

                          <Badge
                            status={
                              selectedComplaint.status
                            }
                          />

                        </div>

                        <h2 className="text-4xl font-black">
                          {
                            selectedComplaint.title
                          }
                        </h2>

                        <p className="text-gray-300 text-lg mt-5 leading-relaxed max-w-4xl">
                          {
                            selectedComplaint.description
                          }
                        </p>

                      </div>

                      <div className="flex items-start">

                        <Button
                          icon={
                            IoArrowForwardOutline
                          }
                          loading={assigning}
                          onClick={() =>
                            handleAssignWorker(
                              selectedComplaint.id
                            )
                          }
                          className="bg-gradient-to-r from-cyan-500 to-purple-600"
                        >
                          Smart Assign
                        </Button>

                      </div>

                    </div>

                  </div>

                </Card>
              )}

              {/* SMART WORKERS */}

              <Card className="rounded-[32px] bg-white/5 border border-white/10 p-8">

                <div className="flex items-center gap-3 mb-8">

                  <IoConstructOutline className="text-green-400 text-3xl" />

                  <div>

                    <h2 className="text-3xl font-black">
                      Smart Worker Suggestions
                    </h2>

                    <p className="text-gray-400 mt-1">
                      Nearest and suitable workers
                    </p>

                  </div>

                </div>

                {!selectedComplaint ? (
                  <div className="text-center py-10 text-gray-400">
                    No complaint selected
                  </div>
                ) : suggestedWorkers.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    No matching workers found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {suggestedWorkers.map((w) => {

                      const workerTasks =
                        inProgressComplaints.filter(
                          (c) =>
                            c.assignedWorker?.id ===
                            w.id
                        );

                      return (
                        <motion.div
                          key={w.id}
                          whileHover={{ y: -4 }}
                          className="rounded-3xl bg-white/5 border border-white/10 p-6"
                        >

                          <div className="flex items-start justify-between">

                            <div>

                              <h3 className="text-2xl font-bold">
                                {w.name}
                              </h3>

                              <p className="text-gray-400 mt-1">
                                {w.department}
                              </p>

                            </div>

                            <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm">
                              {w.distance} km
                            </div>

                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-6">

                            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">

                              <p className="text-gray-400 text-sm">
                                Experience
                              </p>

                              <h4 className="font-bold mt-2">
                                {w.experience ||
                                  "Professional"}
                              </h4>

                            </div>

                            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">

                              <p className="text-gray-400 text-sm">
                                Active Tasks
                              </p>

                              <h4 className="font-bold mt-2 text-yellow-400">
                                {workerTasks.length}
                              </h4>

                            </div>

                          </div>

                          {/* CURRENT TASK */}

                          <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4">

                            <p className="text-gray-400 text-sm mb-2">
                              Current Task
                            </p>

                            {workerTasks.length > 0 ? (
                              <div>

                                <h4 className="font-semibold">
                                  {
                                    workerTasks[0]
                                      .title
                                  }
                                </h4>

                                <p className="text-sm text-gray-400 mt-1">
                                  {
                                    workerTasks[0]
                                      .status
                                  }
                                </p>

                              </div>
                            ) : (
                              <p className="text-green-400 text-sm">
                                No active task
                              </p>
                            )}

                          </div>

                          {/* MANUAL ASSIGN */}

                          <Button
                            loading={assigning}
                            onClick={() =>
                              handleManualAssign(
                                selectedComplaint.id,
                                w.id
                              )
                            }
                            className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600"
                          >
                            Assign This Worker
                          </Button>

                        </motion.div>
                      );
                    })}

                  </div>
                )}

              </Card>

              {/* ACTIVE */}

              <Card className="rounded-[32px] bg-white/5 border border-white/10 p-8">

                <div className="flex items-center gap-3 mb-8">

                  <IoTimeOutline className="text-yellow-400 text-3xl" />

                  <div>

                    <h2 className="text-3xl font-black">
                      Current In Progress Complaints
                    </h2>

                    <p className="text-gray-400 mt-1">
                      Track active assignments
                    </p>

                  </div>

                </div>

                {inProgressComplaints.length ===
                0 ? (
                  <div className="text-center py-10 text-gray-400">
                    No active complaints
                  </div>
                ) : (
                  <div className="space-y-5">

                    {inProgressComplaints.map(
                      (c) => (

                        <div
                          key={c.id}
                          className="rounded-3xl bg-white/5 border border-white/10 p-6"
                        >

                          <div className="flex flex-col lg:flex-row justify-between gap-5">

                            <div>

                              <h3 className="text-2xl font-bold">
                                {c.title}
                              </h3>

                              <p className="text-gray-400 mt-2">
                                {c.description}
                              </p>

                              <div className="flex flex-wrap gap-3 mt-5">

                                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                                  {c.category}
                                </div>

                                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                                  {formatDate(
                                    c.createdAt
                                  )}
                                </div>

                              </div>

                            </div>

                            <div className="flex flex-col items-start lg:items-end gap-3">

                              <Badge
                                status={c.status}
                                
                              />

                              

                              <div className="space-y-2">

                                <div className="font-bold text-lg text-cyan-300">
                                  {c.worker?.name ||
  "Assigned Worker"}
                                </div>

                                <div className="text-sm text-gray-400">
                                  Department:
                                  {" "}
                                  {c.worker?.department ||
  "N/A"}
                                </div>

                                <div className="text-sm text-gray-400">
                                  Current Tasks:
                                  {" "}
                                  {c.worker
                                    ?.activeComplaintsCount ||
                                    0}
                                </div>

                              </div>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>
                )}

              </Card>

            </div>

          </div>

        </main>

      </div>
    </AdminLayout>
  );
};

export default AssignWorker;