import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  activeNavbarTab: string;
  setActiveNavbarTab: (tab: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  activeNavbarTab: "events",
  setActiveNavbarTab: (tab) => set({ activeNavbarTab: tab }),
}));
