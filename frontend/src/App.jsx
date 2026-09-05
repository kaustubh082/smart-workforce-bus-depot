import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { AppLayout, RequireAuth, RequireRole } from './components/layout/AppLayout';

// Public
import LandingPage from './pages/public/LandingPage';
// Auth
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
// Driver
import DriverDashboard from './pages/driver/DriverDashboard';
// Conductor
import ConductorDashboard from './pages/conductor/ConductorDashboard';
// Shared
import AttendancePage from './pages/shared/AttendancePage';
import LeavePage from './pages/shared/LeavePage';
import DutyHistoryPage from './pages/shared/DutyHistoryPage';
import ProfilePage from './pages/shared/ProfilePage';
import NotificationsPage from './pages/shared/NotificationsPage';
// Manager
import ManagerDashboard from './pages/manager/ManagerDashboard';
import EmployeesPage from './pages/manager/EmployeesPage';
import DutyAllocationPage from './pages/manager/DutyAllocationPage';
import ShiftManagementPage from './pages/manager/ShiftManagementPage';
import RosterPage from './pages/manager/RosterPage';
import BusManagementPage from './pages/manager/BusManagementPage';
import RouteManagementPage from './pages/manager/RouteManagementPage';
import LeaveApprovalsPage from './pages/manager/LeaveApprovalsPage';
import ReportsPage from './pages/manager/ReportsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Authenticated layout shell */}
          <Route element={<RequireAuth />}>
            <Route element={<AppLayout />}>

              {/* Shared (driver + conductor) */}
              <Route path="/shared/attendance" element={<AttendancePage />} />
              <Route path="/shared/leave" element={<LeavePage />} />
              <Route path="/shared/duty-history" element={<DutyHistoryPage />} />
              <Route path="/shared/profile" element={<ProfilePage />} />
              <Route path="/shared/notifications" element={<NotificationsPage />} />

              {/* Driver */}
              <Route element={<RequireRole roles={['driver']} />}>
                <Route path="/driver/dashboard" element={<DriverDashboard />} />
              </Route>

              {/* Conductor */}
              <Route element={<RequireRole roles={['conductor']} />}>
                <Route path="/conductor/dashboard" element={<ConductorDashboard />} />
              </Route>

              {/* Manager */}
              <Route element={<RequireRole roles={['manager']} />}>
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                <Route path="/manager/employees" element={<EmployeesPage />} />
                <Route path="/manager/duty-allocation" element={<DutyAllocationPage />} />
                <Route path="/manager/shifts" element={<ShiftManagementPage />} />
                <Route path="/manager/roster" element={<RosterPage />} />
                <Route path="/manager/buses" element={<BusManagementPage />} />
                <Route path="/manager/routes" element={<RouteManagementPage />} />
                <Route path="/manager/leave-approvals" element={<LeaveApprovalsPage />} />
                <Route path="/manager/reports" element={<ReportsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
