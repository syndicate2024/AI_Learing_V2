import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, RefreshCcw } from 'lucide-react';
import { ExplosionEffect, CyberpunkError, LoadingScreen } from '../../../shared/components';
import VideoBackground from '../../../shared/components/VideoBackground';

const CyberpunkVerification = () => {
  const navigate = useNavigate();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    if (!isLoaded || !signUp) {
      navigate('/register');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          setResendDisabled(false);
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoaded, signUp, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status !== "complete") {
        throw new Error("Unable to verify email address.");
      }

      // Set the active session
      await setActive({ session: completeSignUp.createdSessionId });

      // Clear stored data
      localStorage.removeItem('userProfileImage');
      localStorage.removeItem('rememberedCredentials');

      // Show explosion effect
      setShowExplosion(true);

      // Wait for explosion animation then redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      console.error("Verification error:", err);
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setError(null);
      setResendDisabled(true);
      
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      // Reset timer
      setTimeLeft(300);
      
    } catch (err) {
      console.error("Resend code error:", err);
      setError(err.message || "Failed to resend code. Please try again.");
      setResendDisabled(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0A0F1B] to-[#1A0B2E]">
      <VideoBackground isLoginScreen={false} />

      <AnimatePresence>
        {showExplosion && (
          <ExplosionEffect onComplete={() => navigate("/dashboard")} />
        )}
      </AnimatePresence>

      {error && <CyberpunkError message={error} onClose={() => setError(null)} />}

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
                  VERIFY YOUR EMAIL
                </motion.h1>
                <p className="bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] bg-clip-text text-xl tracking-widest text-transparent font-semibold font-exo">
                  SECURE • PROTECT • ACCESS
                </p>
              </div>

              {error && <CyberpunkError message={error} onClose={() => setError(null)} />}

              <form onSubmit={handleVerify} className="space-y-6">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className="w-48 h-16 text-center text-2xl rounded-lg bg-black/50 border border-white/20 
                               text-white placeholder-white/50 
                               focus:outline-none focus:border-[#00F6FF] focus:shadow-[0_0_15px_rgba(0,246,255,0.3)] 
                               transition-all duration-300 font-orbitron tracking-wider"
                      required
                      maxLength={6}
                    />
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 -z-10 group-hover:opacity-100">
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] blur-sm" />
                    </div>
                  </div>

                  {/* Centered Timer */}
                  <motion.div 
                    className="text-center font-orbitron"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <span className="text-lg text-[#00F6FF]">{formatTime(timeLeft)}</span>
                  </motion.div>

                  <div className="flex items-center justify-between w-full gap-4">
                    <motion.button
                      type="button"
                      onClick={() => navigate('/register')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] p-[2px]"
                    >
                      <div className="flex items-center justify-center w-full h-full bg-black rounded-full">
                        <ArrowLeftIcon size={20} className="text-white" />
                      </div>
                    </motion.button>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-grow px-12 py-4 rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] text-white font-bold relative group overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2 font-orbitron">
                        Verify Email
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00F6FF] to-[#FF2E97] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendDisabled}
                      whileHover={!resendDisabled ? { scale: 1.05 } : {}}
                      whileTap={!resendDisabled ? { scale: 0.95 } : {}}
                      className={`w-12 h-12 rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] p-[2px] ${
                        resendDisabled ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="flex items-center justify-center w-full h-full bg-black rounded-full">
                        <RefreshCcw size={20} className={`text-white ${resendDisabled ? '' : 'group-hover:text-[#00F6FF]'}`} />
                      </div>
                    </motion.button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSubmitting && <LoadingScreen />}
      </AnimatePresence>
    </div>
  );
};

export default CyberpunkVerification;