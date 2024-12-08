import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { config } from './core/config';
import { 
  CyberpunkLoginEnhanced as SignIn,
  CyberpunkRegistration as SignUp,
  CyberpunkVerification
} from './features/auth/components';
import DashboardRoutes from './features/dashboard/routes';

// AppRoutes component to handle route transitions
function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-in/*" element={
          <SignedOut>
            <SignIn />
          </SignedOut>
        } />
        <Route path="/sign-up/*" element={
          <SignedOut>
            <SignUp />
          </SignedOut>
        } />
        <Route path="/verify-email" element={
          <SignedOut>
            <CyberpunkVerification />
          </SignedOut>
        } />

        {/* Protected routes */}
        <Route path="/dashboard/*" element={
          <SignedIn>
            <DashboardRoutes />
          </SignedIn>
        } />

        {/* Catch-all routes */}
        <Route path="*" element={
          <SignedIn>
            <Navigate to="/dashboard" replace />
          </SignedIn>
        } />
        <Route path="*" element={
          <SignedOut>
            <Navigate to="/sign-in" replace />
          </SignedOut>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  console.log('Rendering App component');
  return (
    <ClerkProvider publishableKey={config.clerkPublishableKey}>
      <Router>
        <AppRoutes />
      </Router>
    </ClerkProvider>
  );
}

export default App;