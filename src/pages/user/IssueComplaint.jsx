import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoSendOutline,
  IoCheckmarkCircle,
  IoSparklesOutline,
  IoShieldCheckmarkOutline,
  IoLocationOutline,
  IoCameraOutline,
  IoAddCircleOutline,
  IoTrendingUpOutline,
  IoDocumentTextOutline,
} from 'react-icons/io5';

import DashboardLayout from '../../components/layout/Layout';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LocationPicker from '../../components/maps/LocationPicker';
import ImageUploader from '../../components/complaint/ImageUploader';

import { complaintService } from '../../services/complaintService';
import { useAuthStore } from '../../store/authStore';
import { COMPLAINT_CATEGORIES } from '../../utils/constants';

import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const IssueComplaint = () => {
  const navigate = useNavigate();

  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    latitude: null,
    longitude: null,
    image: null,
  });

  const [errors, setErrors] = useState({});

  const sidebarLinks = [
    {
      name: 'Dashboard',
      path: '/user/dashboard',
      icon: IoTrendingUpOutline,
    },
    {
      name: 'Issue Complaint',
      path: '/user/issue-complaint',
      icon: IoAddCircleOutline,
    },
    {
      name: 'My Complaints',
      path: '/user/my-complaints',
      icon: IoDocumentTextOutline,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleLocationSelect = (locationData) => {
    setFormData((prev) => ({
      ...prev,
      latitude: locationData.lat,
      longitude: locationData.lng,
      location:
        locationData.address ||
        `${locationData.lat.toFixed(4)}, ${locationData.lng.toFixed(4)}`,
    }));

    if (errors.location) {
      setErrors((prev) => ({
        ...prev,
        location: '',
      }));
    }
  };

  const handleImageUpload = (file) => {
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Complaint title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select category';
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.location = 'Please choose issue location';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      toast.error('Please complete all required fields');

      return;
    }

    setLoading(true);

    try {
      const response = await complaintService.issueComplaint(
        user.id,
        formData
      );

      setSubmittedComplaint(response || formData);

      setShowSuccessModal(true);

      toast.success('Complaint registered successfully!');
    } catch (error) {
      console.error(error);

      toast.error(
        error?.message ||
          'Failed to submit complaint. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout links={sidebarLinks}>
      <div className="space-y-8">
        {/* PREMIUM HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            relative overflow-hidden
            rounded-[32px]
            border border-white/10
            bg-gradient-to-br
            from-primary-500/20
            via-purple-500/10
            to-cyan-500/10
            backdrop-blur-2xl
            p-8 md:p-10
          "
        >
          {/* Glow Effects */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/20 blur-3xl rounded-full"></div>

          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Left */}
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-5">
                  <IoSparklesOutline className="text-yellow-400" />

                  <span className="text-sm text-gray-200">
                    Smart Civic Reporting System
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                  Report City Issues
                </h1>

                <p className="text-gray-300 mt-5 text-base md:text-lg leading-relaxed">
                  Help improve your city by reporting public issues,
                  infrastructure damage, sanitation problems, road defects,
                  electricity failures, and more.
                </p>
              </div>

              {/* Right Stats */}
              <div className="grid grid-cols-2 gap-4 min-w-[280px]">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-3">
                    <IoShieldCheckmarkOutline
                      className="text-green-400"
                      size={24}
                    />
                  </div>

                  <h3 className="text-white font-bold text-lg">Secure</h3>

                  <p className="text-gray-400 text-sm mt-1">
                    Protected complaint management
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
                    <IoTrendingUpOutline
                      className="text-blue-400"
                      size={24}
                    />
                  </div>

                  <h3 className="text-white font-bold text-lg">Live Tracking</h3>

                  <p className="text-gray-400 text-sm mt-1">
                    Real-time complaint updates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="xl:col-span-2 space-y-8">
              {/* BASIC INFO */}
              <Card className="rounded-[28px] border border-white/10 bg-black/20 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary-500/20 flex items-center justify-center">
                    <IoDocumentTextOutline
                      className="text-primary-400"
                      size={28}
                    />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Complaint Information
                    </h2>

                    <p className="text-gray-400 text-sm">
                      Provide complete details about the issue
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <Input
                    label="Complaint Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Water leakage near central road"
                    error={errors.title}
                    required
                  />

                  <Select
                    label="Issue Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={COMPLAINT_CATEGORIES}
                    placeholder="Select issue category"
                    error={errors.category}
                    required
                  />

                  <Textarea
                    label="Detailed Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Explain the issue clearly..."
                    error={errors.description}
                    required
                  />
                </div>
              </Card>

              {/* LOCATION */}
              <Card className="rounded-[28px] border border-white/10 bg-black/20 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                    <IoLocationOutline
                      className="text-blue-400"
                      size={28}
                    />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Issue Location
                    </h2>

                    <p className="text-gray-400 text-sm">
                      Select exact issue location on map
                    </p>
                  </div>
                </div>

                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={
                    formData.latitude && formData.longitude
                      ? {
                          lat: formData.latitude,
                          lng: formData.longitude,
                        }
                      : null
                  }
                />

                {errors.location && (
                  <p className="text-red-400 mt-3 text-sm">
                    {errors.location}
                  </p>
                )}
              </Card>
            </div>

            {/* RIGHT */}
            <div className="space-y-8">
              {/* UPLOAD */}
              <Card className="rounded-[28px] border border-white/10 bg-black/20 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                    <IoCameraOutline
                      className="text-purple-400"
                      size={28}
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Upload Evidence
                    </h2>

                    <p className="text-gray-400 text-sm">
                      Add photo proof (optional)
                    </p>
                  </div>
                </div>

                <ImageUploader
                  onImageUpload={handleImageUpload}
                  maxFiles={1}
                />
              </Card>

              {/* SUMMARY */}
              <Card
                neon
                className="rounded-[28px] border border-primary-500/20 bg-gradient-to-br from-primary-500/10 to-purple-500/10 backdrop-blur-xl"
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  Submission Summary
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      label: 'Title',
                      value: formData.title,
                    },
                    {
                      label: 'Category',
                      value: formData.category,
                    },
                    {
                      label: 'Description',
                      value: formData.description,
                    },
                    {
                      label: 'Location',
                      value: formData.location,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-400">
                        {item.label}
                      </span>

                      <span
                        className={`font-semibold ${
                          item.value
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {item.value ? '✓ Complete' : '✗ Missing'}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* QUICK TIPS */}
              <Card className="rounded-[28px] border border-blue-500/20 bg-blue-500/10 backdrop-blur-xl">
                <h3 className="text-blue-400 font-bold text-lg mb-4">
                  💡 Quick Tips
                </h3>

                <ul className="space-y-3 text-sm text-gray-300">
                  <li>• Add clear issue description</li>
                  <li>• Select accurate location</li>
                  <li>• Upload evidence photo if possible</li>
                  <li>• Choose correct issue category</li>
                </ul>
              </Card>

              {/* SUBMIT */}
              <Card className="rounded-[28px] border border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl">
                <h2 className="text-2xl font-bold text-white mb-3">
                  Ready to Submit?
                </h2>

                <p className="text-gray-400 text-sm mb-6">
                  Your complaint will be reviewed by city administration
                  and assigned for resolution.
                </p>

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  icon={IoSendOutline}
                  size="lg"
                >
                  Submit Complaint
                </Button>
              </Card>
            </div>
          </div>
        </form>

        {/* SUCCESS MODAL */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="
                fixed inset-0 z-[100]
                bg-black/70 backdrop-blur-md
                flex items-center justify-center
                p-4
              "
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 180,
                  damping: 15,
                }}
                className="
                  relative
                  w-full max-w-2xl
                  overflow-hidden
                  rounded-[32px]
                  border border-green-500/20
                  bg-[#0f172a]/95
                  backdrop-blur-2xl
                  shadow-2xl shadow-green-500/20
                "
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10"></div>

                <div className="relative p-8 md:p-10">
                  {/* ICON */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.2,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    className="
                      w-32 h-32
                      rounded-full
                      mx-auto mb-8
                      flex items-center justify-center
                      bg-gradient-to-br
                      from-green-500
                      to-emerald-600
                      shadow-2xl shadow-green-500/30
                    "
                  >
                    <IoCheckmarkCircle
                      className="text-white"
                      size={70}
                    />
                  </motion.div>

                  {/* TEXT */}
                  <div className="text-center">
                    <h2 className="text-4xl font-black text-white mb-4">
                      Complaint Registered
                    </h2>

                    <p className="text-gray-400 leading-relaxed max-w-lg mx-auto">
                      Your complaint has been submitted successfully.
                      The city administration team will review your issue
                      shortly and update the complaint status in real-time.
                    </p>
                  </div>

                  {/* INFO */}
                  <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Complaint Title
                      </span>

                      <span className="text-white font-semibold">
                        {formData.title}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Category
                      </span>

                      <span className="text-primary-400 font-semibold">
                        {formData.category}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Status
                      </span>

                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs border border-yellow-500/20">
                        Pending Verification
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
                    <button
                      onClick={() =>
                        navigate(
                          `/user/track-complaint?id=${submittedComplaint?.id}`
                        )
                      }
                      className="
                        h-14
                        rounded-2xl
                        bg-gradient-to-r
                        from-primary-500
                        to-purple-600
                        text-white
                        font-semibold
                        transition-all
                        hover:scale-[1.02]
                        hover:shadow-xl
                        hover:shadow-primary-500/30
                      "
                    >
                      Track Complaint
                    </button>

                    <button
                      onClick={() => {
                        setShowSuccessModal(false);

                        setFormData({
                          title: '',
                          description: '',
                          category: '',
                          location: '',
                          latitude: null,
                          longitude: null,
                          image: null,
                        });
                      }}
                      className="
                        h-14
                        rounded-2xl
                        border border-white/10
                        bg-white/5
                        hover:bg-white/10
                        text-white
                        font-semibold
                        transition-all
                        flex items-center justify-center gap-2
                      "
                    >
                      <IoAddCircleOutline size={20} />
                      Issue Another
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default IssueComplaint;