import { NavLink } from "react-router-dom";
import useStore from "../store/useStore";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path d="M4 5.5h7v5H4zM13 5.5h7v13h-7zM4 12.5h7V19H4z" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    to: "/admin",
    label: "Admin",
    roles: ["admin"],
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path d="M12 3l8 4.5v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9v-5z" stroke="currentColor" strokeWidth="1.7" />
        <path d="M9.5 12l1.8 1.8L15 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function NavButton({ item, collapsed = false }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `inline-flex w-full items-center rounded-xl py-2 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-orange-500 text-white shadow-sm ring-1 ring-orange-500/20"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        } ${collapsed ? "justify-center px-0" : "gap-2 px-3"}`
      }
    >
      <span className={`${collapsed ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>{item.icon}</span>
      <span
        className={`overflow-hidden whitespace-nowrap text-sm transition-all duration-200 ${
          collapsed ? "max-w-0 opacity-0" : "max-w-[120px] opacity-100"
        }`}
      >
        {item.label}
      </span>
    </NavLink>
  );
}

export default function Sidebar({ collapsed = false, onToggleSidebar }) {
  const authUser = useStore((s) => s.authUser);

  const visibleItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(authUser?.role);
  });

  return (
    <>
      <div className="mb-4 md:hidden">
        <div className="glass-panel flex flex-wrap gap-2 p-2">
          {visibleItems.map((item) => (
            <NavButton key={item.to} item={item} />
          ))}
        </div>
      </div>

      <aside
        className={`fixed left-0 top-[70px] hidden h-[calc(100vh-70px)] bg-white/70 pb-3 pt-4 backdrop-blur-xl transition-all duration-300 dark:bg-gray-950/85 md:block ${
          collapsed ? "w-[76px] px-2" : "w-[252px] px-3"
        }`}
      >
        <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-300 bg-gray-50/95 p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/95">
          <div>
            <div className={`mb-3 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
              {!collapsed && (
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Workspace
                </p>
              )}

              <button
                type="button"
                onClick={onToggleSidebar}
                className="inline-flex rounded-lg border border-gray-300 bg-white p-1.5 text-gray-500 transition-all duration-200 hover:border-orange-500 hover:text-orange-500 active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-orange-500 dark:hover:text-orange-400"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <rect x="3.5" y="4" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d={collapsed ? "M8 7v10" : "M13 7v10"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path
                    d={collapsed ? "M14 9l3 3-3 3" : "M10 9l-3 3 3 3"}
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <nav className="space-y-2">
              {visibleItems.map((item) => (
                <NavButton key={item.to} item={item} collapsed={collapsed} />
              ))}
            </nav>
          </div>

          {collapsed ? (
            <div className="flex justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-xs font-black text-white ring-1 ring-orange-500/20">
                {(authUser?.name || "U").slice(0, 1).toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-xs font-semibold text-gray-400">Signed in as</p>
              <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">{authUser?.name || "User"}</p>
              <p className="mt-0.5 text-xs uppercase text-gray-400">{authUser?.role || "member"}</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
