import { Routes, Route } from 'react-router-dom';
import {
  Overview,
  LearningProgress,
  Projects,
  Activity,
  DailyLog,
  Backup,
  Challenges,
  Community,
  AIAssistant,
  Resources,
  Premium,
  Dashboard,
} from './components';
import { lazy, Suspense } from 'react';

// Lazy loaded components
const LazyAchievements = lazy(() => import('./components/achievements/Achievements'));
const LazyGrandFinale = lazy(() => import('./components/achievements/GrandFinale'));

// Loading screen component
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-[#0A0F1B] flex items-center justify-center z-50">
    <div className="w-16 h-16 border-4 border-t-[#FF2E97] border-r-[#00F6FF] border-b-[#FF2E97] border-l-[#00F6FF] rounded-full animate-spin" />
  </div>
);

const DashboardRoutes = () => {
  return (
    <Routes>
      {/* Dashboard and its child routes */}
      <Route path="" element={<Dashboard />}>
        <Route path="overview" element={<Overview />} />
        <Route path="learning-progress" element={<LearningProgress />} />
        <Route path="projects" element={<Projects />} />
        <Route path="achievements" element={
          <Suspense fallback={<LoadingScreen />}>
            <LazyAchievements />
          </Suspense>
        } />
        <Route path="activity" element={<Activity />} />
        <Route path="daily-log" element={<DailyLog />} />
        <Route path="backup" element={<Backup />} />
        <Route path="challenges" element={<Challenges />} />
        <Route path="community" element={<Community />} />
        <Route path="ai-assistant" element={<AIAssistant />} />
        <Route path="resources" element={<Resources />} />
        <Route path="premium" element={<Premium />} />
        <Route index element={<Overview />} />
      </Route>
      
      {/* Grand Finale route */}
      <Route path="finale" element={
        <Suspense fallback={<LoadingScreen />}>
          <LazyGrandFinale />
        </Suspense>
      } />
    </Routes>
  );
};

export default DashboardRoutes; 