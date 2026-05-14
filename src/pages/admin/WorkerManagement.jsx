import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  IoSearchOutline,
  IoPersonOutline,
  IoCallOutline,
  IoMailOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoPeopleOutline,
  IoLocationOutline,
  IoRefreshOutline,
  IoSparklesOutline,
} from "react-icons/io5";

import AdminLayout from "../../components/layout/AdminLayout";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Avatar from "../../components/common/Avatar";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";

import { complaintService } from "../../services/complaintService";
import { authService } from "../../services/authService";

import toast from "react-hot-toast";

const WorkerManagement = () => {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("adminUser"));
  const [loading, setLoading] = useState(true);

  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchWorkers();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, workers]);

  const fetchWorkers = async () => {
  try {

    setLoading(true);

    if (!admin?.id) {
      toast.error("Admin session expired");
      return;
    }

    // ✅ PASS ADMIN ID

    const workerData =
      await complaintService.getAllWorkers(
        admin.id
      );

    const complaints =
      await complaintService.getAllComplaints(
        admin.id
      );

    // ✅ ENHANCE WORKERS

    const enhanced = workerData.map(
      (worker) => {

        const assigned = complaints.filter(
          (c) =>
            String(
              c.worker?.id
            ) === String(worker.id)
        );

        return {
          ...worker,

          activeTasks: assigned.filter(
            (c) =>
              c.status === "ASSIGNED" ||
              c.status === "IN_PROGRESS"
          ).length,

          completedTasks: assigned.filter(
            (c) =>
              c.status === "RESOLVED"
          ).length,

          isOnline:
            worker.isOnline !== undefined
              ? worker.isOnline
              : true,
        };
      }
    );

    console.log(
      "Enhanced Workers:",
      enhanced
    );

    setWorkers(enhanced);

    setFilteredWorkers(enhanced);

  } catch (err) {

    console.error(err);

    toast.error(
      "Failed to load workers"
    );

  } finally {

    setLoading(false);
  }
};

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredWorkers(workers);
      return;
    }

    const filtered = workers.filter((w) =>
      [w.name, w.email, w.phone]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    setFilteredWorkers(filtered);
  };

  const handleViewDetails = (worker) => {
  setSelectedWorker(worker);
  setShowModal(true);
};
const handleCloseModal = () => {
  setShowModal(false);
  setSelectedWorker(null);
  fetchWorkers(); // 🔥 refresh data after modal close
};

  const handleLogout = async () => {
    await authService.logout();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  if (loading) {
    return <Loader fullScreen text="Loading Worker Management..." />;
  }

  const onlineWorkers = workers.filter((w) => w.isOnline).length;

  const activeWorkers = workers.filter(
    (w) => w.activeTasks > 0
  ).length;

  const completedTasks = workers.reduce(
    (acc, w) => acc + (w.completedTasks || 0),
    0
  );

  return (
    <AdminLayout>
      <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">

        {/* BACKGROUND */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        {/* MAIN */}
        <main className="relative z-10 p-4 md:p-6 xl:p-8 space-y-8">

          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 p-8"
          >
            <div className="flex items-center gap-3 text-cyan-300 mb-3">
              <IoSparklesOutline />
              Worker Management System
            </div>

            <h1 className="text-4xl font-black">
              Field Worker Control Panel
            </h1>

            <p className="text-gray-400 mt-2 max-w-2xl">
              Monitor, manage, and track all field workers in real time.
            </p>

            <div className="mt-6 flex gap-3">
              <Button onClick={fetchWorkers} icon={IoRefreshOutline}>
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            <Card className="bg-cyan-500/10 border border-cyan-500/20">
              <h2 className="text-4xl font-black">{workers.length}</h2>
              <p className="text-gray-300">Total Workers</p>
            </Card>

            <Card className="bg-green-500/10 border border-green-500/20">
              <h2 className="text-4xl font-black">{onlineWorkers}</h2>
              <p className="text-gray-300">Online Workers</p>
            </Card>

            <Card className="bg-orange-500/10 border border-orange-500/20">
              <h2 className="text-4xl font-black">{activeWorkers}</h2>
              <p className="text-gray-300">Active Workers</p>
            </Card>

            <Card className="bg-purple-500/10 border border-purple-500/20">
              <h2 className="text-4xl font-black">{completedTasks}</h2>
              <p className="text-gray-300">Completed Tasks</p>
            </Card>

          </div>

          {/* SEARCH */}
          <Card className="bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <IoSearchOutline className="text-gray-400" />

              <input
                type="text"
                placeholder="Search workers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-white"
              />
            </div>
          </Card>

          {/* WORKERS */}
          {filteredWorkers.length === 0 ? (
            <Card className="bg-white/5 border border-white/10">
              <EmptyState
                icon={IoPersonOutline}
                title="No Workers Found"
                description="Try adjusting your search"
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredWorkers.map((worker) => (
                  <motion.div
                    key={worker.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="bg-white/5 border border-white/10">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar
                          name={worker.name}
                          online={worker.isOnline}
                        />

                        <div>
                          <h3 className="font-bold">
                            {worker.name}
                          </h3>

                          <p className="text-gray-400 text-sm">
                            Worker
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-300">
                        <p>{worker.email}</p>
                        <p>{worker.phone || "N/A"}</p>
                        <p>
                          Active: {worker.activeTasks || 0}
                        </p>
                        <p>
                          Completed: {worker.completedTasks || 0}
                        </p>
                      </div>

                      <Button
                        className="mt-4 w-full"
                        onClick={() =>
                          handleViewDetails(worker)
                        }
                      >
                        View Details
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>

      {/* MODAL */}
      <Modal
  isOpen={showModal}
  onClose={handleCloseModal}
  title="Worker Details"
>
        {selectedWorker && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              {selectedWorker.name}
            </h2>

            <p>{selectedWorker.email}</p>
            <p>{selectedWorker.phone}</p>

            <p>Active: {selectedWorker.activeTasks}</p>
            <p>Completed: {selectedWorker.completedTasks}</p>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default WorkerManagement;