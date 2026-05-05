import { create } from "zustand";
import type { AppId, WindowState } from "@/types";

const Z_INDEX_BASE = 100;

export interface WindowOpenConfig {
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
}

interface WindowStore {
  windows: Record<AppId, WindowState>;
  focusedWindowId: AppId | null;
  zCounter: number;

  openWindow: (id: AppId, config?: WindowOpenConfig) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  restoreWindow: (id: AppId) => void;
  maximizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  updatePosition: (id: AppId, position: { x: number; y: number }) => void;
  updateSize: (id: AppId, size: { width: number; height: number }) => void;
}

const defaultWindowState = (id: AppId, config?: WindowOpenConfig): WindowState => ({
  id,
  isOpen: false,
  isMinimized: false,
  isMaximized: false,
  position: config?.defaultPosition ?? { x: 80, y: 48 },
  size: config?.defaultSize ?? { width: 800, height: 560 },
  zIndex: Z_INDEX_BASE,
});

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: {} as Record<AppId, WindowState>,
  focusedWindowId: null,
  zCounter: Z_INDEX_BASE,

  openWindow: (id, config) => {
    const { zCounter, windows } = get();
    const next = zCounter + 1;
    const existing = windows[id];
    set({
      zCounter: next,
      focusedWindowId: id,
      windows: {
        ...windows,
        [id]: existing
          ? { ...existing, isOpen: true, isMinimized: false, zIndex: next }
          : { ...defaultWindowState(id, config), isOpen: true, zIndex: next },
      },
    });
  },

  closeWindow: (id) => {
    const { windows } = get();
    set({
      windows: { ...windows, [id]: { ...windows[id], isOpen: false } },
      focusedWindowId: null,
    });
  },

  minimizeWindow: (id) => {
    const { windows } = get();
    set({
      windows: { ...windows, [id]: { ...windows[id], isMinimized: true } },
      focusedWindowId: null,
    });
  },

  restoreWindow: (id) => {
    const { windows, zCounter } = get();
    const next = zCounter + 1;
    set({
      zCounter: next,
      focusedWindowId: id,
      windows: {
        ...windows,
        [id]: { ...windows[id], isMinimized: false, zIndex: next },
      },
    });
  },

  maximizeWindow: (id) => {
    const { windows } = get();
    const win = windows[id];
    if (!win) return;
    set({
      windows: {
        ...windows,
        [id]: { ...win, isMaximized: !win.isMaximized },
      },
    });
  },

  focusWindow: (id) => {
    const { windows, zCounter } = get();
    const next = zCounter + 1;
    set({
      zCounter: next,
      focusedWindowId: id,
      windows: { ...windows, [id]: { ...windows[id], zIndex: next } },
    });
  },

  updatePosition: (id, position) => {
    const { windows } = get();
    set({ windows: { ...windows, [id]: { ...windows[id], position } } });
  },

  updateSize: (id, size) => {
    const { windows } = get();
    set({ windows: { ...windows, [id]: { ...windows[id], size } } });
  },
}));
