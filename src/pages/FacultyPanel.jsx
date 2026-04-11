// src/pages/FacultyPanel.jsx
import { useMemo, useState } from 'react';
import useStore from '../store/useStore';
import { canManageRoom, effectiveStatus } from '../utils/helpers';
import { toggleRoomStatus } from '../firebase/rooms';
import { STATUS, ROLES } from '../lib/constants';
import toast from 'react-hot-toast';

export default function FacultyPanel() {
  const authUser = useStore((s) => s.authUser);
  const rooms = useStore((s) => s.rooms);
  const [busyRooms, setBusyRooms] = useState({});

  const myRooms = useMemo(() => {
    if (authUser?.role === ROLES.ADMIN) return rooms;
    return rooms.filter((room) => canManageRoom(authUser, room.id));
  }, [authUser, rooms]);

  const stats = useMemo(() => {
    const statusCount = myRooms.reduce((acc, room) => {
      const status = effectiveStatus(room);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return {
      total: myRooms.length,
      free: statusCount[STATUS.FREE] || 0,
      occupied: statusCount[STATUS.OCCUPIED] || 0,
      reserved: statusCount[STATUS.RESERVED] || 0,
    };
  }, [myRooms]);

  const handleToggle = async (room) => {
    if (!canManageRoom(authUser, room.id)) {
      toast.error('You are not assigned to this room');
      return;
    }

    setBusyRooms((prev) => ({ ...prev, [room.id]: true }));
    try {
      await toggleRoomStatus(room, authUser.uid);
      toast.success(`${room.name} updated`);
    } catch (error) {
      toast.error(error.message || 'Failed to update');
    } finally {
      setBusyRooms((prev) => ({ ...prev, [room.id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0px_0px_#0f172a]">
        <h1 className="text-2xl font-black text-slate-900">Faculty Panel</h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-slate-500">
          Manage your assigned rooms and view status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_#0f172a]">
          <p className="text-3xl font-black text-slate-900">{stats.total}</p>
          <p className="mt-1 font-mono text-xs uppercase text-slate-500">
            Total
          </p>
        </div>
        <div className="rounded-2xl border-2 border-slate-900 bg-green-100 p-4 shadow-[4px_4px_0px_0px_#0f172a]">
          <p className="text-3xl font-black text-green-600">{stats.free}</p>
          <p className="mt-1 font-mono text-xs uppercase text-green-700">
            Free
          </p>
        </div>
        <div className="rounded-2xl border-2 border-slate-900 bg-red-100 p-4 shadow-[4px_4px_0px_0px_#0f172a]">
          <p className="text-3xl font-black text-red-600">{stats.occupied}</p>
          <p className="mt-1 font-mono text-xs uppercase text-red-700">
            Occupied
          </p>
        </div>
        <div className="rounded-2xl border-2 border-slate-900 bg-yellow-100 p-4 shadow-[4px_4px_0px_0px_#0f172a]">
          <p className="text-3xl font-black text-yellow-600">
            {stats.reserved}
          </p>
          <p className="mt-1 font-mono text-xs uppercase text-yellow-700">
            Reserved
          </p>
        </div>
      </div>

      {/* Room List */}
      <div className="rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_0px_#0f172a]">
        <div className="border-b-2 border-slate-900 bg-slate-100 px-6 py-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-600">
            My Rooms ({myRooms.length})
          </h2>
        </div>

        {myRooms.length === 0 ? (
          <div className="px-6 py-10 text-center font-mono text-sm text-slate-500">
            No rooms assigned to you yet.
          </div>
        ) : (
          <div className="divide-y-2 divide-slate-200">
            {myRooms.map((room) => {
              const status = effectiveStatus(room);
              const isOccupied = status === STATUS.OCCUPIED;
              const isBusy = busyRooms[room.id];

              return (
                <div
                  key={room.id}
                  className="flex items-center justify-between gap-3 px-6 py-4"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        status === STATUS.FREE
                          ? 'bg-green-500'
                          : status === STATUS.OCCUPIED
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                      }`}
                    />
                    <div>
                      <p className="font-bold text-slate-900">{room.name}</p>
                      <p className="font-mono text-xs text-slate-500">
                        {room.building} • Floor {room.floor} • {room.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full border-2 border-slate-900 px-3 py-1 text-xs font-bold uppercase ${
                        status === STATUS.FREE
                          ? 'bg-green-100 text-green-600'
                          : status === STATUS.OCCUPIED
                            ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {status}
                    </span>
                    <button
                      onClick={() => handleToggle(room)}
                      disabled={isBusy}
                      className={`rounded-xl border-2 border-slate-900 px-4 py-2 text-sm font-bold text-white transition-all ${
                        isOccupied
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-red-500 hover:bg-red-600'
                      } disabled:opacity-60`}
                    >
                      {isBusy ? '...' : isOccupied ? 'Free' : 'Occupy'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
