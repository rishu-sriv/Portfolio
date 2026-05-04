import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppId } from "@/types";

export const WALLPAPERS: string[] = [
  // macOS Sonoma — warm rose aurora (default, matches screenshot)
  "radial-gradient(ellipse at 28% 65%, #b84dbe 0%, transparent 52%), radial-gradient(ellipse at 68% 35%, #e8607a 0%, transparent 52%), radial-gradient(ellipse at 88% 62%, #5b82d0 0%, transparent 50%), linear-gradient(150deg, #a050b8 0%, #d05888 45%, #6088c8 100%)",
  // macOS Sonoma dark nebula
  "linear-gradient(160deg, #0a0a1a 0%, #1a1a3e 35%, #0f3460 65%, #533483 100%)",
  // Ocean sunrise
  "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
  // Purple haze
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  // Rose gold
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  // Arctic blue
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  // Emerald
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
];

interface DesktopStore {
  isDarkMode: boolean;
  currentWallpaper: string;
  openApps: AppId[];
  isMuted: boolean;
  isSpotlightOpen: boolean;
  isLaunchpadOpen: boolean;
  isNotificationCenterOpen: boolean;

  toggleDarkMode: () => void;
  setWallpaper: (url: string) => void;
  cycleWallpaper: () => void;
  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  toggleMute: () => void;
  setSpotlightOpen: (open: boolean) => void;
  setLaunchpadOpen: (open: boolean) => void;
  setNotificationCenterOpen: (open: boolean) => void;
}

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      currentWallpaper: WALLPAPERS[0],
      openApps: [],
      isMuted: false,
      isSpotlightOpen: false,
      isLaunchpadOpen: false,
      isNotificationCenterOpen: false,

      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),
      setWallpaper: (url) => set({ currentWallpaper: url }),
      cycleWallpaper: () => {
        const current = get().currentWallpaper;
        const idx = WALLPAPERS.indexOf(current);
        const next = WALLPAPERS[(idx + 1) % WALLPAPERS.length];
        set({ currentWallpaper: next });
      },
      openApp: (id) =>
        set((s) => ({
          openApps: s.openApps.includes(id) ? s.openApps : [...s.openApps, id],
        })),
      closeApp: (id) =>
        set((s) => ({ openApps: s.openApps.filter((a) => a !== id) })),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      setSpotlightOpen: (open) => set({ isSpotlightOpen: open }),
      setLaunchpadOpen: (open) => set({ isLaunchpadOpen: open }),
      setNotificationCenterOpen: (open) =>
        set({ isNotificationCenterOpen: open }),
    }),
    { name: "desktop-store" }
  )
);
