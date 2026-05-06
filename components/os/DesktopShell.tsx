"use client";

import { useEffect } from "react";
import { useDesktopStore } from "@/store/useDesktopStore";
import MenuBar from "./MenuBar";
import Desktop from "./Desktop";
import Dock from "./Dock";
import NotificationCenter from "./NotificationCenter";

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

  const wallpaper = isDarkMode
    ? "url('/wallpaper-dark.jpg')"
    : "url('/wallpaper-light.jpg')";

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundImage: wallpaper,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 0.4s ease",
      }}
    >
      <MenuBar />
      <Desktop />
      <Dock />
      <NotificationCenter />
    </div>
  );
}
