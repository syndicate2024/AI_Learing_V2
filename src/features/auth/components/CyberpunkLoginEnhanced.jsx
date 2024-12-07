import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, LogIn, Upload, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ExplosionEffect } from '../../../shared/components';
import { useSignIn, useUser } from "@clerk/clerk-react";
import PropTypes from 'prop-types';
import { FcGoogle } from 'react-icons/fc';
import { VideoBackground } from '../../../shared/components';
import { config } from '../../../core/config';
import { LoadingScreen } from '../../../shared/components/ui';
import { CyberpunkError } from '../../../shared/components/ui';

// Error Message Component
const ErrorMessage = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative px-4 py-2 mb-4 border rounded-lg font-exo
                   border-[#FF2E97] bg-black/40 backdrop-blur-sm
                   text-[#FF2E97] text-sm"
      >
        <div className="absolute inset-0 rounded-lg bg-[#FF2E97] opacity-5" />
        <p className="relative z-10">{message}</p>
      </motion.div>
    )}
  </AnimatePresence>
);

ErrorMessage.propTypes = {
  message: PropTypes.string
};

const GlitchImage = ({ src, alt }) => {
  const [glitchStyle, setGlitchStyle] = useState({});

  useEffect(() => {
    const generateGlitchEffect = () => {
      const effects = [
        {
          transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`,
          filter: `hue-rotate(${Math.random() * 360}deg) saturate(${150 + Math.random() * 150}%)`,
          clipPath: `polygon(${Math.random() * 10}% 0%, 100% 0%, 100% 100%, 0% 100%)`
        },
        {
          transform: `skew(${Math.random() * 10 - 5}deg)`,
          filter: `brightness(${150 + Math.random() * 50}%) contrast(${150 + Math.random() * 50}%)`,
          clipPath: `inset(${Math.random() * 20}% 0 ${Math.random() * 20}% 0)`
        },
        {
          transform: `scale(${1 + Math.random() * 0.1})`,
          filter: `blur(${Math.random() * 2}px)`,
          opacity: 0.8 + Math.random() * 0.2
        }
      ];

      return effects[Math.floor(Math.random() * effects.length)];
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to trigger glitch
        setGlitchStyle(generateGlitchEffect());
        
        // Reset glitch after a short duration
        setTimeout(() => {
          setGlitchStyle({});
        }, 150);
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
      <img
        src={src}
        alt={alt}
        className="object-cover w-full h-full rounded-full transition-all duration-150"
        style={glitchStyle}
      />
      <div className="absolute inset-0 rounded-full mix-blend-overlay bg-gradient-to-r from-[#FF2E97]/10 to-[#00F6FF]/10" />
      <div className="absolute inset-0 rounded-full opacity-50 mix-blend-overlay animate-pulse bg-gradient-to-r from-[#FF2E97]/5 to-[#00F6FF]/5" />
    </div>
  );
};

const CyberpunkLoginEnhanced = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  const { 
    isLoaded: signInLoaded, 
    signIn: clerkSignIn,
    setActive: setActiveSession 
  } = useSignIn();

  // Force loading state to true initially
  const [isLoading, setIsLoading] = useState(true);
  const [showExplosion, setShowExplosion] = useState(false);
  const [error, setError] = useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showCamera, setShowCamera] = useState(false);
  const [imagePreview, setImagePreview] = useState(() => {
    const saved = localStorage.getItem('userProfileImage');
    return saved || null;
  });
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Refresh image preview when location changes
  useEffect(() => {
    const saved = localStorage.getItem('userProfileImage');
    setImagePreview(saved || null);
  }, [location]);

  // Enhanced loading state handling
  useEffect(() => {
    const minimumLoadingTime = 3000;
    setIsLoading(true); // Always start with loading true

    const timer = setTimeout(() => {
      if (userLoaded && signInLoaded) {
        if (isSignedIn) {
          // If already signed in, still show loading before navigation
          setTimeout(() => {
            setShowExplosion(true);
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          }, minimumLoadingTime);
        } else {
          setIsLoading(false);
        }
      }
    }, minimumLoadingTime);

    return () => clearTimeout(timer);
  }, [userLoaded, signInLoaded, isSignedIn, navigate]);

  // Check if already signed in
  useEffect(() => {
    if (!userLoaded || !signInLoaded) return;
    
    if (isSignedIn) {
      setIsLoading(true); // Ensure loading shows
      setTimeout(() => {
        setShowExplosion(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }, 1000);
    }
  }, [userLoaded, signInLoaded, isSignedIn, navigate]);

  const clearCredentials = () => {
    setCredentials({
      email: "",
      password: "",
      rememberMe: false
    });
    localStorage.removeItem('rememberedCredentials');
  };

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        console.log("Camera already active");
        return;
      }

      console.log("Requesting camera access...");
      
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Camera access granted:", stream.getVideoTracks()[0].label);
      
      setShowCamera(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        } else {
          console.error("Video ref still not available after delay");
          stopCamera();
        }
      }, 100);

    } catch (err) {
      console.error("Camera access error:", err);
      setError(err.message || "Could not access camera");
      stopCamera();
    }
  };

  const capturePhoto = () => {
    setIsProcessing(true);
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    
    const aspectRatio = video.videoWidth / video.videoHeight;
    canvas.width = 400;
    canvas.height = canvas.width / aspectRatio;
    
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setImagePreview(imageData);
    localStorage.setItem('userProfileImage', imageData);
    stopCamera();
    setIsProcessing(false);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setImagePreview(imageData);
        localStorage.setItem('userProfileImage', imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    clearCredentials();
    setImagePreview(null);
    window.location.href = window.location.origin;
  };

  // Clear any stored credentials on mount
  useEffect(() => {
    localStorage.removeItem('rememberedCredentials');
  }, []);

  // Add SSO callback handling
  useEffect(() => {
    if (location.pathname === '/sso-callback') {
      const handleCallback = async () => {
        try {
          console.log("Handling SSO callback...");
          const result = await clerkSignIn.handleRedirectCallback();
          console.log("SSO callback result:", result);
          
          if (result?.status === "complete") {
            console.log("Setting active session with ID:", result.createdSessionId);
            await setActiveSession({ session: result.createdSessionId });
            console.log("Session set, navigating to dashboard");
            navigate("/dashboard");
          } else {
            console.error("SSO callback incomplete:", result);
            setError("Authentication incomplete. Please try again.");
            navigate('/');
          }
        } catch (err) {
          console.error("SSO callback error:", err);
          setError("Authentication failed. Please try again.");
          navigate('/');
        }
      };
      handleCallback();
    }
  }, [location.pathname, clerkSignIn, setActiveSession, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      console.log("Initiating Google login...");

      if (!clerkSignIn) {
        throw new Error("Authentication not initialized");
      }

      await clerkSignIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: config.appUrl + config.routes.ssoCallback,
        redirectUrlComplete: config.appUrl + config.routes.dashboard
      });
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.message || "Google login failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setIsFacebookLoading(true);
      setError(null);
      console.log("Initiating Facebook login...");
      
      if (!clerkSignIn) {
        throw new Error("Authentication not initialized");
      }

      await clerkSignIn.authenticateWithRedirect({
        strategy: "oauth_facebook",
        redirectUrl: config.appUrl + config.routes.ssoCallback,
        redirectUrlComplete: config.appUrl + config.routes.dashboard
      });
    } catch (err) {
      console.error("Facebook login error:", err);
      setError("Facebook login failed. Please try again.");
    } finally {
      setIsFacebookLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true); // Ensure loading shows on login attempt
    
    try {
      if (!clerkSignIn) {
        throw new Error("Authentication not initialized");
      }
      
      console.log("Attempting sign in...");
      const result = await clerkSignIn.create({
        identifier: credentials.email,
        password: credentials.password,
      });

      console.log("Sign in result:", result);

      if (result.status === "complete") {
        await setActiveSession({ session: result.createdSessionId });
        setTimeout(() => {
          setShowExplosion(true);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }, 1000);
      } else {
        console.log("Incomplete sign in:", result);
        throw new Error("Sign in incomplete");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.message?.includes('single session mode')) {
        setTimeout(() => {
          setShowExplosion(true);
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }, 1000);
      } else {
        setIsLoading(false);
        setError(err.message || "An error occurred during sign in");
      }
    }
  };

  const inputClasses = `
    w-full p-4 rounded-lg bg-black/50 border border-white/20 font-exo
    text-white placeholder-white/50 
    focus:outline-none focus:border-[#00F6FF] focus:shadow-[0_0_15px_rgba(0,246,255,0.3)] 
    transition-all duration-300
  `;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0A0F1B] to-[#1A0B2E]">
      <VideoBackground isLoginScreen={true} />

      <AnimatePresence>
        {showExplosion && (
          <ExplosionEffect onComplete={() => navigate("/dashboard")} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isLoading && !showExplosion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex fixed inset-0 justify-center items-center p-4"
          >
            <motion.div
              className="p-8 w-full max-w-md rounded-2xl border backdrop-blur-xl bg-black/40 border-white/10"
              style={{
                boxShadow: "0 0 15px rgba(0,246,255,0.1)",
              }}
            >
              <ErrorMessage message={error} />

              <div className="flex flex-col items-center mb-8">
                {/* Top Controls - Spread to edges */}
                <div className="flex justify-between px-4 w-full">
                  <motion.button
                    onClick={() => fileInputRef.current.click()}
                    whileHover={{ scale: 1.05, rotate: 360 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] p-[2px]"
                  >
                    <div className="flex justify-center items-center w-full h-full bg-black rounded-full">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={showCamera ? stopCamera : startCamera}
                    whileHover={{ scale: 1.05, rotate: 360 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] p-[2px]"
                  >
                    <div className="flex justify-center items-center w-full h-full bg-black rounded-full">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </motion.button>
                </div>

                {/* Single Main Image/Placeholder Area */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  className="w-40 h-40 mt-4 rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] p-[2px]"
                >
                  {imagePreview ? (
                    <div className="overflow-hidden relative w-full h-full rounded-full group">
                      <GlitchImage src={imagePreview} alt="Preview" />
                      <div className="flex absolute inset-0 gap-4 justify-center items-center opacity-0 transition-opacity bg-black/50 group-hover:opacity-100">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current.click();
                          }}
                          whileHover={{ scale: 1.1 }}
                          className="p-2 rounded-full bg-[#00F6FF]/20 hover:bg-[#00F6FF]/40"
                        >
                          <Upload className="w-6 h-6 text-white" />
                        </motion.button>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                            localStorage.removeItem('userProfileImage');
                          }}
                          whileHover={{ scale: 1.1 }}
                          className="p-2 rounded-full bg-[#FF2E97]/20 hover:bg-[#FF2E97]/40"
                        >
                          <Trash2 className="w-6 h-6 text-white" />
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center w-full h-full bg-black rounded-full">
                      <Camera className="w-16 h-16 text-white" />
                    </div>
                  )}
                </motion.div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="mb-8 text-center">
                <motion.h1
                  className="mb-2 text-4xl font-bold tracking-wider text-white font-orbitron"
                  style={{ textShadow: "0 0 10px rgba(0,246,255,0.5)" }}
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(0,246,255,0.5)",
                      "0 0 15px rgba(255,46,151,0.5)",
                      "0 0 10px rgba(0,246,255,0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  EMPOWER YOUR SKILLS
                </motion.h1>
                <p className="bg-gradient-to-r font-exo from-[#FF2E97] to-[#00F6FF] bg-clip-text text-2xl tracking-widest text-transparent font-semibold">
                  LEARN • BUILD • GROW
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
                <div className="relative group font-exo">
                  <input
                    type="text"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials({ ...credentials, email: e.target.value })
                    }
                    placeholder="Email or Username"
                    className={inputClasses}
                    autoComplete="off"
                    autoSave="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                    data-form-type="other"
                  />
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 -z-10 group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] blur-sm" />
                  </div>
                </div>

                <div className="relative group">
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    placeholder="Password"
                    className={inputClasses}
                    autoComplete="new-password"
                    data-form-type="other"
                  />
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 -z-10 group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] blur-sm" />
                  </div>
                </div>

                <div className="flex gap-4 justify-between items-center mt-8">
                  {/* Comment out Google button
                  <motion.button
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] p-[2px]"
                  >
                    <div className="flex justify-center items-center w-full h-full bg-black rounded-full">
                      {isGoogleLoading ? (
                        <RefreshCcw className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <FcGoogle className="w-7 h-7" />
                      )}
                    </div>
                  </motion.button>
                  */}

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-grow px-12 py-4 rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] text-white font-bold relative font-exo group overflow-hidden"
                  >
                    <span className="flex relative z-10 gap-2 justify-center items-center font-orbitron">
                      Begin <LogIn size={20} />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00F6FF] to-[#FF2E97] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>

                  {/* Comment out Facebook button
                  <motion.button
                    onClick={handleFacebookLogin}
                    disabled={isFacebookLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] p-[2px]"
                  >
                    <div className="flex justify-center items-center w-full h-full bg-black rounded-full">
                      {isFacebookLoading ? (
                        <RefreshCcw className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <span className="text-[2rem] font-bold leading-none text-[#1877F2] group-hover:text-[#2196F3]">
                          f
                        </span>
                      )}
                    </div>
                  </motion.button>
                  */}
                </div>

                <div className="mt-4 text-center">
                  <Link
                    to="/register"
                    className="transition-colors duration-200 text-white/70 hover:text-white"
                  >
                    Don&apos;t have an account?
                    <span className="ml-1 bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] bg-clip-text text-transparent">
                      Register here
                    </span>
                  </Link>
                </div>
              </form>

              {/* Camera Preview */}
              {showCamera && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex fixed inset-0 z-50 justify-center items-center bg-black/80"
                >
                  <div className="relative p-4 rounded-lg bg-black/90">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full max-w-md rounded-lg"
                    />
                    <div className="flex gap-4 justify-center mt-4">
                      <motion.button
                        onClick={capturePhoto}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] text-white"
                      >
                        Capture
                      </motion.button>
                      <motion.button
                        onClick={stopCamera}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 text-white rounded-full bg-white/10"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-[#0A0F1B] flex items-center justify-center z-50"
          >
            {/* Main container - centered absolutely */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Random Laser Effects */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    scale: 0,
                    opacity: 0,
                    rotate: Math.random() * 360,
                    x: 0,
                    y: 0
                  }}
                  animate={{
                    scale: [0, 1, 1],
                    opacity: [0, 1, 0],
                    rotate: `${Math.random() * 360}deg`,
                    x: [0, (Math.random() - 0.5) * 400],
                    y: [0, (Math.random() - 0.5) * 400]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2,
                    ease: "linear"
                  }}
                  className="absolute w-px h-40 bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] blur-sm"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}

              {/* Rotating Border and Glow Container */}
              <div className="relative w-48 h-48">
                {/* Rotating Border */}
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] blur-md"
                />

                {/* Outer Glow */}
                <motion.div
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF2E97]/20 to-[#00F6FF]/20 blur-xl"
                />

                {/* Inner Spinning Circle */}
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
                  className="absolute inset-0 bg-black rounded-full"
                >
                  <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] opacity-50" />
                  <div className="absolute inset-4 bg-black rounded-full" />
                  
                  {/* Data Stream Effect */}
                  <motion.div
                    animate={{
                      opacity: [0, 1, 0],
                      y: [-40, 40],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="overflow-hidden absolute inset-x-0 h-full"
                  >
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-px h-4 bg-[#00F6FF]"
                        style={{
                          left: `${(i + 1) * 15}%`,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          opacity: 0.6,
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              </div>

              {/* Loading Text */}
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  bottom: '-8rem'
                }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] font-orbitron text-3xl">
                  INITIALIZING
                </span>
              </motion.div>

              {/* Particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  initial={{ 
                    scale: 0,
                    opacity: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 0.8, 0],
                    x: [0, (Math.random() - 0.5) * 200],
                    y: [0, (Math.random() - 0.5) * 200]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: Math.random(),
                    ease: "easeOut"
                  }}
                  className="absolute w-2 h-2 rounded-full bg-[#00F6FF]"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CyberpunkLoginEnhanced;
