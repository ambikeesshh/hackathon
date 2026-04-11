// src/pages/Admin.jsx
import { useState, useMemo } from 'react';
import useStore from '../store/useStore';
import { addRoom, deleteRoom } from '../firebase/rooms';
import { effectiveStatus, hourLabel } from '../utils/helpers';
import QRModal from '../components/QRModal';
import ActivityFeed from '../components/ActivityFeed';
import { useActivityLogs } from '../hooks/useActivityLogs';
import toast from 'react-hot-toast';
import { STATUS } from '../lib/constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function Admin() {
  const rooms = useStore((s) => s.rooms);
  const logs = useActivityLogs(200);
  const [newRoom, setNewRoom] = useState({
    name: '',
    building: '',
    floor: '',
    type: 'classroom',
    capacity: 0,
    note: '',
    features: '',
  });
  const [adding, setAdding] = useState(false);
  const [qrRoom, setQrRoom] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const chartData = useMemo(
    () =>
      rooms.map((r) => ({
        name: r.name.length > 12 ? r.name.slice(0, 12) + '…' : r.name,
        status: effectiveStatus(r) === STATUS.OCCUPIED ? 1 : 0,
        fullName: r.name,
      })),
    [rooms]
  );

  const handleAdd = async () => {
    if (!newRoom.name.trim()) return toast.error('Room name required.');
    setAdding(true);
    try {
      await addRoom(newRoom.name.trim(), {
        building: newRoom.building.trim(),
        floor: newRoom.floor.trim(),
        type: newRoom.type.trim() || 'classroom',
        capacity: Number(newRoom.capacity) || 0,
        note: newRoom.note.trim(),
        features: newRoom.features
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setNewRoom({
        name: '',
        building: '',
        floor: '',
        type: 'classroom',
        capacity: 0,
        note: '',
        features: '',
      });
      toast.success('Room added!');
    } catch (error) {
      console.error('Failed to add room', error);
      toast.error(error?.message || 'Failed to add room.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (room) => {
    try {
      await deleteRoom(room.id);
      toast.success(`${room.name} deleted.`);
    } catch (error) {
      console.error('Failed to delete room', error);
      toast.error(error?.message || 'Failed to delete room.');
    } finally {
      setConfirmDelete(null);
    }
  };

  const freeCount = rooms.filter(
    (r) => effectiveStatus(r) === STATUS.FREE
  ).length;
  const occupiedCount = rooms.length - freeCount;

  const analytics = useMemo(() => {
    const usageCount = logs.filter(
      (log) => log.action === STATUS.OCCUPIED
    ).length;

    const peakHoursMap = logs.reduce((acc, log) => {
      if (!log.timestamp) return acc;
      const hour = hourLabel(log.timestamp);
      acc.set(hour, (acc.get(hour) || 0) + 1);
      return acc;
    }, new Map());

    const peakHourEntry = [...peakHoursMap.entries()].sort(
      (a, b) => b[1] - a[1]
    )[0];
    return {
      usageCount,
      peakHour: peakHourEntry
        ? `${peakHourEntry[0]} (${peakHourEntry[1]} actions)`
        : 'N/A',
      reservationActions: logs.filter((log) => log.action === STATUS.RESERVED)
        .length,
    };
  }, [logs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0px_0px_#0f172a]">
        <h1 className="text-2xl font-black text-slate-900">Admin Panel</h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-slate-500">
          Manage rooms and view analytics
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_#0f172a]">
          <p className="text-3xl font-black text-slate-900">{rooms.length}</p>
          <p className="mt-1 font-mono text-xs uppercase text-slate-500">
            Total
          </p>
        </div>
        <div className="rounded-2xl border-2 border-slate-900 bg-green-100 p-4 shadow-[4px_4px_0px_0px_#0f172a]">
          <p className="text-3xl font-black text-green-600">{freeCount}</p>
          <p className="mt-1 font-mono text-xs uppercase text-green-700">
            Free
          </p>
        </div>
        <div className="rounded-2xl border-2 border-slate-900 bg-red-100 p-4 shadow-[4px_4px_0px_0px_#0f172a]">
          <p className="text-3xl font-black text-red-600">{occupiedCount}</p>
          <p className="mt-1 font-mono text-xs uppercase text-red-700">
            Occupied
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_#0f172a]">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Usage Count
          </p>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {analytics.usageCount}
          </p>
        </div>
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_#0f172a]">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Peak Hour
          </p>
          <p className="mt-2 text-sm font-bold text-slate-900">
            {analytics.peakHour}
          </p>
        </div>
        <div className="rounded-2xl border-2 border-slate-900 bg-yellow-100 p-4 shadow-[4px_4px_0px_0px_#0f172a]">
          <p className="font-mono text-xs uppercase tracking-widest text-yellow-700">
            Reservations
          </p>
          <p className="mt-2 text-2xl font-black text-yellow-600">
            {analytics.reservationActions}
          </p>
        </div>
      </div>

      {/* Analytics chart */}
      {rooms.length > 0 && (
        <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0px_0px_#0f172a]">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-slate-500">
            Room Status Overview
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} barSize={24}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#0f172a', strokeWidth: 2 }}
                tickLine={false}
              />
              <YAxis hide domain={[0, 1]} />
              <Tooltip
                formatter={(v, _, p) => [
                  v === 1 ? 'Occupied' : 'Free',
                  p.payload.fullName,
                ]}
                contentStyle={{
                  borderRadius: 10,
                  border: '2px solid #0f172a',
                  fontSize: 12,
                  background: '#ffffff',
                  color: '#0f172a',
                }}
              />
              <Bar dataKey="status" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.fullName}
                    fill={entry.status === 1 ? '#ef4444' : '#22c55e'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Add room */}
      <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0px_0px_#0f172a]">
        <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-slate-500">
          Add New Room
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            value={newRoom.name}
            onChange={(e) =>
              setNewRoom((prev) => ({ ...prev, name: e.target.value }))
            }
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Room name"
            className="rounded-lg border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-yellow-50"
          />
          <input
            value={newRoom.building}
            onChange={(e) =>
              setNewRoom((prev) => ({ ...prev, building: e.target.value }))
            }
            placeholder="Building"
            className="rounded-lg border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-yellow-50"
          />
          <input
            value={newRoom.floor}
            onChange={(e) =>
              setNewRoom((prev) => ({ ...prev, floor: e.target.value }))
            }
            placeholder="Floor"
            className="rounded-lg border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-yellow-50"
          />
          <input
            value={newRoom.type}
            onChange={(e) =>
              setNewRoom((prev) => ({ ...prev, type: e.target.value }))
            }
            placeholder="Type (classroom, lab, etc.)"
            className="rounded-lg border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-yellow-50"
          />
          <input
            value={newRoom.capacity}
            type="number"
            min="0"
            onChange={(e) =>
              setNewRoom((prev) => ({
                ...prev,
                capacity: Number(e.target.value) || 0,
              }))
            }
            placeholder="Capacity"
            className="rounded-lg border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-yellow-50"
          />
          <input
            value={newRoom.features}
            onChange={(e) =>
              setNewRoom((prev) => ({ ...prev, features: e.target.value }))
            }
            placeholder="Features (comma-separated)"
            className="rounded-lg border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-yellow-50"
          />
          <input
            value={newRoom.note}
            onChange={(e) =>
              setNewRoom((prev) => ({ ...prev, note: e.target.value }))
            }
            placeholder="Optional note"
            className="md:col-span-2 rounded-lg border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none transition-all focus:bg-yellow-50"
          />
          <button
            onClick={handleAdd}
            disabled={adding}
            className="md:col-span-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-slate-900 ring-2 ring-slate-900 transition-all duration-200 hover:bg-yellow-300 active:scale-95 disabled:opacity-60"
          >
            {adding ? 'Adding...' : 'Add Room'}
          </button>
        </div>
      </div>

      {/* Activity Feed */}
      <div>
        <ActivityFeed maxRows={15} title="Latest Room Actions" />
      </div>

      {/* Room list */}
      <div className="overflow-hidden rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0px_0px_#0f172a]">
        <div className="border-b-2 border-slate-900 bg-slate-100 px-6 py-3">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-slate-600">
            Rooms ({rooms.length})
          </p>
        </div>
        {rooms.length === 0 && (
          <div className="px-6 py-10 text-center font-mono text-sm text-slate-500">
            No rooms yet. Add one above.
          </div>
        )}
        {rooms.map((room) => {
          const status = effectiveStatus(room);
          return (
            <div
              key={room.id}
              className="flex items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 last:border-b-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`flex-shrink-0 h-3 w-3 rounded-full ${
                    status === STATUS.FREE
                      ? 'bg-green-500'
                      : status === STATUS.RESERVED
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                />
                <span className="truncate font-bold text-slate-900">
                  {room.name}
                </span>
                <span
                  className={`hidden sm:inline text-xs font-bold uppercase px-2 py-0.5 rounded-lg border-2 border-slate-900 ${
                    status === STATUS.FREE
                      ? 'bg-green-100 text-green-600'
                      : status === STATUS.RESERVED
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                  }`}
                >
                  {status}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setQrRoom(room)}
                  className="rounded-lg border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition-all duration-200 hover:bg-yellow-400 active:scale-95"
                >
                  QR
                </button>
                <button
                  onClick={() => setConfirmDelete(room)}
                  className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition-all duration-200 hover:bg-red-600 active:scale-95"
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
            className="mx-4 w-full max-w-sm rounded-2xl border-2 border-slate-900 bg-[#fdfbf7] p-6 shadow-[8px_8px_0px_0px_#0f172a]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-black text-slate-900">
              Delete Room?
            </h3>
            <p className="mb-5 text-sm font-medium text-slate-600">
              <strong>{confirmDelete.name}</strong> will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border-2 border-slate-900 bg-white py-2.5 text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-slate-100 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-red-600 active:scale-95"
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
