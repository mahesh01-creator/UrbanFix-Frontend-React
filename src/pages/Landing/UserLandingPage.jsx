import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import logo from "../../assets/UrbanFix-Logo.png";
import {
  IoRocketOutline,
  IoShieldCheckmarkOutline,
  IoPeopleOutline,
  IoSpeedometerOutline,
  IoLocationOutline,
  IoCheckmarkCircle,
  IoArrowForward,
  IoMenu,
  IoClose,
  IoLogoGithub,
  IoLogoTwitter,
  IoLogoLinkedin,
  IoLogoInstagram,
  IoCallOutline,
  IoMailOutline,
  IoMapOutline,
  IoSparklesOutline,
  IoFlashOutline,
  IoGlobeOutline,
  IoPlayCircleOutline,
  IoChevronDownOutline
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();

  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.4]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.96]);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleNavigate = (path) => {
    localStorage.clear();
    navigate(path);
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    setMobileMenuOpen(false);
  };

  const features = [
    {
      icon: IoRocketOutline,
      title: 'Fast Resolution',
      description:
        'Smart complaint routing helps authorities respond faster and improve public issue handling efficiency.',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: IoLocationOutline,
      title: 'Live Location Tracking',
      description:
        'Track complaint location and assigned workers with real-time map-based monitoring.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: IoPeopleOutline,
      title: 'Smart Worker Assignment',
      description:
        'Nearest available workers are assigned automatically to improve resolution time.',
      color: 'from-emerald-500 to-green-600'
    },
    {
      icon: IoShieldCheckmarkOutline,
      title: 'Verified Complaints',
      description:
        'Admin verification ensures genuine reports and prevents fake complaint submissions.',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: IoSpeedometerOutline,
      title: 'Real-Time Tracking',
      description:
        'Citizens can track complaint progress from submission to successful resolution.',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: IoSparklesOutline,
      title: 'Feedback & Ratings',
      description:
        'Users can rate worker performance and help improve city services continuously.',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Issues Resolved' },
    { value: '5K+', label: 'Active Citizens' },
    { value: '500+', label: 'Workers Connected' },
    { value: '98%', label: 'User Satisfaction' }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Report Issue',
      description:
        'Citizens submit complaints with images, category, and live location.',
      icon: IoLocationOutline
    },
    {
      step: '02',
      title: 'Admin Verification',
      description:
        'Admins review complaints and verify issue authenticity.',
      icon: IoShieldCheckmarkOutline
    },
    {
      step: '03',
      title: 'Worker Assigned',
      description:
        'The nearest worker is assigned to resolve the complaint quickly.',
      icon: IoPeopleOutline
    },
    {
      step: '04',
      title: 'Issue Resolved',
      description:
        'Workers resolve the issue and users receive updates instantly.',
      icon: IoCheckmarkCircle
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Citizen • Pune',
      emoji: '👨‍💼',
      text:
        'The platform is extremely smooth and responsive. My road repair complaint was resolved within 2 days.'
    },
    {
      name: 'Priya Sharma',
      role: 'Community Member',
      emoji: '👩‍💼',
      text:
        'The live tracking and complaint updates make the entire system transparent and trustworthy.'
    },
    {
      name: 'Amit Patel',
      role: 'Business Owner',
      emoji: '👨‍💻',
      text:
        'This is exactly how modern smart city systems should work. Premium experience and excellent UI.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden relative">
      {/* ================= BACKGROUND ================= */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.12),transparent_30%)]" />

        {[...Array(45)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400/30"
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight
              ],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 12 + 8,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      {/* ================= NAVBAR ================= */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/20 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="flex items-center gap-4 cursor-pointer"
            >
              <div className="relative group">
  {/* Glow */}
  <div className="absolute inset-0 rounded-2xl bg-cyan-500/30 blur-xl transition-all duration-500" />

  {/* Logo Container */}
  <div className="relative w-14 h-14 rounded-2xl border border-whi flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.10)]">
    
    {/* Glass Overlay */}
    <div className="" />

    {/* Logo */}
    <img
      src={logo}
      alt="UrbanFix Logo"
      className=" w-100 h-100 "
    />
  </div>
</div>

              <div>
                <h1 className="text-xl font-bold">
                  Urban<span className="text-cyan-400">Fix</span>
                </h1>
                <p className="text-xs text-gray-400">
                  Smart City Complaint & Resolution Platform
                </p>
              </div>
            </motion.div>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-300 hover:text-cyan-400 transition"
              >
                Features
              </button>

              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-300 hover:text-cyan-400 transition"
              >
                How It Works
              </button>

              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-gray-300 hover:text-cyan-400 transition"
              >
                Testimonials
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-300 hover:text-cyan-400 transition"
              >
                Contact
              </button>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => handleNavigate('/user/login')}
                className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
              >
                Login
              </button>

              <button
                onClick={() => handleNavigate('/user/register')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-all shadow-lg shadow-cyan-500/30 font-semibold"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
            >
              {mobileMenuOpen ? (
                <IoClose size={24} />
              ) : (
                <IoMenu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden border-t border-white/10 bg-black/80 backdrop-blur-2xl"
          >
            <div className="p-5 space-y-4">
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left text-gray-300"
              >
                Features
              </button>

              <button
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left text-gray-300"
              >
                How It Works
              </button>

              <button
                onClick={() => scrollToSection('testimonials')}
                className="block w-full text-left text-gray-300"
              >
                Testimonials
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left text-gray-300"
              >
                Contact
              </button>

              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => handleNavigate('/user/login')}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10"
                >
                  User Login
                </button>

                <button
                  onClick={() => handleNavigate('/user/register')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold"
                >
                  Create Account
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* ================= HERO ================= */}
      <motion.section
        style={{
          opacity: heroOpacity,
          scale: heroScale
        }}
        className="relative pt-36 pb-28 px-5"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-8">
              <IoFlashOutline />
              Next Generation Civic Complaint Platform
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black leading-tight mb-8"
          >
            Build A
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Smarter City
            </span>
            Together
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed mb-12"
          >
            Report civic issues instantly, track complaint progress in real-time,
            receive notifications, and help authorities improve your city with
            a premium digital experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <button
              onClick={() => handleNavigate('/user/register')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-lg hover:scale-105 transition-all shadow-2xl shadow-cyan-500/30 flex items-center gap-2"
            >
              Start Reporting
              <IoArrowForward />
            </button>

            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <IoPlayCircleOutline />
              How It Works
            </button>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-24"
          >
            <div className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-5 shadow-2xl shadow-cyan-500/10">
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  {
                    icon: '📍',
                    title: 'Track Complaints',
                    desc: 'Real-time complaint monitoring'
                  },
                  {
                    icon: '🔔',
                    title: 'Live Notifications',
                    desc: 'Receive instant status updates'
                  },
                  {
                    icon: '⚡',
                    title: 'Fast Resolution',
                    desc: 'Smart worker assignment system'
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -8 }}
                    className="rounded-2xl border border-white/10 bg-black/30 p-6 text-left"
                  >
                    <div className="text-5xl mb-5">{item.icon}</div>

                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>

                    <p className="text-gray-400">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-14 flex justify-center"
          >
            <IoChevronDownOutline className="text-3xl text-gray-500" />
          </motion.div>
        </div>
      </motion.section>

      {/* ================= STATS ================= */}
      <section className="py-16 px-5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center"
            >
              <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                {stat.value}
              </h2>

              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-28 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm mb-5">
              <IoGlobeOutline />
              Smart Features
            </div>

            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Designed For
              <span className="text-cyan-400"> Modern Cities</span>
            </h2>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Every feature is built to improve complaint management and provide
              the best citizen experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 hover:border-cyan-500/30 transition-all"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-6 shadow-lg`}
                  >
                    <Icon />
                  </div>

                  <h3 className="text-2xl font-bold mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="py-28 px-5 bg-gradient-to-b from-transparent to-white/[0.03]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              How It Works
            </h2>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A simple and transparent process designed for better civic issue
              management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 overflow-hidden"
                >
                  <div className="absolute top-5 right-5 text-5xl font-black text-white/5">
                    {step.step}
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl mb-6">
                    <Icon />
                  </div>

                  <h3 className="text-2xl font-bold mb-4">
                    {step.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section id="testimonials" className="py-28 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              What Citizens Say
            </h2>

            <p className="text-xl text-gray-400">
              Thousands of users trust the platform every day.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8"
              >
                <div className="text-6xl mb-6">{item.emoji}</div>

                <p className="text-gray-300 leading-relaxed mb-8">
                  “{item.text}”
                </p>

                <div>
                  <h4 className="text-lg font-bold">{item.name}</h4>
                  <p className="text-gray-400 text-sm">{item.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-28 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-[40px] overflow-hidden relative border border-white/10 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 backdrop-blur-3xl p-12 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_30%)]" />

            <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10">
              Ready To Improve
              <span className="block text-cyan-400">
                Your City?
              </span>
            </h2>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 relative z-10">
              Join the digital revolution for smarter civic management and
              experience a premium complaint reporting platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 relative z-10">
              <button
                onClick={() => handleNavigate('/user/register')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-lg hover:scale-105 transition-all shadow-2xl shadow-cyan-500/30"
              >
                Create Free Account
              </button>

              <button
                onClick={() => handleNavigate('/user/login')}
                className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
              >
                Login Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer
        id="contact"
        className="border-t border-white/10 py-16 px-5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-14">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="relative">
  

  <div className="relative w-14 h-14 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center overflow-hidden">
    <img
      src={logo}
      alt="UrbanFix Logo"
      className="w-100 h-100 object-contain"
    />
  </div>
</div>

                <div>
                  <h3 className="font-bold text-xl">
                    UrbanFix
                  </h3>

                  <p className="text-sm text-gray-400">
                    Civic Complaint Platform
                  </p>
                </div>
              </div>

              <p className="text-gray-400 leading-relaxed">
                Transforming cities through digital complaint management and
                smart civic engagement.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-lg mb-5">Quick Links</h4>

              <div className="space-y-3 text-gray-400">
                <button
                  onClick={() => scrollToSection('features')}
                  className="block hover:text-cyan-400 transition"
                >
                  Features
                </button>

                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="block hover:text-cyan-400 transition"
                >
                  How It Works
                </button>

                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="block hover:text-cyan-400 transition"
                >
                  Testimonials
                </button>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-5">Contact</h4>

              <div className="space-y-4 text-gray-400">
                <div className="flex items-center gap-3">
                  <IoMailOutline />
                  support@smartcity.com
                </div>

                <div className="flex items-center gap-3">
                  <IoCallOutline />
                  +91 1800-123-4567
                </div>

                <div className="flex items-center gap-3">
                  <IoMapOutline />
                  Pune, Maharashtra
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-bold text-lg mb-5">
                Connect With Us
              </h4>

              <div className="flex gap-4">
                {[IoLogoGithub, IoLogoLinkedin, IoLogoInstagram].map(
                  (Icon, i) => (
                    <button
                      key={i}
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/30 transition"
                      link="https://github.com/mahesh01-creator"
                    >
                      <Icon size={22} />
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            © 2026 UrbanFix - Citizen Portal . 
            All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;