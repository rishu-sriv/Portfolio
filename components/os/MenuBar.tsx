"use client";

import { useEffect, useRef, useState } from "react";
import { Wifi, BatteryFull, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useDesktopStore } from "@/store/useDesktopStore";
import { useSoundStore } from "@/store/useSoundStore";

// ── Apple logo ─────────────────────────────────────────────────────────────────

function AppleLogo() {
  return (
    <svg width="13" height="15" viewBox="0 0 814 1000" fill="currentColor" aria-hidden="true">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4C46 790.8 0 663.4 0 541.8c0-202.9 132.4-310.3 261.5-310.3 70.2 0 128.5 46.4 173.9 46.4 43.4 0 111.3-49 192.1-49 30.8 0 134.2 2.6 197.5 99.9zm-234.2-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  );
}

// ── Control Center icon ────────────────────────────────────────────────────────

function ControlCenterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="1" y="3" width="5" height="1.5" rx="0.75" />
      <rect x="7" y="3" width="8" height="1.5" rx="0.75" />
      <rect x="1" y="7.25" width="9" height="1.5" rx="0.75" />
      <rect x="11.5" y="7.25" width="3.5" height="1.5" rx="0.75" />
      <rect x="1" y="11.5" width="4" height="1.5" rx="0.75" />
      <rect x="6.5" y="11.5" width="8.5" height="1.5" rx="0.75" />
      <circle cx="6.5" cy="3.75" r="2" fill="currentColor" />
      <circle cx="10.75" cy="8" r="2" fill="currentColor" />
      <circle cx="5.75" cy="12.25" r="2" fill="currentColor" />
    </svg>
  );
}

const MENU_ITEMS = ["File", "Edit", "View", "Go", "Window", "Help"];
const TEXT_COLOR = "rgba(255,255,255,0.9)";

interface MenuBarProps {
  onShutdown: () => void;
}

// ── MenuBar ────────────────────────────────────────────────────────────────────

export default function MenuBar({ onShutdown }: MenuBarProps) {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [appleMenuOpen, setAppleMenuOpen] = useState(false);
  const appleMenuRef = useRef<HTMLDivElement>(null);

  const { isDarkMode, toggleDarkMode, isNotificationCenterOpen, setNotificationCenterOpen, isSpidermanVisible } =
    useDesktopStore();
  const { isMuted, toggleMute } = useSoundStore();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
      const raw = now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      setDate(raw.replace(",", ""));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Close apple menu on outside click
  useEffect(() => {
    if (!appleMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (appleMenuRef.current && !appleMenuRef.current.contains(e.target as Node)) {
        setAppleMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [appleMenuOpen]);

  const handleShutdown = () => {
    setAppleMenuOpen(false);
    onShutdown();
  };

  return (
    <header
      role="banner"
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-3 select-none"
      style={{
        height: "var(--menubar-height)",
        background: "rgba(0,0,0,0.2)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        color: TEXT_COLOR,
        fontSize: "13px",
      }}
    >
      {/* ── Left ─────────────────────────────────────────────────────── */}
      <div className="flex items-center flex-1" style={{ gap: "16px" }}>
        {/* Apple menu */}
        <div className="relative" ref={appleMenuRef}>
          <button
            onClick={() => setAppleMenuOpen((v) => !v)}
            className="flex items-center justify-center px-1 py-0.5 rounded transition-colors"
            aria-label="Apple menu"
            style={{
              color: TEXT_COLOR,
              background: appleMenuOpen ? "rgba(255,255,255,0.2)" : "transparent",
            }}
          >
            <AppleLogo />
          </button>

          {appleMenuOpen && (
            <div
              className="absolute left-0 top-full mt-0.5 rounded-lg overflow-hidden"
              style={{
                width: 200,
                background: "rgba(30,30,30,0.92)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                zIndex: 100,
              }}
            >
              <AppleMenuItem label="About This Mac" onClick={() => setAppleMenuOpen(false)} />
              <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "2px 0" }} />
              <AppleMenuItem label="System Preferences…" onClick={() => setAppleMenuOpen(false)} />
              <AppleMenuItem label="App Store…" onClick={() => setAppleMenuOpen(false)} />
              <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "2px 0" }} />
              <AppleMenuItem label="Sleep" onClick={() => setAppleMenuOpen(false)} />
              <AppleMenuItem label="Restart…" onClick={() => setAppleMenuOpen(false)} />
              <AppleMenuItem
                label="Shut Down…"
                onClick={handleShutdown}
                danger
              />
            </div>
          )}
        </div>

        <span style={{ fontWeight: 500, color: TEXT_COLOR }}>Finder</span>

        {MENU_ITEMS.map((label) => (
          <button
            key={label}
            style={{ fontWeight: 400, color: TEXT_COLOR, background: "none", border: "none", padding: 0, cursor: "default" }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Right ────────────────────────────────────────────────────── */}
      <div className="flex items-center" style={{ gap: "8px", color: TEXT_COLOR }}>
        <div className="relative flex items-center">
          <BatteryFull size={15} strokeWidth={1.8} aria-label="Battery" />
          <div
            className="pointer-events-none select-none absolute"
            style={{
              left: "calc(100% + 8px)",
              top: "-10px",
              width: 0,
              height: 0,
              transform: "translateX(-50%)",
              transformOrigin: "top center",
              animation: "spidey-sway-2d 2.4s ease-in-out infinite alternate",
              zIndex: 1,
              opacity: isSpidermanVisible ? 1 : 0,
              transition: "opacity 500ms steps(10, end)",
            }}
          >
            <img
              src="/decor/spiderman-hanging.png"
              alt=""
              aria-hidden="true"
              draggable={false}
              style={{
                width: "auto",
                height: "clamp(62vh, 72vh, 86vh)",
                maxWidth: "none",
                transform: "translateX(-50%)",
                transformOrigin: "top center",
                opacity: 0.98,
              }}
            />
          </div>
        </div>
        <Wifi size={13} strokeWidth={1.8} aria-label="Wi-Fi" />

        {/* Control Center */}
        <button
          onClick={() => setNotificationCenterOpen(!isNotificationCenterOpen)}
          className="flex items-center justify-center px-1 py-0.5 rounded transition-colors"
          style={{ color: TEXT_COLOR, background: isNotificationCenterOpen ? "rgba(255,255,255,0.2)" : "transparent" }}
          aria-label="Notification Center"
          title="Notification Center"
        >
          <ControlCenterIcon />
        </button>

        {/* Sound mute toggle */}
        <button
          onClick={toggleMute}
          className="flex items-center justify-center px-1 py-0.5 rounded transition-colors"
          style={{ color: TEXT_COLOR }}
          aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted
            ? <VolumeX size={13} strokeWidth={1.8} />
            : <Volume2 size={13} strokeWidth={1.8} />
          }
        </button>

        {/* Dark / Light mode toggle */}
        <div className="relative">
          <button
            onClick={toggleDarkMode}
            className="relative flex items-center justify-center px-1 py-0.5 rounded transition-colors"
            style={{ color: TEXT_COLOR, zIndex: 2 }}
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode
              ? <Sun size={13} strokeWidth={1.8} />
              : <Moon size={13} strokeWidth={1.8} />
            }
          </button>
        </div>

        {/* Date + Time */}
        <button
          onClick={() => setNotificationCenterOpen(!isNotificationCenterOpen)}
          className="flex items-center gap-1.5 px-1 rounded transition-colors"
          style={{
            color: TEXT_COLOR,
            fontWeight: 400,
            background: isNotificationCenterOpen ? "rgba(255,255,255,0.2)" : "transparent",
          }}
          aria-label="Open Notification Center"
        >
          <span>{date}</span>
          <span>{time}</span>
        </button>
      </div>
    </header>
  );
}

// ── Apple menu item ────────────────────────────────────────────────────────────

function AppleMenuItem({
  label,
  onClick,
  danger,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-1.5 text-[13px] transition-colors"
      style={{
        color: danger ? "#ff453a" : "rgba(255,255,255,0.9)",
        background: "transparent",
        border: "none",
        cursor: "default",
        display: "block",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      {label}
    </button>
  );
}
