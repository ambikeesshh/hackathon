import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar />

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      />

      <div
        className={`px-4 pb-4 pt-4 transition-all duration-300 ${
          sidebarCollapsed ? "md:pl-[5.75rem]" : "md:pl-[16.75rem]"
        }`}
      >
        <div className="mx-auto max-w-[1500px]">
          <main className="min-h-[calc(100vh-96px)] min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
