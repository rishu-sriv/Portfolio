import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DesktopStore {
  isDarkMode: boolean;
  currentWallpaper: string;
  isMuted: boolean;
  isSpotlightOpen: boolean;
  isLaunchpadOpen: boolean;
  isNotificationCenterOpen: boolean;

  toggleDarkMode: () => void;
  setWallpaper: (url: string) => void;
  toggleMute: () => void;
  setSpotlightOpen: (open: boolean) => void;
  setLaunchpadOpen: (open: boolean) => void;
  setNotificationCenterOpen: (open: boolean) => void;
}

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set) => ({
      isDarkMode: false,
      currentWallpaper: "/wallpapers/default.jpg",
      isMuted: false,
      isSpotlightOpen: false,
      isLaunchpadOpen: false,
      isNotificationCenterOpen: false,

      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),
      setWallpaper: (url) => set({ currentWallpaper: url }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      setSpotlightOpen: (open) => set({ isSpotlightOpen: open }),
      setLaunchpadOpen: (open) => set({ isLaunchpadOpen: open }),
      setNotificationCenterOpen: (open) =>
        set({ isNotificationCenterOpen: open }),
    }),
    { name: "desktop-store" }
  )
);
