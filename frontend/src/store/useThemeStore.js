import { create } from 'zustand'
//This imports the create function from the zustand library. zustand is a small, fast state-management library for React.
//Zustand is a lightweight, scalable state management library for React. It lets you create global state outside of components, 
// and access or update it using custom hooks — without boilerplate like Redux
// from zustand documentation
export const useThemeStore = create((set) => ({
  theme:localStorage.getItem("streamify-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("streamify-theme", theme); //// Save to localStorage
    set({ theme });   // // Update Zustand state
  },
}))