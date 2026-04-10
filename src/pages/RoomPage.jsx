// src/pages/RoomPage.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import { effectiveStatus, timeAgo, roomUrl } from "../utils/helpers";
import { toggleRoomStatus, addLog } from "../firebase/rooms";
import QRModal from "../components/QRModal";
import toast from "react-hot-toast";

export default function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const authUser = useStore((s) => s.authUser);
  const rooms = useStore((s) => s.rooms);
  const [showQR, setShowQR] = useState(false);
  const [toggling, setToggling] = useState(false);

  const room = rooms.find((r) => r.id === roomId);
  const canToggle = authUser?.role === "faculty" || authUser?.role === "admin";

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <p className="text-lg font-medium">Room not found</p>
        <button onClick={() => navigate("/dashboard")} className="mt-3 text-indigo-600 text-sm font-semibold">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const status = effectiveStatus(room);
  const isFree = status === "free";

  const handleToggle = async () => {
    setToggling(true);
    try {
      await toggleRoomStatus({ ...room, status }, authUser.uid);
      await addLog(room.id, authUser.uid, isFree ? "occupied" : "free");
      toast.success(`Marked as ${isFree ? "occupied" : "free"}`);
    } catch {
      toast.error("Failed to update room status.");
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 text-sm text-indigo-600 font-semibold hover:underline"
      >
        ← All Rooms
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Status indicator */}
        <div className={`mb-6 rounded-xl p-4 text-center ${isFree ? "bg-emerald-50" : "bg-red-50"}`}>
          <div
            className={`mx-auto mb-2 h-14 w-14 rounded-full flex items-center justify-center text-2xl ${
              isFree ? "bg-emerald-100" : "bg-red-100"
            }`}
          >
            {isFree ? "✅" : "🔴"}
          </div>
          <p className={`text-2xl font-black ${isFree ? "text-emerald-700" : "text-red-700"}`}>
            {isFree ? "Available" : "Occupied"}
          </p>
        </div>

        <h1 className="text-2xl font-black text-slate-900 text-center mb-1">{room.name}</h1>
        <p className="text-center text-sm text-slate-400 mb-6">
          Last updated: {timeAgo(room.updatedAt)}
        </p>

        {room.autoResetAt && !isFree && (
          <div className="mb-4 rounded-lg bg-amber-50 border border-amber-100 px-4 py-2.5 text-xs text-amber-700 text-center">
            Auto-resets at{" "}
            {room.autoResetAt.toDate
              ? room.autoResetAt.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "—"}
          </div>
        )}

        <div className="space-y-3">
          {canToggle && (
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`w-full rounded-xl py-3 text-sm font-bold transition-colors disabled:opacity-60 ${
                isFree
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-emerald-500 text-white hover:bg-emerald-600"
              }`}
            >
              {toggling ? "Updating…" : `Mark as ${isFree ? "Occupied" : "Free"}`}
            </button>
          )}

          <button
            onClick={() => setShowQR(true)}
            className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            📷 Show QR Code
          </button>
        </div>
      </div>

      {showQR && <QRModal room={room} onClose={() => setShowQR(false)} />}
    </div>
  );
}
