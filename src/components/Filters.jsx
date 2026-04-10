export default function Filters({
  search,
  onSearch,
  availability,
  onAvailability,
  roomType,
  onRoomType,
  minCapacity,
  onMinCapacity,
  typeOptions,
}) {
  const handleReset = () => {
    onSearch("");
    onAvailability("all");
    onRoomType("all");
    onMinCapacity(0);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Smart Filters
        </h2>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition-all duration-200 hover:border-orange-500 hover:text-orange-600 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-orange-500 dark:hover:text-orange-400"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none">
            <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.7" />
            <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by room name"
            className="w-full rounded-lg border border-gray-300 bg-gray-100 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <select
          value={availability}
          onChange={(e) => onAvailability(e.target.value)}
          className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-700 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="all">All availability</option>
          <option value="free">Free</option>
          <option value="reserved">Reserved</option>
          <option value="occupied">Occupied</option>
        </select>

        <select
          value={roomType}
          onChange={(e) => onRoomType(e.target.value)}
          className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-700 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="all">All room types</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          value={minCapacity}
          onChange={(e) => onMinCapacity(Number(e.target.value) || 0)}
          placeholder="Min capacity"
          className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>
    </div>
  );
}
