"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDesktopStore } from "@/store/useDesktopStore";
import { useWindowStore } from "@/store/useWindowStore";
import Window from "@/components/windows/Window";
import AboutWindow from "@/components/windows/AboutWindow";
import FinderWindow from "@/components/windows/FinderWindow";
import TerminalWindow from "@/components/windows/TerminalWindow";
import SafariWindow from "@/components/windows/SafariWindow";
import GuestbookWindow from "@/components/windows/GuestbookWindow";
import SpotifyWindow from "@/components/windows/SpotifyWindow";
import type { AppId } from "@/types";

// ─── App metadata registry ────────────────────────────────────────────────────
// Centralises per-app title / icon / size so Desktop stays thin.
const APP_META: Record<
  AppId,
  {
    title: string;
    icon: string;
    defaultPosition: { x: number; y: number };
    defaultSize: { width: number; height: number };
    minSize: { width: number; height: number };
  }
> = {
  finder: {
    title: "Finder",
    icon: "/icons/finder.png",
    defaultPosition: { x: 80, y: 48 },
    defaultSize: { width: 860, height: 540 },
    minSize: { width: 480, height: 320 },
  },
  terminal: {
    title: "Terminal",
    icon: "/icons/terminal.png",
    defaultPosition: { x: 120, y: 80 },
    defaultSize: { width: 720, height: 460 },
    minSize: { width: 400, height: 260 },
  },
  safari: {
    title: "Safari",
    icon: "/icons/safari.png",
    defaultPosition: { x: 100, y: 60 },
    defaultSize: { width: 960, height: 600 },
    minSize: { width: 560, height: 360 },
  },
  about: {
    title: "About This Mac",
    icon: "/icons/about.png",
    defaultPosition: { x: 160, y: 60 },
    defaultSize: { width: 860, height: 580 },
    minSize: { width: 640, height: 420 },
  },
  guestbook: {
    title: "Guestbook",
    icon: "/icons/guestbook.png",
    defaultPosition: { x: 160, y: 100 },
    defaultSize: { width: 680, height: 500 },
    minSize: { width: 400, height: 320 },
  },
  launchpad: {
    title: "Launchpad",
    icon: "/icons/launchpad.png",
    defaultPosition: { x: 100, y: 60 },
    defaultSize: { width: 800, height: 560 },
    minSize: { width: 480, height: 360 },
  },
  spotlight: {
    title: "Spotlight",
    icon: "/icons/spotlight.png",
    defaultPosition: { x: 300, y: 200 },
    defaultSize: { width: 680, height: 440 },
    minSize: { width: 400, height: 300 },
  },
  spotify: {
    title: "Spotify",
    icon: "/icons/spotify.jpg",
    defaultPosition: { x: 140, y: 60 },
    defaultSize: { width: 900, height: 580 },
    minSize: { width: 640, height: 420 },
  },
};

// ─── Context menu ─────────────────────────────────────────────────────────────
interface ContextMenuPosition {
  x: number;
  y: number;
}

interface ContextMenuItem {
  label: string;
  action: () => void;
  divider?: boolean;
}

// ─── Desktop ──────────────────────────────────────────────────────────────────
export default function Desktop() {
  const { cycleWallpaper, isDarkMode } = useDesktopStore();
  const { windows, openWindow, closeWindow, minimizeWindow } = useWindowStore();
  const [menu, setMenu] = useState<ContextMenuPosition | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // This ref is passed to every Window as dragConstraints boundary
  const desktopRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setMenu({ x: e.clientX, y: e.clientY });
    },
    []
  );

  const closeMenu = useCallback(() => setMenu(null), []);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu, closeMenu]);

  const menuItems: ContextMenuItem[] = [
    {
      label: "Change Wallpaper",
      action: () => {
        cycleWallpaper();
        closeMenu();
      },
    },
    { label: "New Folder", action: closeMenu },
    { label: "Get Info", action: closeMenu, divider: true },
    {
      label: "About This Mac",
      action: () => {
        closeMenu();
        openWindow("about", APP_META.about);
      },
    },
  ];

  // Collect every window that is open (or minimizing) so we can render it
  const openWindowIds = (Object.keys(windows) as AppId[]).filter(
    (id) => windows[id]?.isOpen
  );

  return (
    <div
      ref={desktopRef}
      className="absolute inset-0"
      style={{
        top: "var(--menubar-height)",
        bottom: "calc(var(--dock-height) + 16px)",
      }}
      onContextMenu={handleContextMenu}
      onClick={closeMenu}
    >
      {/* ── Right-click context menu ──────────────────────────────────────── */}
      {menu && (
        <div
          ref={menuRef}
          role="menu"
          className="fixed z-40 min-w-[200px] rounded-xl overflow-hidden py-1"
          style={{
            left: Math.min(menu.x, window.innerWidth - 210),
            top: Math.min(menu.y, window.innerHeight - 180),
            background: isDarkMode
              ? "rgba(30, 30, 32, 0.88)"
              : "rgba(248, 248, 248, 0.88)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.18)",
            color: isDarkMode ? "#f5f5f7" : "#1d1d1f",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {menuItems.map((item, i) => (
            <div key={i}>
              {item.divider && (
                <div
                  className="my-1 mx-2"
                  style={{
                    height: "1px",
                    background: isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)",
                  }}
                />
              )}
              <button
                role="menuitem"
                className="w-full text-left text-[13px] px-4 py-[5px] transition-colors"
                style={{ background: "transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.07)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                }}
                onClick={item.action}
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Windows ───────────────────────────────────────────────────────── */}
      {openWindowIds.map((id) => {
        const meta = APP_META[id];
        if (!meta) return null;
        return (
          <Window
            key={id}
            id={id}
            title={meta.title}
            icon={meta.icon}
            defaultPosition={meta.defaultPosition}
            defaultSize={meta.defaultSize}
            minSize={meta.minSize}
            constraintsRef={desktopRef}
            onClose={() => closeWindow(id)}
            onMinimize={() => minimizeWindow(id)}
          >
            {id === "about"    ? <AboutWindow />    :
             id === "finder"   ? <FinderWindow />   :
             id === "terminal"  ? <TerminalWindow />  :
             id === "safari"    ? <SafariWindow />    :
             id === "guestbook" ? <GuestbookWindow /> :
             id === "spotify"   ? <SpotifyWindow />   :
             <AppPlaceholder id={id} />}
          </Window>
        );
      })}
    </div>
  );
}

// ─── Temporary placeholder rendered inside each window ────────────────────────
function AppPlaceholder({ id }: { id: AppId }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 p-8 opacity-40">
      <span className="text-[48px]">🚧</span>
      <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
        {id.charAt(0).toUpperCase() + id.slice(1)} — coming soon
      </p>
    </div>
  );
}
