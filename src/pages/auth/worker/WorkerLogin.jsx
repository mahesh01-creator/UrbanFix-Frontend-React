import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline, IoConstructOutline,IoCheckmarkDone} from 'react-icons/io5';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { complaintService } from '../../../services/complaintService';
import { authService } from '../../../services/authService';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';


const WorkerLogin = () => {
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

  // Update handleSubmit function
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
    
    if (response.user.role !== 'WORKER') {
      toast.error('Invalid credentials for Worker portal');
      authService.logout();
      return;
    }


    
    // Auto-update location on login
    setUser(response.user);
    toast.loading('Updating your location...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await complaintService.updateWorkerLocation(
              response.user.id,
              position.coords.latitude,
              position.coords.longitude
            );
            toast.dismiss();
            toast.success(`Welcome back, ${response.user.name}! Location updated.`);
          } catch (error) {
            toast.dismiss();
            toast.success(`Welcome back, ${response.user.name}!`);
            console.error('Location update failed:', error);
          }
          navigate('/worker/dashboard');
        },
        (error) => {
          toast.dismiss();
          toast.success(`Welcome back, ${response.user.name}!`);
          console.error('Geolocation error:', error);
          navigate('/worker/dashboard');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      toast.dismiss();
      toast.success(`Welcome back, ${response.user.name}!`);
      navigate('/worker/dashboard');
    }
  } catch (error) {

  console.error("Worker Login Error:", error);

  const message =
    error?.response?.data?.message ||
    error?.response?.data ||
    error?.message ||
    "Invalid worker credentials";

  toast.error(message);

} finally {
    setLoading(false);
  }
};

  return (
  <div className="relative min-h-screen overflow-hidden bg-[#03110b] text-white flex items-center justify-center px-4 py-10">

    {/* PREMIUM BACKGROUND */}

    <div className="absolute inset-0 overflow-hidden">

      {/* GRID */}

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* GLOW 1 */}

      <div className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] bg-emerald-500/20 blur-[140px] rounded-full" />

      {/* GLOW 2 */}

      <div className="absolute bottom-[-150px] right-[-120px] w-[500px] h-[500px] bg-green-500/20 blur-[140px] rounded-full" />

      {/* CENTER GLOW */}

      <div className="absolute top-[35%] left-[45%] w-[350px] h-[350px] bg-lime-500/10 blur-[120px] rounded-full" />

    </div>

    {/* MAIN CARD */}

    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-3xl shadow-[0_0_80px_rgba(16,185,129,0.18)]"
    >

      {/* LEFT PANEL */}

      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-white/10 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10">

        <div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/10 text-green-300 text-sm font-medium">
            <IoConstructOutline />
            UrbanFix - Workforce
          </div>

          <h1 className="mt-8 text-6xl font-black leading-[1]">
            Worker
            <span className="block bg-gradient-to-r from-green-400 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
              Operations
            </span>
          </h1>

          <p className="mt-8 text-lg leading-relaxed text-gray-300 max-w-xl">
            Access assigned civic complaints, update
            your live work status, track smart routes
            and resolve city issues efficiently in
            real-time.
          </p>

        </div>

        {/* FEATURES */}

        <div className="space-y-5">

          {[
            "Smart Complaint Assignment",
            "Live GPS Location Updates",
            "Real-Time Work Tracking",
            "Quick Resolution Upload System"
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4"
            >

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <IoCheckmarkDone className="text-lg" />
              </div>

              <span className="text-gray-200 font-medium">
                {item}
              </span>

            </div>
          ))}

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="flex items-center justify-center p-6 md:p-10">

        <div className="w-full max-w-md">

          {/* MOBILE HEADER */}

          <div className="lg:hidden text-center mb-8">

            <div className="w-24 h-24 mx-auto rounded-[28px] bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30">
              <IoConstructOutline className="text-5xl text-white" />
            </div>

            <h1 className="mt-6 text-4xl font-black">
              Worker Login
            </h1>

            <p className="mt-3 text-gray-400">
              Access your assigned operations
            </p>

          </div>

          {/* DESKTOP HEADER */}

          <div className="hidden lg:block mb-8">

            <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-green-500 via-emerald-500 to-lime-500 flex items-center justify-center shadow-2xl shadow-green-500/30">
              <IoConstructOutline className="text-5xl text-white" />
            </div>

            <h1 className="mt-6 text-5xl font-black">
              Worker Login
            </h1>

            <p className="mt-3 text-gray-400 text-lg">
              Access field operations dashboard
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* EMAIL */}

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

              <Input
                label="Worker Email"
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

            {/* PASSWORD */}

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
              className="!mt-8 !h-16 rounded-2xl !text-lg !font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 hover:scale-[1.01] transition-all duration-300 shadow-2xl shadow-green-500/20"
            >
              Enter as Worker
            </Button>

          </form>

          {/* LINKS */}

          <div className="mt-8 text-center space-y-4">

            <p className="text-gray-400">
              Don't have worker access?{" "}
              <Link
                to="/worker/register"
                className="text-green-400 hover:text-green-300 font-semibold transition"
              >
                Register
              </Link>
            </p>

            

            <Link
              to="/worker"
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

export default WorkerLogin;