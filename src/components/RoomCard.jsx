// src/components/RoomCard.jsx
import { useNavigate } from "react-router-dom";
import { effectiveStatus, isReservationActive, timeAgo, timeUntil } from "../utils/helpers";
import useStore from "../store/useStore";
import { toggleRoomStatus, addLog } from "../firebase/rooms";
import toast from "react-hot-toast";

export default function RoomCard({ room, showToggle = false }) {
  const navigate = useNavigate();
  const authUser = useStore((s) => s.authUser);
  const status = effectiveStatus(room);
  const isFree = status === "free";
  const isReserved = status === "reserved";
  const canManage = authUser?.role === "faculty" || authUser?.role === "admin";

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (!canManage) return;
    try {
      await toggleRoomStatus({ ...room, status }, authUser.uid);
      await addLog(room.id, authUser.uid, status === "free" ? "occupied" : "free", room.note || "");
      toast.success(`${room.name} marked as ${isFree ? "occupied" : "free"}`);
    } catch {
      toast.error("Failed to update room status.");
    }
  };

  return (
    <article
      onClick={() => navigate(`/room/${room.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/room/${room.id}`);
        }
      }}
      role="button"
      tabIndex={0}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500/70 via-orange-400/40 to-transparent" />

      {/* Status pill */}
      <span
        className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
          isFree
            ? "bg-green-400/10 text-green-400"
            : isReserved
              ? "bg-yellow-400/10 text-yellow-400"
              : "bg-red-400/10 text-red-400"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isFree ? "bg-green-400 animate-pulse" : isReserved ? "bg-yellow-400" : "bg-red-400"
          }`}
        />
        {isFree ? "Free" : isReserved ? "Reserved" : "Occupied"}
      </span>

      <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">Room</p>
      <h3 className="pr-20 text-lg font-semibold leading-tight text-gray-900 dark:text-gray-100">{room.name}</h3>

      <div className="mt-2 flex flex-wrap gap-2">
        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-300">
          {(room.type || "classroom").toUpperCase()}
        </span>
        <span className="rounded-md bg-orange-500/10 px-2 py-0.5 text-[11px] font-medium text-orange-600 dark:text-orange-400">
          Cap {room.capacity || 0}
        </span>
      </div>

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {[room.building || "Building N/A", room.floor ? `Floor ${room.floor}` : "Floor N/A"].join(" • ")}
      </p>

      <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-800">
        {room.note && (
          <p className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {room.note}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-400">Updated {timeAgo(room.updatedAt)}</p>
        {isReservationActive(room) && room.reservedUntil && (
          <p className="mt-1 text-xs font-medium text-yellow-500">Reserved for {timeUntil(room.reservedUntil)}</p>
        )}
      </div>

      {showToggle && (
        <button
          onClick={handleToggle}
          className={`mt-4 w-full rounded-xl py-2 text-sm font-medium transition-all duration-200 active:scale-95 ${
            isFree || isReserved
              ? "bg-red-500/90 text-white hover:bg-red-600"
              : "bg-orange-500 text-white hover:bg-orange-600 ring-1 ring-orange-500/20"
          }`}
        >
          Mark as {isFree || isReserved ? "Occupied" : "Free"}
        </button>
      )}
    </article>
  );
}
