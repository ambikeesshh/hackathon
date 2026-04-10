export default function StatsCards({ stats }) {
  const cards = [
    { label: "Total", value: stats.total, valueClass: "text-gray-900 dark:text-gray-100" },
    { label: "Free", value: stats.free, valueClass: "text-green-500 dark:text-green-400" },
    { label: "Reserved", value: stats.reserved, valueClass: "text-yellow-500 dark:text-yellow-400" },
    { label: "Occupied", value: stats.occupied, valueClass: "text-red-500 dark:text-red-400" },
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Overview
      </p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {cards.map((card) => (
          <div
            key={card.label}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 dark:border-gray-800 dark:bg-gray-800/60"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
            <p className={`text-2xl font-semibold ${card.valueClass}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}