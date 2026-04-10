// src/pages/RoomPage.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import {
  effectiveStatus,
  isReservationActive,
  timeAgo,
  timeUntil,
} from '../utils/helpers';
import { toggleRoomStatus, addLog } from '../firebase/rooms';
import QRModal from '../components/QRModal';
import ReservationUI from '../components/ReservationUI';
import toast from 'react-hot-toast';

export default function RoomPage() {
  const { roomId, resourceId } = useParams();
  const navigate = useNavigate();
  const authUser = useStore((s) => s.authUser);
  const rooms = useStore((s) => s.rooms);
  const [showQR, setShowQR] = useState(false);
  const [toggling, setToggling] = useState(false);

  const resolvedRoomId = roomId || resourceId;
  const room = rooms.find((r) => r.id === resolvedRoomId);
  const canToggle = authUser?.role === 'faculty' || authUser?.role === 'admin';

  if (!room) {
    return (
      <div
        className="flex h-64 flex-col items-center justify-center"
        style={{ color: 'var(--text-subtle)' }}
      >
        <p className="text-lg font-medium">Room not found</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-3 text-sm font-semibold text-blue-600"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const status = effectiveStatus(room);
  const isFree = status === 'free';
  const isReserved = status === 'reserved';

  const handleToggle = async () => {
    setToggling(true);
    try {
      await toggleRoomStatus({ ...room, status }, authUser.uid);
      await addLog(
        room.id,
        authUser.uid,
        isFree || isReserved ? 'occupied' : 'free',
        room.note || ''
      );
      toast.success(`Marked as ${isFree || isReserved ? 'occupied' : 'free'}`);
    } catch {
      toast.error('Failed to update room status.');
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-6 text-sm font-semibold text-blue-600 hover:underline"
      >
        ← All Rooms
      </button>

      <div
        className="rounded-2xl border p-8"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--bg-elevated)',
          boxShadow: '0 8px 24px rgba(var(--shadow), 0.09)',
        }}
      >
        {/* Status indicator */}
        <div
          className={`mb-6 rounded-xl p-4 text-center ${isFree ? 'bg-emerald-50' : isReserved ? 'bg-amber-50' : 'bg-red-50'}`}
        >
          <div
            className={`mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full ${
              isFree
                ? 'bg-emerald-100'
                : isReserved
                  ? 'bg-amber-100'
                  : 'bg-red-100'
            }`}
          >
            {isFree ? (
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-emerald-700"
                fill="none"
              >
                <path
                  d="M6 12.5l4 4 8-9"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : isReserved ? (
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-amber-700"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 8v4.2l2.8 1.6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-red-600"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 8.5v4.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="16.4" r="1" fill="currentColor" />
              </svg>
            )}
          </div>
          <p
            className={`text-2xl font-black ${isFree ? 'text-emerald-700' : isReserved ? 'text-amber-700' : 'text-red-700'}`}
          >
            {isFree ? 'Available' : isReserved ? 'Reserved' : 'Occupied'}
          </p>
        </div>

        <h1
          className="mb-1 text-center text-2xl font-black"
          style={{ color: 'var(--text)' }}
        >
          {room.name}
        </h1>
        <p
          className="mb-1 text-center text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          {[
            room.building || 'Building N/A',
            room.floor ? `Floor ${room.floor}` : 'Floor N/A',
            room.type || 'Type N/A',
            `Cap ${room.capacity || 0}`,
          ].join(' • ')}
        </p>
        <p
          className="mb-6 text-center text-sm"
          style={{ color: 'var(--text-subtle)' }}
        >
          Last updated: {timeAgo(room.updatedAt)}
        </p>

        {room.note && (
          <div
            className="mb-4 rounded-lg border px-4 py-2.5 text-xs"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg-soft)',
              color: 'var(--text-muted)',
            }}
          >
            {room.note}
          </div>
        )}

        {room.autoResetAt && !isFree && (
          <div className="mb-4 rounded-lg bg-amber-50 border border-amber-100 px-4 py-2.5 text-xs text-amber-700 text-center">
            Auto-resets at{' '}
            {room.autoResetAt.toDate
              ? room.autoResetAt
                  .toDate()
                  .toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
              : '—'}
          </div>
        )}

        {isReservationActive(room) && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs text-amber-700">
            Reservation ends in {timeUntil(room.reservedUntil)}
          </div>
        )}

        <div className="mb-4">
          <ReservationUI
            room={room}
            authUser={authUser}
            canManage={canToggle}
          />
        </div>

        <div className="space-y-3">
          {canToggle && (
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`w-full rounded-xl py-3 text-sm font-bold transition-colors disabled:opacity-60 ${
                isFree || isReserved
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {toggling
                ? 'Updating…'
                : isFree || isReserved
                  ? 'Start Session'
                  : 'End Session'}
            </button>
          )}

          <button
            onClick={() => setShowQR(true)}
            className="w-full rounded-xl border py-3 text-sm font-semibold transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            Show QR Code
          </button>
        </div>
      </div>

      {showQR && <QRModal room={room} onClose={() => setShowQR(false)} />}
    </div>
  );
}
