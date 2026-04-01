import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
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
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected teacher routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
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
        <Route path="feedback" element={<Feedback />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="classes/:className" element={<ClassDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
