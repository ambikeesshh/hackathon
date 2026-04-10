import Filters from "../Filters";
import RoomsGrid from "./RoomsGrid";
import useStore from "../../store/useStore";

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
  equipment,
  onEquipment,
  equipmentOptions,
  rooms,
  canToggle,
}) {
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <section className="space-y-6">
      <div className={`rounded-2xl border-2 ${isDark ? 'border-slate-700 bg-[#242424]' : 'border-slate-900 bg-white'} p-4 shadow-[4px_4px_0px_0px_#0f172a]`}>
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
          equipment={equipment}
          onEquipment={onEquipment}
          equipmentOptions={equipmentOptions}
        />
      </div>

      <div className={`rounded-2xl border-2 ${isDark ? 'border-slate-700 bg-[#242424]' : 'border-slate-900 bg-white'} p-4 shadow-[4px_4px_0px_0px_#0f172a]`}>
        <p className={`mb-4 font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          Rooms ({rooms.length})
        </p>
        <RoomsGrid rooms={rooms} canToggle={canToggle} />
      </div>
    </section>
  );
}