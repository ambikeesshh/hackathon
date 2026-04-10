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
      className="group relative inline-flex h-9 w-[74px] items-center rounded-full border-2 border-slate-900 transition-all duration-300"
      style={{
        background: isDark ? '#242424' : '#ffffff',
      }}
    >
      <span
        className={`absolute left-1 flex h-5 w-5 items-center justify-center rounded-full shadow-md transition-all duration-300 ${
          isDark
            ? "translate-x-10"
            : "translate-x-0"
        }`}
        style={{
          background: isDark
            ? "#f59e0b"
            : "#1e293b",
        }}
      >
        {isDark ? (
          <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 text-yellow-400">
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <path
              d="M12 2v2M12 19.8V22M4.93 4.93l1.56 1.56M17.5 17.5l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.5 6.5l1.56-1.56"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 text-white">
            <path
              d="M15.74 2.6a.8.8 0 01.88 1.13A8.4 8.4 0 1019.95 15a.8.8 0 011.1.92A10 10 0 1114.92 2.7a.8.8 0 01.82-.1z"
              fill="currentColor"
            />
          </svg>
        )}
      </span>

      <span className={`absolute left-2 text-xs transition-colors duration-300 ${isDark ? 'text-yellow-400' : 'text-slate-400'}`}>
        ☀
      </span>
      <span className={`absolute right-2 text-xs transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-600'}`}>
        ☾
      </span>
    </button>
  );
}