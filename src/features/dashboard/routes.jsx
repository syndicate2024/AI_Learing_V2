import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Dashboard } from './components';
import ComingSoon from './components/ComingSoon';
import PropTypes from 'prop-types';
import CyberpunkEKGLoader from '../../shared/components/ui/CyberpunkEKGLoader';

// Delay constant for consistent loading times
const LOADING_DELAY = 3000; // 3 seconds

// Helper function to add delay to lazy loading
const withLoadingDelay = (importFn, name) => 
  new Promise(resolve => {
    console.log(`Starting to load ${name}...`);
    setTimeout(() => {
      console.log(`Loading ${name} component...`);
      importFn().then(module => {
        console.log(`${name} loaded!`);
        resolve(module);
      });
    }, LOADING_DELAY);
  });

// Only lazy load complex components with consistent delay
const LazyAchievements = lazy(() => 
  withLoadingDelay(
    () => import('./components/achievements/Achievements'),
    'Achievements'
  )
);

const LazyGrandFinale = lazy(() => 
  withLoadingDelay(
    () => import('./components/achievements/GrandFinale'),
    'Grand Finale'
  )
);

// Simple component for coming soon pages
const ComingSoonRoute = ({ title }) => <ComingSoon title={title} />;

ComingSoonRoute.propTypes = {
  title: PropTypes.string.isRequired
};

const DashboardRoutes = () => {
  return (
    <Routes>
      {/* Dashboard and its child routes */}
      <Route path="" element={<Dashboard />}>
        <Route path="overview" element={<ComingSoonRoute title="Overview" />} />
        <Route path="learning-progress" element={<ComingSoonRoute title="Learning Progress" />} />
        <Route path="projects" element={<ComingSoonRoute title="Projects" />} />
        <Route path="achievements" element={
          <Suspense fallback={<CyberpunkEKGLoader />}>
            <LazyAchievements />
          </Suspense>
        } />
        <Route path="activity" element={<ComingSoonRoute title="Activity" />} />
        <Route path="daily-log" element={<ComingSoonRoute title="Daily Log" />} />
        <Route path="backup" element={<ComingSoonRoute title="Backup" />} />
        <Route path="challenges" element={<ComingSoonRoute title="Challenges" />} />
        <Route path="community" element={<ComingSoonRoute title="Community" />} />
        <Route path="ai-assistant" element={<ComingSoonRoute title="AI Assistant" />} />
        <Route path="resources" element={<ComingSoonRoute title="Resources" />} />
        <Route path="premium" element={<ComingSoonRoute title="Premium" />} />
        <Route index element={<ComingSoonRoute title="Overview" />} />
      </Route>
      
      {/* Grand Finale route */}
      <Route path="finale" element={
        <Suspense fallback={<CyberpunkEKGLoader />}>
          <LazyGrandFinale />
        </Suspense>
      } />
    </Routes>
  );
};

export default DashboardRoutes; 