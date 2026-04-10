// src/components/RoomCard.jsx
import { useNavigate } from "react-router-dom";
import { effectiveStatus, timeAgo } from "../utils/helpers";
import useStore from "../store/useStore";
import { toggleRoomStatus, addLog } from "../firebase/rooms";
import toast from "react-hot-toast";

export default function RoomCard({ room, showToggle = false }) {
  const navigate = useNavigate();
  const authUser = useStore((s) => s.authUser);
  const status = effectiveStatus(room);
  const isFree = status === "free";

  const handleToggle = async (e) => {
    e.stopPropagation();
    try {
      await toggleRoomStatus({ ...room, status }, authUser.uid);
      await addLog(room.id, authUser.uid, status === "free" ? "occupied" : "free");
      toast.success(`${room.name} marked as ${isFree ? "occupied" : "free"}`);
    } catch (err) {
      toast.error("Failed to update room status.");
    }
  };

  return (
    <div
      onClick={() => navigate(`/room/${room.id}`)}
      className="group relative cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Status pill */}
      <span
        className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
          isFree
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-700"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isFree ? "bg-emerald-500 animate-pulse" : "bg-red-500"
          }`}
        />
        {isFree ? "Free" : "Occupied"}
      </span>

      <p className="font-mono text-xs text-slate-400 mb-1">Room</p>
      <h3 className="text-lg font-bold text-slate-800 pr-20 leading-tight">{room.name}</h3>
      <p className="mt-2 text-xs text-slate-400">Updated {timeAgo(room.updatedAt)}</p>

      {showToggle && (
        <button
          onClick={handleToggle}
          className={`mt-4 w-full rounded-xl py-2 text-sm font-semibold transition-colors ${
            isFree
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-emerald-500 text-white hover:bg-emerald-600"
          }`}
        >
          Mark as {isFree ? "Occupied" : "Free"}
        </button>
      )}
    </div>
  );
}
