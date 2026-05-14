import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import {
  IoStarOutline,
  IoStar,
  IoSendOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoCreateOutline,
  IoChatbubbleEllipsesOutline,
  IoTrendingUpOutline,
  IoDocumentTextOutline,
  IoHomeOutline,
  IoAddCircleOutline,
  IoLocationOutline,
  IoCalendarOutline,
  IoShieldCheckmarkOutline,
  IoArrowForwardOutline,
  IoArchiveOutline,
} from 'react-icons/io5';

import DashboardLayout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Textarea from '../../components/common/Textarea';
import Loader from '../../components/common/Loader';

import { complaintService } from '../../services/complaintService';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../../utils/helpers';

import toast from 'react-hot-toast';

const Feedback = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);

  // ================= STATES =================

  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [feedbackHistory, setFeedbackHistory] = useState([]);

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [comment, setComment] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const sidebarLinks = [
    {
      name: 'Dashboard',
      path: '/user/dashboard',
      icon: IoHomeOutline,
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
    {
      name: 'Track Complaint',
      path: '/user/track-complaint',
      icon: IoTrendingUpOutline,
    },
    {
      name: 'Feedback',
      path: '/user/feedback',
      icon: IoChatbubbleEllipsesOutline,
    },
  ];

  // ================= LOAD DATA =================

  useEffect(() => {
    fetchResolvedComplaints();
  }, []);

  const fetchResolvedComplaints = async () => {
    try {
      setLoading(true);

      const data =
        await complaintService.getUserComplaints(
          user.id
        );

      // ONLY RESOLVED
      const resolved = data.filter(
        (c) => c.status === 'RESOLVED'
      );

      // CHECK BOTH feedbackSubmitted AND feedback/rating

const pending = resolved.filter(
  (c) =>
    !c.feedbackSubmitted &&
    !c.feedback &&
    !c.rating
);

const history = resolved.filter(
  (c) =>
    c.feedbackSubmitted ||
    c.feedback ||
    c.rating
);

      setPendingComplaints(pending);

      setFeedbackHistory(history);

      // AUTO SELECT FIRST PENDING
      if (pending.length > 0) {
        setSelectedComplaint(pending[0]);

        setComment('');
        setRating(0);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        'Failed to load feedback data'
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= SELECT =================

  const handleSelectComplaint = (
    complaint
  ) => {
    setSelectedComplaint(complaint);

    setComment('');
    setRating(0);
  };

  // ================= SUBMIT =================

  const handleSubmitFeedback =
    async () => {
      if (!selectedComplaint) return;

      if (rating === 0) {
        toast.error(
          'Please select rating'
        );
        return;
      }

      if (!comment.trim()) {
        toast.error(
          'Please write feedback'
        );
        return;
      }

      try {
        setSubmitting(true);

        await complaintService.submitFeedback(
          user.id,
          selectedComplaint.id,
          comment,
          rating
        );

        const updatedComplaint = {
        ...selectedComplaint,
        feedback: comment,
        rating,
        feedbackSubmitted: true,
        updatedAt: new Date(),
        };

        // REMOVE FROM PENDING
        const updatedPending =
          pendingComplaints.filter(
            (c) =>
              c.id !==
              selectedComplaint.id
          );

        setPendingComplaints(
          updatedPending
        );

        // ADD TO HISTORY
        setFeedbackHistory((prev) => [
          updatedComplaint,
          ...prev,
        ]);

        // RESET
        setComment('');
        setRating(0);

        // AUTO SELECT NEXT
        if (updatedPending.length > 0) {
          setSelectedComplaint(
            updatedPending[0]
          );
        } else {
          setSelectedComplaint(null);
        }

        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);

        toast.success(
          'Feedback submitted successfully!'
        );
      } catch (error) {
        console.error(error);

        toast.error(
          'Failed to submit feedback'
        );
      } finally {
        setSubmitting(false);
      }
    };

  // ================= LOADER =================

  if (loading) {
    return (
      <Loader
        fullScreen
        text="Loading Feedback Center..."
      />
    );
  }

  return (
    <DashboardLayout
      links={sidebarLinks}
    >
      <div className="space-y-8">
        {/* ================= HEADER ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: -25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] via-[#1e1b4b] to-[#0f172a] p-8 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-5">
                <IoStar className="text-yellow-400" />

                <span className="text-sm text-gray-300 font-medium">
                  Citizen Feedback Portal
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Share Your
                <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
                  Experience
                </span>
              </h1>

              <p className="text-gray-400 mt-5 max-w-2xl text-lg leading-relaxed">
                Your feedback helps
                improve city services and
                public complaint handling.
              </p>
            </div>

            {/* STATS */}

            <div className="grid grid-cols-2 gap-4 min-w-[280px]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-gray-400 text-sm mb-2">
                  Pending Feedback
                </p>

                <h2 className="text-3xl font-black text-yellow-400">
                  {
                    pendingComplaints.length
                  }
                </h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-gray-400 text-sm mb-2">
                  Feedback History
                </p>

                <h2 className="text-3xl font-black text-green-400">
                  {
                    feedbackHistory.length
                  }
                </h2>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= SUCCESS ================= */}

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{
                  scale: 0.6,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                className="text-center"
              >
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40">
                  <IoCheckmarkCircle className="w-20 h-20 text-white" />
                </div>

                <h2 className="text-4xl font-black text-white mt-8 mb-3">
                  Thank You!
                </h2>

                <p className="text-gray-300 text-lg">
                  Feedback submitted
                  successfully
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= EMPTY ================= */}

        {pendingComplaints.length ===
          0 &&
        feedbackHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-3xl border border-white/10 p-16 text-center overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-purple-500/5"></div>

            <div className="relative z-10">
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/20 mb-8">
                <IoTimeOutline className="w-14 h-14 text-yellow-400" />
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">
                No Feedback Available
              </h2>

              <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed mb-8">
                Feedback becomes
                available once your
                complaints are resolved.
              </p>

              <Button
                onClick={() =>
                  navigate(
                    '/user/track-complaint'
                  )
                }
                icon={
                  IoArrowForwardOutline
                }
                size="lg"
              >
                Track Complaints
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* ================= LEFT PANEL ================= */}

            <div className="space-y-8">
              {/* PENDING FEEDBACK */}

              <Card className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] backdrop-blur-2xl overflow-hidden shadow-2xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4">
                        <IoTimeOutline className="text-yellow-400" />

                        <span className="text-sm font-medium text-yellow-300">
                          Pending
                          Feedback
                        </span>
                      </div>

                      <h3 className="text-3xl font-black text-white">
                        Need Feedback
                      </h3>
                    </div>

                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                      <span className="text-2xl font-black text-white">
                        {
                          pendingComplaints.length
                        }
                      </span>
                    </div>
                  </div>

                  {pendingComplaints.length ===
                  0 ? (
                    <div className="rounded-3xl bg-white/5 border border-white/10 p-10 text-center">
                      <IoCheckmarkCircle className="text-5xl text-green-400 mx-auto mb-5" />

                      <h3 className="text-2xl font-bold text-white">
                        All Feedback
                        Submitted
                      </h3>

                      <p className="text-gray-400 mt-3">
                        You have already
                        submitted feedback
                        for all resolved
                        complaints.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2">
                      {pendingComplaints.map(
                        (
                          complaint,
                          index
                        ) => {
                          const isSelected =
                            selectedComplaint?.id ===
                            complaint.id;

                          return (
                            <motion.div
                              key={
                                complaint.id
                              }
                              initial={{
                                opacity: 0,
                                y: 15,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              transition={{
                                delay:
                                  index *
                                  0.05,
                              }}
                              whileHover={{
                                scale: 1.02,
                              }}
                              onClick={() =>
                                handleSelectComplaint(
                                  complaint
                                )
                              }
                              className={`rounded-3xl p-5 border cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-primary-500 bg-primary-500/10'
                                  : 'border-white/10 bg-white/5 hover:border-primary-500/30'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div>
                                  <h4 className="font-bold text-white text-lg">
                                    {
                                      complaint.title
                                    }
                                  </h4>

                                  <p className="text-gray-400 text-sm mt-2">
                                    {
                                      complaint.category
                                    }
                                  </p>
                                </div>

                                <div className="px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold">
                                  Pending
                                </div>
                              </div>

                              <div className="mt-4 space-y-2 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                  <IoCalendarOutline />

                                  <span>
                                    {formatDate(
                                      complaint.resolvedAt
                                    )}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <IoLocationOutline />

                                  <span>
                                    {
                                      complaint.location
                                    }
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              </Card>

              {/* ================= FEEDBACK HISTORY ================= */}

              <Card className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-8">
                    <IoArchiveOutline className="text-green-400 text-3xl" />

                    <div>
                      <h3 className="text-3xl font-black text-white">
                        Feedback History
                      </h3>

                      <p className="text-gray-400">
                        Submitted feedback
                        records
                      </p>
                    </div>
                  </div>

                  {feedbackHistory.length ===
                  0 ? (
                    <div className="text-center py-10 text-gray-400">
                      No feedback history
                    </div>
                  ) : (
                    <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
                      {feedbackHistory.map(
                        (complaint) => (
                          <div
                            key={
                              complaint.id
                            }
                            className="rounded-3xl bg-white/5 border border-white/10 p-5"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <h4 className="font-bold text-white">
                                  {
                                    complaint.title
                                  }
                                </h4>

                                <p className="text-gray-400 text-sm mt-2">
                                  {
                                    complaint.category
                                  }
                                </p>
                              </div>

                              <div className="flex items-center gap-1">
                                {[...Array(
                                  complaint.rating
                                )].map(
                                  (
                                    _,
                                    i
                                  ) => (
                                    <IoStar
                                      key={
                                        i
                                      }
                                      className="text-yellow-400"
                                    />
                                  )
                                )}
                              </div>
                            </div>

                            <div className="mt-4 rounded-2xl bg-black/20 border border-white/5 p-4">
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {
                                  complaint.feedback
                                }
                              </p>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                              <span>
                                Feedback
                                Submitted
                              </span>

                              <span>
                                {formatDate(
                                  complaint.updatedAt ||
                                    complaint.resolvedAt
                                )}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* ================= RIGHT PANEL ================= */}

            <div className="xl:col-span-2">
              {selectedComplaint ? (
                <div className="space-y-8">
                  {/* DETAILS */}

                  <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
                    <div className="p-8">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
                        <div>
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-5">
                            <IoShieldCheckmarkOutline className="text-green-400" />

                            <span className="text-green-300 text-sm font-medium">
                              Complaint
                              Resolved
                            </span>
                          </div>

                          <h2 className="text-3xl font-black text-white mb-3">
                            {
                              selectedComplaint.title
                            }
                          </h2>

                          <p className="text-gray-400 leading-relaxed">
                            {
                              selectedComplaint.description
                            }
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
                          <p className="text-gray-400 text-sm mb-2">
                            Category
                          </p>

                          <h4 className="text-white font-bold">
                            {
                              selectedComplaint.category
                            }
                          </h4>
                        </div>

                        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
                          <p className="text-gray-400 text-sm mb-2">
                            Resolved On
                          </p>

                          <h4 className="text-white font-bold">
                            {formatDate(
                              selectedComplaint.resolvedAt
                            )}
                          </h4>
                        </div>

                        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
                          <p className="text-gray-400 text-sm mb-2">
                            Location
                          </p>

                          <h4 className="text-white font-bold">
                            {
                              selectedComplaint.location
                            }
                          </h4>
                        </div>

                        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
                          <p className="text-gray-400 text-sm mb-2">
                            Resolved By
                          </p>

                          <h4 className="text-white font-bold">
                            {selectedComplaint
                              .worker
                              ?.name ||
                              selectedComplaint
                                .assignedWorker
                                ?.name ||
                              'Municipal Team'}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* FEEDBACK FORM */}

                  <Card
                    neon
                    className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#1e1b4b]"
                  >
                    <div className="p-8">
                      <div className="mb-8">
                        <h2 className="text-3xl font-black text-white mb-2">
                          Share Feedback
                        </h2>

                        <p className="text-gray-400">
                          Rate your
                          experience with
                          the complaint
                          resolution process
                        </p>
                      </div>

                      {/* STARS */}

                      <div className="flex justify-center gap-5 mb-8 flex-wrap">
                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <motion.button
                              key={star}
                              whileHover={{
                                scale: 1.15,
                              }}
                              whileTap={{
                                scale: 0.95,
                              }}
                              onClick={() =>
                                setRating(
                                  star
                                )
                              }
                              onMouseEnter={() =>
                                setHoverRating(
                                  star
                                )
                              }
                              onMouseLeave={() =>
                                setHoverRating(
                                  0
                                )
                              }
                              className="focus:outline-none"
                            >
                              {star <=
                              (hoverRating ||
                                rating) ? (
                                <IoStar className="w-14 h-14 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                              ) : (
                                <IoStarOutline className="w-14 h-14 text-gray-600 hover:text-yellow-300 transition" />
                              )}
                            </motion.button>
                          )
                        )}
                      </div>

                      {/* COMMENT */}

                      <Textarea
                        label="Your Feedback"
                        value={comment}
                        onChange={(e) =>
                          setComment(
                            e.target.value
                          )
                        }
                        placeholder="Tell us about your experience..."
                        rows={6}
                        required
                      />

                      <Button
                        onClick={
                          handleSubmitFeedback
                        }
                        loading={submitting}
                        disabled={
                          rating === 0 ||
                          !comment.trim()
                        }
                        fullWidth
                        size="lg"
                        icon={
                          IoSendOutline
                        }
                        className="mt-8 h-14 text-lg font-semibold"
                      >
                        Submit Feedback
                      </Button>
                    </div>
                  </Card>
                </div>
              ) : (
                <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-16 text-center">
                  <IoCheckmarkCircle className="text-6xl text-green-400 mx-auto mb-6" />

                  <h2 className="text-3xl font-black text-white mb-4">
                    All Feedback Completed
                  </h2>

                  <p className="text-gray-400 max-w-xl mx-auto text-lg">
                    You have submitted
                    feedback for all
                    resolved complaints.
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Feedback;