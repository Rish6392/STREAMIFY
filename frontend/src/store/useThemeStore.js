import { create } from 'zustand'

// from zustand documentation
export const useThemeStore = create((set) => ({
  theme:localStorage.getItem("streamify-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("streamify-theme", theme);
    set({ theme });
  },
}))