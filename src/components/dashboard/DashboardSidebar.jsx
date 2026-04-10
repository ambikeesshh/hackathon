import ActivityFeed from "../ActivityFeed";
import StatsCards from "./StatsCards";

export default function DashboardSidebar({ stats }) {
  return (
    <aside className="space-y-6">
      <StatsCards stats={stats} />

      <ActivityFeed maxRows={20} />
    </aside>
  );
}
