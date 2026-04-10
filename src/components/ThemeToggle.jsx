import useStore from "../store/useStore";

export default function ThemeToggle() {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="group relative inline-flex h-9 w-[74px] items-center rounded-full border p-1 transition-all duration-300"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-soft)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <span
        className={`absolute left-1 flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-all duration-300 ${
          isDark
            ? "translate-x-9"
            : "translate-x-0"
        }`}
        style={{
          background: isDark
            ? "linear-gradient(135deg, #1f2a44 0%, #0f172a 100%)"
            : "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
        }}
      >
        {isDark ? (
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-slate-100">
            <path
              d="M15.74 2.6a.8.8 0 01.88 1.13A8.4 8.4 0 1019.95 15a.8.8 0 011.1.92A10 10 0 1114.92 2.7a.8.8 0 01.82-.1z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white">
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <path
              d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.5 17.5l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.5 6.5l1.56-1.56"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>

      <span className="ml-1 text-amber-500 transition-colors duration-300 dark:text-slate-500">
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
        </svg>
      </span>
      <span className="ml-auto mr-1 text-slate-400 transition-colors duration-300 dark:text-slate-100">
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
          <path
            d="M15.74 2.6a.8.8 0 01.88 1.13A8.4 8.4 0 1019.95 15a.8.8 0 011.1.92A10 10 0 1114.92 2.7a.8.8 0 01.82-.1z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
  );
}
