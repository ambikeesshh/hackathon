// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import useStore from "../store/useStore";

export default function ProtectedRoute({ children, roles }) {
  const authUser = useStore((s) => s.authUser);
  const authLoading = useStore((s) => s.authLoading);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!authUser) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(authUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
