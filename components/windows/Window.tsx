"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useDragControls,
  animate,
} from "framer-motion";
import { useWindowStore } from "@/store/useWindowStore";
import { useDesktopStore } from "@/store/useDesktopStore";
import { useSound } from "@/hooks/useSound";
import type { AppId } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────
const TITLEBAR_H  = 28;
const MENUBAR_H   = 24;   // matches --menubar-height CSS var
const DOCK_AREA_H = 96;   // --dock-height (80) + bottom margin (16)

const SPRING = { type: "spring" as const, stiffness: 320, damping: 30 };

// ─── Types ────────────────────────────────────────────────────────────────────
export interface WindowProps {
  id: AppId;
  title: string;
  icon: string;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  constraintsRef: React.RefObject<HTMLDivElement>;
}

// ─── Window ───────────────────────────────────────────────────────────────────
export default function Window({
  id,
  title,
  icon,
  defaultPosition,
  defaultSize,
  minSize,
  children,
  onClose,
  onMinimize,
  constraintsRef,
}: WindowProps) {
  const { windows, focusedWindowId, focusWindow, updatePosition, maximizeWindow } =
    useWindowStore();
  const { isDarkMode } = useDesktopStore();
  const playOpen  = useSound("window-open");
  const playClose = useSound("window-close");

  const win        = windows[id];
  const isFocused  = focusedWindowId === id;
  const isMaximized = win?.isMaximized ?? false;

  const dragControls = useDragControls();
  const [isAnimatingMinimize, setIsAnimatingMinimize] = useState(false);

  // ── All motion values ─────────────────────────────────────────────────────
  const initX = win?.position?.x ?? defaultPosition.x;
  const initY = win?.position?.y ?? defaultPosition.y;
  const initW = win?.size?.width  ?? defaultSize.width;
  const initH = win?.size?.height ?? defaultSize.height;

  const xMV      = useMotionValue(initX);
  const yMV      = useMotionValue(initY);
  const wMV      = useMotionValue(initW);
  const hMV      = useMotionValue(initH);
  const rMV      = useMotionValue(12);
  // opacity + scale are also motion values so we never mix declarative
  // animate={{ y/opacity/scale }} with style={{ y: motionValue }} — doing
  // so causes Framer Motion to override yMV → 0, breaking all position animation.
  const opMV     = useMotionValue(0);    // starts transparent
  const scMV     = useMotionValue(0.88); // starts slightly small

  // Snapshot for restore after maximize / minimize
  const savedRef = useRef({ x: initX, y: initY, w: initW, h: initH });

  // ── Entrance animation (runs on open AND every restore from minimize) ────
  // Component never unmounts (guard returns null), so useEffect(fn,[]) only
  // fires once. wasVisibleRef tracks the invisible→visible transition so the
  // animation plays both on first open and each time the window is restored.
  const wasVisibleRef = useRef(false);

  useEffect(() => {
    const isVisible = win?.isOpen === true && win?.isMinimized === false;

    if (!wasVisibleRef.current && isVisible) {
      animate(opMV, 1, { duration: 0.18, ease: "easeOut" });
      animate(scMV, 1, { type: "spring", stiffness: 340, damping: 26 });
      playOpen();
    }

    wasVisibleRef.current = isVisible;
  }, [win?.isOpen, win?.isMinimized]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Maximize / restore animation ──────────────────────────────────────────
  const prevMaxRef = useRef(isMaximized);

  useEffect(() => {
    if (prevMaxRef.current === isMaximized) return;
    prevMaxRef.current = isMaximized;

    if (isMaximized) {
      savedRef.current = { x: xMV.get(), y: yMV.get(), w: wMV.get(), h: hMV.get() };
      animate(xMV, 0,                                        SPRING);
      animate(yMV, MENUBAR_H,                                SPRING);
      animate(wMV, window.innerWidth,                        SPRING);
      animate(hMV, window.innerHeight - MENUBAR_H - DOCK_AREA_H, SPRING);
      animate(rMV, 0,                                        SPRING);
    } else {
      const s = savedRef.current;
      animate(xMV, s.x,  SPRING);
      animate(yMV, s.y,  SPRING);
      animate(wMV, s.w,  SPRING);
      animate(hMV, s.h,  SPRING);
      animate(rMV, 12,   SPRING);
    }
  }, [isMaximized]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleDragEnd = useCallback(() => {
    updatePosition(id, { x: xMV.get(), y: yMV.get() });
    savedRef.current = { ...savedRef.current, x: xMV.get(), y: yMV.get() };
  }, [id, xMV, yMV, updatePosition]);

  const handleFocus = useCallback(() => {
    focusWindow(id);
  }, [id, focusWindow]);

  const handleMinimize = useCallback(() => {
    setIsAnimatingMinimize(true);

    const curX = xMV.get();
    const curY = yMV.get();
    const curW = wMV.get();
    const curH = hMV.get();

    const dockX = window.innerWidth  - 200;
    const dockY = window.innerHeight - 6;

    const D = 0.62; // total duration in seconds

    // All properties animate simultaneously.
    // Keyframe arrays + times encode the squish (0–0.30) then collapse (0.30–1.0)
    // without Promise chaining (which is unreliable with Framer Motion thenables).
    //
    // IMPORTANT: we intentionally do NOT toggle `drag` off during this animation.
    // Changing drag=true→false on the same render that starts the animation causes
    // Framer Motion's drag system to reset the x/y transform back to its resting
    // state, cancelling the position animation. Width/height still animate because
    // they are not owned by the drag system — which is exactly the bug the user saw.
    // Since dragListener={false}, drag only fires via explicit dragControls.start(),
    // so leaving drag enabled is safe.
    animate(xMV,  [curX, curX,          dockX], { duration: D,       times: [0, 0.33, 1], ease: "easeIn" });
    animate(yMV,  [curY, curY + 14,     dockY], { duration: D,       times: [0, 0.25, 1], ease: "easeIn" });
    animate(hMV,  [curH, curH * 1.1,    0    ], { duration: D,       times: [0, 0.25, 1], ease: "easeIn" });
    animate(wMV,  [curW, curW * 0.85,   60   ], { duration: D,       times: [0, 0.30, 1], ease: "easeIn" });
    animate(opMV, [1,    1,             0    ], { duration: D,       times: [0, 0.55, 1] });
    animate(rMV,  [12,   12,            6    ], { duration: D * 0.8, times: [0, 0.35, 1] });

    // setTimeout is used (not .then()) because Framer Motion's
    // AnimationPlaybackControls is a thenable but not a real Promise —
    // Promise.all and chained .then() calls can silently fail to resolve.
    setTimeout(() => {
      xMV.set(curX);  yMV.set(curY);
      wMV.set(curW);  hMV.set(curH);
      rMV.set(12);    opMV.set(0);   scMV.set(0.88);
      setIsAnimatingMinimize(false);
      onMinimize();
    }, Math.round(D * 1000) + 80); // 80 ms buffer after animation ends
  }, [xMV, yMV, wMV, hMV, rMV, opMV, scMV, onMinimize]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Guard ─────────────────────────────────────────────────────────────────
  if (!win?.isOpen || (win.isMinimized && !isAnimatingMinimize)) return null;

  return (
    <motion.div
      // ── No declarative animate/initial/transition here ───────────────────
      // Mixing animate={{ y: 0 }} with style={{ y: motionValue }} causes
      // Framer Motion to force yMV → 0 on mount, breaking position animation.
      // Every property is driven imperatively through motion values instead.
      onPointerDown={handleFocus}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x:            xMV,
        y:            yMV,
        width:        wMV,
        height:       hMV,
        borderRadius: rMV,
        opacity:      opMV,
        scale:        scMV,
        zIndex:       win?.zIndex ?? 100,
        minWidth:     minSize.width,
        minHeight:    minSize.height,
        display:      "flex",
        flexDirection: "column",
        overflow:     "hidden",
        boxShadow: isFocused
          ? "0 22px 70px 4px rgba(0,0,0,0.56), 0 0 0 1px rgba(255,255,255,0.08)"
          : "0 8px 32px rgba(0,0,0,0.28), 0 0 0 0.5px rgba(0,0,0,0.14)",
      }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={isMaximized
        ? { left: -9999, right: 9999, top: -9999, bottom: 9999 }
        : constraintsRef}
      dragElastic={0}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
    >
      {/* ── Title Bar ──────────────────────────────────────────────────────── */}
      <div
        className="relative flex items-center select-none flex-shrink-0"
        style={{
          height: TITLEBAR_H,
          background: isFocused ? "var(--titlebar-bg)" : "var(--titlebar-bg-inactive)",
          borderBottom: `1px solid ${isFocused ? "var(--separator)" : "transparent"}`,
          cursor: isMaximized ? "default" : "grab",
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          focusWindow(id);
          if (!isMaximized) dragControls.start(e);
        }}
        onDoubleClick={() => maximizeWindow(id)}
      >
        <TrafficLights
          isFocused={isFocused}
          onClose={() => { playClose(); onClose(); }}
          onMinimize={handleMinimize}
          onMaximize={() => maximizeWindow(id)}
        />

        <div className="absolute inset-0 flex items-center justify-center gap-[5px] pointer-events-none px-[80px]">
          {icon && (
            <img src={icon} alt="" className="w-[14px] h-[14px] object-contain flex-shrink-0" />
          )}
          <span
            className="text-[12px] font-semibold truncate"
            style={{
              letterSpacing: "0.01em",
              color: isFocused ? "var(--text-primary)" : "var(--text-tertiary)",
            }}
          >
            {title}
          </span>
        </div>
      </div>

      {/* ── Window Body ────────────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-auto selectable"
        style={{
          background: isDarkMode ? "rgba(28,28,30,0.96)" : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </motion.div>
  );
}

// ─── Traffic Light Buttons ────────────────────────────────────────────────────
interface TrafficLightsProps {
  isFocused: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

function TrafficLights({ isFocused, onClose, onMinimize, onMaximize }: TrafficLightsProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-[6px] pl-[12px] z-10 relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Red — Close */}
      <button
        aria-label="Close"
        className="w-[12px] h-[12px] rounded-full flex items-center justify-center flex-shrink-0 focus:outline-none"
        style={{ background: isFocused ? "#ff5f57" : "#cccccc" }}
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {hovered && isFocused && (
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <path d="M1 1l4 4M5 1L1 5" stroke="#820005" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Yellow — Minimize */}
      <button
        aria-label="Minimize"
        className="w-[12px] h-[12px] rounded-full flex items-center justify-center flex-shrink-0 focus:outline-none"
        style={{ background: isFocused ? "#febc2e" : "#cccccc" }}
        onClick={(e) => { e.stopPropagation(); onMinimize(); }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {hovered && isFocused && (
          <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
            <path d="M1 1h6" stroke="#7d5100" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Green — Fullscreen */}
      <button
        aria-label="Fullscreen"
        className="w-[12px] h-[12px] rounded-full flex items-center justify-center flex-shrink-0 focus:outline-none"
        style={{ background: isFocused ? "#28c840" : "#cccccc" }}
        onClick={(e) => { e.stopPropagation(); onMaximize(); }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {hovered && isFocused && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path
              d="M1.5 6.5l5-5M1.5 1.5h3v3M6.5 6.5h-3v-3"
              stroke="#006500" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
