import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  IoPersonOutline, 
  IoMailOutline, 
  IoLockClosedOutline, 
  IoEyeOutline, 
  IoEyeOffOutline 
} from 'react-icons/io5';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { authService } from '../../../services/authService';
import toast from 'react-hot-toast';

const UserRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      
      await authService.register(registerData);
      
      toast.success('Registration successful! Please login.');
      navigate('/user/login');
    } catch (error) {
      toast.error(error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">

    {/* BACKGROUND */}

    <div className="absolute inset-0 overflow-hidden">

      <div className="absolute top-[-150px] left-[-120px] w-[420px] h-[420px] bg-cyan-500/15 rounded-full blur-[140px]" />

      <div className="absolute bottom-[-150px] right-[-120px] w-[420px] h-[420px] bg-blue-600/15 rounded-full blur-[140px]" />

      <div className="absolute top-[35%] left-[45%] w-[240px] h-[240px] bg-purple-500/10 rounded-full blur-[120px]" />

    </div>

    {/* GRID */}

    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />

    <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-6xl rounded-[36px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.65)]"
      >

        <div className="grid lg:grid-cols-2">

          {/* LEFT PANEL */}

          <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-r border-white/10 overflow-hidden">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.2),transparent_35%)]" />

            <div className="relative z-10">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-8">
                <IoPersonOutline />
                UrbanFix - Citizen Portal
              </div>

              <div className="relative mb-10">

                <div className="absolute inset-0 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full" />

                <div className="relative w-28 h-28 rounded-[28px] bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-6xl border border-white/10 shadow-2xl">
                  👤
                </div>

              </div>

              <h1 className="text-5xl font-black leading-tight">
                Join Your
                <br />
                Smart City
              </h1>

              <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-md">
                Report civic issues, track complaint
                progress, and help improve your city
                through intelligent digital governance.
              </p>

            </div>

            {/* FEATURES */}

            <div className="relative z-10 space-y-5 mt-12">

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-300">
                  ⚡
                </div>

                <div>
                  <h3 className="font-semibold">
                    Fast Complaint Tracking
                  </h3>

                  <p className="text-sm text-gray-400">
                    Real-time complaint updates
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-300">
                  🛡️
                </div>

                <div>
                  <h3 className="font-semibold">
                    Secure Digital Access
                  </h3>

                  <p className="text-sm text-gray-400">
                    Protected citizen account
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-300">
                  🌍
                </div>

                <div>
                  <h3 className="font-semibold">
                    Smart City Integration
                  </h3>

                  <p className="text-sm text-gray-400">
                    AI-powered civic management
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT PANEL */}

          <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center">

            {/* MOBILE LOGO */}

            <div className="lg:hidden text-center mb-8">

              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-5xl shadow-2xl">
                👤
              </div>

            </div>

            <div className="mb-8">

              <h2 className="text-4xl font-black">
                Create Account
              </h2>

              <p className="text-gray-400 mt-3 text-lg">
                Start your smart city experience
              </p>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                icon={IoPersonOutline}
                error={errors.name}
                required
              />

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

              <div className="grid md:grid-cols-2 gap-5">

                {/* PASSWORD */}

                <div className="relative">

                  <Input
                    label="Password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
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
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-[44px] text-gray-400 hover:text-cyan-300"
                  >
                    {showPassword ? (
                      <IoEyeOffOutline size={20} />
                    ) : (
                      <IoEyeOutline size={20} />
                    )}
                  </button>

                </div>

                {/* CONFIRM */}

                <div className="relative">

                  <Input
                    label="Confirm Password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Confirm password"
                    icon={IoLockClosedOutline}
                    error={
                      errors.confirmPassword
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-[44px] text-gray-400 hover:text-cyan-300"
                  >
                    {showConfirmPassword ? (
                      <IoEyeOffOutline size={20} />
                    ) : (
                      <IoEyeOutline size={20} />
                    )}
                  </button>

                </div>

              </div>

              {/* CTA */}

              <Button
                type="submit"
                fullWidth
                loading={loading}
                variant="primary"
                className="!mt-7 !h-14 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-lg font-bold shadow-[0_12px_40px_rgba(6,182,212,0.35)] hover:scale-[1.01] transition-all duration-300"
              >
                Create Citizen Account
              </Button>

            </form>

            {/* FOOTER */}

            <div className="mt-8 text-center">

              <p className="text-gray-400">
                Already have an account?{" "}

                <Link
                  to="/user/login"
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  LogIn
                </Link>

              </p>

              <Link
                to="/"
                className="inline-block mt-5 text-sm text-gray-500 hover:text-white transition-colors"
              >
                ← Back to Home
              </Link>

            </div>

          </div>

        </div>

      </motion.div>

    </div>

  </div>
);
};

export default UserRegister;