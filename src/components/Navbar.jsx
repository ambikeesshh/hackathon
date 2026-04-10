// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import { logoutUser } from "../firebase/auth";
import toast from "react-hot-toast";
import ThemeToggle from "./ThemeToggle";

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
    student: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    faculty: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    admin: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/70 shadow-sm backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/70">
      <div className="flex w-full items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 text-sm font-black text-white shadow-sm ring-1 ring-orange-500/20">
              CS
            </div>
            <span className="font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              CampusSync
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {authUser?.role === "admin" && (
            <Link
              to="/admin"
              className="text-sm font-medium text-gray-500 transition-colors hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
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
            <span className="hidden max-w-[120px] truncate text-sm text-gray-500 sm:block dark:text-gray-400">
              {authUser.name}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 active:scale-95 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
