import React, { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTimeOutline,
  IoDocumentTextOutline,
  IoAlertCircleOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { useAuthStore } from "../../store/authStore";

import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

import toast from "react-hot-toast";
import { complaintService } from "../../services/complaintService";
import { formatDate } from "../../utils/helpers";
const BASE_URL = "http://localhost:8080";
const VerifyComplaint = () => {
  const [loading, setLoading] = useState(true);

  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [verifiedComplaints, setVerifiedComplaints] = useState([]);
  const [rejectedComplaints, setRejectedComplaints] = useState([]);

  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
  if (user?.id) {
    fetchComplaints();
  }
}, [user]);

  const fetchComplaints = async () => {
  try {
    setLoading(true);

    const data = await complaintService.getAllComplaints(user.id);

    // Pending Complaints
    setPendingComplaints(
      data.filter((c) => c.status === "PENDING")
    );

    // Verified Complaints
    // Includes all complaints once verified
    setVerifiedComplaints(
      data.filter(
        (c) =>
          c.status === "VERIFIED" ||
          c.status === "ASSIGNED" ||
          c.status === "IN_PROGRESS" ||
          c.status === "RESOLVED"
      )
    );

    // Rejected Complaints
    setRejectedComplaints(
      data.filter(
        (c) =>
          c.status === "REJECTED" ||
          c.isFake === true
      )
    );
  } catch (error) {
    toast.error("Failed to fetch complaints");
  } finally {
    setLoading(false);
  }
};

  const handleVerify = async (complaint) => {
  try {
    if (!user?.id) {
      toast.error("Admin not found");
      return;
    }

    await complaintService.verifyComplaint(
  user.id,
  complaint.id,
  false,
  ""
);

    toast.success(
      "Complaint Verified Successfully"
    );

    fetchComplaints();
  } catch (error) {
    console.error(error);

    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Verification Failed"
    );
  }
};

  const handleReject = async () => {
  if (!rejectReason.trim()) {
    return toast.error(
      "Enter rejection reason"
    );
  }

  try {
    if (!user?.id) {
      toast.error("Admin not found");
      return;
    }

    await complaintService.verifyComplaint(
  user.id,
  selectedComplaint.id,
  true,
  rejectReason
);

    toast.success(
      "Complaint Rejected Successfully"
    );

    setShowRejectModal(false);
    setRejectReason("");
    setSelectedComplaint(null);

    fetchComplaints();
  } catch (error) {
    console.error(error);

    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to reject complaint"
    );
  }
};

  if (loading) {
    return <Loader fullScreen text="Loading Verification Queue..." />;
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#111827] via-[#1e1b4b] to-[#312e81] p-8 shadow-2xl"
        >
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#6366f1,transparent_40%)]" />

          <div className="relative z-10">
            <h1 className="text-4xl font-black text-white mb-3">
              Complaint Verification Center
            </h1>

            <p className="text-gray-300 text-lg">
              Review complaints, verify authenticity and manage moderation queue.
            </p>

            <div className="flex gap-4 mt-6 flex-wrap">
              <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-sm">Pending</p>
                <h2 className="text-2xl font-bold text-yellow-400">
                  {pendingComplaints.length}
                </h2>
              </div>

              <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-sm">Verified</p>
                <h2 className="text-2xl font-bold text-green-400">
                  {verifiedComplaints.length}
                </h2>
              </div>

              <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-sm">Rejected</p>
                <h2 className="text-2xl font-bold text-red-400">
                  {rejectedComplaints.length}
                </h2>
              </div>
            </div>
          </div>
        </motion.div>

        {/* EMPTY QUEUE */}
        {pendingComplaints.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="p-10 text-center border border-green-500/20 bg-green-500/5">
              <div className="flex justify-center mb-5">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                  <IoCheckmarkCircle className="text-5xl text-green-400" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-3">
                Verification Queue Empty
              </h2>

              <p className="text-gray-400 max-w-xl mx-auto">
                All complaints have been reviewed successfully.
              </p>
            </Card>
          </motion.div>
        )}

        {/* PENDING COMPLAINTS */}
        {pendingComplaints.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <IoTimeOutline className="text-3xl text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">
                Pending Complaints
              </h2>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {pendingComplaints.map((complaint) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="overflow-hidden border border-white/10 hover:border-indigo-500/30 transition-all duration-300">
                    {complaint.imageUrl && (
                      <img
  src={`${BASE_URL}/uploads/${encodeURIComponent(complaint.imageUrl)}`}
  alt="Complaint"
  className="w-full h-52 object-cover hover:scale-105 transition duration-700"
/>
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            {complaint.title}
                          </h3>

                          <p className="text-gray-400 mt-1">
                            {complaint.category}
                          </p>
                        </div>

                        <span className="px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-300 text-sm border border-yellow-500/20">
                          Pending
                        </span>
                      </div>

                      <p className="text-gray-300 leading-relaxed mb-5">
                        {complaint.description}
                      </p>

                      <div className="space-y-2 text-sm mb-6">
                        <p className="text-gray-400">
                          📍 {complaint.location}
                        </p>

                        <p className="text-gray-400">
                          🗓 {formatDate(complaint.createdAt)}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="success"
                          className="flex-1"
                          onClick={() => handleVerify(complaint)}
                        >
                          Verify
                        </Button>

                        <Button
                          variant="danger"
                          className="flex-1"
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setShowRejectModal(true);
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* VERIFIED + REJECTED SECTION */}
<div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">

  {/* VERIFIED */}
  <div>
    <div className="flex items-center gap-3 mb-6">
      <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/20">
        <IoCheckmarkCircle className="text-3xl text-green-400" />
      </div>

      <div>
        <h2 className="text-3xl font-black text-white">
          Verified Complaints
        </h2>

        <p className="text-gray-400">
          Successfully approved complaints
        </p>
      </div>
    </div>

    <div className="space-y-5">
      {verifiedComplaints.length > 0 ? (
        verifiedComplaints.map((complaint) => (
          <motion.div
            key={complaint.id}
            whileHover={{ y: -4 }}
          >
            <Card className="border border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/5 hover:border-green-500/40 transition-all duration-300">
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {complaint.title}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    {complaint.category}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm border border-green-500/20">
                  Verified
                </span>
              </div>

              <p className="text-gray-300 leading-relaxed line-clamp-3">
                {complaint.description}
              </p>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
                <span className="text-sm text-gray-400">
                  {formatDate(complaint.createdAt)}
                </span>

                <span className="text-sm text-green-400 font-semibold">
                  Approved
                </span>
              </div>
            </Card>
          </motion.div>
        ))
      ) : (
        <Card className="text-center py-10 border border-white/10">
          <p className="text-gray-400">
            No verified complaints found
          </p>
        </Card>
      )}
    </div>
  </div>

  {/* REJECTED */}
  <div>
    <div className="flex items-center gap-3 mb-6">
      <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/20">
        <IoCloseCircle className="text-3xl text-red-400" />
      </div>

      <div>
        <h2 className="text-3xl font-black text-white">
          Rejected Complaints
        </h2>

        <p className="text-gray-400">
          Rejected or fake complaints
        </p>
      </div>
    </div>

    <div className="space-y-5">
      {rejectedComplaints.length > 0 ? (
        rejectedComplaints.map((complaint) => (
          <motion.div
            key={complaint.id}
            whileHover={{ y: -4 }}
          >
            <Card className="border border-red-500/20 bg-gradient-to-br from-red-500/10 to-rose-500/5 hover:border-red-500/40 transition-all duration-300">
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {complaint.title}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    {complaint.category}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-sm border border-red-500/20">
                  Rejected
                </span>
              </div>

              <p className="text-gray-300 leading-relaxed line-clamp-3">
                {complaint.description}
              </p>

              <div className="mt-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/10">
                <p className="text-red-300 text-sm font-medium">
                  Rejection Reason
                </p>

                <p className="text-gray-300 text-sm mt-2">
                  {complaint.rejectReason || "Marked as invalid complaint"}
                </p>
              </div>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
                <span className="text-sm text-gray-400">
                  {formatDate(complaint.createdAt)}
                </span>

                <span className="text-sm text-red-400 font-semibold">
                  Rejected
                </span>
              </div>
            </Card>
          </motion.div>
        ))
      ) : (
        <Card className="text-center py-10 border border-white/10">
          <p className="text-gray-400">
            No rejected complaints found
          </p>
        </Card>
      )}
    </div>
  </div>

</div>

        {/* REJECT MODAL */}
        <AnimatePresence>
          {showRejectModal && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111827] p-8"
              >
                <h2 className="text-3xl font-bold text-white mb-4">
                  Reject Complaint
                </h2>

                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none"
                />

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="secondary"
                    onClick={() => setShowRejectModal(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="danger"
                    onClick={handleReject}
                  >
                    Reject Complaint
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default VerifyComplaint;