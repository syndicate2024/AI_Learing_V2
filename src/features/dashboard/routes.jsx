import { Routes, Route } from 'react-router-dom';
import {
  Overview,
  LearningProgress,
  Projects,
  Achievements,
  Activity,
  DailyLog,
  Backup,
  Challenges,
  Community,
  AIAssistant,
  Resources,
  Premium,
} from './components';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="overview" element={<Overview />} />
      <Route path="learning-progress" element={<LearningProgress />} />
      <Route path="projects" element={<Projects />} />
      <Route path="achievements" element={<Achievements />} />
      <Route path="activity" element={<Activity />} />
      <Route path="daily-log" element={<DailyLog />} />
      <Route path="backup" element={<Backup />} />
      <Route path="challenges" element={<Challenges />} />
      <Route path="community" element={<Community />} />
      <Route path="ai-assistant" element={<AIAssistant />} />
      <Route path="resources" element={<Resources />} />
      <Route path="premium" element={<Premium />} />
      <Route index element={<Overview />} />
    </Routes>
  );
};

export default DashboardRoutes; 