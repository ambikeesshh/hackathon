// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import useStore from "./store/useStore";
import { useAuthBootstrap } from "./hooks/useAuth";
import { useRoomsListener } from "./hooks/useRooms";
import AppLayout from "./components/AppLayout";
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
  const theme = useStore((s) => s.theme);

  const withLayout = (page, roles) => (
    <ProtectedRoute roles={roles}>
      <AppLayout>{page}</AppLayout>
    </ProtectedRoute>
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <BrowserRouter>
      <AppShell />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 500,
            border: `1px solid ${isDark ? "#2a3651" : "#d8e1ec"}`,
            background: isDark ? "#131b2d" : "#ffffff",
            color: isDark ? "#e2e8f0" : "#0f172a",
          },
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
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />

        <Route path="/dashboard" element={withLayout(<Dashboard />)} />

        <Route
          path="/room/:roomId"
          element={withLayout(<RoomPage />)}
        />

        <Route path="/admin" element={withLayout(<Admin />, ["admin"])} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
