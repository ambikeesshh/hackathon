// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import { logoutUser } from "../firebase/auth";
import toast from "react-hot-toast";

export default function Navbar() {
  const authUser = useStore((s) => s.authUser);
  const clearAuth = useStore((s) => s.clearAuth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearAuth();
      navigate("/login");
    } catch {
      toast.error("Logout failed.");
    }
  };

  const roleColors = {
    student: "bg-blue-100 text-blue-700",
    faculty: "bg-violet-100 text-violet-700",
    admin: "bg-amber-100 text-amber-700",
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-sm">
            CS
          </div>
          <span className="font-black text-slate-900 tracking-tight">CampusSync</span>
        </Link>

        <div className="flex items-center gap-3">
          {authUser?.role === "admin" && (
            <Link
              to="/admin"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Admin
            </Link>
          )}
          {authUser && (
            <span className={`hidden sm:inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${roleColors[authUser.role] || "bg-slate-100 text-slate-600"}`}>
              {authUser.role}
            </span>
          )}
          {authUser && (
            <span className="hidden sm:block text-sm text-slate-500 truncate max-w-[120px]">
              {authUser.name}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
