import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { authService } from '../../../services/authService';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';
import logo from "../../../assets/UrbanFix-Logo.png";
const UserLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

const { setUser } = useAuthStore();
const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = validate();

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setLoading(true);

  try {
    const response = await authService.login(formData);

    if (response.user.role !== 'USER') {
      toast.error('Invalid credentials for User portal');
      authService.logout();
      return;
    }

    // ✅ UPDATE ZUSTAND STORE
    setUser(response.user);

    toast.success(`Welcome back, ${response.user.name}!`);

    navigate('/user/dashboard');

  } catch (error) {

  console.error("User Login Error:", error);

  const message =
    error?.response?.data?.message ||
    error?.response?.data ||
    error?.message ||
    "Invalid email or password";

  toast.error(message);

} finally {
    setLoading(false);
  }
};

  return (
  <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">

    {/* BACKGROUND EFFECTS */}

    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-cyan-500/20 blur-[120px] rounded-full" />

      <div className="absolute bottom-[-150px] right-[-120px] w-[420px] h-[420px] bg-blue-600/20 blur-[120px] rounded-full" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
    </div>

    <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl rounded-[36px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.6)]"
      >

        <div className="grid lg:grid-cols-2">

          {/* LEFT SIDE */}

          <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-transparent border-r border-white/10 overflow-hidden">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.18),transparent_40%)]" />

            <div className="relative z-10">

              <div className="relative group">
                
              
                {/* Logo Container */}
                {/* <div className="relative w-20 h-20 rounded-2xl border border-whi flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.10)]"> */}
                  
                  {/* Glass Overlay */}
                  
              
                  {/* Logo */}
                  <img
                    src={logo}
                    alt="UrbanFix Logo"
                    className=" w-40 h-40 "
                  />
                {/* </div> */}
              </div>

              <div className="mt-1">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm font-medium">
                  <IoMailOutline />
                  UrbanFix - Citizen Portal
                </div>

                <h1 className="mt-6 text-5xl font-black leading-tight">
                  Welcome
                  <br />
                  Back Citizen
                </h1>

                <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-md">
                  Access your smart complaint dashboard,
                  track reports in real-time and help build
                  a cleaner, safer smart city experience.
                </p>

              </div>

            </div>

            {/* FEATURES */}

            <div className="relative z-10 grid grid-cols-1 gap-4 mt-10">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="font-semibold text-cyan-300">
                  Real-Time Tracking
                </h3>

                <p className="text-sm text-gray-400 mt-2">
                  Monitor complaint progress instantly.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <h3 className="font-semibold text-cyan-300">
                  AI Smart System
                </h3>

                <p className="text-sm text-gray-400 mt-2">
                  Faster issue detection and worker assignment.
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="p-6 sm:p-10 lg:p-14 flex items-center">

            <div className="w-full max-w-md mx-auto">

              {/* MOBILE LOGO */}

              <div className="lg:hidden text-center mb-8">

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 mx-auto rounded-[24px] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl shadow-2xl shadow-cyan-500/20"
                >
                  👤
                </motion.div>

              </div>

              {/* HEADER */}

              <div className="mb-10">

                <h2 className="text-4xl font-black">
                  Citizen Login
                </h2>

                <p className="text-gray-400 mt-3 text-lg">
                  Sign in to continue to your portal
                </p>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                <div className="rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    icon={IoMailOutline}
                    error={errors.email}
                    required
                  />
                </div>

                <div className="relative rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">

                  <Input
                    label="Password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
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
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-5 top-[46px] text-gray-400 hover:text-cyan-300 transition-colors"
                  >
                    {showPassword ? (
                      <IoEyeOffOutline size={22} />
                    ) : (
                      <IoEyeOutline size={22} />
                    )}
                  </button>

                </div>

                {/* BUTTON */}

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  variant="primary"
                  className="h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-bold shadow-xl shadow-cyan-500/20 hover:scale-[1.01] transition-all duration-300"
                >
                  Sign In as Citizen
                </Button>

              </form>

              {/* LINKS */}

              <div className="mt-8 space-y-5 text-center">

                <p className="text-gray-400">
                  Don't have an account?{" "}

                  <Link
                    to="/user/register"
                    className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Register
                  </Link>

                </p>

                <div className="flex items-center justify-center gap-3 text-xs text-gray-500">

                  <div className="h-px w-14 bg-white/10" />

                  UrbanFix

                  <div className="h-px w-14 bg-white/10" />

                </div>

                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
                >
                  ← Back to Home
                </Link>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </div>

  </div>
);
};

export default UserLogin;