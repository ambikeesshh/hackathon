// src/pages/Admin.jsx
import { useState, useMemo } from "react";
import useStore from "../store/useStore";
import { addRoom, deleteRoom } from "../firebase/rooms";
import { effectiveStatus, hourLabel } from "../utils/helpers";
import QRModal from "../components/QRModal";
import ActivityFeed from "../components/ActivityFeed";
import { useActivityLogs } from "../hooks/useActivityLogs";
import toast from "react-hot-toast";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";

export default function Admin() {
  const rooms = useStore((s) => s.rooms);
  const theme = useStore((s) => s.theme);
  const logs = useActivityLogs(200);
  const [newRoom, setNewRoom] = useState({
    name: "",
    building: "",
    floor: "",
    type: "classroom",
    capacity: 0,
    note: "",
    features: "",
  });
  const [adding, setAdding] = useState(false);
  const [qrRoom, setQrRoom] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const chartData = useMemo(
    () =>
      rooms.map((r) => ({
        name: r.name.length > 12 ? r.name.slice(0, 12) + "…" : r.name,
        status: effectiveStatus(r) === "occupied" ? 1 : 0,
        fullName: r.name,
      })),
    [rooms]
  );

  const handleAdd = async () => {
    if (!newRoom.name.trim()) return toast.error("Room name required.");
    setAdding(true);
    try {
      await addRoom(newRoom.name.trim(), {
        building: newRoom.building.trim(),
        floor: newRoom.floor.trim(),
        type: newRoom.type.trim() || "classroom",
        capacity: Number(newRoom.capacity) || 0,
        note: newRoom.note.trim(),
        features: newRoom.features
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setNewRoom({
        name: "",
        building: "",
        floor: "",
        type: "classroom",
        capacity: 0,
        note: "",
        features: "",
      });
      toast.success("Room added!");
    } catch {
      toast.error("Failed to add room.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (room) => {
    try {
      await deleteRoom(room.id);
      toast.success(`${room.name} deleted.`);
    } catch {
      toast.error("Failed to delete room.");
    } finally {
      setConfirmDelete(null);
    }
  };

  const freeCount = rooms.filter((r) => effectiveStatus(r) === "free").length;
  const occupiedCount = rooms.length - freeCount;
  const isDark = theme === "dark";

  const analytics = useMemo(() => {
    const usageCount = logs.filter((log) => log.action === "occupied").length;

    const peakHoursMap = logs.reduce((acc, log) => {
      if (!log.timestamp) return acc;
      const hour = hourLabel(log.timestamp);
      acc.set(hour, (acc.get(hour) || 0) + 1);
      return acc;
    }, new Map());

    const peakHourEntry = [...peakHoursMap.entries()].sort((a, b) => b[1] - a[1])[0];
    return {
      usageCount,
      peakHour: peakHourEntry ? `${peakHourEntry[0]} (${peakHourEntry[1]} actions)` : "N/A",
      reservationActions: logs.filter((log) => log.action === "reserved").length,
    };
  }, [logs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Admin Panel</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage rooms and view analytics</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-4 shadow-sm dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{rooms.length}</p>
          <p className="mt-1 text-sm text-gray-400">Total</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-4 shadow-sm dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
          <p className="text-2xl font-semibold text-green-500 dark:text-green-400">{freeCount}</p>
          <p className="mt-1 text-sm text-gray-400">Free</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-4 shadow-sm dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
          <p className="text-2xl font-semibold text-red-500 dark:text-red-400">{occupiedCount}</p>
          <p className="mt-1 text-sm text-gray-400">Occupied</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm uppercase tracking-wide text-gray-400">Usage Count</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{analytics.usageCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm uppercase tracking-wide text-gray-400">Peak Hour</p>
          <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{analytics.peakHour}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm uppercase tracking-wide text-gray-400">Reservations Logged</p>
          <p className="mt-2 text-2xl font-semibold text-yellow-500 dark:text-yellow-400">{analytics.reservationActions}</p>
        </div>
      </div>

      {/* Analytics chart */}
      {rooms.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Room Status Overview
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} barSize={24}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: isDark ? "#90a0ba" : "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide domain={[0, 1]} />
              <Tooltip
                formatter={(v, _, p) => [v === 1 ? "Occupied" : "Free", p.payload.fullName]}
                contentStyle={{
                  borderRadius: 10,
                  border: `1px solid ${isDark ? "#1f2937" : "#e5e7eb"}`,
                  fontSize: 12,
                  background: isDark ? "#111827" : "#ffffff",
                  color: isDark ? "#f3f4f6" : "#111827",
                }}
              />
              <Bar dataKey="status" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.fullName}
                    fill={entry.status === 1 ? "var(--chart-occupied)" : "var(--chart-free)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-2 text-center text-xs text-gray-400">
            <span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: "var(--chart-free)" }} />Free
            <span className="ml-3 mr-1 inline-block h-2 w-2 rounded-full" style={{ background: "var(--chart-occupied)" }} />Occupied
          </p>
        </div>
      )}

      {/* Add room */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Add New Room
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            value={newRoom.name}
            onChange={(e) => setNewRoom((prev) => ({ ...prev, name: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Room name"
            className="flex-1 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-700 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <input
            value={newRoom.building}
            onChange={(e) => setNewRoom((prev) => ({ ...prev, building: e.target.value }))}
            placeholder="Building"
            className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-700 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <input
            value={newRoom.floor}
            onChange={(e) => setNewRoom((prev) => ({ ...prev, floor: e.target.value }))}
            placeholder="Floor"
            className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-700 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <input
            value={newRoom.type}
            onChange={(e) => setNewRoom((prev) => ({ ...prev, type: e.target.value }))}
            placeholder="Type (classroom, lab, etc.)"
            className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-700 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <input
            value={newRoom.capacity}
            type="number"
            min="0"
            onChange={(e) => setNewRoom((prev) => ({ ...prev, capacity: Number(e.target.value) || 0 }))}
            placeholder="Capacity"
            className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-700 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <input
            value={newRoom.features}
            onChange={(e) => setNewRoom((prev) => ({ ...prev, features: e.target.value }))}
            placeholder="Features (comma-separated)"
            className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-700 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <input
            value={newRoom.note}
            onChange={(e) => setNewRoom((prev) => ({ ...prev, note: e.target.value }))}
            placeholder="Optional note"
            className="md:col-span-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-700 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          <button
            onClick={handleAdd}
            disabled={adding}
            className="md:col-span-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-orange-500/20 transition-all duration-200 hover:bg-orange-600 active:scale-95 disabled:opacity-60"
          >
            {adding ? "Adding…" : "Add Room"}
          </button>
        </div>
      </div>

      <div>
        <ActivityFeed maxRows={30} title="Latest Room Actions" />
      </div>

      {/* Room list */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-800/70">
          <p className="text-sm uppercase tracking-wide text-gray-400">Rooms ({rooms.length})</p>
        </div>
        {rooms.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-gray-400">
            No rooms yet. Add one above.
          </div>
        )}
        {rooms.map((room) => {
          const status = effectiveStatus(room);
          return (
            <div key={room.id} className="flex items-center justify-between gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`flex-shrink-0 h-2.5 w-2.5 rounded-full ${
                    status === "free" ? "bg-green-400" : status === "reserved" ? "bg-yellow-400" : "bg-red-400"
                  }`}
                />
                <span className="truncate font-medium text-gray-800 dark:text-gray-100">{room.name}</span>
                <span
                  className={`hidden sm:inline text-xs font-medium px-2 py-0.5 rounded-full ${
                    status === "free"
                      ? "bg-green-400/10 text-green-400"
                      : status === "reserved"
                        ? "bg-yellow-400/10 text-yellow-400"
                        : "bg-red-400/10 text-red-400"
                  }`}
                >
                  {status}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setQrRoom(room)}
                  className="rounded-xl border border-gray-300 bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-gray-200 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  QR
                </button>
                <button
                  onClick={() => setConfirmDelete(room)}
                  className="rounded-xl bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-red-600 active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* QR Modal */}
      {qrRoom && <QRModal room={qrRoom} onClose={() => setQrRoom(null)} />}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="mx-4 w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Delete Room?</h3>
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
              <strong>{confirmDelete.name}</strong> will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-gray-300 bg-gray-100 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-200 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 rounded-xl bg-red-500/90 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-red-600 active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
