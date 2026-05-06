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
  Fingerprint,
  LayoutGrid,
  Trash2,
  BookOpen,
  Search,
} from "lucide-react";
import { useDesktopStore } from "@/store/useDesktopStore";
import { useWindowStore } from "@/store/useWindowStore";
import { useSound } from "@/hooks/useSound";
import type { AppId } from "@/types";

// ── Brand icon SVGs ───────────────────────────────────────────────────────────

function GithubSVG() {
  return (
    <svg width="52%" height="52%" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinSVG() {
  return (
    <svg width="52%" height="52%" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramSVG() {
  return (
    <svg width="52%" height="52%" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function GmailSVG() {
  return (
    <svg width="56%" height="56%" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  );
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface DockApp {
  id: string;
  name: string;
  Icon: React.ElementType;
  bg: string;
  color: string;
  isApp?: boolean;
  href?: string;
  /** Optional image-based icon paths (overrides Icon when provided) */
  iconLight?: string;
  iconDark?: string;
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
    iconLight: "/icons/finder.jpg",
    iconDark: "/icons/finder.jpg",
  },
  {
    id: "launchpad",
    name: "Launchpad",
    Icon: LayoutGrid,
    bg: "linear-gradient(145deg, #e74c3c, #a93226)",
    color: "#ffffff",
    isApp: true,
    iconLight: "/icons/launchpad.jpg",
    iconDark: "/icons/launchpad.jpg",
  },
  {
    id: "safari",
    name: "Safari",
    Icon: Globe,
    bg: "linear-gradient(145deg, #3a9bd5, #1e6fa5)",
    color: "#ffffff",
    isApp: true,
    iconLight: "/icons/safari-light.jpg",
    iconDark: "/icons/safari-dark.jpg",
  },
  {
    id: "terminal",
    name: "Terminal",
    Icon: Terminal,
    bg: "linear-gradient(145deg, #2d2d2d, #1a1a1a)",
    color: "#00ff88",
    isApp: true,
    iconLight: "/icons/terminal.jpg",
    iconDark: "/icons/terminal.jpg",
  },
  {
    id: "about",
    name: "About Me",
    Icon: Fingerprint,
    bg: "linear-gradient(145deg, #a855f7, #6d28d9)",
    color: "#ffffff",
    isApp: true,
  },
  {
    id: "guestbook",
    name: "Guestbook",
    Icon: BookOpen,
    bg: "linear-gradient(145deg, #9c27b0, #6a1b9a)",
    color: "#ffffff",
    isApp: true,
    iconLight: "/icons/message.jpg",
    iconDark: "/icons/message.jpg",
  },
  {
    id: "spotify",
    name: "Spotify",
    Icon: BookOpen,
    bg: "linear-gradient(145deg, #1db954, #158a3e)",
    color: "#ffffff",
    isApp: true,
    iconLight: "/icons/spotify.jpg",
    iconDark: "/icons/spotify.jpg",
  },
];

const TRASH_APP: DockApp = {
  id: "trash",
  name: "Trash",
  Icon: Trash2,
  bg: "linear-gradient(145deg, #78909c, #546e7a)",
  color: "#ffffff",
  iconLight: "/icons/trash.jpg",
  iconDark: "/icons/trash.jpg",
};

const SOCIAL_APPS: DockApp[] = [
  {
    id: "github",
    name: "GitHub",
    Icon: GithubSVG,
    bg: "linear-gradient(145deg, #24292f, #0d1117)",
    color: "#ffffff",
    href: "https://github.com/rishu-sriv",
    iconLight: "/icons/github.png",
    iconDark: "/icons/github.png",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    Icon: LinkedinSVG,
    bg: "linear-gradient(145deg, #0077b5, #005a8a)",
    color: "#ffffff",
    href: "https://www.linkedin.com/in/sameer-srivastava-01a438371/",
    iconLight: "/icons/linkedin.jpg",
    iconDark: "/icons/linkedin.jpg",
  },
  {
    id: "instagram",
    name: "Instagram",
    Icon: InstagramSVG,
    bg: "linear-gradient(145deg, #e1306c, #833ab4)",
    color: "#ffffff",
    href: "https://www.instagram.com/ft.rishu/",
    iconLight: "/icons/instagram.jpg",
    iconDark: "/icons/instagram.jpg",
  },
  {
    id: "gmail",
    name: "Gmail",
    Icon: GmailSVG,
    bg: "linear-gradient(145deg, #ea4335, #c5221f)",
    color: "#ffffff",
    href: "mailto:rishupayne04@gmail.com",
    iconLight: "/icons/gmail.jpg",
    iconDark: "/icons/gmail.jpg",
  },
];

// Full app metadata used for minimized window thumbnails
const APP_META: Partial<
  Record<AppId, { name: string; Icon: React.ElementType; bg: string; color: string; titlebarBg: string; iconLight?: string; iconDark?: string }>
> = {
  finder:    { name: "Finder",    Icon: Folder,    bg: "linear-gradient(145deg,#1d72f3,#0a4db5)", color: "#fff",    titlebarBg: "#d8dce0", iconLight: "/icons/finder.jpg", iconDark: "/icons/finder.jpg" },
  launchpad: { name: "Launchpad", Icon: LayoutGrid, bg: "linear-gradient(145deg,#e74c3c,#a93226)", color: "#fff",    titlebarBg: "#e0d8d8" },
  safari:    { name: "Safari",    Icon: Globe,      bg: "linear-gradient(145deg,#3a9bd5,#1e6fa5)", color: "#fff",    titlebarBg: "#d8dde0", iconLight: "/icons/safari-light.jpg", iconDark: "/icons/safari-dark.jpg" },
  terminal:  { name: "Terminal",  Icon: Terminal,   bg: "linear-gradient(145deg,#2d2d2d,#1a1a1a)", color: "#00ff88", titlebarBg: "#232323", iconLight: "/icons/terminal.jpg", iconDark: "/icons/terminal.jpg" },
  about:     { name: "About Me",   Icon: Fingerprint, bg: "linear-gradient(145deg,#a855f7,#6d28d9)", color: "#fff",    titlebarBg: "#e8d8f0" },
  guestbook: { name: "Guestbook", Icon: BookOpen,   bg: "linear-gradient(145deg,#9c27b0,#6a1b9a)", color: "#fff",    titlebarBg: "#ddd8e0", iconLight: "/icons/message.jpg", iconDark: "/icons/message.jpg" },
  spotify:   { name: "Spotify",   Icon: BookOpen,   bg: "linear-gradient(145deg,#1db954,#158a3e)", color: "#fff",    titlebarBg: "#d8e8d8", iconLight: "/icons/spotify.jpg", iconDark: "/icons/spotify.jpg" },
  spotlight: { name: "Spotlight", Icon: Search,     bg: "linear-gradient(145deg,#607d8b,#455a64)", color: "#fff",    titlebarBg: "#d8dadb" },
};

// ── DockIcon ──────────────────────────────────────────────────────────────────

const BASE_SIZE      = 52;
const HOVER_SCALE    = 1.65;   // icon grows to ~86 px at peak — matches macOS feel
const MAGNIFY_RADIUS = 130;
const ICON_RADIUS    = 13;

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
  const { isDarkMode } = useDesktopStore();

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds || val === Infinity) return Infinity;
    return val - (bounds.left + bounds.width / 2);
  });

  // Scale 1 → HOVER_SCALE based on cursor proximity
  const scaleTransform = useTransform(distance, (d: number) => {
    if (d === Infinity) return 1;
    const abs = Math.abs(d);
    if (abs >= MAGNIFY_RADIUS) return 1;
    const t = (1 - abs / MAGNIFY_RADIUS) ** 1.6;
    return 1 + (HOVER_SCALE - 1) * t;
  });

  const scale = useSpring(scaleTransform, { mass: 0.08, stiffness: 200, damping: 16 });

  const { Icon } = app;

  return (
    // Fixed layout size — scale transform overflows upward, never pushes siblings
    <div
      className="relative flex flex-col items-center"
      style={{ width: BASE_SIZE + 8, height: BASE_SIZE + 7, flexShrink: 0 }}
    >
      {tooltip && <DockTooltip label={app.name} />}

      <motion.div
        ref={ref}
        style={{
          width: BASE_SIZE,
          height: BASE_SIZE,
          borderRadius: ICON_RADIUS,
          scale,
          transformOrigin: "bottom center",  // grows upward, not sideways
        }}
        className="relative flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={onClick}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        whileTap={{ scale: 0.88 }}
      >
        {app.iconLight && app.iconDark ? (
          <img
            src={isDarkMode ? app.iconDark : app.iconLight}
            alt={app.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            draggable={false}
          />
        ) : (
          <>
            <div className="absolute inset-0" style={{ background: app.bg }} />
            <div
              className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
              style={{ background: "linear-gradient(180deg,rgba(255,255,255,0.22) 0%,rgba(255,255,255,0) 100%)" }}
              aria-hidden="true"
            />
            <Icon className="relative z-10" style={{ color: app.color }} size="44%" strokeWidth={1.8} />
          </>
        )}
      </motion.div>

      {/* Dot — fixed 7 px slot so all icons stay at the same baseline */}
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

  // Hooks must always be called before any early return
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
    return 1 + (HOVER_SCALE - 1) * t * 0.65;
  });
  const scale = useSpring(scaleT, { mass: 0.08, stiffness: 180, damping: 14 });

  const win  = windows[id];
  const meta = APP_META[id];
  if (!win || !meta) return null;

  // Derive thumbnail dimensions from the real window's aspect ratio
  const aspect = win.size.width / win.size.height;
  const thumbH = BASE_SIZE;
  const thumbW = Math.max(58, Math.min(92, Math.round(thumbH * aspect)));

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
            {meta.iconLight && meta.iconDark ? (
              <img
                src={isDarkMode ? meta.iconDark : meta.iconLight}
                alt={meta.name}
                style={{ width: 18, height: 18, objectFit: "contain", opacity: 0.7 }}
                draggable={false}
              />
            ) : (
              <Icon
                style={{ color: isDarkMode ? meta.color : "#888", opacity: 0.45 }}
                size={16}
                strokeWidth={1.5}
              />
            )}
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
  spotify:   { defaultPosition: { x: 140, y: 60  }, defaultSize: { width: 900, height: 580 } },
};

// ── Dock ──────────────────────────────────────────────────────────────────────

export default function Dock() {
  const { openApp, setLaunchpadOpen, setSpotlightOpen } = useDesktopStore();
  const { windows, openWindow } = useWindowStore();
  const mouseX = useMotionValue(Infinity);
  const playClick = useSound("dock-click");

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
                playClick();
                if (id === "launchpad") {
                  setLaunchpadOpen(true);
                  return;
                }
                openApp(id);
                openWindow(id, APP_DEFAULTS[id]);
              }}
            />
          );
        })}

        {/* ── Spotlight search icon ───────────────────────────────────────── */}
        <DockIcon
          app={{
            id: "spotlight-btn",
            name: "Spotlight",
            Icon: Search,
            bg: "linear-gradient(145deg,#607d8b,#37474f)",
            color: "#ffffff",
          }}
          mouseX={mouseX}
          onClick={() => { playClick(); setSpotlightOpen(true); }}
        />

        {/* ── Social links ───────────────────────────────────────────────── */}
        <Separator />
        {SOCIAL_APPS.map((app) => (
          <DockIcon
            key={app.id}
            app={app}
            mouseX={mouseX}
            onClick={() => {
              playClick();
              if (app.href) window.open(app.href, "_blank", "noopener,noreferrer");
            }}
          />
        ))}

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
