"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
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
        className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0"
        style={{ boxShadow: "0 8px 28px rgba(0,0,0,0.26)" }}
      >
        <img
          src="/profile/sameer-about.png"
          alt="Sameer Srivastava"
          draggable={false}
          className="w-full h-full object-cover select-none"
        />
      </div>

      {/* Name */}
      <div className="space-y-1">
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Sameer Srivastava
        </h1>
        <p
          className="text-lg font-medium"
          style={{ color: "var(--accent)" }}
        >
          GenAI Engineer &amp; Full-Stack Developer
        </p>
      </div>

      {/* About copy */}
      <div
        className="max-w-2xl rounded-2xl p-6 text-left"
        style={{
          background: dark
            ? "linear-gradient(145deg, rgba(41,151,255,0.12), rgba(168,85,247,0.08))"
            : "linear-gradient(145deg, rgba(0,113,227,0.08), rgba(168,85,247,0.06))",
          border: `1px solid ${dark ? "rgba(120,180,255,0.25)" : "rgba(0,113,227,0.18)"}`,
          boxShadow: dark
            ? "0 14px 36px rgba(0,0,0,0.35), 0 0 0 1px rgba(120,180,255,0.12) inset"
            : "0 12px 30px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,113,227,0.08) inset",
        }}
      >
        <p className="text-[16px] leading-relaxed font-medium" style={{ color: "var(--text-primary)" }}>
          I build systems at the intersection of <span style={{ color: "var(--accent)", fontWeight: 800 }}>AI and finance</span> —
          environments where the data is noisy, latency matters, and decisions have downstream consequences.
        </p>
        <p className="text-[15px] leading-relaxed mt-3" style={{ color: "var(--text-secondary)" }}>
          Recently, that&apos;s meant building RAG systems over financial filings and research documents,
          conversational interfaces for analyst workflows, and anomaly detection pipelines designed to surface unusual
          market behavior from noisy streaming data.
        </p>
        <p className="text-[15px] leading-relaxed mt-3" style={{ color: "var(--text-secondary)" }}>
          Underneath those systems, I focus heavily on reliability: async processing, event-driven services,
          time-series storage, and WebSocket infrastructure that continues operating cleanly under failure conditions.
        </p>
        <p className="text-[15px] leading-relaxed mt-3" style={{ color: "var(--text-secondary)" }}>
          Fintech is one of the few domains where both model quality and systems engineering matter simultaneously,
          which is why it&apos;s where I want to keep building.
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-2">
        {["Python", "RAG", "Agentic Workflows", "Qdrant", "FastAPI", "WebSockets", "Time-Series", "Fintech AI"].map((tag) => (
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

const CORE_LANGUAGES = [
  { name: "Python",     pct: 95 },
  { name: "TypeScript", pct: 92 },
  { name: "JavaScript", pct: 88 },
  { name: "SQL",        pct: 82 },
];

const AI_ML_STACK = [
  "LLMs / RAG Pipelines",
  "Vector DBs (Qdrant)",
  "LangChain",
  "Statistical Analysis",
  "Agentic Workflows",
];

const BACKEND_INFRA = [
  "FastAPI",
  "Flask",
  "Redis",
  "Celery",
  "PostgreSQL / TimescaleDB",
  "Node.js",
  "WebRTC",
  "MongoDB",
  "Docker / CI-CD",
];

const FRONTEND_STACK = [
  "React / Next.js",
  "Tailwind CSS",
  "Framer Motion",
  "TypeScript",
];

const FOCUS_AREAS = [
  "RAG & Retrieval Systems",
  "Event-Driven Architecture",
  "Time-Series & Anomaly Detection",
  "RESTful & WebSocket API Design",
  "System Design",
  "Fintech AI Pipelines",
];

function SlideSkills({ dark }: { dark: boolean }) {
  return (
    <div className="flex flex-col h-full px-10 py-8 gap-6">
      <h2
        className="text-2xl font-bold tracking-tight flex-shrink-0"
        style={{ color: "var(--text-primary)" }}
      >
        Technical Skills
      </h2>

      <p className="text-sm -mt-3" style={{ color: "var(--text-secondary)" }}>
        Proficiency Matrix &amp; Technology Stack
      </p>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        <section
          className="rounded-xl p-4"
          style={{
            background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          }}
        >
          <h3 className="text-[14px] font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            Core Languages
          </h3>
          <div className="space-y-2.5">
            {CORE_LANGUAGES.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-[12px] mb-1">
                  <span style={{ color: "var(--text-primary)" }}>{s.name}</span>
                  <span style={{ color: "var(--accent)", fontWeight: 700 }}>{s.pct}%</span>
                </div>
                <div
                  style={{
                    height: 7,
                    borderRadius: 999,
                    background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${s.pct}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #2997ff, #7c3aed)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          className="rounded-xl p-4"
          style={{
            background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          }}
        >
          <h3 className="text-[14px] font-semibold mb-2.5" style={{ color: "var(--text-primary)" }}>
            AI &amp; ML Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {AI_ML_STACK.map((item) => (
              <span
                key={item}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{
                  color: dark ? "#a78bfa" : "#6d28d9",
                  background: dark ? "rgba(167,139,250,0.14)" : "rgba(109,40,217,0.08)",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section
          className="rounded-xl p-4"
          style={{
            background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          }}
        >
          <h3 className="text-[14px] font-semibold mb-2.5" style={{ color: "var(--text-primary)" }}>
            Backend &amp; Infrastructure
          </h3>
          <div className="flex flex-wrap gap-2">
            {BACKEND_INFRA.map((item) => (
              <span
                key={item}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{
                  color: dark ? "#fbbf24" : "#92400e",
                  background: dark ? "rgba(251,191,36,0.14)" : "rgba(251,191,36,0.16)",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section
          className="rounded-xl p-4"
          style={{
            background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          }}
        >
          <h3 className="text-[14px] font-semibold mb-2.5" style={{ color: "var(--text-primary)" }}>
            Frontend
          </h3>
          <div className="flex flex-wrap gap-2">
            {FRONTEND_STACK.map((item) => (
              <span
                key={item}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{
                  color: "var(--accent)",
                  background: dark ? "rgba(41,151,255,0.14)" : "rgba(0,113,227,0.1)",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section
          className="rounded-xl p-4"
          style={{
            background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          }}
        >
          <h3 className="text-[14px] font-semibold mb-2.5" style={{ color: "var(--text-primary)" }}>
            Concepts &amp; Focus Areas
          </h3>
          <ul className="space-y-1.5">
            {FOCUS_AREAS.map((item) => (
              <li key={item} className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
                • {item}
              </li>
            ))}
          </ul>
        </section>
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
    title: "Backend/AI Systems Engineer (Intern)",
    subtitle: "Niti AI",
    period: "Dec 2025 – Present",
    detail:
      "Built and refined 5 Whys and RCA workflows to produce clearer root-cause analysis, and improved insights detection/capture so key findings are consistently synthesized, stored, and surfaced for product decision workflows.",
  },
  {
    title: "Artificial Intelligence Intern",
    subtitle: "Moonkind",
    period: "Jun 2025 – Jul 2025",
    detail:
      "Researched multi-agent AI optimizations to improve orchestration efficiency by 15%, proposed 5+ automation workflows, and authored 15+ technical docs that reduced onboarding time by 20%.",
  },
  {
    title: "Software Engineer Intern",
    subtitle: "Symphony Talent",
    period: "May 2025 – Jun 2025",
    detail:
      "Improved career portal accessibility by 25% for 10K+ monthly users, reduced CRM sync issues by 40% with backend integrations, raised test coverage to 85%, and cut deployment time by 30% via CI/CD automation.",
  },
  {
    title: "Frontend Developer (Intern)",
    subtitle: "Aarvasa",
    period: "Feb 2025 – Apr 2025",
    detail:
      "Built responsive React interfaces, improved performance with 30% faster load times, and helped deliver sprint features ahead of schedule with cross-functional Agile collaboration.",
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
    title: "Bachelor of Technology (B.Tech), Computer Science",
    subtitle: "Vellore Institute of Technology (VIT)",
    period: "2022 – 2026",
    detail:
      "Coursework and project experience across software engineering, full-stack web development, AI systems, and applied algorithms.",
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
    emoji: "🏏",
    title: "Cricket > Productivity",
    text: "I can spend an entire day dissecting match moments, impossible chases, and why that one over changed everything. Virat and Rohit will always be the legends — no debate, no context needed.",
  },
  {
    emoji: "🥄",
    title: "Cutlery Enthusiast",
    text: "I judge restaurants slightly based on how good their spoons feel. No further questions.",
  },
  {
    emoji: "🍳",
    title: "Kitchen Experimenter",
    text: "Half my recipes come from confidence instead of measurements. It works until it really doesn't.",
  },
  {
    emoji: "🎮",
    title: "Can Turn Anything Competitive",
    text: "FIFA, table tennis, chai-making, card games — somehow it always becomes a serious matter.",
  },
  {
    emoji: "🎵",
    title: "Karan Aujla & The 1975 on Repeat",
    text: "If there's music playing while I work, it's either The 1975 or Karan Aujla — zero in-between. One good track can reset the entire day.",
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

      <div
        className="flex-1 overflow-y-auto pr-1"
        style={{ scrollbarWidth: "thin" }}
      >
        {/* 2-col grid; last card (5th) auto-centers via justify-items */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            justifyItems: "stretch",
          }}
        >
          {FUN_FACTS.map((fact, i) => {
            const isLast = i === FUN_FACTS.length - 1 && FUN_FACTS.length % 2 !== 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.3 }}
                style={{
                  gridColumn: isLast ? "1 / -1" : undefined,
                  maxWidth: isLast ? "50%" : undefined,
                  margin: isLast ? "0 auto" : undefined,
                  padding: "20px 22px",
                  borderRadius: 14,
                  border: `1px solid ${dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)"}`,
                  background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {/* Large emoji */}
                <span style={{ fontSize: 32, lineHeight: 1, userSelect: "none" }}>
                  {fact.emoji}
                </span>

                {/* Title */}
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {fact.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: 12,
                    lineHeight: 1.65,
                    color: "var(--text-secondary)",
                    margin: 0,
                    opacity: 0.75,
                  }}
                >
                  {fact.text}
                </p>
              </motion.div>
            );
          })}
        </div>
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
