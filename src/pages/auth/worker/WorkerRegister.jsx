import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  IoPersonOutline, 
  IoMailOutline, 
  IoLockClosedOutline, 
  IoEyeOutline, 
  IoEyeOffOutline,
  IoCallOutline,
  IoBusinessOutline,
  IoLocationSharp,
  IoMapOutline
} from 'react-icons/io5';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import { authService } from '../../../services/authService';
import toast from 'react-hot-toast';

const DEPARTMENTS = [
  'Road Damage',
  'Street Light',
  'Garbage Collection',
  'Water Supply',
  'Drainage',
  'Public Property',
  'Parks & Recreation',
  'Noise Pollution',
  'Others'
];

const WorkerRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    phone: '',
    area: '',
    latitude: null,
    longitude: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    toast.loading('Getting your location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));

        // Get address from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          
          if (data.results && data.results[0]) {
            const address = data.results[0].formatted_address;
            setFormData(prev => ({
              ...prev,
              area: address,
            }));
          }
        } catch (error) {
          console.error('Geocoding error:', error);
        }

        toast.dismiss();
        toast.success('Location detected successfully!');
        setGettingLocation(false);
      },
      (error) => {
        toast.dismiss();
        toast.error('Unable to get location. Please enable location services.');
        console.error('Geolocation error:', error);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.area) {
      newErrors.area = 'Area is required';
    }
    
    if (!formData.latitude || !formData.longitude) {
      newErrors.location = 'Please get your current location';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        phone: formData.phone,
        area: formData.area,
        latitude: formData.latitude,
        longitude: formData.longitude,
        activeTasks: 0,
      };
      
      await authService.registerWorker(registerData);
      
      toast.success('Worker registration successful! Please login.');
      navigate('/worker/login');
    } catch (error) {
      toast.error(error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen relative overflow-hidden bg-[#06110b] text-white">
    
    {/* PREMIUM BACKGROUND */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[520px] h-[520px] bg-green-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[520px] h-[520px] bg-emerald-500/20 rounded-full blur-3xl" />
      <div className="absolute top-[30%] left-[40%] w-[350px] h-[350px] bg-lime-500/10 rounded-full blur-3xl" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>

    <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl grid lg:grid-cols-[1.05fr_0.95fr] rounded-[34px] overflow-hidden border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
      >

        {/* LEFT SIDE */}
        <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 border-r border-white/10 bg-gradient-to-br from-green-950/40 via-black/30 to-emerald-950/30">

          {/* Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_45%)]" />

          <div className="relative z-10">
            
            {/* LOGO */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-400 via-emerald-500 to-lime-500 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(34,197,94,0.35)]">
                🔧
              </div>

              <div>
                <h1 className="text-4xl font-black leading-tight">
                  Worker
                  <span className="block bg-gradient-to-r from-green-300 via-emerald-400 to-lime-300 bg-clip-text text-transparent">
                    Registration
                  </span>
                </h1>

                <p className="text-gray-400 mt-2 text-sm tracking-wide uppercase">
                  UrbanFix - Field Workforce Portal
                </p>
              </div>
            </motion.div>

            {/* TEXT */}
            <div className="mt-14 space-y-5">
              <h2 className="text-5xl font-black leading-tight">
                Join the
                <span className="block text-green-400">
                  Smart Response Team
                </span>
              </h2>

              <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
                Register as a verified field worker and manage civic complaints,
                live location tracking, issue resolution, and smart task assignments
                with real-time city operations support.
              </p>
            </div>

            {/* FEATURES */}
            <div className="mt-12 grid gap-5">
              
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center text-2xl">
                  📍
                </div>

                <div>
                  <h3 className="font-bold text-lg">
                    Live Location Assignment
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Automatically receive complaints from your nearby operational zone.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-2xl">
                  ⚡
                </div>

                <div>
                  <h3 className="font-bold text-lg">
                    Quick Resolution Workflow
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Upload proof images and update complaint status instantly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-lime-500/20 flex items-center justify-center text-2xl">
                  🛡️
                </div>

                <div>
                  <h3 className="font-bold text-lg">
                    Verified Worker Access
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Secure access to the city operations and worker management portal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="relative z-10 mt-10 flex items-center justify-between border-t border-white/10 pt-6">
            <div>
              <p className="text-sm text-gray-500">
                Smart City Operations
              </p>
              <h4 className="font-semibold text-white">
                Workers Activity Portal
              </h4>
            </div>

            
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="relative flex items-center justify-center p-6 sm:p-10 xl:p-14">
          
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="w-full max-w-2xl"
          >

            {/* MOBILE HEADER */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                🔧
              </div>

              <h1 className="text-4xl font-black mt-5">
                Worker
                <span className="block bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                  Registration
                </span>
              </h1>
            </div>

            {/* FORM CARD */}
            <div className="rounded-[30px] border border-white/10 bg-black/30 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_10px_50px_rgba(0,0,0,0.5)]">

              <div className="mb-8">
                <h2 className="text-3xl font-black">
                  Create Worker Account
                </h2>

                <p className="text-gray-400 mt-2">
                  Complete your registration to access field operations.
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* PERSONAL INFO */}
                <div className="grid md:grid-cols-2 gap-5">

                  <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    icon={IoPersonOutline}
                    error={errors.name}
                    required
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    icon={IoCallOutline}
                    error={errors.phone}
                    required
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  icon={IoMailOutline}
                  error={errors.email}
                  required
                />

                <div className="grid md:grid-cols-2 gap-5">

                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      icon={IoLockClosedOutline}
                      error={errors.password}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-[44px] text-gray-400 hover:text-green-400 transition"
                    >
                      {showPassword ? (
                        <IoEyeOffOutline size={20} />
                      ) : (
                        <IoEyeOutline size={20} />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      icon={IoLockClosedOutline}
                      error={errors.confirmPassword}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-[44px] text-gray-400 hover:text-green-400 transition"
                    >
                      {showConfirmPassword ? (
                        <IoEyeOffOutline size={20} />
                      ) : (
                        <IoEyeOutline size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* WORK INFO */}
                <div className="grid md:grid-cols-2 gap-5">

                  <Select
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    options={DEPARTMENTS}
                    placeholder="Select department"
                    error={errors.department}
                    required
                  />

                  <Input
                    label="Area / Region"
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Enter work area"
                    icon={IoMapOutline}
                    error={errors.area}
                    required
                  />
                </div>

                {/* LOCATION SECTION */}
                <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">

                  <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                    <div>
                      <h3 className="font-bold text-lg">
                        Live Location Verification
                      </h3>

                      <p className="text-sm text-gray-400 mt-1">
                        Enable location access for smart complaint assignments.
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 text-xl">
                      <IoLocationSharp />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleGetLocation}
                    loading={gettingLocation}
                    icon={IoLocationSharp}
                    variant={formData.latitude ? 'success' : 'secondary'}
                    fullWidth
                  >
                    {formData.latitude
                      ? `Location Captured `
                      : 'Get Current Location'}
                  </Button>

                  {errors.location && (
                    <p className="text-red-400 text-sm mt-3">
                      ⚠️ {errors.location}
                    </p>
                  )}
                </div>

                {/* SUBMIT */}
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  variant="primary"
                  size="lg"
                   className="!mt-8 !h-16 rounded-2xl !text-lg !font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 hover:scale-[1.01] transition-all duration-300 shadow-2xl shadow-green-500/20"
                >
                  Register as Worker
                </Button>
              </form>

              {/* LINKS */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-4">

                <p className="text-gray-400">
                  Already registered?{" "}
                  <Link
                    to="/worker/login"
                    className="text-green-400 hover:text-green-300 font-semibold transition"
                  >
                    LogIn
                  </Link>
                </p>

                
                <Link
                  to="/worker"
                  className="inline-flex items-center text-gray-500 hover:text-white text-sm transition"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </div>
);
};

export default WorkerRegister;