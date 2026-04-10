import Filters from "../Filters";
import RoomsGrid from "./RoomsGrid";

export default function RoomsSection({
  search,
  onSearch,
  availability,
  onAvailability,
  roomType,
  onRoomType,
  minCapacity,
  onMinCapacity,
  typeOptions,
  rooms,
  canToggle,
}) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Filters
          search={search}
          onSearch={onSearch}
          availability={availability}
          onAvailability={onAvailability}
          roomType={roomType}
          onRoomType={onRoomType}
          minCapacity={minCapacity}
          onMinCapacity={onMinCapacity}
          typeOptions={typeOptions}
        />
      </div>

      <RoomsGrid rooms={rooms} canToggle={canToggle} />
    </section>
  );
}
