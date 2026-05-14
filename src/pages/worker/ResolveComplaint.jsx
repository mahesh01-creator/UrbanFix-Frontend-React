import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
  IoArrowBack,
  IoCheckmarkCircleOutline,
  IoMenu,
  IoClose,
  IoHomeOutline,
  IoHammerOutline,
  IoDocumentTextOutline,
  IoMapOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
  IoShieldCheckmarkOutline,
  IoSparklesOutline,
  IoCalendarOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoWarningOutline,
  IoImageOutline,
} from "react-icons/io5";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Textarea from "../../components/common/Textarea";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import WorkerLayout from "../../components/layout/WorkerLayout";
import ImageUploader from "../../components/complaint/ImageUploader";
import WorkerLocationMap from "../../components/maps/WorkerLocationMap";

import { complaintService } from "../../services/complaintService";
import { useAuthStore } from "../../store/authStore";
import { formatDate } from "../../utils/helpers";

import toast from "react-hot-toast";
const BASE_URL = "http://localhost:8080";

const sidebarItems = [
  {
    title: "Dashboard",
    path: "/worker/dashboard",
    icon: <IoHomeOutline size={22} />,
  },
  {
    title: "Assigned Tasks",
    path: "/worker/assigned-complaints",
    icon: <IoHammerOutline size={22} />,
  },
  {
    title: "Update Location",
    path: "/worker/update-location",
    icon: <IoMapOutline size={22} />,
  },
  {
    title: "All Complaints",
    path: "/worker/all-complaints",
    icon: <IoDocumentTextOutline size={22} />,
  },
];

const ResolveComplaint = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [complaint, setComplaint] =
    useState(null);

  const [formData, setFormData] = useState({
    resolutionNotes: "",
    proofImage: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);

      let data = null;

      if (
        complaintService.getWorkerComplaintById
      ) {
        data =
          await complaintService.getWorkerComplaintById(
            user.id,
            id
          );
      } else if (
        complaintService.getComplaintById
      ) {
        data =
          await complaintService.getComplaintById(
            id
          );
      }

      if (!data) {
        toast.error("Complaint not found");

        navigate(
          "/worker/assigned-complaints"
        );

        return;
      }

      if (
        data.worker &&
        data.worker.id !== user.id
      ) {
        toast.error(
          "This complaint is not assigned to you"
        );

        navigate(
          "/worker/assigned-complaints"
        );

        return;
      }

      if (data.status === "RESOLVED") {
        toast.info(
          "This complaint is already resolved"
        );

        navigate(
          "/worker/assigned-complaints"
        );

        return;
      }

      setComplaint(data);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load complaint details"
      );

      navigate(
        "/worker/assigned-complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (file) => {
    setFormData((prev) => ({
      ...prev,
      proofImage: file,
    }));

    setErrors((prev) => ({
      ...prev,
      proofImage: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.resolutionNotes.trim()) {
      newErrors.resolutionNotes =
        "Resolution notes are required";
    }

    if (!formData.proofImage) {
      newErrors.proofImage =
        "Please upload proof image";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();

    if (
      Object.keys(newErrors).length > 0
    ) {
      setErrors(newErrors);

      toast.error(
        "Please fill all required fields"
      );

      return;
    }

    try {
      setSubmitting(true);

      await complaintService.resolveComplaint(
        user.id,
        complaint.id,
        formData.resolutionNotes,
        formData.proofImage
      );

      toast.success(
        "🎉 Complaint resolved successfully!"
      );

      navigate(
        "/worker/assigned-complaints"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to resolve complaint"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.success(
        "Logged out successfully"
      );

      navigate("/worker/login");
    } catch (error) {
      toast.error("Logout failed");
    }
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
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
        Complaint not found
      </div>
    );
  }

  const complaintLocation =
    complaint.latitude &&
    complaint.longitude
      ? {
          lat: complaint.latitude,
          lng: complaint.longitude,
        }
      : null;

  const workerLocation =
    user?.latitude && user?.longitude
      ? {
          lat: user.latitude,
          lng: user.longitude,
        }
      : null;

  return (
  <WorkerLayout>
    <div className="relative min-h-screen text-white">
  
        {/* CONTENT */}
        <main className="p-4 md:p-6 xl:p-8 space-y-8">
          {/* HERO */}
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="relative overflow-hidden rounded-[32px] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.2),transparent_35%)]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-6">
                <IoSparklesOutline />
                Smart Resolution System
              </div>

              <h1 className="text-5xl font-black">
                Complaint
              </h1>

              <h2 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mt-2">
                Resolution Center
              </h2>

              <p className="text-gray-300 mt-6 max-w-3xl text-lg leading-relaxed">
                Complete assigned tasks,
                upload proof, and submit
                resolution updates to close
                complaints efficiently.
              </p>
            </div>
          </motion.div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="2xl:col-span-2 space-y-8">
              {/* DETAILS */}
              <Card className="bg-white/[0.04] border border-white/10 rounded-[32px] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-black">
                      Complaint Details
                    </h2>

                    <p className="text-gray-400 mt-1">
                      Assigned complaint
                      information
                    </p>
                  </div>

                  <Badge
                    status={complaint.status}
                    size="lg"
                  />
                </div>

                {complaint.imageUrl && (
                  <div className="rounded-[28px] overflow-hidden mb-6 border border-white/10">
                    <img
                        src={`${BASE_URL}/uploads/${encodeURIComponent(complaint.imageUrl)}`}
                        alt="Complaint"
                    />
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-black">
                      {complaint.title}
                    </h3>

                    <p className="text-gray-300 mt-4 leading-relaxed text-lg">
                      {
                        complaint.description
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <IoDocumentTextOutline className="text-cyan-400 text-xl" />

                        <p className="text-gray-400 text-sm">
                          Category
                        </p>
                      </div>

                      <h3 className="text-xl font-bold">
                        {
                          complaint.category
                        }
                      </h3>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <IoCalendarOutline className="text-green-400 text-xl" />

                        <p className="text-gray-400 text-sm">
                          Reported Date
                        </p>
                      </div>

                      <h3 className="text-xl font-bold">
                        {formatDate(
                          complaint.createdAt
                        )}
                      </h3>
                    </div>

                    {complaint.location && (
                      <div className="md:col-span-2 bg-white/5 rounded-2xl p-5 border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                          <IoLocationOutline className="text-purple-400 text-xl" />

                          <p className="text-gray-400 text-sm">
                            Location
                          </p>
                        </div>

                        <h3 className="text-lg font-semibold">
                          {
                            complaint.location
                          }
                        </h3>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* MAP */}
              {workerLocation &&
                complaintLocation && (
                  <Card className="bg-white/[0.04] border border-white/10 rounded-[32px] p-6">
                    <h2 className="text-3xl font-black mb-6">
                      Live Route Map
                    </h2>

                    <WorkerLocationMap
                      workerLocation={
                        workerLocation
                      }
                      complaintLocation={
                        complaintLocation
                      }
                      workerInfo={user}
                      showRoute={true}
                    />
                  </Card>
                )}

              {/* FORM */}
              <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-[32px] p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                    <IoCheckmarkCircleOutline className="text-3xl text-cyan-400" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-black">
                      Submit Resolution
                    </h2>

                    <p className="text-gray-400 mt-1">
                      Complete the complaint
                      task
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <Textarea
                    label="Resolution Notes"
                    value={
                      formData.resolutionNotes
                    }
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        resolutionNotes:
                          e.target.value,
                      }));

                      setErrors((prev) => ({
                        ...prev,
                        resolutionNotes:
                          "",
                      }));
                    }}
                    placeholder="Describe how you resolved this complaint..."
                    rows={6}
                    error={
                      errors.resolutionNotes
                    }
                    required
                  />

                  {/* IMAGE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Proof Image
                    </label>

                    <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
                      <ImageUploader
                        onImageUpload={
                          handleImageUpload
                        }
                        existingImage={null}
                        maxFiles={1}
                      />

                      {errors.proofImage && (
                        <p className="text-red-400 text-sm mt-3">
                          {
                            errors.proofImage
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    loading={submitting}
                    icon={
                      IoCheckmarkCircleOutline
                    }
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white h-14 text-lg font-bold rounded-2xl"
                  >
                    Mark Complaint as
                    Resolved
                  </Button>
                </form>
              </Card>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* GUIDELINES */}
              <Card className="bg-blue-500/10 border border-blue-500/20 rounded-[32px] p-6">
                <h2 className="text-2xl font-black text-blue-300 mb-6">
                  📋 Resolution Guidelines
                </h2>

                <div className="space-y-4">
                  {[
                    "Ensure the issue is fully resolved",
                    "Upload clear proof images",
                    "Write detailed notes",
                    "Verify all work completed",
                    "Double-check complaint status",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-2xl bg-white/5"
                    >
                      <div className="h-7 w-7 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 text-sm font-bold">
                        ✓
                      </div>

                      <p className="text-gray-300">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* USER */}
              {complaint.user && (
                <Card className="bg-white/[0.04] border border-white/10 rounded-[32px] p-6">
                  <h2 className="text-2xl font-black mb-5">
                    Reported By
                  </h2>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-black">
                      {complaint.user.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">
                        {
                          complaint.user
                            .name
                        }
                      </h3>

                      <p className="text-gray-400">
                        {
                          complaint.user
                            .email
                        }
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* SUMMARY */}
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-[32px] p-6">
                <h2 className="text-2xl font-black mb-6 text-purple-300">
                  Submission Status
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <IoDocumentTextOutline className="text-cyan-400 text-xl" />

                      <span>
                        Resolution Notes
                      </span>
                    </div>

                    <span className="text-xl">
                      {formData.resolutionNotes
                        ? "✅"
                        : "❌"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <IoImageOutline className="text-green-400 text-xl" />

                      <span>
                        Proof Image
                      </span>
                    </div>

                    <span className="text-xl">
                      {formData.proofImage
                        ? "✅"
                        : "❌"}
                    </span>
                  </div>
                </div>
              </Card>

              {/* WARNING */}
              <Card className="bg-yellow-500/10 border border-yellow-500/20 rounded-[32px] p-6">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                    <IoWarningOutline className="text-3xl text-yellow-400" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">
                      Important Notice
                    </h3>

                    <p className="text-gray-300 leading-relaxed">
                      Once the complaint is
                      resolved and submitted,
                      the action cannot be
                      undone. Make sure all
                      work is completed
                      properly before
                      submission.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
  </WorkerLayout>
);
};

export default ResolveComplaint;