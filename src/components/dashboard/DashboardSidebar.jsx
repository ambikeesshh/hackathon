import ActivityFeed from "../ActivityFeed";
import StatsCards from "./StatsCards";
import useStore from "../../store/useStore";

export default function DashboardSidebar({ stats }) {
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <aside className="space-y-6">
      <StatsCards stats={stats} />

      <div className={`rounded-2xl border-2 ${isDark ? 'border-slate-700 bg-[#242424]' : 'border-slate-900 bg-white'} p-4 shadow-[4px_4px_0px_0px_#0f172a]`}>
        <p className={`mb-4 font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          Recent Activity
        </p>
        <ActivityFeed maxRows={10} />
      </div>
    </aside>
  );
}