// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import { logoutUser } from "../features/auth/authService";
import toast from "react-hot-toast";
import ThemeToggle from "./ThemeToggle";
import { ROLES } from "../lib/constants";

export default function Navbar() {
  const authUser = useStore((s) => s.authUser);
  const clearAuth = useStore((s) => s.clearAuth);
  const theme = useStore((s) => s.theme);
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearAuth();
      navigate("/");
    } catch {
      toast.error("Logout failed.");
    }
  };

  const getRoleLink = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return "/admin";
      case ROLES.FACULTY:
        return "/faculty";
      default:
        return "/dashboard";
    }
  };

  const getHomeLink = () => {
    return "/";
  };

  return (
    <nav className={`sticky top-0 z-50 border-b-2 ${isDark ? 'border-slate-700 bg-[#1a1a1a]' : 'border-slate-900 bg-[#fdfbf7]'}/95 backdrop-blur-sm`}>
      <div className="flex w-full items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isDark ? 'bg-yellow-600' : 'bg-yellow-400'} text-sm font-black ${isDark ? 'text-slate-100' : 'text-slate-900'} shadow-sm ring-1 ring-slate-900/20`}>
              CS
            </div>
            <div>
              <span className={`font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                CampusSync
              </span>
<p className={`hidden font-mono text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'} sm:block`}>
                  Home
                </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/dashboard"
            className={`rounded-lg border-2 border-transparent px-3 py-1.5 text-sm font-bold transition-all ${
              isDark 
                ? 'text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:text-slate-100' 
                : 'text-slate-600 hover:border-slate-900 hover:bg-yellow-400 hover:text-slate-900'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/floorplan"
            className={`rounded-lg border-2 border-transparent px-3 py-1.5 text-sm font-bold transition-all ${
              isDark 
                ? 'text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:text-slate-100' 
                : 'text-slate-600 hover:border-slate-900 hover:bg-yellow-400 hover:text-slate-900'
            }`}
          >
            Floor Plan
          </Link>
          {authUser?.role === ROLES.ADMIN && (
            <>
              <Link
                to="/admin"
                className={`rounded-lg border-2 border-transparent px-3 py-1.5 text-sm font-bold transition-all ${
                  isDark 
                    ? 'text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:text-slate-100' 
                    : 'text-slate-600 hover:border-slate-900 hover:bg-yellow-400 hover:text-slate-900'
                }`}
              >
                Admin
              </Link>
              <Link
                to="/admin/analytics"
                className={`hidden rounded-lg border-2 border-transparent px-3 py-1.5 text-sm font-bold transition-all sm:block ${
                  isDark 
                    ? 'text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:text-slate-100' 
                    : 'text-slate-600 hover:border-slate-900 hover:bg-yellow-400 hover:text-slate-900'
                }`}
              >
                Analytics
              </Link>
            </>
          )}
          {authUser?.role === ROLES.FACULTY && (
            <Link
              to="/faculty"
              className={`rounded-lg border-2 border-transparent px-3 py-1.5 text-sm font-bold transition-all ${
                isDark 
                  ? 'text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:text-slate-100' 
                  : 'text-slate-600 hover:border-slate-900 hover:bg-yellow-400 hover:text-slate-900'
              }`}
            >
              Faculty
            </Link>
          )}
          {authUser && (
            <span className={`hidden rounded-full border-2 ${isDark ? 'border-slate-600 bg-slate-800 text-slate-300' : 'border-slate-900 bg-white text-slate-700'} px-3 py-1 text-xs font-bold uppercase sm:block`}>
              {authUser.role}
            </span>
          )}
          {authUser && (
            <span className={`hidden max-w-[120px] truncate text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'} sm:block`}>
              {authUser.name}
            </span>
          )}
          <button
            onClick={handleLogout}
            className={`rounded-xl border-2 border-slate-900 px-4 py-2 text-sm font-bold transition-all duration-200 active:scale-95 ${
              isDark 
                ? 'border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700' 
                : 'bg-white text-slate-900 hover:bg-yellow-400'
            }`}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}