import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeftIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { ExplosionEffect } from '../../../shared/components';
import VideoBackground from '../../../shared/components/VideoBackground';

const CyberpunkRegistration = () => {
  const navigate = useNavigate();
  const { isLoaded, signUp } = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const inputClasses = `
    w-full p-4 rounded-lg bg-black/50 border border-white/20 
    text-white placeholder-white/50 
    focus:outline-none focus:border-[#00F6FF] focus:shadow-[0_0_15px_rgba(0,246,255,0.3)] 
    transition-all duration-300
  `;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setIsSubmitting(true);
      setError(null);

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Create sign up with CAPTCHA
      const signUpAttempt = await signUp.create({
        username: formData.username,
        emailAddress: formData.email,
        password: formData.password
      });

      // Handle CAPTCHA if required
      if (signUpAttempt.status === 'needs_captcha') {
        await signUp.attemptCaptcha();
        // Retry sign up after CAPTCHA
        await signUp.create({
          username: formData.username,
          emailAddress: formData.email,
          password: formData.password
        });
      }

      // Show explosion effect before navigation
      setShowExplosion(true);
      
      // Wait for explosion animation
      setTimeout(async () => {
        // Prepare email verification
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        navigate('/verify-email');
      }, 2000);

    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message || "An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0A0F1B] to-[#1A0B2E]">
      <VideoBackground isLoginScreen={false} />
      
      <AnimatePresence>
        {showExplosion && <ExplosionEffect />}
      </AnimatePresence>

      <AnimatePresence>
        {!isSubmitting && !showExplosion && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 flex items-center justify-center p-4"
          >
            <motion.div 
              className="w-full max-w-md p-8 border rounded-2xl bg-black/40 backdrop-blur-xl border-white/10"
              style={{ boxShadow: '0 0 15px rgba(0,246,255,0.1)' }}
            >
              <div className="mb-8 text-center">
                <motion.h1 
                  className="mb-2 text-4xl font-bold tracking-wider text-white font-orbitron"
                  style={{ textShadow: "0 0 10px rgba(0,246,255,0.5)" }}
                  animate={{ 
                    textShadow: [
                      "0 0 10px rgba(0,246,255,0.5)",
                      "0 0 15px rgba(255,46,151,0.5)",
                      "0 0 10px rgba(0,246,255,0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  JOIN THE FUTURE
                </motion.h1>
                <p className="bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] bg-clip-text text-xl tracking-widest text-transparent font-semibold font-exo">
                  CREATE • INNOVATE • EVOLVE
                </p>
              </div>

              {error && <CyberpunkError message={error} onClose={() => setError(null)} />}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                  <input 
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Username"
                    className={inputClasses}
                    required
                  />
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 -z-10 group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] blur-sm" />
                  </div>
                </div>

                <div className="relative group">
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                    className={inputClasses}
                    required
                  />
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 -z-10 group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] blur-sm" />
                  </div>
                </div>

                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password"
                    className={inputClasses}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute -translate-y-1/2 right-4 top-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  </button>
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 -z-10 group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] blur-sm" />
                  </div>
                </div>

                <div className="relative group">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm Password"
                    className={inputClasses}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute -translate-y-1/2 right-4 top-1/2 text-white/50 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  </button>
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 -z-10 group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] blur-sm" />
                  </div>
                </div>

                <label className="relative flex items-center mt-4 transition-colors duration-200 cursor-pointer select-none text-white/80 hover:text-white">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="appearance-none h-5 w-5 border rounded border-white/20 bg-black/50 
                             checked:bg-gradient-to-r checked:from-[#FF2E97] checked:to-[#00F6FF]
                             checked:border-transparent focus:outline-none cursor-pointer 
                             transition-all duration-200 mr-2"
                    required
                  />
                  <motion.span 
                    className="relative"
                    animate={!formData.agreeToTerms ? {
                      x: [-2, 2, -2, 2, 0],
                      textShadow: [
                        "0 0 8px rgba(255,46,151,0.5)",
                        "2px 0 8px rgba(0,246,255,0.5)",
                        "-2px 0 8px rgba(255,46,151,0.5)",
                        "2px 0 8px rgba(0,246,255,0.5)",
                        "0 0 8px rgba(255,46,151,0.5)"
                      ]
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <span className={`${!formData.agreeToTerms ? 'text-[#FF2E97]' : ''}`}>
                      Please check this box if you want to proceed.
                    </span>
                  </motion.span>
                </label>

                {/* Buttons */}
                <div className="flex items-center justify-between gap-4 mt-8">
                  <motion.button
                    type="button"
                    onClick={() => navigate('/')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] p-[2px] flex items-center justify-center group"
                  >
                    <div className="flex items-center justify-center w-full h-full bg-black rounded-full">
                      <ArrowLeftIcon size={20} className="text-white group-hover:text-[#00F6FF] transition-colors" />
                    </div>
                  </motion.button>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-grow px-12 py-4 rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] text-white font-bold relative group overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 font-orbitron">
                      Register <UserPlus size={20} />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00F6FF] to-[#FF2E97] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-[#0A0F1B] flex items-center justify-center z-50"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-16 h-16 border-4 border-t-[#FF2E97] border-r-[#00F6FF] border-b-[#FF2E97] border-l-[#00F6FF] rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CyberpunkRegistration;