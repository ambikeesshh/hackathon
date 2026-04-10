// src/pages/TogglePage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { toggleRoomStatus } from '../firebase/rooms';
import { effectiveStatus } from '../utils/helpers';
import { STATUS, ROLES } from '../lib/constants';
import toast from 'react-hot-toast';

export default function TogglePage() {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const rooms = useStore((s) => s.rooms);
  const authUser = useStore((s) => s.authUser);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const room = rooms.find((r) => r.id === resourceId);

  useEffect(() => {
    if (authUser === null) {
      navigate('/login', { state: { redirectTo: `/toggle/${resourceId}` } });
      return;
    }

    if (authUser.role !== ROLES.FACULTY && authUser.role !== ROLES.ADMIN) {
      toast.error('You do not have permission to toggle room status');
      navigate('/dashboard');
      return;
    }

    setLoading(false);
  }, [authUser, resourceId, navigate]);

  const handleToggle = async () => {
    if (!room || !authUser) return;

    setToggling(true);
    try {
      await toggleRoomStatus(room, authUser.uid);
      toast.success(`${room.name} is now ${effectiveStatus(room) === STATUS.FREE ? STATUS.OCCUPIED : STATUS.FREE}`);
      navigate(-1);
    } catch (error) {
      toast.error(error.message || 'Failed to toggle status');
    } finally {
      setToggling(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading || !room || !authUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fdfbf7]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
      </div>
    );
  }

  const currentStatus = effectiveStatus(room);
  const isOccupied = currentStatus === STATUS.OCCUPIED;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdfbf7] px-4">
      <div className="w-full max-w-md rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[8px_8px_0px_0px_#0f172a]">
        <button
          onClick={handleBack}
          className="mb-4 text-sm font-bold text-slate-500 hover:text-slate-900"
        >
          ← Back
        </button>

        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-900 bg-yellow-100">
            <span className="text-2xl">🚪</span>
          </div>

          <h1 className="mb-2 text-2xl font-black text-slate-900">
            {room.name}
          </h1>

          <p className="mb-6 font-mono text-xs uppercase text-slate-500">
            {room.building} • Floor {room.floor}
          </p>

          <div
            className={`mb-6 inline-flex rounded-full border-2 border-slate-900 px-4 py-2 text-sm font-bold uppercase ${
              isOccupied
                ? 'bg-red-100 text-red-600'
                : 'bg-green-100 text-green-600'
            }`}
          >
            {currentStatus}
          </div>

          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`w-full rounded-xl border-2 border-slate-900 py-4 text-lg font-bold text-white transition-all ${
              isOccupied
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
            } disabled:opacity-60`}
          >
            {toggling
              ? 'Updating...'
              : isOccupied
                ? 'Mark as Free'
                : 'Mark as Occupied'}
          </button>

          {room.note && (
            <p className="mt-4 font-mono text-xs text-slate-500">
              Note: {room.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}