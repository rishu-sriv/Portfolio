"use client";

import { useEffect } from "react";
import { useDesktopStore } from "@/store/useDesktopStore";
import MenuBar from "./MenuBar";
import Desktop from "./Desktop";
import Dock from "./Dock";
import NotificationCenter from "./NotificationCenter";
import SpotlightSearch from "./SpotlightSearch";
import Launchpad from "./Launchpad";

/**
 * DesktopShell — top-level OS chrome that composes the three fixed layers:
 *   MenuBar (top)  ·  Desktop (fill)  ·  Dock (bottom)
 *
 * Also syncs isDarkMode → [data-theme] on <html> so CSS design tokens respond.
 */
export default function DesktopShell() {
  const { isDarkMode, currentWallpaper, setSpotlightOpen } = useDesktopStore();

  // Keep <html data-theme> in sync with Zustand state
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  // Global Cmd+Space → open Spotlight
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault();
        setSpotlightOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSpotlightOpen]);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundImage: currentWallpaper,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 0.5s ease",
      }}
    >
      <MenuBar />
      <Desktop />
      <Dock />
      <NotificationCenter />
      <SpotlightSearch />
      <Launchpad />
    </div>
  );
}
