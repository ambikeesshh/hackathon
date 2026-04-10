// src/pages/Dashboard.jsx
import { useMemo, useState } from "react";
import useStore from "../store/useStore";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import RoomsSection from "../components/dashboard/RoomsSection";
import { effectiveStatus } from "../utils/helpers";

export default function Dashboard() {
  const rooms = useStore((s) => s.rooms);
  const roomsLoading = useStore((s) => s.roomsLoading);
  const authUser = useStore((s) => s.authUser);
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");
  const [roomType, setRoomType] = useState("all");
  const [minCapacity, setMinCapacity] = useState(0);

  const canToggle = authUser?.role === "faculty" || authUser?.role === "admin";

  const stats = useMemo(() => {
    const statusCount = rooms.reduce(
      (acc, room) => {
        const status = effectiveStatus(room);
        acc[status] += 1;
        return acc;
      },
      { free: 0, occupied: 0, reserved: 0 }
    );

    return {
      total: rooms.length,
      free: statusCount.free,
      reserved: statusCount.reserved,
      occupied: statusCount.occupied,
    };
  }, [rooms]);

  const typeOptions = useMemo(
    () => [...new Set(rooms.map((room) => room.type).filter(Boolean))],
    [rooms]
  );

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      const status = effectiveStatus(r);
      const matchAvailability = availability === "all" || status === availability;
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
      const matchType = roomType === "all" || r.type === roomType;
      const matchCapacity = (r.capacity || 0) >= minCapacity;
      return matchAvailability && matchSearch && matchType && matchCapacity;
    });
  }, [rooms, availability, search, roomType, minCapacity]);

  if (roomsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <div className="grid items-start gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <DashboardSidebar stats={stats} />

        <RoomsSection
          search={search}
          onSearch={setSearch}
          availability={availability}
          onAvailability={setAvailability}
          roomType={roomType}
          onRoomType={setRoomType}
          minCapacity={minCapacity}
          onMinCapacity={setMinCapacity}
          typeOptions={typeOptions}
          rooms={filtered}
          canToggle={canToggle}
        />
      </div>
    </div>
  );
}
