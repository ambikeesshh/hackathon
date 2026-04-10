// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useStore from './store/useStore';
import { useAuthBootstrap } from './hooks/useAuth';
import { useRoomsListener } from './hooks/useRooms';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { ROLES } from './lib/constants';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AdminAnalytics from './pages/AdminAnalytics';
import FacultyPanel from './pages/FacultyPanel';
import TogglePage from './pages/TogglePage';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import RoomPage from './pages/RoomPage';

// Components
import FloorPlanView from './components/FloorPlanView';
import SketchyLanding from './components/SketchyLanding';
import ChatWidget from './components/ChatWidget';

function AppShell() {
  useAuthBootstrap();
  useRoomsListener();
  return null;
}

function AppLayout({ children }) {
  const authUser = useStore((s) => s.authUser);
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  
  if (!authUser) {
    return <>{children}</>;
  }
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#fdfbf7]'}`}>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>
      <ChatWidget />
    </div>
  );
}

export default function App() {
  const theme = useStore((s) => s.theme);
  const authUser = useStore((s) => s.authUser);

  const isDark = theme === 'dark';

  return (
    <>
      <AppShell />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
            border: `1px solid ${isDark ? '#2a3651' : '#d8e1ec'}`,
            background: isDark ? '#131b2d' : '#ffffff',
            color: isDark ? '#e2e8f0' : '#0f172a',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      
      {/* Landing Page - SketchyLanding is the main entry */}
      <Routes>
        <Route path="/" element={<><SketchyLanding /><ChatWidget /></>} />
        
        {/* Auth Pages */}
        <Route path="/login" element={authUser ? <Navigate to={getRolePath(authUser.role)} replace /> : <Login />} />
        <Route path="/register" element={authUser ? <Navigate to={getRolePath(authUser.role)} replace /> : <Register />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={[ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN]}>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <AppLayout>
                <Admin />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <AppLayout>
                <AdminAnalytics />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty"
          element={
            <ProtectedRoute roles={[ROLES.FACULTY, ROLES.ADMIN]}>
              <AppLayout>
                <FacultyPanel />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/toggle/:resourceId"
          element={
            <ProtectedRoute roles={[ROLES.FACULTY, ROLES.ADMIN]}>
              <TogglePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:roomId"
          element={
            <ProtectedRoute roles={[ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN]}>
              <AppLayout>
                <RoomPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/floorplan"
          element={
            <ProtectedRoute roles={[ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN]}>
              <AppLayout>
                <FloorPlanView />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Error Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function getRolePath(role) {
  switch (role) {
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.FACULTY:
      return '/faculty';
    default:
      return '/dashboard';
  }
}