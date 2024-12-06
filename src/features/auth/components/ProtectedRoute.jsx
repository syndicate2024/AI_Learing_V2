// src/features/auth/components/ProtectedRoute.jsx
import { useAuth } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LoadingScreen } from '../../../shared/components';

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  console.log("Protected Route - Auth State:", { 
    isLoaded, 
    isSignedIn,
    path: location.pathname,
    state: location.state
  });

  if (!isLoaded) {
    console.log("Auth not loaded yet, showing loading screen");
    return <LoadingScreen />;
  }

  if (!isSignedIn) {
    console.log("User not signed in, redirecting to login");
    return <Navigate to="/" state={{ from: location, error: "Please sign in to access this page" }} replace />;
  }

  console.log("User is authenticated, rendering protected content");
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;