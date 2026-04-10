import { useMemo } from "react";
import useStore from "../store/useStore";
import { timeAgo } from "../utils/helpers";
import { useActivityLogs } from "../hooks/useActivityLogs";

const badgeClass = {
  occupied: "bg-red-400/10 text-red-400",
  free: "bg-green-400/10 text-green-400",
  reserved: "bg-yellow-400/10 text-yellow-400",
};

export default function ActivityFeed({ maxRows = 30, title = "Live Activity" }) {
  const rooms = useStore((s) => s.rooms);
  const logs = useActivityLogs(maxRows);

  const roomMap = useMemo(() => new Map(rooms.map((room) => [room.id, room.name])), [rooms]);

  return (
    <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">{logs.length} events</span>
      </div>

      <div className="max-h-[360px] space-y-2 overflow-auto pr-1">
        {logs.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-3 py-8 text-center dark:border-gray-700 dark:bg-gray-800/60">
            <svg viewBox="0 0 24 24" className="mx-auto mb-2 h-9 w-9 text-gray-400" fill="none">
              <path d="M4 12h16M12 4v16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">No activity yet</p>
          </div>
        )}

        {logs.map((log) => (
          <div key={log.id} className="rounded-xl border border-gray-200 bg-white px-3 py-2 transition-all duration-200 hover:shadow-sm dark:border-gray-800 dark:bg-gray-800/70">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                {roomMap.get(log.roomId) || "Unknown room"}
              </p>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeClass[log.action] || "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200"}`}>
                {log.action}
              </span>
            </div>
            {log.note && (
              <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                {log.note}
              </p>
            )}
            <p className="mt-1 text-[11px] text-gray-400">
              {timeAgo(log.timestamp)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
