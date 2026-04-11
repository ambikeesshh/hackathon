import { useMemo, useState } from 'react';
import { clearReservation, reserveRoom } from '../firebase/rooms';
import { isReservationActive, timeUntil } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ReservationUI({ room, authUser, canManage }) {
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState('');

  const reservationActive = useMemo(() => isReservationActive(room), [room]);

  const handleReserve = async () => {
    if (!authUser) return;
    setSaving(true);
    try {
      await reserveRoom({
        roomId: room.id,
        userId: authUser.uid,
        minutes: 30,
        note: note.trim(),
      });
      setNote('');
      toast.success('Room reserved for 30 minutes');
    } catch (error) {
      console.error('Unable to reserve room', error);
      toast.error(error?.message || 'Unable to reserve room');
    } finally {
      setSaving(false);
    }
  };

  const handleClearReservation = async () => {
    if (!authUser) return;
    setSaving(true);
    try {
      await clearReservation({ roomId: room.id, userId: authUser.uid });
      toast.success('Reservation cleared');
    } catch (error) {
      console.error('Unable to clear reservation', error);
      toast.error(error?.message || 'Unable to clear reservation');
    } finally {
      setSaving(false);
    }
  };

  if (!canManage) return null;

  return (
    <div
      className="space-y-3 rounded-xl border p-4"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          Soft Reservation
        </h3>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${reservationActive ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}
        >
          {reservationActive
            ? `Active (${timeUntil(room.reservedUntil)} left)`
            : 'Inactive'}
        </span>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="Optional note for reservation"
        className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--bg-elevated)',
          color: 'var(--text)',
        }}
      />

      <div className="flex gap-2">
        <button
          onClick={handleReserve}
          disabled={saving}
          className="flex-1 rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
        >
          Reserve 30m
        </button>
        {reservationActive && (
          <button
            onClick={handleClearReservation}
            disabled={saving}
            className="rounded-lg border px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-60"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
