import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import Students from './pages/Students';
import Timetable from './pages/Timetable';
import Planner from './pages/Planner';
import Grading from './pages/Grading';
import Attendance from './pages/Attendance';
import Standards from './pages/Standards';
import Tasks from './pages/Tasks';
import Lessons from './pages/Lessons';
import LessonEditorPage from './pages/LessonEditorPage';
import Portfolio from './pages/Portfolio';
import Feedback from './pages/Feedback';
import Subscription from './pages/Subscription';
import ClassDetail from './pages/ClassDetail';
import Rewards from './pages/Rewards';
import AIPlanner from './pages/AIPlanner';
import LiveAssessment from './pages/LiveAssessment';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard routes (authentication temporarily disabled) */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="classes" element={<Classes />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<Portfolio />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="planner" element={<Planner />} />
        <Route path="grading" element={<Grading />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="standards" element={<Standards />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="lessons" element={<Lessons />} />
        <Route path="lessons/editor" element={<LessonEditorPage />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="ai-planner" element={<AIPlanner />} />
        <Route path="live-assessment" element={<LiveAssessment />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reports" element={<Reports />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="classes/:className" element={<ClassDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
