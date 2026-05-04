"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDesktopStore } from "@/store/useDesktopStore";

interface ContextMenuPosition {
  x: number;
  y: number;
}

interface ContextMenuItem {
  label: string;
  action: () => void;
  divider?: boolean;
}

export default function Desktop() {
  const { cycleWallpaper, isDarkMode } = useDesktopStore();
  const [menu, setMenu] = useState<ContextMenuPosition | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setMenu({ x: e.clientX, y: e.clientY });
    },
    []
  );

  const closeMenu = useCallback(() => setMenu(null), []);

  // Close on any click or Escape key
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
        // Placeholder — wire to openApp('about') when windows are ready
      },
    },
  ];

  return (
    <div
      className="absolute inset-0"
      style={{
        top: "var(--menubar-height)",
        bottom: "calc(var(--dock-height) + 16px)",
      }}
      onContextMenu={handleContextMenu}
      onClick={closeMenu}
    >

      {/* ── Right-click context menu ── */}
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
            boxShadow: "0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.18)",
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
                style={{
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)";
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
    </div>
  );
}
