import { useState, useEffect } from 'react';
import VideoBackground from '../../../shared/components/VideoBackground';

const DashboardIntro = () => {
  const [mounted] = useState(() => {
    // Only mount if we haven't shown the video and we're on the dashboard
    return !localStorage.getItem('dashboardVideoShown') && window.location.pathname.includes('/dashboard');
  });

  useEffect(() => {
    // Cleanup function
    return () => {
      // Only set video shown if we actually mounted the video
      if (mounted) {
        localStorage.setItem('dashboardVideoShown', 'true');
      }
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <VideoBackground 
        isLoginScreen={false} 
        onVideoComplete={() => {
          localStorage.setItem('dashboardVideoShown', 'true');
          window.location.reload(); // Force a clean reload after video
        }} 
      />
    </div>
  );
};

export default DashboardIntro; 