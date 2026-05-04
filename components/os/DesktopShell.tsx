"use client";

import { useEffect } from "react";
import { useDesktopStore } from "@/store/useDesktopStore";
import MenuBar from "./MenuBar";
import Desktop from "./Desktop";
import Dock from "./Dock";

/**
 * DesktopShell — top-level OS chrome that composes the three fixed layers:
 *   MenuBar (top)  ·  Desktop (fill)  ·  Dock (bottom)
 *
 * Also syncs isDarkMode → [data-theme] on <html> so CSS design tokens respond.
 */
export default function DesktopShell() {
  const { isDarkMode } = useDesktopStore();

  // Keep <html data-theme> in sync with Zustand state
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundImage: "url('/wallpaper.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <MenuBar />
      <Desktop />
      <Dock />
    </div>
  );
}
