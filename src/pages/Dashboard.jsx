// src/pages/Dashboard.jsx
import { useMemo, useState } from "react";
import useStore from "../store/useStore";
import RoomCard from "../components/RoomCard";
import { effectiveStatus } from "../utils/helpers";

export default function Dashboard() {
  const rooms = useStore((s) => s.rooms);
  const roomsLoading = useStore((s) => s.roomsLoading);
  const authUser = useStore((s) => s.authUser);
  const [filter, setFilter] = useState("all"); // "all" | "free" | "occupied"
  const [search, setSearch] = useState("");

  const canToggle = authUser?.role === "faculty" || authUser?.role === "admin";

  const stats = useMemo(() => {
    const free = rooms.filter((r) => effectiveStatus(r) === "free").length;
    return { total: rooms.length, free, occupied: rooms.length - free };
  }, [rooms]);

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      const status = effectiveStatus(r);
      const matchFilter = filter === "all" || status === filter;
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [rooms, filter, search]);

  if (roomsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Room Availability</h1>
        <p className="text-slate-500 mt-1">Live campus room status · updates instantly</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Rooms", value: stats.total, color: "bg-slate-100 text-slate-700" },
          { label: "Available", value: stats.free, color: "bg-emerald-50 text-emerald-700" },
          { label: "Occupied", value: stats.occupied, color: "bg-red-50 text-red-700" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl ${s.color} p-4 text-center`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5 opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search rooms…"
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
        />
        <div className="flex rounded-xl border border-slate-200 bg-white p-1 gap-1">
          {["all", "free", "occupied"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Room Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="text-5xl mb-3">🏫</div>
          <p className="font-medium">No rooms found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((room) => (
            <RoomCard key={room.id} room={room} showToggle={canToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
