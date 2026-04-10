// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';

export default function ProtectedRoute({ children, roles }) {
  const authUser = useStore((s) => s.authUser);
  const authLoading = useStore((s) => s.authLoading);
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!authUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectTo: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (roles && !roles.includes(authUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
