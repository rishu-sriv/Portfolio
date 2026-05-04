"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import {
  Folder,
  Globe,
  Terminal,
  Mail,
  LayoutGrid,
  Trash2,
} from "lucide-react";
import { useDesktopStore } from "@/store/useDesktopStore";
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
// Order: Finder · Launchpad · Safari · Terminal · Mail | Trash

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

// ── DockIcon ──────────────────────────────────────────────────────────────────

const BASE_SIZE = 52;
const HOVER_SIZE = 72;
const MAGNIFY_RADIUS = 120;
const ICON_RADIUS = 13; // macOS squircle proportion

interface DockIconProps {
  app: DockApp;
  mouseX: MotionValue<number>;
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

  const size = useSpring(sizeTransform, {
    mass: 0.08,
    stiffness: 180,
    damping: 14,
  });

  const { Icon } = app;

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ width: BASE_SIZE + 8 }}
    >
      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute bottom-full mb-2 px-[10px] py-[3px] rounded-[6px] text-[12px] font-medium whitespace-nowrap pointer-events-none z-50"
          style={{
            background: "rgba(36, 36, 38, 0.86)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "rgba(255,255,255,0.95)",
            boxShadow:
              "0 2px 12px rgba(0,0,0,0.35), inset 0 0 0 0.5px rgba(255,255,255,0.12)",
            letterSpacing: "0.01em",
          }}
        >
          {app.name}
        </div>
      )}

      <motion.div
        ref={ref}
        style={{
          width: size,
          height: size,
          borderRadius: ICON_RADIUS,
        }}
        className="relative flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={onClick}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        whileTap={{ scale: 0.88 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {/* Icon background */}
        <div
          className="absolute inset-0"
          style={{ background: app.bg }}
        />
        {/* Gloss sheen */}
        <div
          className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 100%)",
          }}
          aria-hidden="true"
        />
        <Icon
          className="relative z-10"
          style={{ color: app.color }}
          size="44%"
          strokeWidth={1.8}
        />
      </motion.div>

      {/* Running indicator dot — white, 3px, 4px below icon */}
      {isActive && (
        <div
          style={{
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.7)",
            marginTop: "4px",
          }}
        />
      )}
    </div>
  );
}

// ── Dock ──────────────────────────────────────────────────────────────────────

export default function Dock() {
  const { openApps, openApp } = useDesktopStore();
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      className="fixed left-0 right-0 z-40 flex flex-col items-center pointer-events-none"
      style={{ bottom: "6px" }}
    >
      {/* Dock pill */}
      <motion.div
        className="flex items-end pointer-events-auto"
        style={{
          gap: "8px",
          padding: "6px 10px",
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "0.5px solid rgba(255,255,255,0.3)",
          borderRadius: "22px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.22)",
        }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {/* Main apps: Finder · Launchpad · Safari · Terminal · Mail */}
        {MAIN_APPS.map((app) => (
          <DockIcon
            key={app.id}
            app={app}
            mouseX={mouseX}
            isActive={openApps.includes(app.id as AppId)}
            onClick={() => app.isApp && openApp(app.id as AppId)}
          />
        ))}

        {/* Separator */}
        <div
          style={{
            width: "1px",
            height: "40px",
            background: "rgba(255,255,255,0.25)",
            margin: "0 4px",
            alignSelf: "center",
          }}
          aria-hidden="true"
        />

        {/* Trash */}
        <DockIcon app={TRASH_APP} mouseX={mouseX} />
      </motion.div>
    </div>
  );
}
