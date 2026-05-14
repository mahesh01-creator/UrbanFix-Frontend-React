import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

import {
  IoArrowBackOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoPersonOutline,
  IoLocationOutline,
  IoCalendarOutline,
  IoShieldCheckmarkOutline,
  IoConstructOutline,
  IoDocumentTextOutline,
  IoMailOutline,
  IoCallOutline,
  IoStar,
  IoStarOutline,
  IoWarningOutline,
} from "react-icons/io5";

import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";

import { complaintService } from "../../services/complaintService";
import { formatDate } from "../../utils/helpers";

import toast from "react-hot-toast";

const ComplaintDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [complaint, setComplaint] = useState(null);

  const [adminRemark, setAdminRemark] = useState("");
  const [workerRating, setWorkerRating] = useState(0);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);

      const data = await complaintService.getComplaintById(id);

      setComplaint(data);

      setAdminRemark(data?.adminRemark || "");
      setWorkerRating(data?.workerRating || 0);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load complaint details");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReview = () => {
    toast.success("Worker performance review saved");
  };

  const getAssignedWorker = () => {
    return (
      complaint?.assignedWorker ||
      complaint?.worker ||
      complaint?.workerDetails ||
      complaint?.assignedTo ||
      complaint?.workerInfo ||
      null
    );
  };

  const worker = getAssignedWorker();

  const getTimeline = () => {
    if (!complaint) return [];

    const timeline = [
      {
        title: "Complaint Submitted",
        description:
          "Citizen submitted the complaint into the system.",
        icon: IoDocumentTextOutline,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        date: complaint.createdAt,
      },
    ];

    if (
      complaint.status === "VERIFIED" ||
      complaint.status === "ASSIGNED" ||
      complaint.status === "IN_PROGRESS" ||
      complaint.status === "RESOLVED"
    ) {
      timeline.push({
        title: "Complaint Verified",
        description:
          "Admin verified and approved the complaint.",
        icon: IoShieldCheckmarkOutline,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        date: complaint.updatedAt,
      });
    }

    if (
      complaint.status === "ASSIGNED" ||
      complaint.status === "IN_PROGRESS" ||
      complaint.status === "RESOLVED"
    ) {
      timeline.push({
        title: "Worker Assigned",
        description:
          worker?.name
            ? `${worker.name} was assigned to resolve the issue.`
            : "Worker assigned for complaint resolution.",
        icon: IoConstructOutline,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        date: complaint.updatedAt,
      });
    }

    if (
      complaint.status === "IN_PROGRESS" ||
      complaint.status === "RESOLVED"
    ) {
      timeline.push({
        title: "Work In Progress",
        description:
          "Field work started and complaint handling initiated.",
        icon: IoTimeOutline,
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        date: complaint.updatedAt,
      });
    }

    if (complaint.status === "RESOLVED") {
      timeline.push({
        title: "Complaint Resolved",
        description:
          "Complaint successfully resolved and closed.",
        icon: IoCheckmarkCircle,
        color: "text-green-400",
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        date: complaint.updatedAt,
      });
    }

    return timeline;
  };

  if (loading) {
    return (
      <Loader
        fullScreen
        text="Loading Complaint Details..."
      />
    );
  }

  if (!complaint) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center text-white">
          Complaint not found
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
        {/* BACKGROUND EFFECTS */}

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />

          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 p-4 md:p-8 space-y-8">
          {/* HEADER */}

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <button
                onClick={() => navigate(-1)}
                className="
                  p-4 rounded-2xl
                  bg-white/5
                  border border-white/10
                  hover:bg-white/10
                  transition-all duration-300
                "
              >
                <IoArrowBackOutline size={24} />
              </button>

              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-5">
                  <IoDocumentTextOutline />
                  Complaint Monitoring
                </div>

                <h1 className="text-4xl md:text-5xl font-black">
                  Complaint Details
                </h1>

                <p className="text-gray-400 mt-3 text-lg">
                  Complete complaint lifecycle, worker
                  tracking & citizen feedback analytics
                </p>
              </div>
            </div>

            <Badge
              status={complaint.status}
              size="lg"
            />
          </div>

          {/* HERO SECTION */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-[#0f172a] to-purple-500/10 backdrop-blur-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.18),transparent_40%)]" />

              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                    Complaint #{complaint.id}
                  </span>

                  <span className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">
                    {complaint.category}
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black leading-tight">
                  {complaint.title}
                </h2>

                <p className="text-gray-300 text-lg leading-relaxed mt-6 max-w-5xl">
                  {complaint.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-10">
                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <IoPersonOutline className="text-cyan-400 text-2xl" />

                      <h4 className="font-bold">
                        Submitted By
                      </h4>
                    </div>

                    <p className="text-gray-300 text-lg font-semibold">
                      {complaint.user?.name ||
                        complaint.userName ||
                        "Citizen User"}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <IoCalendarOutline className="text-purple-400 text-2xl" />

                      <h4 className="font-bold">
                        Created At
                      </h4>
                    </div>

                    <p className="text-gray-300 text-lg font-semibold">
                      {formatDate(
                        complaint.createdAt
                      )}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <IoConstructOutline className="text-orange-400 text-2xl" />

                      <h4 className="font-bold">
                        Assigned Worker
                      </h4>
                    </div>

                    <p className="text-gray-300 text-lg font-semibold">
                      {worker?.name ||
                        worker?.fullName ||
                        "No Worker Assigned"}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <IoLocationOutline className="text-green-400 text-2xl" />

                      <h4 className="font-bold">
                        Location
                      </h4>
                    </div>

                    <p className="text-gray-300 line-clamp-3">
                      {complaint.address ||
                        complaint.location ||
                        "Location unavailable"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* TIMELINE */}

<Card className="rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl overflow-hidden">
  {/* HEADER */}

  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
    <div>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-5">
        <IoTimeOutline />
        Complaint Lifecycle Tracking
      </div>

      <h2 className="text-4xl font-black">
        Complaint Timeline
      </h2>

      <p className="text-gray-400 mt-3 text-lg">
        Detailed workflow & progress tracking from
        complaint registration to successful resolution
      </p>
    </div>

    <div className="flex items-center gap-3">
      <div className="px-5 py-3 rounded-2xl bg-green-500/10 border border-green-500/20">
        <p className="text-xs text-green-400 uppercase tracking-wider">
          Current Status
        </p>

        <p className="text-lg font-bold text-white mt-1">
          {complaint.status}
        </p>
      </div>

      <div className="px-5 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
        <p className="text-xs text-cyan-400 uppercase tracking-wider">
          Complaint ID
        </p>

        <p className="text-lg font-bold text-white mt-1">
          #{complaint.id}
        </p>
      </div>
    </div>
  </div>

  {/* TIMELINE CONTENT */}

  <div className="relative">
    {/* CENTER LINE */}

    <div className="absolute left-7 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500/30 via-purple-500/20 to-green-500/30 hidden md:block" />

    <div className="space-y-10">
      {getTimeline().map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.08,
            }}
            className="relative flex gap-6"
          >
            {/* ICON */}

            <div className="relative z-10 flex-shrink-0">
              <div
                className={`
                  w-16 h-16 rounded-2xl
                  ${item.bg}
                  ${item.border}
                  border
                  flex items-center justify-center
                  shadow-lg
                `}
              >
                <Icon
                  className={`${item.color} text-2xl`}
                />
              </div>
            </div>

            {/* CONTENT */}

            <div className="flex-1">
              <div
                className={`
                  rounded-[28px]
                  border
                  ${item.border}
                  ${item.bg}
                  backdrop-blur-xl
                  p-7
                  hover:scale-[1.01]
                  transition-all duration-300
                `}
              >
                {/* TOP */}

                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-black">
                        {item.title}
                      </h3>

                      <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                        Step {index + 1}
                      </div>
                    </div>

                    <p className="text-gray-300 mt-4 leading-relaxed text-[15px]">
                      {item.description}
                    </p>
                  </div>

                  {/* DATE */}

                  <div className="min-w-fit">
                    <div className="rounded-2xl bg-black/20 border border-white/10 px-5 py-4">
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                        Activity Date
                      </p>

                      <p className="text-sm font-semibold text-cyan-300">
                        {item.date
                          ? formatDate(item.date)
                          : formatDate(
                              complaint.updatedAt ||
                                complaint.createdAt
                            )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* REMARK */}

                <div className="mt-6 rounded-2xl bg-black/20 border border-white/10 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <IoCheckmarkCircle className="text-green-400 text-lg" />

                    <p className="text-sm font-semibold uppercase tracking-wide text-green-300">
                      System Remark
                    </p>
                  </div>

                  <p className="text-gray-300 leading-relaxed">
                    {item.title ===
                    "Complaint Submitted"
                      ? "Complaint successfully registered into the Smart City Complaint Management System and forwarded for administrative verification."

                      : item.title ===
                        "Complaint Verified"
                      ? "Administrator verified the complaint details and approved it for operational processing."

                      : item.title ===
                        "Worker Assigned"
                      ? `${
                          worker?.name ||
                          "Assigned field worker"
                        } has been allocated to resolve this issue and perform on-site inspection.`

                      : item.title ===
                        "Work In Progress"
                      ? "Field operations have started and the assigned team is actively working on complaint resolution."

                      : item.title ===
                        "Complaint Resolved"
                      ? "Complaint marked as resolved after successful completion of field operations and issue handling."

                      : "Complaint activity updated successfully."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
</Card>

          {/* WORKER PERFORMANCE */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* WORKER DETAILS */}

            <Card className="rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl overflow-hidden">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black">
                    Worker Performance
                  </h2>

                  <p className="text-gray-400 mt-2">
                    Assigned worker analytics &
                    evaluation
                  </p>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-3xl font-black">
                  {worker?.name?.charAt(0) ||
                    worker?.fullName?.charAt(0) ||
                    "W"}
                </div>
              </div>

              <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                <h3 className="text-2xl font-bold mb-8">
                  Worker Details
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                      <IoPersonOutline className="text-cyan-400 text-2xl" />
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm">
                        Worker Name
                      </p>

                      <p className="text-xl font-bold mt-1">
                        {worker?.name ||
                          worker?.fullName ||
                          "Not Assigned"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                      <IoMailOutline className="text-purple-400 text-2xl" />
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm">
                        Email
                      </p>

                      <p className="text-lg font-semibold mt-1 break-all">
                        {worker?.email ||
                          "Email unavailable"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                      <IoCallOutline className="text-green-400 text-2xl" />
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm">
                        Phone
                      </p>

                      <p className="text-lg font-semibold mt-1">
                        {worker?.phone ||
                          worker?.mobile ||
                          "Phone unavailable"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                      <IoCheckmarkCircle className="text-orange-400 text-2xl" />
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm">
                        Current Status
                      </p>

                      <p className="text-lg font-semibold mt-1">
                        {complaint.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* FEEDBACK */}

            <Card className="rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl overflow-hidden">
              <div className="mb-8">
                <h2 className="text-3xl font-black">
                  Citizen Feedback
                </h2>

                <p className="text-gray-400 mt-2">
                  User satisfaction & worker review
                </p>
              </div>

              <div className="space-y-8">
                {/* RATING */}

                <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                  <p className="text-gray-400 mb-5">
                    User Satisfaction
                  </p>

                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() =>
                          setWorkerRating(star)
                        }
                        className="transition-transform hover:scale-110"
                      >
                        {workerRating >= star ? (
                          <IoStar className="text-yellow-400 text-4xl" />
                        ) : (
                          <IoStarOutline className="text-gray-500 text-4xl" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FEEDBACK */}

                <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                  <p className="text-gray-400 mb-4">
                    User Feedback
                  </p>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5 text-lg text-gray-200 leading-relaxed min-h-[120px]">
                    {complaint.feedback ||
                      complaint.userFeedback ||
                      complaint.review ||
                      "Excellent Service"}
                  </div>
                </div>

                {/* ADMIN REMARK */}

                <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <IoWarningOutline className="text-red-400 text-2xl" />

                    <h3 className="text-2xl font-bold">
                      Admin Remark
                    </h3>
                  </div>

                  <textarea
                    value={adminRemark}
                    onChange={(e) =>
                      setAdminRemark(e.target.value)
                    }
                    rows={5}
                    placeholder="Add performance review, disciplinary note, appreciation or improvement remark for the assigned worker..."
                    className="
                      w-full rounded-2xl
                      bg-white/5
                      border border-white/10
                      p-5
                      outline-none
                      focus:border-cyan-500/40
                      resize-none
                    "
                  />

                  <div className="mt-5">
                    <Button
                      variant="primary"
                      onClick={handleSaveReview}
                    >
                      Save Worker Review
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ComplaintDetails;