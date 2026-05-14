import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { IoChevronForward, IoChevronBack } from 'react-icons/io5';

const OnBoarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Report Issues Instantly',
      description: 'Easily report civic issues in your area with photos and location tracking',
      icon: '📱',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Real-time Tracking',
      description: 'Track the status of your complaints from submission to resolution',
      icon: '📍',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Smart Assignment',
      description: 'AI-powered system assigns nearest workers for faster resolution',
      icon: '🤖',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Make Your City Better',
      description: 'Join thousands of citizens making their cities smarter and cleaner',
      icon: '🏙️',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('onboardingComplete', 'true');
      navigate('/login');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingComplete', 'true');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-3xl p-12 text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className={`w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br ${steps[currentStep].color} flex items-center justify-center text-6xl`}
            >
              {steps[currentStep].icon}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold gradient-text mb-4"
            >
              {steps[currentStep].title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto"
            >
              {steps[currentStep].description}
            </motion.p>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-8">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'w-8 bg-gradient-to-r from-primary-500 to-purple-600' 
                      : 'w-2 bg-white/20'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-gray-400"
              >
                Skip
              </Button>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button
                    variant="secondary"
                    icon={IoChevronBack}
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={handleNext}
                  icon={currentStep === steps.length - 1 ? null : IoChevronForward}
                >
                  {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnBoarding;