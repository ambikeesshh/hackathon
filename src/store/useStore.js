// src/store/useStore.js
import { create } from "zustand";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const savedTheme = window.localStorage.getItem("campussync-theme");
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const useStore = create((set) => ({
  // ─── Auth ───────────────────────────────────────────────
  authUser: null,          // { uid, name, email, role }
  authLoading: true,       // true while Firebase resolves session
  setAuthUser: (user) => set({ authUser: user, authLoading: false }),
  clearAuth: () => set({ authUser: null, authLoading: false }),

  // ─── Rooms ──────────────────────────────────────────────
  rooms: [],               // array of room documents
  roomsLoading: true,
  setRooms: (rooms) => set({ rooms, roomsLoading: false }),

  // ─── Theme ──────────────────────────────────────────────
  theme: getInitialTheme(),
  setTheme: (theme) => {
    window.localStorage.setItem("campussync-theme", theme);
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "dark" ? "light" : "dark";
      window.localStorage.setItem("campussync-theme", nextTheme);
      return { theme: nextTheme };
    }),
}));

export default useStore;
