// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthBootstrap } from "./hooks/useAuth";
import { useRoomsListener } from "./hooks/useRooms";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RoomPage from "./pages/RoomPage";
import Admin from "./pages/Admin";

// AppShell mounts real-time listeners after auth is bootstrapped
function AppShell() {
  useAuthBootstrap();
  useRoomsListener();
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: "12px", fontSize: "14px", fontWeight: 500 },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navbar />
              <main className="min-h-[calc(100vh-57px)] bg-slate-50">
                <Navigate to="/dashboard" replace />
              </main>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navbar />
              <main className="min-h-[calc(100vh-57px)] bg-slate-50">
                <Dashboard />
              </main>
            </ProtectedRoute>
          }
        />

        <Route
          path="/room/:roomId"
          element={
            <ProtectedRoute>
              <Navbar />
              <main className="min-h-[calc(100vh-57px)] bg-slate-50">
                <RoomPage />
              </main>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Navbar />
              <main className="min-h-[calc(100vh-57px)] bg-slate-50">
                <Admin />
              </main>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
