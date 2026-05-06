"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  Globe,
  Terminal,
  Fingerprint,
  BookOpen,
  Search,
  X,
} from "lucide-react";
import { useDesktopStore } from "@/store/useDesktopStore";
import { useWindowStore } from "@/store/useWindowStore";
import type { AppId } from "@/types";

// ── App definitions ───────────────────────────────────────────────────────────

interface LaunchpadApp {
  id: AppId;
  name: string;
  Icon: React.ElementType;
  bg: string;
  color: string;
  iconLight?: string;
  iconDark?: string;
}

const LAUNCHPAD_APPS: LaunchpadApp[] = [
  {
    id: "finder",
    name: "Finder",
    Icon: Folder,
    bg: "linear-gradient(145deg,#1d72f3,#0a4db5)",
    color: "#fff",
    iconLight: "/icons/finder.jpg",
    iconDark: "/icons/finder.jpg",
  },
  {
    id: "safari",
    name: "Safari",
    Icon: Globe,
    bg: "linear-gradient(145deg,#3a9bd5,#1e6fa5)",
    color: "#fff",
    iconLight: "/icons/safari-light.png",
    iconDark: "/icons/safari-dark.jpg",
  },
  {
    id: "terminal",
    name: "Terminal",
    Icon: Terminal,
    bg: "linear-gradient(145deg,#2d2d2d,#1a1a1a)",
    color: "#00ff88",
    iconLight: "/icons/terminal.jpg",
    iconDark: "/icons/terminal.jpg",
  },
  {
    id: "about",
    name: "About Me",
    Icon: Fingerprint,
    bg: "linear-gradient(145deg,#a855f7,#6d28d9)",
    color: "#fff",
  },
  {
    id: "guestbook",
    name: "Guestbook",
    Icon: BookOpen,
    bg: "linear-gradient(145deg,#9c27b0,#6a1b9a)",
    color: "#fff",
    iconLight: "/icons/message.jpg",
    iconDark: "/icons/message.jpg",
  },
];

const APP_DEFAULTS: Partial<Record<AppId, { defaultPosition: { x: number; y: number }; defaultSize: { width: number; height: number } }>> = {
  finder:    { defaultPosition: { x: 80,  y: 48  }, defaultSize: { width: 860, height: 540 } },
  safari:    { defaultPosition: { x: 100, y: 60  }, defaultSize: { width: 960, height: 600 } },
  terminal:  { defaultPosition: { x: 120, y: 80  }, defaultSize: { width: 720, height: 460 } },
  about:     { defaultPosition: { x: 160, y: 60  }, defaultSize: { width: 860, height: 580 } },
  guestbook: { defaultPosition: { x: 160, y: 100 }, defaultSize: { width: 680, height: 500 } },
};

// ── Framer Motion variants ────────────────────────────────────────────────────

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.05 },
  },
  exit: {
    transition: { staggerChildren: 0.03, staggerDirection: -1 as const },
  },
};

const iconVariants = {
  hidden: { scale: 0.5, opacity: 0, y: 20 },
  show: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 380, damping: 28 },
  },
  exit: {
    scale: 0.5,
    opacity: 0,
    y: 10,
    transition: { duration: 0.14, ease: "easeIn" as const },
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function Launchpad() {
  const { isLaunchpadOpen, setLaunchpadOpen, isDarkMode } = useDesktopStore();
  const { openWindow } = useWindowStore();
  const [query, setQuery] = useState("");
  const [wiggling, setWiggling] = useState(false);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state and focus search when opened
  useEffect(() => {
    if (isLaunchpadOpen) {
      setQuery("");
      setWiggling(false);
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isLaunchpadOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isLaunchpadOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLaunchpadOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLaunchpadOpen, setLaunchpadOpen]);

  const filteredApps = LAUNCHPAD_APPS.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  // Long-press handlers for wiggle
  const startLongPress = () => {
    longPressRef.current = setTimeout(() => setWiggling(true), 600);
  };
  const cancelLongPress = () => {
    if (longPressRef.current) clearTimeout(longPressRef.current);
  };

  const handleAppClick = (app: LaunchpadApp) => {
    if (wiggling) {
      setWiggling(false);
      return;
    }
    openWindow(app.id, APP_DEFAULTS[app.id]);
    setLaunchpadOpen(false);
  };

  return (
    <AnimatePresence>
      {isLaunchpadOpen && (
        <motion.div
          key="launchpad-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[8000] flex flex-col items-center select-none"
          style={{
            background: isDarkMode
              ? "rgba(10,10,20,0.55)"
              : "rgba(30,30,60,0.42)",
            backdropFilter: "blur(48px)",
            WebkitBackdropFilter: "blur(48px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setLaunchpadOpen(false);
          }}
        >
          {/* ── Search bar ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ delay: 0.06, type: "spring", stiffness: 400, damping: 32 }}
            style={{
              marginTop: 72,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.14)",
              border: "0.5px solid rgba(255,255,255,0.28)",
              borderRadius: 14,
              padding: "9px 16px",
              width: 280,
              boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
            }}
          >
            <Search size={15} color="rgba(255,255,255,0.55)" strokeWidth={2} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 15,
                color: "rgba(255,255,255,0.92)",
                caretColor: "white",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "none",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.65)",
                  flexShrink: 0,
                }}
              >
                <X size={10} />
              </button>
            )}
          </motion.div>

          {/* ── App grid ────────────────────────────────────────────────── */}
          <motion.div
            key={query} // remount grid when query changes so stagger re-fires
            variants={gridVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 100px)",
              gap: "36px 40px",
              marginTop: 56,
              padding: "0 32px",
            }}
          >
            {filteredApps.map((app) => {
              const iconSrc = isDarkMode
                ? (app.iconDark ?? app.iconLight)
                : app.iconLight;

              return (
                <motion.div
                  key={app.id}
                  variants={iconVariants}
                  animate={
                    wiggling
                      ? {
                          rotate: [0, -3, 3, -3, 3, -2, 0],
                          transition: {
                            duration: 0.45,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }
                      : {}
                  }
                  className="flex flex-col items-center gap-[10px] cursor-pointer"
                  style={{ userSelect: "none" }}
                  onClick={() => handleAppClick(app)}
                  onMouseDown={startLongPress}
                  onMouseUp={cancelLongPress}
                  onMouseLeave={cancelLongPress}
                  onTouchStart={startLongPress}
                  onTouchEnd={cancelLongPress}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 19,
                      overflow: "hidden",
                      position: "relative",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.42), 0 0 0 0.5px rgba(255,255,255,0.1)",
                    }}
                  >
                    {iconSrc ? (
                      <img
                        src={iconSrc}
                        alt={app.name}
                        draggable={false}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <>
                        <div style={{ position: "absolute", inset: 0, background: app.bg }} />
                        <div
                          style={{
                            position: "absolute",
                            inset: "0 0 50% 0",
                            background: "linear-gradient(180deg,rgba(255,255,255,0.2) 0%,rgba(255,255,255,0) 100%)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <app.Icon
                            color={app.color}
                            size={38}
                            strokeWidth={1.5}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.92)",
                      textShadow: "0 1px 6px rgba(0,0,0,0.6)",
                      textAlign: "center",
                      lineHeight: 1.3,
                      maxWidth: 90,
                      wordBreak: "break-word",
                    }}
                  >
                    {app.name}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* No results */}
          {filteredApps.length === 0 && (
            <div
              style={{
                marginTop: 60,
                color: "rgba(255,255,255,0.4)",
                fontSize: 15,
              }}
            >
              No apps match &ldquo;{query}&rdquo;
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
