"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Coffee,
  Music,
  Gamepad2,
  Globe,
} from "lucide-react";
import { useDesktopStore } from "@/store/useDesktopStore";

// ─── Slide metadata (for sidebar) ─────────────────────────────────────────────

const SLIDE_META = [
  { id: 0, title: "Intro",      emoji: "👋" },
  { id: 1, title: "Skills",     emoji: "⚡" },
  { id: 2, title: "Experience", emoji: "💼" },
  { id: 3, title: "Education",  emoji: "🎓" },
  { id: 4, title: "Fun Facts",  emoji: "🎉" },
];

// ─── Slide transition variants ────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

// ─── Slide 1 — Intro ──────────────────────────────────────────────────────────

function SlideIntro({ dark }: { dark: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-10 py-8 text-center">
      {/* Avatar */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold select-none flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 8px 32px rgba(102,126,234,0.4)",
          color: "#fff",
        }}
      >
        RS
      </div>

      {/* Name */}
      <div className="space-y-1">
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Rishu Srivastava
        </h1>
        <p
          className="text-lg font-medium"
          style={{ color: "var(--accent)" }}
        >
          Full-Stack Developer &amp; UI Enthusiast
        </p>
      </div>

      {/* One-liner */}
      <p
        className="text-base max-w-md leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        I build thoughtful, high-performance web experiences — from pixel-perfect
        UIs to resilient backend APIs.
      </p>

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-2">
        {["React", "TypeScript", "Next.js", "Node.js"].map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              background: dark
                ? "rgba(41,151,255,0.15)"
                : "rgba(0,113,227,0.08)",
              color: "var(--accent)",
              border: "1px solid",
              borderColor: dark
                ? "rgba(41,151,255,0.25)"
                : "rgba(0,113,227,0.18)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 2 — Skills ─────────────────────────────────────────────────────────

const SKILLS = [
  { name: "React",       color: "#61DAFB", bg: "#20232a", abbr: "⚛" },
  { name: "TypeScript",  color: "#3178C6", bg: "#1a2a3a", abbr: "TS" },
  { name: "Next.js",     color: "#fff",    bg: "#111",    abbr: "N" },
  { name: "Tailwind",    color: "#38BDF8", bg: "#0f172a", abbr: "~" },
  { name: "Node.js",     color: "#68A063", bg: "#1a2a1a", abbr: "⬡" },
  { name: "Python",      color: "#FFD43B", bg: "#1a1a2a", abbr: "Py" },
  { name: "PostgreSQL",  color: "#336791", bg: "#1a1e2a", abbr: "PG" },
  { name: "MongoDB",     color: "#47A248", bg: "#1a2a1a", abbr: "M" },
  { name: "Docker",      color: "#2496ED", bg: "#0d1b2a", abbr: "🐳" },
  { name: "Git",         color: "#F05032", bg: "#2a1a1a", abbr: "⎇" },
  { name: "AWS",         color: "#FF9900", bg: "#1a1a0a", abbr: "☁" },
  { name: "Redis",       color: "#DC382D", bg: "#2a0d0d", abbr: "R" },
];

function SlideSkills({ dark }: { dark: boolean }) {
  return (
    <div className="flex flex-col h-full px-10 py-8 gap-6">
      <h2
        className="text-2xl font-bold tracking-tight flex-shrink-0"
        style={{ color: "var(--text-primary)" }}
      >
        Skills &amp; Technologies
      </h2>

      <div className="grid grid-cols-4 gap-3 flex-1 content-start">
        {SKILLS.map((skill) => (
          <motion.div
            key={skill.name}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-default"
            style={{
              background: dark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.04)",
              border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold select-none"
              style={{ background: skill.bg, color: skill.color }}
            >
              {skill.abbr}
            </div>
            <span
              className="text-[11px] font-medium text-center leading-tight"
              style={{ color: "var(--text-secondary)" }}
            >
              {skill.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared Timeline component ────────────────────────────────────────────────

interface TimelineEntry {
  title: string;
  subtitle: string;
  period: string;
  detail?: string;
}

function Timeline({
  entries,
  dark,
}: {
  entries: TimelineEntry[];
  dark: boolean;
}) {
  return (
    <div className="relative pl-8">
      {/* Vertical line */}
      <div
        className="absolute left-[11px] top-2 bottom-2 w-px"
        style={{
          background: dark
            ? "rgba(255,255,255,0.12)"
            : "rgba(0,0,0,0.1)",
        }}
      />

      <div className="space-y-7">
        {entries.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="relative"
          >
            {/* Dot */}
            <div
              className="absolute -left-8 top-1 w-[10px] h-[10px] rounded-full border-2 flex-shrink-0"
              style={{
                background: "var(--accent)",
                borderColor: dark ? "#1c1c1e" : "#fff",
                boxShadow: `0 0 0 2px var(--accent)`,
              }}
            />

            <div className="space-y-0.5">
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <h3
                  className="text-[14px] font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {entry.title}
                </h3>
                <span
                  className="text-[11px] font-medium flex-shrink-0"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {entry.period}
                </span>
              </div>
              <p
                className="text-[13px] font-medium"
                style={{ color: "var(--accent)" }}
              >
                {entry.subtitle}
              </p>
              {entry.detail && (
                <p
                  className="text-[12px] leading-relaxed pt-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {entry.detail}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide 3 — Experience ─────────────────────────────────────────────────────

const EXPERIENCE: TimelineEntry[] = [
  {
    title: "Software Engineer",
    subtitle: "Acme Corp",
    period: "2023 – Present",
    detail:
      "Built and maintained scalable React + Node.js applications serving 200k+ users. Led migration to TypeScript across the frontend codebase.",
  },
  {
    title: "Frontend Developer",
    subtitle: "Startup Studio",
    period: "2021 – 2023",
    detail:
      "Developed component libraries and design systems with React & Storybook. Collaborated closely with design to ship pixel-perfect UIs.",
  },
  {
    title: "Software Intern",
    subtitle: "TechCo Labs",
    period: "Summer 2020",
    detail:
      "Contributed to REST API development with Python/FastAPI. Built internal dashboards with React.",
  },
];

function SlideExperience({ dark }: { dark: boolean }) {
  return (
    <div className="flex flex-col h-full px-10 py-8 gap-6">
      <h2
        className="text-2xl font-bold tracking-tight flex-shrink-0"
        style={{ color: "var(--text-primary)" }}
      >
        Work Experience
      </h2>
      <div className="overflow-y-auto flex-1 pr-2">
        <Timeline entries={EXPERIENCE} dark={dark} />
      </div>
    </div>
  );
}

// ─── Slide 4 — Education ──────────────────────────────────────────────────────

const EDUCATION: TimelineEntry[] = [
  {
    title: "B.Tech, Computer Science",
    subtitle: "National Institute of Technology",
    period: "2017 – 2021",
    detail:
      "Graduated with distinction. Focused on algorithms, distributed systems, and human-computer interaction.",
  },
  {
    title: "AWS Certified Solutions Architect",
    subtitle: "Amazon Web Services",
    period: "2022",
    detail: "Associate-level certification covering cloud architecture best practices.",
  },
  {
    title: "Full-Stack Web Development",
    subtitle: "The Odin Project",
    period: "2019 – 2020",
    detail:
      "Completed the full curriculum including Ruby on Rails, JavaScript, React, and databases.",
  },
];

function SlideEducation({ dark }: { dark: boolean }) {
  return (
    <div className="flex flex-col h-full px-10 py-8 gap-6">
      <h2
        className="text-2xl font-bold tracking-tight flex-shrink-0"
        style={{ color: "var(--text-primary)" }}
      >
        Education &amp; Certifications
      </h2>
      <div className="overflow-y-auto flex-1 pr-2">
        <Timeline entries={EDUCATION} dark={dark} />
      </div>
    </div>
  );
}

// ─── Slide 5 — Fun Facts ──────────────────────────────────────────────────────

const FUN_FACTS = [
  {
    icon: Coffee,
    color: "#b5651d",
    bg: "rgba(181,101,29,0.12)",
    title: "Caffeine-Driven",
    text: "Powered by an unhealthy amount of cold brew. Coffee-to-code ratio is 1:1.",
  },
  {
    icon: Globe,
    color: "#2997ff",
    bg: "rgba(41,151,255,0.12)",
    title: "Open Source Fan",
    text: "Regularly contribute to open source projects and love reading other people's code.",
  },
  {
    icon: Music,
    color: "#1DB954",
    bg: "rgba(29,185,84,0.12)",
    title: "Music While Coding",
    text: "Lo-fi hip hop and jazz are my go-to coding playlists. Noise cancelling headphones required.",
  },
  {
    icon: Gamepad2,
    color: "#a855f7",
    bg: "rgba(168,85,247,0.12)",
    title: "Weekend Builder",
    text: "I spend weekends building random side projects that nobody asked for but I enjoy anyway.",
  },
];

function SlideFunFacts({ dark }: { dark: boolean }) {
  return (
    <div className="flex flex-col h-full px-10 py-8 gap-6">
      <h2
        className="text-2xl font-bold tracking-tight flex-shrink-0"
        style={{ color: "var(--text-primary)" }}
      >
        Fun Facts
      </h2>

      <div className="grid grid-cols-2 gap-4 flex-1 content-start">
        {FUN_FACTS.map((fact, i) => {
          const Icon = fact.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09, duration: 0.3 }}
              className="flex flex-col gap-3 p-4 rounded-xl"
              style={{
                background: dark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.03)",
                border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: fact.bg }}
              >
                <Icon size={18} color={fact.color} />
              </div>
              <div className="space-y-1">
                <h3
                  className="text-[13px] font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {fact.title}
                </h3>
                <p
                  className="text-[12px] leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {fact.text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Slide renderer ───────────────────────────────────────────────────────────

function renderSlide(index: number, dark: boolean) {
  switch (index) {
    case 0: return <SlideIntro dark={dark} />;
    case 1: return <SlideSkills dark={dark} />;
    case 2: return <SlideExperience dark={dark} />;
    case 3: return <SlideEducation dark={dark} />;
    case 4: return <SlideFunFacts dark={dark} />;
    default: return null;
  }
}

// ─── Sidebar thumbnail ────────────────────────────────────────────────────────

function SlideThumbnail({
  slide,
  active,
  dark,
  onClick,
}: {
  slide: (typeof SLIDE_META)[number];
  active: boolean;
  dark: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex flex-col items-center gap-1.5 px-2 py-2 rounded-lg transition-all duration-150 focus:outline-none group"
      style={{
        background: active
          ? dark
            ? "rgba(41,151,255,0.2)"
            : "rgba(0,113,227,0.1)"
          : "transparent",
        border: `1.5px solid ${
          active
            ? "var(--accent)"
            : "transparent"
        }`,
      }}
    >
      {/* Mini preview card */}
      <div
        className="w-full aspect-[4/3] rounded-md flex flex-col items-center justify-center gap-1 text-center overflow-hidden"
        style={{
          background: dark
            ? active
              ? "rgba(41,151,255,0.12)"
              : "rgba(255,255,255,0.05)"
            : active
            ? "rgba(0,113,227,0.07)"
            : "rgba(0,0,0,0.04)",
          border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
        }}
      >
        <span className="text-lg leading-none select-none">{slide.emoji}</span>
        <span
          className="text-[9px] font-medium leading-none"
          style={{
            color: active ? "var(--accent)" : "var(--text-tertiary)",
          }}
        >
          {slide.title}
        </span>
      </div>

      {/* Slide number */}
      <span
        className="text-[10px] font-medium"
        style={{
          color: active ? "var(--accent)" : "var(--text-tertiary)",
        }}
      >
        {slide.id + 1}
      </span>
    </button>
  );
}

// ─── About Window ─────────────────────────────────────────────────────────────

export default function AboutWindow() {
  const { isDarkMode } = useDesktopStore();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === current) return;
      setDirection(idx > current ? 1 : -1);
      setCurrent(idx);
    },
    [current]
  );

  const prev = useCallback(() => {
    if (current > 0) goTo(current - 1);
  }, [current, goTo]);

  const next = useCallback(() => {
    if (current < SLIDE_META.length - 1) goTo(current + 1);
  }, [current, goTo]);

  // Keyboard navigation — focus the container on mount and listen for arrow keys
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      }
    },
    [next, prev]
  );

  const sidebarBg = isDarkMode
    ? "rgba(255,255,255,0.03)"
    : "rgba(0,0,0,0.03)";

  const sidebarBorder = isDarkMode
    ? "rgba(255,255,255,0.07)"
    : "rgba(0,0,0,0.07)";

  const bottomBorder = isDarkMode
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.08)";

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex h-full outline-none"
    >
      {/* ── Left sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className="flex flex-col gap-1 p-2 overflow-y-auto flex-shrink-0"
        style={{
          width: 108,
          background: sidebarBg,
          borderRight: `1px solid ${sidebarBorder}`,
        }}
      >
        {SLIDE_META.map((slide) => (
          <SlideThumbnail
            key={slide.id}
            slide={slide}
            active={current === slide.id}
            dark={isDarkMode}
            onClick={() => goTo(slide.id)}
          />
        ))}
      </aside>

      {/* ── Main area ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Slide viewport */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="absolute inset-0 overflow-y-auto"
            >
              {renderSlide(current, isDarkMode)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom nav bar ──────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-center gap-4 px-4 flex-shrink-0"
          style={{
            height: 44,
            borderTop: `1px solid ${bottomBorder}`,
            background: isDarkMode
              ? "rgba(255,255,255,0.02)"
              : "rgba(0,0,0,0.02)",
          }}
        >
          {/* Prev */}
          <motion.button
            whileHover={current > 0 ? { scale: 1.1 } : {}}
            whileTap={current > 0 ? { scale: 0.92 } : {}}
            onClick={prev}
            disabled={current === 0}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors focus:outline-none"
            style={{
              background:
                current > 0
                  ? isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.07)"
                  : "transparent",
              color:
                current > 0
                  ? "var(--text-primary)"
                  : "var(--text-tertiary)",
              cursor: current > 0 ? "pointer" : "not-allowed",
            }}
          >
            <ChevronLeft size={15} />
          </motion.button>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {SLIDE_META.map((s) => (
              <button
                key={s.id}
                onClick={() => goTo(s.id)}
                className="rounded-full transition-all duration-200 focus:outline-none"
                style={{
                  width: current === s.id ? 16 : 6,
                  height: 6,
                  background:
                    current === s.id
                      ? "var(--accent)"
                      : isDarkMode
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.15)",
                }}
              />
            ))}
          </div>

          {/* Slide counter */}
          <span
            className="text-[11px] font-medium tabular-nums w-12 text-center"
            style={{ color: "var(--text-tertiary)" }}
          >
            {current + 1} / {SLIDE_META.length}
          </span>

          {/* Next */}
          <motion.button
            whileHover={current < SLIDE_META.length - 1 ? { scale: 1.1 } : {}}
            whileTap={current < SLIDE_META.length - 1 ? { scale: 0.92 } : {}}
            onClick={next}
            disabled={current === SLIDE_META.length - 1}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors focus:outline-none"
            style={{
              background:
                current < SLIDE_META.length - 1
                  ? isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.07)"
                  : "transparent",
              color:
                current < SLIDE_META.length - 1
                  ? "var(--text-primary)"
                  : "var(--text-tertiary)",
              cursor:
                current < SLIDE_META.length - 1 ? "pointer" : "not-allowed",
            }}
          >
            <ChevronRight size={15} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
