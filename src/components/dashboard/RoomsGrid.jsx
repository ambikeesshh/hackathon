import RoomCard from "../RoomCard";

export default function RoomsGrid({ rooms, canToggle }) {
  if (rooms.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center dark:border-gray-800 dark:bg-gray-900">
        <svg viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 h-12 w-12 text-gray-400">
          <path d="M2 10l10-6 10 6-10 6-10-6z" fill="currentColor" opacity="0.25" />
          <path d="M5 11.5V18a1 1 0 001 1h12a1 1 0 001-1v-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9 20v-4.2a1 1 0 011-1h4a1 1 0 011 1V20" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No rooms found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} showToggle={canToggle} />
      ))}
    </div>
  );
}