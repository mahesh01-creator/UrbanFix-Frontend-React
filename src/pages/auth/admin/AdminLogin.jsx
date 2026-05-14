import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

import {
  IoMailOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoShieldCheckmarkOutline,
  IoPulseOutline,
  IoLayersOutline,
  IoSparklesOutline,
  IoArrowForwardOutline,
  IoCheckmarkCircleOutline,
} from 'react-icons/io5';

import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

import { authService } from '../../../services/authService';

import toast from 'react-hot-toast';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

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

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email =
        'Email is required';
    } else if (
      !/\S+@\S+\.\S+/.test(
        formData.email
      )
    ) {
      newErrors.email =
        'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password =
        'Password is required';
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
      return;
    }

    setLoading(true);

    try {
      const response =
        await authService.login(
          formData
        );

      if (
        response.user.role !== 'ADMIN'
      ) {
        toast.error(
          'Invalid credentials for Admin portal'
        );

        authService.logout();

        return;
      }

      toast.success(
        `Welcome back, Admin ${response.user.name}!`
      );

      navigate('/admin/dashboard');

    } catch (error) {

      console.error(
        'Admin Login Error:',
        error
      );

      const message =
        error?.response?.data
          ?.message ||
        error?.response?.data ||
        error?.message ||
        'Invalid admin credentials';

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white flex items-center justify-center px-4 py-10">

    {/* PREMIUM BACKGROUND */}

    <div className="absolute inset-0 overflow-hidden">

      {/* GRID */}

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* GLOW 1 */}

      <div className="absolute top-[-150px] left-[-120px] w-[500px] h-[500px] bg-purple-600/20 blur-[140px] rounded-full" />

      {/* GLOW 2 */}

      <div className="absolute bottom-[-180px] right-[-100px] w-[500px] h-[500px] bg-blue-600/20 blur-[140px] rounded-full" />

      {/* GLOW 3 */}

      <div className="absolute top-[40%] left-[45%] w-[350px] h-[350px] bg-pink-500/10 blur-[120px] rounded-full" />

    </div>

    {/* MAIN CONTAINER */}

    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-3xl shadow-[0_0_80px_rgba(139,92,246,0.15)]"
    >

      {/* LEFT SIDE */}

      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-white/10 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10">

        <div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-sm font-medium">
            <IoShieldCheckmarkOutline />
            UrbanFix - Administration
          </div>

          <h1 className="mt-8 text-6xl font-black leading-[1]">
            Admin
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Control Panel
            </span>
          </h1>

          <p className="mt-8 text-lg leading-relaxed text-gray-300 max-w-xl">
            Access intelligent city management tools,
            complaint monitoring systems, worker allocation,
            analytics dashboards and smart governance controls.
          </p>

        </div>

        {/* FEATURES */}

        <div className="space-y-5">

          {[
            "AI Powered Complaint Verification",
            "Smart Worker Assignment System",
            "Live Analytics & Monitoring",
            "Secure Administrative Access"
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <IoShieldCheckmarkOutline className="text-lg" />
              </div>

              <span className="text-gray-200 font-medium">
                {item}
              </span>
            </div>
          ))}

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="flex items-center justify-center p-6 md:p-10">

        <div className="w-full max-w-md">

          {/* MOBILE HEADING */}

          <div className="lg:hidden text-center mb-8">

            <div className="w-24 h-24 mx-auto rounded-[28px] bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
              <IoShieldCheckmarkOutline className="text-5xl text-white" />
            </div>

            <h1 className="mt-6 text-4xl font-black">
              Admin Login
            </h1>

            <p className="mt-3 text-gray-400">
              Secure administration access
            </p>

          </div>

          {/* DESKTOP HEADER */}

          <div className="hidden lg:block mb-8">

            <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-purple-500 via-pink-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
              <IoShieldCheckmarkOutline className="text-5xl text-white" />
            </div>

            <h1 className="mt-6 text-5xl font-black">
              Admin Login
            </h1>

            <p className="mt-3 text-gray-400 text-lg">
              Access secure administrative dashboard
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <Input
                label="Admin Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter admin email"
                icon={IoMailOutline}
                error={errors.email}
                required
              />
            </div>

            <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-5">

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                icon={IoLockClosedOutline}
                error={errors.password}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-8 top-[54px] text-gray-400 hover:text-white transition"
              >
                {showPassword ? (
                  <IoEyeOffOutline size={22} />
                ) : (
                  <IoEyeOutline size={22} />
                )}
              </button>

            </div>

            {/* LOGIN BUTTON */}

            <Button
              type="submit"
              fullWidth
              loading={loading}
              variant="primary"
              className="!mt-8 !h-16 rounded-2xl !text-lg !font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-600 hover:scale-[1.01] transition-all duration-300 shadow-2xl shadow-purple-500/20"
            >
              Enter as Admin
            </Button>

          </form>

          {/* LINKS */}

          <div className="mt-8 text-center space-y-4">

          
            <Link
              to="/admin"
              className="inline-block text-gray-500 hover:text-white text-sm transition"
            >
              ← Back to Home
            </Link>

          </div>

        </div>

      </div>

    </motion.div>

  </div>
);
};

export default AdminLogin;