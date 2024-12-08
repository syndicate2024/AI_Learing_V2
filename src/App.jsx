import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useSignIn } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { ClerkProvider } from "@clerk/clerk-react";
import { config } from './config';
import { 
  CyberpunkLoginEnhanced,
  CyberpunkRegistration,
  CyberpunkVerification,
  ProtectedRoute 
} from '../features/auth/components';
import Dashboard from '../features/dashboard/components/Dashboard';
import DashboardRoutes from '../features/dashboard/routes';

// Loading screen component stays the same
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-[#0A0F1B] flex items-center justify-center z-50">
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
  </div>
);

// SSO Callback component
const SSOCallback = () => {
  const navigate = useNavigate();
  const { isLoaded } = useAuth();
  const { signIn } = useSignIn();

  useEffect(() => {
    const handleCallback = async () => {
      if (!isLoaded || !signIn) return;

      console.log("SSO Callback - Starting callback handling");
      
      try {
        const result = await signIn.handleRedirectCallback();
        console.log("SSO Callback result:", result);

        if (result?.status === "complete") {
          console.log("SSO Callback successful, redirecting to dashboard");
          await signIn.setActive({ session: result.createdSessionId });
          navigate("/dashboard", { replace: true });
        } else {
          console.log("SSO Callback incomplete:", result);
          navigate("/", { 
            replace: true,
            state: { 
              error: 'Authentication incomplete. Please try again.' 
            }
          });
        }
      } catch (error) {
        console.error("SSO Callback error:", error);
        navigate("/", {
          replace: true,
          state: {
            error: error.message || 'Authentication failed. Please try again.'
          }
        });
      }
    };

    handleCallback();
  }, [isLoaded, signIn, navigate]);

  if (!isLoaded || !signIn) {
    return <LoadingScreen />;
  }

  return <LoadingScreen />;
};

function AppRoutes() {
  const location = useLocation();
  const { isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path={config.routes.home} element={<CyberpunkLoginEnhanced />} />
        <Route path={config.routes.register} element={<CyberpunkRegistration />} />
        <Route path={config.routes.verifyEmail} element={<CyberpunkVerification />} />
        <Route path={config.routes.ssoCallback} element={<SSOCallback />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard>
                <DashboardRoutes />
              </Dashboard>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  console.log("Initializing app with Clerk key:", config.clerkPublishableKey.substring(0, 10) + "...");

  return (
    <ClerkProvider publishableKey={config.clerkPublishableKey}>
      <Router>
        <AppRoutes />
      </Router>
    </ClerkProvider>
  );
}

export default App;