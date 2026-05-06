"use client";

import { useEffect, useState } from "react";
import { Wifi, BatteryFull, Moon, Sun } from "lucide-react";
import { useDesktopStore } from "@/store/useDesktopStore";

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

// ── MenuBar ────────────────────────────────────────────────────────────────────

export default function MenuBar() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const { isDarkMode, toggleDarkMode, isNotificationCenterOpen, setNotificationCenterOpen } =
    useDesktopStore();

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
        <button className="flex items-center justify-center" aria-label="Apple menu" style={{ color: TEXT_COLOR }}>
          <AppleLogo />
        </button>

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
        <BatteryFull size={15} strokeWidth={1.8} aria-label="Battery" />
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

        {/* Dark / Light mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center px-1 py-0.5 rounded transition-colors"
          style={{ color: TEXT_COLOR }}
          aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          title={isDarkMode ? "Light Mode" : "Dark Mode"}
        >
          {isDarkMode
            ? <Sun size={13} strokeWidth={1.8} />
            : <Moon size={13} strokeWidth={1.8} />
          }
        </button>

        {/* Date + Time — click to open Notification Center */}
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
