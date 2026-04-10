// src/pages/Admin.jsx
import { useState, useMemo } from "react";
import useStore from "../store/useStore";
import { addRoom, deleteRoom } from "../firebase/rooms";
import { effectiveStatus } from "../utils/helpers";
import QRModal from "../components/QRModal";
import toast from "react-hot-toast";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";

export default function Admin() {
  const rooms = useStore((s) => s.rooms);
  const [newRoomName, setNewRoomName] = useState("");
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
    if (!newRoomName.trim()) return toast.error("Room name required.");
    setAdding(true);
    try {
      await addRoom(newRoomName.trim());
      setNewRoomName("");
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Panel</h1>
        <p className="text-slate-500 mt-1">Manage rooms and view analytics</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl bg-slate-100 p-4 text-center">
          <p className="text-2xl font-black text-slate-700">{rooms.length}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Total</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4 text-center">
          <p className="text-2xl font-black text-emerald-700">{freeCount}</p>
          <p className="text-xs font-semibold text-emerald-600 mt-0.5">Free</p>
        </div>
        <div className="rounded-2xl bg-red-50 p-4 text-center">
          <p className="text-2xl font-black text-red-700">{occupiedCount}</p>
          <p className="text-xs font-semibold text-red-500 mt-0.5">Occupied</p>
        </div>
      </div>

      {/* Analytics chart */}
      {rooms.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">
            Room Status Overview
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} barSize={24}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 1]} />
              <Tooltip
                formatter={(v, _, p) => [v === 1 ? "Occupied" : "Free", p.payload.fullName]}
                contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }}
              />
              <Bar dataKey="status" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.status === 1 ? "#ef4444" : "#10b981"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center text-xs text-slate-400 mt-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1" />Free
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1 ml-3" />Occupied
          </p>
        </div>
      )}

      {/* Add room */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">
          Add New Room
        </h2>
        <div className="flex gap-3">
          <input
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="e.g. Lab 301, Library Room B"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
          />
          <button
            onClick={handleAdd}
            disabled={adding}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {adding ? "Adding…" : "Add"}
          </button>
        </div>
      </div>

      {/* Room list */}
      <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
        <div className="px-6 py-3 bg-slate-50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Rooms ({rooms.length})</p>
        </div>
        {rooms.length === 0 && (
          <div className="px-6 py-10 text-center text-slate-400 text-sm">
            No rooms yet. Add one above.
          </div>
        )}
        {rooms.map((room) => {
          const status = effectiveStatus(room);
          return (
            <div key={room.id} className="flex items-center justify-between px-6 py-4 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`flex-shrink-0 h-2.5 w-2.5 rounded-full ${
                    status === "free" ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                <span className="font-semibold text-slate-800 truncate">{room.name}</span>
                <span
                  className={`hidden sm:inline text-xs font-medium px-2 py-0.5 rounded-full ${
                    status === "free"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {status}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setQrRoom(room)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  QR
                </button>
                <button
                  onClick={() => setConfirmDelete(room)}
                  className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
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
            className="rounded-2xl bg-white p-6 shadow-xl max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Room?</h3>
            <p className="text-slate-500 text-sm mb-5">
              <strong>{confirmDelete.name}</strong> will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600 transition-colors"
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
