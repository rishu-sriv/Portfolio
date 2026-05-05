"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  MotionValue,
} from "framer-motion";
import {
  Folder,
  Globe,
  Terminal,
  Mail,
  LayoutGrid,
  Trash2,
  BookOpen,
  Search,
} from "lucide-react";
import { useDesktopStore } from "@/store/useDesktopStore";
import { useWindowStore } from "@/store/useWindowStore";
import type { AppId } from "@/types";

// ── Types ──────────────────────────────────────────────────────────────────────

interface DockApp {
  id: AppId | "trash";
  name: string;
  Icon: React.ElementType;
  bg: string;
  color: string;
  isApp?: boolean;
}

// ── App definitions ────────────────────────────────────────────────────────────

const MAIN_APPS: DockApp[] = [
  {
    id: "finder",
    name: "Finder",
    Icon: Folder,
    bg: "linear-gradient(145deg, #1d72f3, #0a4db5)",
    color: "#ffffff",
    isApp: true,
  },
  {
    id: "launchpad",
    name: "Launchpad",
    Icon: LayoutGrid,
    bg: "linear-gradient(145deg, #e74c3c, #a93226)",
    color: "#ffffff",
    isApp: true,
  },
  {
    id: "safari",
    name: "Safari",
    Icon: Globe,
    bg: "linear-gradient(145deg, #3a9bd5, #1e6fa5)",
    color: "#ffffff",
    isApp: true,
  },
  {
    id: "terminal",
    name: "Terminal",
    Icon: Terminal,
    bg: "linear-gradient(145deg, #2d2d2d, #1a1a1a)",
    color: "#00ff88",
    isApp: true,
  },
  {
    id: "about",
    name: "Mail",
    Icon: Mail,
    bg: "linear-gradient(145deg, #2196F3, #1565C0)",
    color: "#ffffff",
    isApp: true,
  },
];

const TRASH_APP: DockApp = {
  id: "trash",
  name: "Trash",
  Icon: Trash2,
  bg: "linear-gradient(145deg, #78909c, #546e7a)",
  color: "#ffffff",
};

// Full app metadata used for minimized window thumbnails
const APP_META: Partial<
  Record<AppId, { name: string; Icon: React.ElementType; bg: string; color: string; titlebarBg: string }>
> = {
  finder:    { name: "Finder",    Icon: Folder,    bg: "linear-gradient(145deg,#1d72f3,#0a4db5)", color: "#fff",    titlebarBg: "#d8dce0" },
  launchpad: { name: "Launchpad", Icon: LayoutGrid, bg: "linear-gradient(145deg,#e74c3c,#a93226)", color: "#fff",    titlebarBg: "#e0d8d8" },
  safari:    { name: "Safari",    Icon: Globe,      bg: "linear-gradient(145deg,#3a9bd5,#1e6fa5)", color: "#fff",    titlebarBg: "#d8dde0" },
  terminal:  { name: "Terminal",  Icon: Terminal,   bg: "linear-gradient(145deg,#2d2d2d,#1a1a1a)", color: "#00ff88", titlebarBg: "#232323" },
  about:     { name: "Mail",      Icon: Mail,       bg: "linear-gradient(145deg,#2196F3,#1565C0)", color: "#fff",    titlebarBg: "#d8dce0" },
  guestbook: { name: "Guestbook", Icon: BookOpen,   bg: "linear-gradient(145deg,#9c27b0,#6a1b9a)", color: "#fff",    titlebarBg: "#ddd8e0" },
  spotlight: { name: "Spotlight", Icon: Search,     bg: "linear-gradient(145deg,#607d8b,#455a64)", color: "#fff",    titlebarBg: "#d8dadb" },
};

// ── DockIcon ──────────────────────────────────────────────────────────────────

const BASE_SIZE    = 52;
const HOVER_SIZE   = 72;
const MAGNIFY_RADIUS = 120;
const ICON_RADIUS  = 13;

interface DockIconProps {
  app: DockApp;
  mouseX: MotionValue<number>;
  /** Dot is shown only when the window is actually open (not minimized) */
  isActive?: boolean;
  onClick?: () => void;
}

function DockIcon({ app, mouseX, isActive = false, onClick }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState(false);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds || val === Infinity) return Infinity;
    return val - (bounds.left + bounds.width / 2);
  });

  const sizeTransform = useTransform(distance, (d: number) => {
    if (d === Infinity) return BASE_SIZE;
    const abs = Math.abs(d);
    if (abs >= MAGNIFY_RADIUS) return BASE_SIZE;
    const t = (1 - abs / MAGNIFY_RADIUS) ** 1.6;
    return BASE_SIZE + (HOVER_SIZE - BASE_SIZE) * t;
  });

  const size = useSpring(sizeTransform, { mass: 0.08, stiffness: 180, damping: 14 });

  const { Icon } = app;

  return (
    // Fixed-height wrapper so every icon (with or without the dot) takes the
    // exact same vertical space. Without this, active icons are taller than
    // inactive ones (dot + 4 px margin), causing trash to appear misaligned.
    <div
      className="relative flex flex-col items-center justify-end"
      style={{ width: BASE_SIZE + 8, height: BASE_SIZE + 7 }}
    >
      {tooltip && <DockTooltip label={app.name} />}

      <motion.div
        ref={ref}
        style={{ width: size, height: size, borderRadius: ICON_RADIUS }}
        className="relative flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={onClick}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        whileTap={{ scale: 0.88 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <div className="absolute inset-0" style={{ background: app.bg }} />
        <div
          className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
          style={{ background: "linear-gradient(180deg,rgba(255,255,255,0.22) 0%,rgba(255,255,255,0) 100%)" }}
          aria-hidden="true"
        />
        <Icon className="relative z-10" style={{ color: app.color }} size="44%" strokeWidth={1.8} />
      </motion.div>

      {/* Dot — always occupies 7 px so all icons have identical height.
          Transparent when app is not actively running. */}
      <div
        style={{
          width: 3,
          height: 3,
          borderRadius: "50%",
          marginTop: 4,
          flexShrink: 0,
          background: isActive ? "rgba(255,255,255,0.75)" : "transparent",
          transition: "background 0.2s ease",
        }}
      />
    </div>
  );
}

// ── MinimizedWindowTab ────────────────────────────────────────────────────────
// Renders a tiny window chrome (title bar + traffic lights + content area)
// in the dock, matching the aspect ratio of the actual window.

interface MinimizedWindowTabProps {
  id: AppId;
  mouseX: MotionValue<number>;
}

function MinimizedWindowTab({ id, mouseX }: MinimizedWindowTabProps) {
  const { windows, restoreWindow } = useWindowStore();
  const { isDarkMode } = useDesktopStore();
  const [tooltip, setTooltip] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const win     = windows[id];
  const meta    = APP_META[id];
  if (!win || !meta) return null;

  // Derive thumbnail dimensions from the real window's aspect ratio
  const aspect  = win.size.width / win.size.height;
  const thumbH  = BASE_SIZE;                                   // 52 px — matches other icons
  const thumbW  = Math.max(58, Math.min(92, Math.round(thumbH * aspect)));

  // Proximity-based magnification (same math as DockIcon)
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds || val === Infinity) return Infinity;
    return val - (bounds.left + bounds.width / 2);
  });
  const scaleT = useTransform(distance, (d: number) => {
    if (d === Infinity) return 1;
    const abs = Math.abs(d);
    if (abs >= MAGNIFY_RADIUS) return 1;
    const t = (1 - abs / MAGNIFY_RADIUS) ** 1.6;
    return 1 + (HOVER_SIZE / BASE_SIZE - 1) * t * 0.65; // slightly less than icons
  });
  const scale = useSpring(scaleT, { mass: 0.08, stiffness: 180, damping: 14 });

  const TITLEBAR_H  = 13;
  const titlebarBg  = isDarkMode ? "#2e2e30" : meta.titlebarBg;
  const contentBg   = isDarkMode ? "#1c1c1e" : "#f0f0f2";
  const titleColor  = isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";

  const { Icon } = meta;

  return (
    <div
      className="relative flex flex-col items-center justify-end"
      style={{ width: thumbW + 8, height: BASE_SIZE + 7 }}
    >
      {tooltip && <DockTooltip label={meta.name} />}

      <motion.div
        ref={ref}
        className="relative flex flex-col overflow-hidden cursor-pointer"
        style={{
          width: thumbW,
          height: thumbH,
          borderRadius: 6,
          scale,
          transformOrigin: "bottom center",
          boxShadow: "0 2px 14px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(255,255,255,0.12)",
        }}
        whileTap={{ scale: 0.93 }}
        onClick={() => restoreWindow(id)}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
      >
        {/* ── Mini title bar ─────────────────────────────────────────── */}
        <div
          style={{
            height: TITLEBAR_H,
            background: titlebarBg,
            display: "flex",
            alignItems: "center",
            paddingLeft: 5,
            gap: 3,
            flexShrink: 0,
          }}
        >
          {/* Tiny traffic lights */}
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#ff5f57", flexShrink: 0 }} />
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#febc2e", flexShrink: 0 }} />
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#28c840", flexShrink: 0 }} />
          <span
            style={{
              fontSize: 7,
              fontWeight: 600,
              color: titleColor,
              marginLeft: 3,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              flex: 1,
              paddingRight: 4,
              letterSpacing: "0.02em",
            }}
          >
            {meta.name}
          </span>
        </div>

        {/* ── Content area ───────────────────────────────────────────── */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden", background: contentBg }}>
          {/* Subtle app-colour tint */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: meta.bg,
              opacity: isDarkMode ? 0.18 : 0.1,
            }}
          />
          {/* Centred app icon as visual stand-in for window content */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              style={{ color: isDarkMode ? meta.color : "#888", opacity: 0.45 }}
              size={16}
              strokeWidth={1.5}
            />
          </div>
        </div>
      </motion.div>

      {/* Height placeholder — keeps vertical alignment identical to DockIcon */}
      <div style={{ height: 7, flexShrink: 0 }} />
    </div>
  );
}

// ── Shared tooltip ────────────────────────────────────────────────────────────

function DockTooltip({ label }: { label: string }) {
  return (
    <div
      className="absolute bottom-full mb-2 px-[10px] py-[3px] rounded-[6px] text-[12px] font-medium whitespace-nowrap pointer-events-none z-50"
      style={{
        background: "rgba(36,36,38,0.86)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "rgba(255,255,255,0.95)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.35), inset 0 0 0 0.5px rgba(255,255,255,0.12)",
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </div>
  );
}

// ── Separator ─────────────────────────────────────────────────────────────────

function Separator() {
  return (
    <div
      style={{
        width: 1,
        height: 32,
        background: "rgba(255,255,255,0.25)",
        margin: "0 2px",
        alignSelf: "center",
        flexShrink: 0,
      }}
      aria-hidden="true"
    />
  );
}

// ── Default open configs ──────────────────────────────────────────────────────

const APP_DEFAULTS: Partial<Record<AppId, { defaultPosition: { x: number; y: number }; defaultSize: { width: number; height: number } }>> = {
  finder:    { defaultPosition: { x: 80,  y: 48  }, defaultSize: { width: 860, height: 540 } },
  terminal:  { defaultPosition: { x: 120, y: 80  }, defaultSize: { width: 720, height: 460 } },
  safari:    { defaultPosition: { x: 100, y: 60  }, defaultSize: { width: 960, height: 600 } },
  about:     { defaultPosition: { x: 200, y: 120 }, defaultSize: { width: 560, height: 380 } },
  guestbook: { defaultPosition: { x: 160, y: 100 }, defaultSize: { width: 680, height: 500 } },
  launchpad: { defaultPosition: { x: 100, y: 60  }, defaultSize: { width: 800, height: 560 } },
};

// ── Dock ──────────────────────────────────────────────────────────────────────

export default function Dock() {
  const { openApps, openApp }     = useDesktopStore();
  const { windows, openWindow, restoreWindow } = useWindowStore();
  const mouseX = useMotionValue(Infinity);

  // Windows that are currently minimized
  const minimizedIds = (Object.keys(windows) as AppId[]).filter(
    (id) => windows[id]?.isMinimized
  );

  return (
    <div
      className="fixed left-0 right-0 z-40 flex flex-col items-center pointer-events-none"
      style={{ bottom: 6 }}
    >
      <motion.div
        className="flex items-end pointer-events-auto"
        style={{
          gap: 8,
          padding: "6px 10px",
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "0.5px solid rgba(255,255,255,0.3)",
          borderRadius: 22,
          boxShadow: "0 4px 32px rgba(0,0,0,0.22)",
        }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {/* ── Main apps ──────────────────────────────────────────────────── */}
        {MAIN_APPS.map((app) => {
          const id = app.id as AppId;
          // Show dot only when the window is genuinely open (not minimized)
          const isActive = !!(windows[id]?.isOpen && !windows[id]?.isMinimized);
          return (
            <DockIcon
              key={app.id}
              app={app}
              mouseX={mouseX}
              isActive={isActive}
              onClick={() => {
                if (!app.isApp) return;
                openApp(id);
                openWindow(id, APP_DEFAULTS[id]);
              }}
            />
          );
        })}

        {/* ── Right-side separator ───────────────────────────────────────── */}
        <Separator />

        {/* ── Minimized window thumbnails ────────────────────────────────── */}
        <AnimatePresence>
          {minimizedIds.map((id) => (
            <motion.div
              key={`min-${id}`}
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.4, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              <MinimizedWindowTab id={id} mouseX={mouseX} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Second separator only when there are minimised windows */}
        {minimizedIds.length > 0 && <Separator />}

        {/* ── Trash ──────────────────────────────────────────────────────── */}
        <DockIcon app={TRASH_APP} mouseX={mouseX} />
      </motion.div>
    </div>
  );
}
